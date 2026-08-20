import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

const STORAGE_KEY = "storyforge-state-v1";

const demoStoryId = "story-demo";
const demoArcId = "arc-demo";
const demoChapterId = "chapter-demo";

const starterState = {
  users: {
    "demo-user": {
      id: "demo-user",
      name: "Demo Creator",
      email: "demo@storyforge.local",
      penName: "",
    },
  },
  stories: {
    [demoStoryId]: {
      id: demoStoryId,
      title: "The Clockwork Harbor",
      tags: ["fantasy", "mystery", "serial"],
      visibility: "public",
      creatorId: "demo-user",
      creatorName: "Demo Creator",
      arcIds: [demoArcId],
      createdAt: new Date("2026-08-18T10:00:00Z").toISOString(),
      updatedAt: new Date("2026-08-18T10:00:00Z").toISOString(),
    },
  },
  arcs: {
    [demoArcId]: {
      id: demoArcId,
      storyId: demoStoryId,
      title: "Tide One",
      chapterIds: [demoChapterId],
      createdAt: new Date("2026-08-18T10:00:00Z").toISOString(),
      updatedAt: new Date("2026-08-18T10:00:00Z").toISOString(),
    },
  },
  chapters: {
    [demoChapterId]: {
      id: demoChapterId,
      arcId: demoArcId,
      title: "Lanterns on the Pier",
      body: "# Opening scene\n\nA storm hangs over the harbor while the first lanterns come alive.",
      assets: [],
      createdAt: new Date("2026-08-18T10:00:00Z").toISOString(),
      updatedAt: new Date("2026-08-18T10:00:00Z").toISOString(),
    },
  },
};

function makeId(prefix) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadLocalState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(starterState));
    return deepClone(starterState);
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(starterState));
    return deepClone(starterState);
  }
}

function saveLocalState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalizeStory(story, state) {
  const arcs = (story.arcIds ?? [])
    .map((arcId) => state.arcs[arcId])
    .filter(Boolean)
    .map((arc) => normalizeArc(arc, state));

  return {
    ...story,
    arcIds: story.arcIds ?? [],
    arcs,
  };
}

function normalizeArc(arc, state) {
  const chapters = (arc.chapterIds ?? [])
    .map((chapterId) => state.chapters[chapterId])
    .filter(Boolean);

  return {
    ...arc,
    chapterIds: arc.chapterIds ?? [],
    chapters,
  };
}

