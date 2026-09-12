import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const part = argv[index];
    if (!part.startsWith("--")) {
      continue;
    }

    const key = part.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      index += 1;
    }
  }
  return args;
}

function requireArg(args, key, message) {
  const value = args[key];
  if (!value || value === true) {
    throw new Error(message);
  }
  return String(value);
}

function normalizeEmail(value) {
  return String(value ?? "").trim().toLowerCase();
}

function initAdmin(serviceAccountPath) {
  const absolutePath = path.resolve(serviceAccountPath);
  const serviceAccount = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
}

async function findAuthUserByEmail(emailLower) {
  const auth = getAuth();
  try {
    return await auth.getUserByEmail(emailLower);
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      return null;
    }
    throw error;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const oldUid = requireArg(args, "old-uid", "Pass --old-uid with the original Firebase Auth UID.");
  const emailLower = normalizeEmail(requireArg(args, "email", "Pass --email with the recreated Google account email."));
  const serviceAccountPath = args.service || "firebase-admin.json";
  const dryRun = Boolean(args["dry-run"]);

  initAdmin(serviceAccountPath);

  const authUser = await findAuthUserByEmail(emailLower);
  if (!authUser) {
    throw new Error(`No Firebase Auth user exists for ${emailLower}. Ask the user to log in once first.`);
  }

  if (authUser.uid === oldUid) {
    throw new Error(`The recreated user still has the old UID (${oldUid}). Nothing to migrate.`);
  }

  const db = getFirestore();
  const oldProfileRef = db.doc(`users/${oldUid}`);
  const newProfileRef = db.doc(`users/${authUser.uid}`);
  const oldProfile = await oldProfileRef.get();
  const newProfile = await newProfileRef.get();
  const stories = await db.collection("stories").where("creatorId", "==", oldUid).get();

  console.log(JSON.stringify({
    dryRun,
    oldUid,
    newUid: authUser.uid,
    email: emailLower,
    storyCount: stories.size,
    storyIds: stories.docs.map((doc) => doc.id),
  }, null, 2));

  if (dryRun) {
    return;
  }

  const now = new Date().toISOString();
  const oldData = oldProfile.exists ? oldProfile.data() : {};
  const newData = newProfile.exists ? newProfile.data() : {};
  const displayName = String(
    newData.penName
      || oldData.penName
      || authUser.displayName
      || oldData.name
      || emailLower
      || "Creator",
  ).trim();

  await newProfileRef.set({
    ...oldData,
    ...newData,
    id: authUser.uid,
    name: authUser.displayName || newData.name || oldData.name || displayName,
    email: authUser.email || emailLower,
    emailLower,
    migratedFromUid: oldUid,
    updatedAt: now,
    createdAt: newData.createdAt || oldData.createdAt || now,
  }, { merge: true });

  const batch = db.batch();
  stories.docs.forEach((storyDoc) => {
    const story = storyDoc.data();
    const editorEmails = (story.editorEmails || []).filter((entry) => normalizeEmail(entry) !== emailLower);
    batch.update(storyDoc.ref, {
      creatorId: authUser.uid,
      creatorName: displayName,
      editorEmails,
      migratedFromUid: oldUid,
      updatedAt: now,
    });
  });

  if (oldProfile.exists) {
    batch.set(oldProfileRef, {
      migratedToUid: authUser.uid,
      migratedAt: now,
      updatedAt: now,
    }, { merge: true });
  }

  await batch.commit();

  console.log(`Migrated ${stories.size} story/stories from ${oldUid} to ${authUser.uid}.`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
