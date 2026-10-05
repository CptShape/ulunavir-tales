import { isAdminToken } from "../shared/permissions.js";

let firebaseAdminPromise;

function getFirebaseAdmin() {
  if (!firebaseAdminPromise) {
    firebaseAdminPromise = Promise.all([
      import("firebase-admin/app"),
      import("firebase-admin/auth"),
      import("firebase-admin/firestore"),
    ]).then(([app, auth, firestore]) => ({ ...app, ...auth, ...firestore }));
  }
  return firebaseAdminPromise;
}

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function normalizeEmail(value) {
  return String(value ?? "").trim().toLowerCase();
}

function compactText(value, maxLength = 240) {
  const text = String(value ?? "").trim().replace(/\s+/g, " ");
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

function getAllowedOrigins() {
  return String(process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

function getCorsState(request) {
  const origin = String(request.headers.get("origin") ?? "").replace(/\/$/, "");
  const allowedOrigins = getAllowedOrigins();
  const allowed = !origin || !allowedOrigins.length || allowedOrigins.includes(origin);
  const headers = new Headers({
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  });

  if (origin && allowed) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
  } else if (!allowedOrigins.length) {
    headers.set("Access-Control-Allow-Origin", "*");
  }

  return { allowed, headers };
}

function jsonResponse(status, body, headers) {
  const responseHeaders = new Headers(headers);
  responseHeaders.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body), { status, headers: responseHeaders });
}

function getServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin environment variables are incomplete.");
  }

  return { projectId, clientEmail, privateKey };
}

async function getAdminApp() {
  const { cert, getApps, initializeApp } = await getFirebaseAdmin();
  if (getApps().length) {
    return getApps()[0];
  }

  const serviceAccount = getServiceAccount();
  return initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.projectId,
  });
}

async function parseRequestBody(request) {
  try {
    return await request.json();
  } catch {
    throw new HttpError(400, "Request body must be valid JSON.");
  }
}

function requireId(value, label) {
  const id = String(value ?? "").trim();
  if (!/^[a-zA-Z0-9_-]{1,160}$/.test(id)) {
    throw new HttpError(400, `${label} is invalid.`);
  }
  return id;
}

function getChapterUrl({ storyId, arcId, chapterId, requestedUrl }) {
  const configuredBase = String(process.env.PUBLIC_APP_URL ?? "").trim();
  if (configuredBase) {
    const base = configuredBase.replace(/#.*$/, "").replace(/\/?$/, "/");
    return `${base}#/stories/${encodeURIComponent(storyId)}/arcs/${encodeURIComponent(arcId)}/chapters/${encodeURIComponent(chapterId)}?view=browser`;
  }

  const parsed = new URL(String(requestedUrl ?? ""));
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Chapter URL is invalid.");
  }
  return parsed.toString();
}

function getImageUrl(value) {
  if (!value) {
    return "";
  }
  try {
    const parsed = new URL(String(value));
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.toString() : "";
  } catch {
    return "";
  }
}

async function sendDiscordWebhook({ message, chapterUrl, coverImageUrl, type }) {
  const configuredWebhook = String(process.env.DISCORD_WEBHOOK_URL ?? "").trim();
  if (!configuredWebhook) {
    throw new Error("DISCORD_WEBHOOK_URL is not configured.");
  }

  const webhookUrl = new URL(configuredWebhook);
  if (!(webhookUrl.hostname === "discord.com" || webhookUrl.hostname.endsWith(".discord.com"))) {
    throw new Error("DISCORD_WEBHOOK_URL must be a Discord webhook URL.");
  }
  webhookUrl.searchParams.set("wait", "true");

  const embed = {
    description: `${message}\n\n[Chapter'ı oku](${chapterUrl})`,
    color: type === "published" ? 0xd9ad5b : 0x8e7148,
    timestamp: new Date().toISOString(),
  };
  if (coverImageUrl) {
    embed.image = { url: coverImageUrl };
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [embed],
      allowed_mentions: { parse: [] },
    }),
  });

  if (!response.ok) {
    const detail = compactText(await response.text(), 500);
    throw new Error(`Discord rejected the announcement (${response.status})${detail ? `: ${detail}` : "."}`);
  }
}