function createLocalAdapter() {
  return {
    mode: "local",
    async getUserProfile(userId) {
      if (!userId) {
        return null;
      }

      const state = loadLocalState();
      return state.users[userId] ?? null;
    },
    async updateUserProfile(userId, patch) {
      const state = loadLocalState();
      const current = state.users[userId] ?? { id: userId, name: patch.name ?? "Creator", email: patch.email ?? "", penName: "" };
      state.users[userId] = {
        ...current,
        ...patch,
      };

      const displayName = state.users[userId].penName?.trim() || state.users[userId].name || "Creator";
      for (const story of Object.values(state.stories)) {
        if (story.creatorId === userId) {
          story.creatorName = displayName;
        }
      }

      saveLocalState(state);
      return state.users[userId];
    },
    async listCreatorStories(userId) {
      if (!userId) {
        return [];
      }

      const state = loadLocalState();
      return Object.values(state.stories)
        .filter((story) => story.creatorId === userId)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .map((story) => ({
          ...story,
          arcs: (story.arcIds ?? []).map((arcId) => ({ id: arcId })),
        }));
    },
    async listBrowserStories() {
      const state = loadLocalState();
      return Object.values(state.stories)
        .filter((story) => story.visibility === "public")
        .sort((a, b) => a.creatorName.localeCompare(b.creatorName) || a.title.localeCompare(b.title))
        .map((story) => ({
          ...story,
          arcs: (story.arcIds ?? []).map((arcId) => ({ id: arcId })),
        }));
    },
    async getStory(storyId) {
      const state = loadLocalState();
      const story = state.stories[storyId];
      return story ? normalizeStory(story, state) : null;
    },
    async getArc(arcId) {
      const state = loadLocalState();
      const arc = state.arcs[arcId];
      return arc ? normalizeArc(arc, state) : null;
    },
    async getChapter(chapterId) {
      const state = loadLocalState();
      return state.chapters[chapterId] ?? null;
    },
    async createStory({ creatorId, creatorName, title, tags, visibility }) {
      const state = loadLocalState();
      const id = makeId("story");
      const now = new Date().toISOString();
      state.stories[id] = {
        id,
        title,
        tags,
        visibility,
        creatorId,
        creatorName,
        arcIds: [],
        createdAt: now,
        updatedAt: now,
      };
      saveLocalState(state);
      return normalizeStory(state.stories[id], state);
    },
    async updateStory(storyId, patch) {
      const state = loadLocalState();
      if (!state.stories[storyId]) {
        throw new Error("Story not found.");
      }

      state.stories[storyId] = {
        ...state.stories[storyId],
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      saveLocalState(state);
      return normalizeStory(state.stories[storyId], state);
    },
    async createArc(storyId, title) {
      const state = loadLocalState();
      const story = state.stories[storyId];
      if (!story) {
        throw new Error("Story not found.");
      }

      const id = makeId("arc");
      const now = new Date().toISOString();
      state.arcs[id] = {
        id,
        storyId,
        title,
        chapterIds: [],
        createdAt: now,
        updatedAt: now,
      };
      story.arcIds.push(id);
      story.updatedAt = now;
      saveLocalState(state);
      return normalizeArc(state.arcs[id], state);
    },
    async updateArc(arcId, patch) {
      const state = loadLocalState();
      const arc = state.arcs[arcId];
      if (!arc) {
        throw new Error("Arc not found.");
      }

      arc.title = patch.title ?? arc.title;
      arc.updatedAt = new Date().toISOString();
      state.stories[arc.storyId].updatedAt = arc.updatedAt;
      saveLocalState(state);
      return normalizeArc(arc, state);
    },
    async reorderArcs(storyId, arcIds) {
      const state = loadLocalState();
      state.stories[storyId].arcIds = [...arcIds];
      state.stories[storyId].updatedAt = new Date().toISOString();
      saveLocalState(state);
    },
    async createChapter(arcId, title) {
      const state = loadLocalState();
      const arc = state.arcs[arcId];
      if (!arc) {
        throw new Error("Arc not found.");
      }

      const id = makeId("chapter");
      const now = new Date().toISOString();
      state.chapters[id] = {
        id,
        arcId,
        title,
        body: "",
        assets: [],
        createdAt: now,
        updatedAt: now,
      };
      arc.chapterIds.push(id);
      arc.updatedAt = now;
      state.stories[arc.storyId].updatedAt = now;
      saveLocalState(state);
      return state.chapters[id];
    },
    async updateChapter(chapterId, patch) {
      const state = loadLocalState();
      if (!state.chapters[chapterId]) {
        throw new Error("Chapter not found.");
      }

      state.chapters[chapterId] = {
        ...state.chapters[chapterId],
        ...patch,
        updatedAt: new Date().toISOString(),
      };

      const arc = state.arcs[state.chapters[chapterId].arcId];
      if (arc) {
        arc.updatedAt = state.chapters[chapterId].updatedAt;
        state.stories[arc.storyId].updatedAt = arc.updatedAt;
      }

      saveLocalState(state);
      return state.chapters[chapterId];
    },
    async updateChapterOrder(arcId, chapterIds) {
      const state = loadLocalState();
      state.arcs[arcId].chapterIds = [...chapterIds];
      state.arcs[arcId].updatedAt = new Date().toISOString();
      state.stories[state.arcs[arcId].storyId].updatedAt = state.arcs[arcId].updatedAt;
      saveLocalState(state);
    },
    async deleteChapter(chapterId) {
      const state = loadLocalState();
      const chapter = state.chapters[chapterId];
      if (!chapter) {
        return;
      }

      const arc = state.arcs[chapter.arcId];
      if (arc) {
        arc.chapterIds = (arc.chapterIds ?? []).filter((id) => id !== chapterId);
        arc.updatedAt = new Date().toISOString();
        const story = state.stories[arc.storyId];
        if (story) {
          story.updatedAt = arc.updatedAt;
        }
      }

      delete state.chapters[chapterId];
      saveLocalState(state);
    },
    async deleteArc(arcId) {
      const state = loadLocalState();
      const arc = state.arcs[arcId];
      if (!arc) {
        return;
      }

      for (const chapterId of arc.chapterIds ?? []) {
        delete state.chapters[chapterId];
      }

      const story = state.stories[arc.storyId];
      if (story) {
        story.arcIds = (story.arcIds ?? []).filter((id) => id !== arcId);
        story.updatedAt = new Date().toISOString();
      }

      delete state.arcs[arcId];
      saveLocalState(state);
    },
    async deleteStory(storyId) {
      const state = loadLocalState();
      const story = state.stories[storyId];
      if (!story) {
        return;
      }

      for (const arcId of story.arcIds ?? []) {
        const arc = state.arcs[arcId];
        for (const chapterId of arc?.chapterIds ?? []) {
          delete state.chapters[chapterId];
        }
        delete state.arcs[arcId];
      }

      delete state.stories[storyId];
      saveLocalState(state);
    },
  };
}

function storySummary(story) {
  return {
    ...story,
    arcIds: story.arcIds ?? [],
    tags: story.tags ?? [],
    arcs: (story.arcIds ?? []).map((arcId) => ({ id: arcId })),
  };
}

function applyDocId(snapshot) {
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

function sortByIdOrder(items, orderedIds) {
  const indexMap = new Map(orderedIds.map((id, index) => [id, index]));
  return [...items].sort((a, b) => (indexMap.get(a.id) ?? 0) - (indexMap.get(b.id) ?? 0));
}

async function fetchStoryBundle(db, storyId) {
  const storySnapshot = await getDoc(doc(db, "stories", storyId));
  const story = applyDocId(storySnapshot);
  if (!story) {
    return null;
  }

  const arcSnapshots = await getDocs(query(collection(db, "arcs"), where("storyId", "==", storyId)));
  const arcs = sortByIdOrder(
    arcSnapshots.docs.map((item) => ({ id: item.id, ...item.data(), chapterIds: item.data().chapterIds ?? [] })),
    story.arcIds ?? [],
  );

  const chapterMaps = await Promise.all(
    arcs.map(async (arc) => {
      const chapterSnapshots = await getDocs(query(collection(db, "chapters"), where("arcId", "==", arc.id)));
      return [
        arc.id,
        sortByIdOrder(
          chapterSnapshots.docs.map((item) => ({ id: item.id, ...item.data(), assets: item.data().assets ?? [] })),
          arc.chapterIds ?? [],
        ),
      ];
    }),
  );

  const chaptersByArcId = Object.fromEntries(chapterMaps);

  return {
    ...story,
    tags: story.tags ?? [],
    arcIds: story.arcIds ?? [],
    arcs: arcs.map((arc) => ({
      ...arc,
      chapterIds: arc.chapterIds ?? [],
      chapters: chaptersByArcId[arc.id] ?? [],
    })),
  };
}

async function touchUserProfile(db, user) {
  if (!user?.id) {
    return;
  }

  const userRef = doc(db, "users", user.id);
  const current = await getDoc(userRef);
  const base = {
    id: user.id,
    name: user.name ?? "Creator",
    email: user.email ?? "",
    penName: user.penName ?? current.data?.penName ?? "",
    updatedAt: new Date().toISOString(),
  };

  if (current.exists()) {
    await updateDoc(userRef, base);
    return;
  }

  await setDoc(userRef, {
    ...base,
    createdAt: new Date().toISOString(),
  });
}

function createFirebaseAdapter(authClient) {
  const db = authClient.db;

  return {
    mode: "firebase",
    async getUserProfile(userId) {
      if (!userId) {
        return null;
      }

      const snapshot = await getDoc(doc(db, "users", userId));
      return applyDocId(snapshot);
    },
    async updateUserProfile(userId, patch) {
      const userRef = doc(db, "users", userId);
      const current = await getDoc(userRef);
      const base = {
        id: userId,
        updatedAt: new Date().toISOString(),
        ...patch,
      };

      if (current.exists()) {
        await updateDoc(userRef, base);
      } else {
        await setDoc(userRef, {
          createdAt: new Date().toISOString(),
          ...base,
        });
      }

      const snapshot = await getDoc(userRef);
      const profile = applyDocId(snapshot);
      const displayName = profile?.penName?.trim() || profile?.name || "Creator";
      const storiesSnapshot = await getDocs(query(collection(db, "stories"), where("creatorId", "==", userId)));

      await Promise.all(
        storiesSnapshot.docs.map((storyDoc) =>
          updateDoc(doc(db, "stories", storyDoc.id), {
            creatorName: displayName,
          }),
        ),
      );

      return profile;
    },
    async listCreatorStories(userId) {
      if (!userId) {
        return [];
      }

      const storySnapshots = await getDocs(query(collection(db, "stories"), where("creatorId", "==", userId)));
      return storySnapshots.docs
        .map((item) => storySummary({ id: item.id, ...item.data() }))
        .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
    },
    async listBrowserStories() {
      const storySnapshots = await getDocs(query(collection(db, "stories"), where("visibility", "==", "public")));
      return storySnapshots.docs
        .map((item) => storySummary({ id: item.id, ...item.data() }))
        .sort((a, b) => a.creatorName.localeCompare(b.creatorName) || a.title.localeCompare(b.title));
    },
    async getStory(storyId) {
      return fetchStoryBundle(db, storyId);
    },
    async getArc(arcId) {
      const arcSnapshot = await getDoc(doc(db, "arcs", arcId));
      const arc = applyDocId(arcSnapshot);
      if (!arc) {
        return null;
      }

      const chapterSnapshots = await getDocs(query(collection(db, "chapters"), where("arcId", "==", arcId)));
      return {
        ...arc,
        chapterIds: arc.chapterIds ?? [],
        chapters: sortByIdOrder(
          chapterSnapshots.docs.map((item) => ({ id: item.id, ...item.data(), assets: item.data().assets ?? [] })),
          arc.chapterIds ?? [],
        ),
      };
    },
    async getChapter(chapterId) {
      const chapterSnapshot = await getDoc(doc(db, "chapters", chapterId));
      const chapter = applyDocId(chapterSnapshot);
      return chapter ? { ...chapter, assets: chapter.assets ?? [] } : null;
    },
    async createStory({ creatorId, creatorName, title, tags, visibility }) {
      const id = makeId("story");
      const now = new Date().toISOString();
      const payload = {
        id,
        title,
        tags,
        visibility,
        creatorId,
        creatorName,
        arcIds: [],
        createdAt: now,
        updatedAt: now,
      };

      await setDoc(doc(db, "stories", id), payload);
      await touchUserProfile(db, { id: creatorId, name: creatorName });
      return storySummary(payload);
    },
    async updateStory(storyId, patch) {
      await updateDoc(doc(db, "stories", storyId), {
        ...patch,
        updatedAt: new Date().toISOString(),
      });
      return fetchStoryBundle(db, storyId);
    },
    async createArc(storyId, title) {
      const storyRef = doc(db, "stories", storyId);
      const storySnapshot = await getDoc(storyRef);
      const story = applyDocId(storySnapshot);
      if (!story) {
        throw new Error("Story not found.");
      }

      const id = makeId("arc");
      const now = new Date().toISOString();
      const payload = {
        id,
        storyId,
        title,
        chapterIds: [],
        createdAt: now,
        updatedAt: now,
      };

      await setDoc(doc(db, "arcs", id), payload);
      await updateDoc(storyRef, {
        arcIds: [...(story.arcIds ?? []), id],
        updatedAt: now,
      });
      return payload;
    },
    async updateArc(arcId, patch) {
      const arcRef = doc(db, "arcs", arcId);
      const now = new Date().toISOString();
      await updateDoc(arcRef, {
        ...patch,
        updatedAt: now,
      });

      const arcSnapshot = await getDoc(arcRef);
      const arc = applyDocId(arcSnapshot);
      if (arc?.storyId) {
        await updateDoc(doc(db, "stories", arc.storyId), {
          updatedAt: now,
        });
      }

      return this.getArc(arcId);
    },
    async reorderArcs(storyId, arcIds) {
      await updateDoc(doc(db, "stories", storyId), {
        arcIds,
        updatedAt: new Date().toISOString(),
      });
    },
    async createChapter(arcId, title) {
      const arcRef = doc(db, "arcs", arcId);
      const arcSnapshot = await getDoc(arcRef);
      const arc = applyDocId(arcSnapshot);
      if (!arc) {
        throw new Error("Arc not found.");
      }

      const id = makeId("chapter");
      const now = new Date().toISOString();
      const payload = {
        id,
        arcId,
        title,
        body: "",
        assets: [],
        createdAt: now,
        updatedAt: now,
      };

      await setDoc(doc(db, "chapters", id), payload);
      await updateDoc(arcRef, {
        chapterIds: [...(arc.chapterIds ?? []), id],
        updatedAt: now,
      });
      await updateDoc(doc(db, "stories", arc.storyId), {
        updatedAt: now,
      });
      return payload;
    },
    async updateChapter(chapterId, patch) {
      const chapterRef = doc(db, "chapters", chapterId);
      const now = new Date().toISOString();
      await updateDoc(chapterRef, {
        ...patch,
        updatedAt: now,
      });

      const chapterSnapshot = await getDoc(chapterRef);
      const chapter = applyDocId(chapterSnapshot);
      if (chapter?.arcId) {
        const arcSnapshot = await getDoc(doc(db, "arcs", chapter.arcId));
        const arc = applyDocId(arcSnapshot);
        if (arc) {
          await updateDoc(doc(db, "arcs", arc.id), {
            updatedAt: now,
          });
          await updateDoc(doc(db, "stories", arc.storyId), {
            updatedAt: now,
          });
        }
      }

      return this.getChapter(chapterId);
    },
    async updateChapterOrder(arcId, chapterIds) {
      const arcRef = doc(db, "arcs", arcId);
      const now = new Date().toISOString();
      await updateDoc(arcRef, {
        chapterIds,
        updatedAt: now,
      });

      const arcSnapshot = await getDoc(arcRef);
      const arc = applyDocId(arcSnapshot);
      if (arc?.storyId) {
        await updateDoc(doc(db, "stories", arc.storyId), {
          updatedAt: now,
        });
      }
    },
    async deleteChapter(chapterId) {
      const chapterSnapshot = await getDoc(doc(db, "chapters", chapterId));
      const chapter = applyDocId(chapterSnapshot);
      if (!chapter) {
        return;
      }

      const arcRef = doc(db, "arcs", chapter.arcId);
      const arcSnapshot = await getDoc(arcRef);
      const arc = applyDocId(arcSnapshot);
      const now = new Date().toISOString();

      if (arc) {
        await updateDoc(arcRef, {
          chapterIds: (arc.chapterIds ?? []).filter((id) => id !== chapterId),
          updatedAt: now,
        });
        await updateDoc(doc(db, "stories", arc.storyId), {
          updatedAt: now,
        });
      }

      await deleteDoc(doc(db, "chapters", chapterId));
    },
    async deleteArc(arcId) {
      const arcSnapshot = await getDoc(doc(db, "arcs", arcId));
      const arc = applyDocId(arcSnapshot);
      if (!arc) {
        return;
      }

      for (const chapterId of arc.chapterIds ?? []) {
        await deleteDoc(doc(db, "chapters", chapterId));
      }

      const storyRef = doc(db, "stories", arc.storyId);
      const storySnapshot = await getDoc(storyRef);
      const story = applyDocId(storySnapshot);
      if (story) {
        await updateDoc(storyRef, {
          arcIds: (story.arcIds ?? []).filter((id) => id !== arcId),
          updatedAt: new Date().toISOString(),
        });
      }

      await deleteDoc(doc(db, "arcs", arcId));
    },
    async deleteStory(storyId) {
      const story = await fetchStoryBundle(db, storyId);
      if (!story) {
        return;
      }

      for (const arc of story.arcs ?? []) {
        for (const chapter of arc.chapters ?? []) {
          await deleteDoc(doc(db, "chapters", chapter.id));
        }
        await deleteDoc(doc(db, "arcs", arc.id));
      }

      await deleteDoc(doc(db, "stories", storyId));
    },
    async seedDemoStory(user) {
      if (!user?.id) {
        return;
      }

      const existing = await getDocs(query(collection(db, "stories"), where("creatorId", "==", user.id), limit(1)));
      if (!existing.empty) {
        await touchUserProfile(db, user);
        return;
      }

      const storyId = makeId("story");
      const arcId = makeId("arc");
      const chapterId = makeId("chapter");
      const now = new Date().toISOString();

      await setDoc(doc(db, "stories", storyId), {
        id: storyId,
        title: "Your First Story",
        tags: ["draft"],
        visibility: "private",
        creatorId: user.id,
        creatorName: user.name ?? "Creator",
        arcIds: [arcId],
        createdAt: now,
        updatedAt: now,
      });

      await setDoc(doc(db, "arcs", arcId), {
        id: arcId,
        storyId,
        title: "Opening Arc",
        chapterIds: [chapterId],
        createdAt: now,
        updatedAt: now,
      });

      await setDoc(doc(db, "chapters", chapterId), {
        id: chapterId,
        arcId,
        title: "Chapter One",
        body: "# Welcome\n\nThis story is now stored in Firestore.",
        assets: [],
        createdAt: now,
        updatedAt: now,
      });

      await touchUserProfile(db, user);
    },
  };
}

export async function createDataAdapter(authClient) {
  if (authClient?.mode === "firebase" && authClient.db) {
    return createFirebaseAdapter(authClient);
  }

  return createLocalAdapter();
}
