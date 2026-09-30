import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

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

function applyCors(req, res) {
  const origin = String(req.headers.origin ?? "").replace(/\/$/, "");
  const allowedOrigins = getAllowedOrigins();
  const allowed = !origin || !allowedOrigins.length || allowedOrigins.includes(origin);

  if (origin && allowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  } else if (!allowedOrigins.length) {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  return allowed;
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

function getAdminApp() {
  if (getApps().length) {
    return getApps()[0];
  }

  const serviceAccount = getServiceAccount();
  return initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.projectId,
  });
}

function parseRequestBody(req) {
  try {
    if (typeof req.body === "string") {
      return JSON.parse(req.body || "{}");
    }
    return req.body ?? {};
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

async function sendDiscordWebhook({ message, chapterUrl, chapterTitle, coverImageUrl, type }) {
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
    title: compactText(chapterTitle, 256),
    url: chapterUrl,
    description: compactText(message, 4096),
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
      content: `${message}\n${chapterUrl}`,
      embeds: [embed],
      allowed_mentions: { parse: [] },
    }),
  });

  if (!response.ok) {
    const detail = compactText(await response.text(), 500);
    throw new Error(`Discord rejected the announcement (${response.status})${detail ? `: ${detail}` : "."}`);
  }
}

export default async function handler(req, res) {
  const originAllowed = applyCors(req, res);
  if (req.method === "OPTIONS") {
    return res.status(originAllowed ? 204 : 403).end();
  }
  if (!originAllowed) {
    return res.status(403).json({ error: "This site origin is not allowed." });
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST for Discord announcements." });
  }

  try {
    const authorization = String(req.headers.authorization ?? "");
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
    if (!token) {
      return res.status(401).json({ error: "Firebase sign-in token is missing." });
    }

    const app = getAdminApp();
    let decodedToken;
    try {
      decodedToken = await getAuth(app).verifyIdToken(token);
    } catch {
      throw new HttpError(401, "Firebase sign-in token is invalid or expired.");
    }
    const body = parseRequestBody(req);
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
      return res.status(404).json({ error: "Story, arc, or chapter was not found." });
    }

    const story = storySnapshot.data();
    const arc = arcSnapshot.data();
    const chapter = chapterSnapshot.data();
    if (arc.storyId !== storyId || chapter.arcId !== arcId) {
      return res.status(409).json({ error: "Story hierarchy does not match this chapter." });
    }

    const tokenEmail = normalizeEmail(decodedToken.email);
    const editorEmails = (story.editorEmails ?? []).map(normalizeEmail);
    const canEdit = story.creatorId === decodedToken.uid || (tokenEmail && editorEmails.includes(tokenEmail));
    if (!canEdit) {
      return res.status(403).json({ error: "You do not have permission to announce this chapter." });
    }
    if (chapter.published !== true) {
      return res.status(409).json({ error: "Only published chapters can be announced." });
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
    const message = `“${storyTitle}” hikayesinde, “${arcTitle}” arc'ında, “${phaseTitle}” phase'inde, “${chapterTitle}” chapterı, ${actorName} tarafından ${verb}.`;
    const chapterUrl = getChapterUrl({
      storyId,
      arcId,
      chapterId,
      requestedUrl: body.chapterUrl,
    });

    await sendDiscordWebhook({
      message,
      chapterUrl,
      chapterTitle,
      coverImageUrl: getImageUrl(chapter.coverImageUrl),
      type,
    });

    await chapterRef.update({
      hasEverBeenPublished: true,
      lastAnnouncementAt: FieldValue.serverTimestamp(),
      lastAnnouncementType: type,
    });

    return res.status(200).json({ ok: true, type });
  } catch (error) {
    console.error("Discord announcement failed:", error);
    const status = Number.isInteger(error?.status) ? error.status : 500;
    return res.status(status).json({ error: error?.message || "Discord announcement failed." });
  }
}