async function handleRequest(request) {
  const cors = getCorsState(request);
  if (request.method === "OPTIONS") {
    return new Response(null, { status: cors.allowed ? 204 : 403, headers: cors.headers });
  }
  if (!cors.allowed) {
    return jsonResponse(403, { error: "This site origin is not allowed." }, cors.headers);
  }
  if (request.method !== "POST") {
    return jsonResponse(405, { error: "Use POST for Discord announcements." }, cors.headers);
  }

  try {
    const authorization = String(request.headers.get("authorization") ?? "");
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
    if (!token) {
      return jsonResponse(401, { error: "Firebase sign-in token is missing." }, cors.headers);
    }

    const { FieldValue, getAuth, getFirestore } = await getFirebaseAdmin();
    const app = await getAdminApp();
    let decodedToken;
    try {
      decodedToken = await getAuth(app).verifyIdToken(token);
    } catch {
      throw new HttpError(401, "Firebase sign-in token is invalid or expired.");
    }
    const body = await parseRequestBody(request);
    const storyId = requireId(body.storyId, "Story ID");
    const arcId = requireId(body.arcId, "Arc ID");
    const chapterId = requireId(body.chapterId, "Chapter ID");
    const db = getFirestore(app);
    const storyRef = db.collection("stories").doc(storyId);
    const arcRef = db.collection("arcs").doc(arcId);
    const chapterRef = db.collection("chapters").doc(chapterId);
    const userRef = db.collection("users").doc(decodedToken.uid);
    const [storySnapshot, arcSnapshot, chapterSnapshot, userSnapshot] = await Promise.all([
      storyRef.get(),
      arcRef.get(),
      chapterRef.get(),
      userRef.get(),
    ]);

    if (!storySnapshot.exists || !arcSnapshot.exists || !chapterSnapshot.exists) {
      return jsonResponse(404, { error: "Story, arc, or chapter was not found." }, cors.headers);
    }

    const story = storySnapshot.data();
    const arc = arcSnapshot.data();
    const chapter = chapterSnapshot.data();
    if (arc.storyId !== storyId || chapter.arcId !== arcId) {
      return jsonResponse(409, { error: "Story hierarchy does not match this chapter." }, cors.headers);
    }

    const tokenEmail = normalizeEmail(decodedToken.email);
    const editorEmails = (story.editorEmails ?? []).map(normalizeEmail);
    const canEdit = isAdminToken(decodedToken) || story.creatorId === decodedToken.uid || (tokenEmail && editorEmails.includes(tokenEmail));
    if (!canEdit) {
      return jsonResponse(403, { error: "You do not have permission to announce this chapter." }, cors.headers);
    }
    if (chapter.published !== true) {
      return jsonResponse(409, { error: "Only published chapters can be announced." }, cors.headers);
    }

    const phase = (arc.phases ?? []).find((entry) => (entry.chapterIds ?? []).includes(chapterId));
    const userProfile = userSnapshot.exists ? userSnapshot.data() : {};
    const actorName = compactText(
      userProfile.penName || userProfile.name || decodedToken.name || decodedToken.email || "Unknown user",
      120,
    );
    const storyTitle = compactText(story.title || "Untitled Story");
    const arcTitle = compactText(arc.title || "Untitled Arc");
    const phaseTitle = compactText(phase?.title || "Chapters");
    const chapterTitle = compactText(chapter.title || "Untitled Chapter");
    const firstPublication = chapter.hasEverBeenPublished !== true;
    const type = firstPublication ? "published" : "updated";
    const verb = firstPublication ? "yayınlanmıştır" : "güncellenmiştir";
    const message = [
      `"${storyTitle}" hikayesinde`,
      `"${arcTitle}" arc'ında`,
      `"${phaseTitle}" phase'inde`,
      `"${chapterTitle}" chapter'ı`,
      `${actorName} tarafından ${verb}.`,
    ].join("\n");
    const chapterUrl = getChapterUrl({
      storyId,
      arcId,
      chapterId,
      requestedUrl: body.chapterUrl,
    });

    await sendDiscordWebhook({
      message,
      chapterUrl,
      coverImageUrl: getImageUrl(chapter.coverImageUrl),
      type,
    });

    await chapterRef.update({
      hasEverBeenPublished: true,
      lastAnnouncementAt: FieldValue.serverTimestamp(),
      lastAnnouncementType: type,
    });

    return jsonResponse(200, { ok: true, type }, cors.headers);
  } catch (error) {
    console.error("Discord announcement failed:", error);
    const status = Number.isInteger(error?.status) ? error.status : 500;
    return jsonResponse(status, { error: error?.message || "Discord announcement failed." }, cors.headers);
  }
}

export default {
  fetch: handleRequest,
};
