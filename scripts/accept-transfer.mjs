import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { applicationDefault, cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

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

function normalizeEmail(value) {
  return String(value ?? "").trim().toLowerCase();
}

function requireArg(args, key, message) {
  const value = args[key];

  if (!value || value === true) {
    throw new Error(message);
  }

  return value;
}

function initFirebaseAdmin(serviceAccountPath) {
  if (serviceAccountPath) {
    const absolutePath = path.resolve(serviceAccountPath);
    const serviceAccount = JSON.parse(fs.readFileSync(absolutePath, "utf8"));

    initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });

    return;
  }

  initializeApp({
    credential: applicationDefault(),
  });
}

async function findUserByEmail(db, emailLower) {
  const usersRef = db.collection("users");
  const byEmailLower = await usersRef.where("emailLower", "==", emailLower).limit(2).get();

  if (!byEmailLower.empty) {
    return byEmailLower.docs[0];
  }

  const byEmail = await usersRef.where("email", "==", emailLower).limit(2).get();

  if (!byEmail.empty) {
    return byEmail.docs[0];
  }

  return null;
}

async function findPendingStory(db, emailLower, storyId) {
  if (storyId) {
    const storyRef = db.collection("stories").doc(storyId);
    const storySnapshot = await storyRef.get();

    if (!storySnapshot.exists) {
      throw new Error(`Story not found: ${storyId}`);
    }

    return storySnapshot;
  }

  const snapshot = await db
    .collection("stories")
    .where("pendingTransferStatus", "==", "pending")
    .where("pendingTransferEmailLower", "==", emailLower)
    .get();

  if (snapshot.empty) {
    throw new Error(`No pending transfer found for ${emailLower}.`);
  }

  if (snapshot.size > 1) {
    console.log(`Found ${snapshot.size} pending transfers for ${emailLower}:`);
    snapshot.docs.forEach((docSnapshot) => {
      const story = docSnapshot.data();
      console.log(`- ${docSnapshot.id}: ${story.title ?? "Untitled story"} by ${story.creatorName ?? "Unknown"}`);
    });
    throw new Error("More than one matching transfer exists. Re-run with --story STORY_ID.");
  }

  return snapshot.docs[0];
}

function transferMatches(story, emailLower) {
  const pendingEmailLower = normalizeEmail(story.pendingTransferEmailLower);
  const nestedEmailLower = normalizeEmail(story.pendingTransfer?.targetEmailLower);
  const nestedEmail = normalizeEmail(story.pendingTransfer?.targetEmail);

  return story.pendingTransferStatus === "pending"
    && [pendingEmailLower, nestedEmailLower, nestedEmail].includes(emailLower);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const email = requireArg(args, "email", "Missing --email target@example.com");
  const emailLower = normalizeEmail(email);
  const storyId = args.story && args.story !== true ? args.story : "";
  const force = args.force === true;

  if (!emailLower.includes("@")) {
    throw new Error(`Invalid email: ${email}`);
  }

  initFirebaseAdmin(args["service-account"]);

  const db = getFirestore();
  const userSnapshot = await findUserByEmail(db, emailLower);

  if (!userSnapshot) {
    throw new Error(
      `No app user document found for ${emailLower}. Log in once with that account first, then run this again.`,
    );
  }

  const storySnapshot = await findPendingStory(db, emailLower, storyId);
  const story = storySnapshot.data();

  if (!force && !transferMatches(story, emailLower)) {
    throw new Error(
      `Story ${storySnapshot.id} does not have a pending transfer for ${emailLower}. Add --force only if you are sure.`,
    );
  }

  const user = userSnapshot.data();
  const displayName = String(user.penName || user.name || user.email || emailLower || "Creator").trim();

  await storySnapshot.ref.update({
    creatorId: userSnapshot.id,
    creatorName: displayName,
    pendingTransfer: null,
    pendingTransferEmailLower: "",
    pendingTransferStatus: "",
    updatedAt: new Date().toISOString(),
  });

  console.log("Ownership transfer completed.");
  console.log(`Story: ${story.title ?? storySnapshot.id} (${storySnapshot.id})`);
  console.log(`New owner: ${displayName} <${user.email ?? emailLower}> (${userSnapshot.id})`);
}

main().catch((error) => {
  console.error(`Transfer failed: ${error.message}`);
  process.exitCode = 1;
});
