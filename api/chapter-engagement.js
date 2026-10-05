import { isAdminToken } from "../shared/permissions.js";

let firebaseAdminPromise;

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

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

function normalizeEmail(value) {
  return String(value ?? "").trim().toLowerCase();
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
    projectId: serviceAccount.projectId ?? serviceAccount.project_id,
  });
}

function requireId(value, label) {
  const id = String(value ?? "").trim();
  if (!/^[a-zA-Z0-9_-]{1,160}$/.test(id)) {
    throw new HttpError(400, `${label} is invalid.`);
  }
  return id;
}

function canEditStory(story, decodedToken) {
  const email = normalizeEmail(decodedToken.email);
  const editorEmails = (story.editorEmails ?? []).map(normalizeEmail);
  return isAdminToken(decodedToken) || story.creatorId === decodedToken.uid || Boolean(email && editorEmails.includes(email));
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
    return jsonResponse(405, { error: "Use POST for chapter engagement." }, cors.headers);
  }

  try {
    const authorization = String(request.headers.get("authorization") ?? "");
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
    if (!token) {
      throw new HttpError(401, "Firebase sign-in token is missing.");
    }

    const { FieldValue, getAuth, getFirestore } = await getFirebaseAdmin();
    const app = await getAdminApp();
    let decodedToken;
    try {
      decodedToken = await getAuth(app).verifyIdToken(token);
    } catch {
      throw new HttpError(401, "Firebase sign-in token is invalid or expired.");
    }

    const body = await request.json().catch(() => {
      throw new HttpError(400, "Request body must be valid JSON.");
    });
    const storyId = requireId(body.storyId, "Story ID");
    const arcId = requireId(body.arcId, "Arc ID");
    const chapterId = requireId(body.chapterId, "Chapter ID");
    const action = String(body.action ?? "");
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
      throw new HttpError(404, "Story, arc, or chapter was not found.");
    }
    const story = storySnapshot.data();
    const arc = arcSnapshot.data();
    const chapter = chapterSnapshot.data();
    if (arc.storyId !== storyId || chapter.arcId !== arcId) {
      throw new HttpError(409, "Story hierarchy does not match this chapter.");
    }

    if (action === "add-comment") {
      const commentBody = String(body.commentBody ?? "").trim();
      if (!commentBody || commentBody.length > 2000) {
        throw new HttpError(400, "Comment must contain between 1 and 2000 characters.");
      }
      const profile = userSnapshot.exists ? userSnapshot.data() : {};
      const comment = {
        id: crypto.randomUUID(),
        userId: decodedToken.uid,
        userName: String(profile.penName || profile.name || decodedToken.name || decodedToken.email || "Reader").slice(0, 120),
        body: commentBody,
        createdAt: new Date().toISOString(),
      };
      await chapterRef.update({
        comments: FieldValue.arrayUnion(comment),
        updatedAt: new Date().toISOString(),
      });
      return jsonResponse(200, { ok: true, comment }, cors.headers);
    }

    if (action === "toggle-reaction") {
      const emoji = String(body.emoji ?? "");
      if (!["🔥", "😮", "💀", "❤️"].includes(emoji)) {
        throw new HttpError(400, "Reaction is not supported.");
      }
      await db.runTransaction(async (transaction) => {
        const freshChapterSnapshot = await transaction.get(chapterRef);
        if (!freshChapterSnapshot.exists) {
          throw new HttpError(404, "Chapter was not found.");
        }
        const reactions = { ...(freshChapterSnapshot.data().reactions ?? {}) };
        const users = new Set(reactions[emoji] ?? []);
        if (users.has(decodedToken.uid)) {
          users.delete(decodedToken.uid);
        } else {
          users.add(decodedToken.uid);
        }
        reactions[emoji] = [...users];
        transaction.update(chapterRef, { reactions, updatedAt: new Date().toISOString() });
      });
      return jsonResponse(200, { ok: true }, cors.headers);
    }

    if (action === "delete-comment") {
      const commentId = String(body.commentId ?? "").trim();
      const fallbackIndex = Number(body.commentIndex);
      await db.runTransaction(async (transaction) => {
        const freshChapterSnapshot = await transaction.get(chapterRef);
        if (!freshChapterSnapshot.exists) {
          throw new HttpError(404, "Chapter was not found.");
        }
        const comments = [...(freshChapterSnapshot.data().comments ?? [])];
        const commentIndex = commentId
          ? comments.findIndex((comment) => comment.id === commentId)
          : fallbackIndex;
        const comment = comments[commentIndex];
        if (!comment) {
          throw new HttpError(404, "Comment was not found.");
        }
        if (comment.userId !== decodedToken.uid && !canEditStory(story, decodedToken)) {
          throw new HttpError(403, "Only the commenter or a story editor can delete this comment.");
        }
        comments.splice(commentIndex, 1);
        transaction.update(chapterRef, { comments, updatedAt: new Date().toISOString() });
      });
      return jsonResponse(200, { ok: true }, cors.headers);
    }

    throw new HttpError(400, "Unknown chapter engagement action.");
  } catch (error) {
    console.error("Chapter engagement failed:", error);
    const status = Number.isInteger(error?.status) ? error.status : 500;
    return jsonResponse(status, { error: error?.message || "Chapter engagement failed." }, cors.headers);
  }
}

export default {
  fetch: handleRequest,
};
