import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

const STORAGE_KEY = "storyforge-state-v1";

const demoStoryId = "story-demo";
const demoArcId = "arc-demo";
const demoChapterId = "chapter-demo";
const DEFAULT_PHASE_TITLE = "Chapters";

function normalizeEmail(value) {
  return String(value ?? "").trim().toLowerCase();
}

function matchesPendingTransferEmail(story, email) {
  const normalized = normalizeEmail(email);
  if (!normalized || story?.pendingTransferStatus !== "pending") {
    return false;
  }

  return [
    story.pendingTransferEmailLower,
    normalizeEmail(story.pendingTransfer?.targetEmail),
  ].includes(normalized);
}

const starterState = {
  users: {
    "demo-user": {
      id: "demo-user",
      name: "Demo Creator",
      email: "demo@storyforge.local",
      emailLower: "demo@storyforge.local",
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
      editorEmails: [],
      pendingTransfer: null,
      pendingTransferEmailLower: "",
      pendingTransferStatus: "",
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
      soundtracks: [],
      phases: [
        {
          id: "phase-demo",
          title: DEFAULT_PHASE_TITLE,
          chapterIds: [demoChapterId],
        },
      ],
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
      renderMode: "markdown",
      htmlBackground: "",
      assets: [],
      soundtracks: [],
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

function flattenPhaseChapterIds(phases) {
  return phases.flatMap((phase) => phase.chapterIds ?? []);
}

function buildDefaultPhase(chapterIds = []) {
  return {
    id: makeId("phase"),
    title: DEFAULT_PHASE_TITLE,
    chapterIds: [...chapterIds],
  };
}

function ensureArcPhasesData(arc) {
  const sourceChapterIds = [...(arc.chapterIds ?? [])];
  const existingPhases = Array.isArray(arc.phases) && arc.phases.length ? arc.phases.map((phase) => ({
    id: phase.id ?? makeId("phase"),
    title: phase.title?.trim() || DEFAULT_PHASE_TITLE,
    chapterIds: [...(phase.chapterIds ?? [])],
  })) : [buildDefaultPhase(sourceChapterIds)];

  const seen = new Set();
  for (const phase of existingPhases) {
    phase.chapterIds = phase.chapterIds.filter((chapterId) => {
      if (!chapterId || seen.has(chapterId)) {
        return false;
      }

      seen.add(chapterId);
      return true;
    });
  }

  const unassigned = sourceChapterIds.filter((chapterId) => !seen.has(chapterId));
  if (unassigned.length) {
    existingPhases[0].chapterIds.push(...unassigned);
  }

  const orderedChapterIds = flattenPhaseChapterIds(existingPhases);
  return {
    ...arc,
    chapterIds: orderedChapterIds,
    soundtracks: arc.soundtracks ?? [],
    phases: existingPhases,
  };
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
    pendingTransfer: story.pendingTransfer ?? null,
    pendingTransferEmailLower: story.pendingTransferEmailLower ?? "",
    pendingTransferStatus: story.pendingTransferStatus ?? "",
    arcIds: story.arcIds ?? [],
    arcs,
  };
}

function normalizeArc(arc, state) {
  const preparedArc = ensureArcPhasesData(arc);
  const chapters = preparedArc.chapterIds
    .map((chapterId) => state.chapters[chapterId])
    .filter(Boolean);

  return {
    ...preparedArc,
    chapterIds: preparedArc.chapterIds ?? [],
    chapters,
    phases: preparedArc.phases.map((phase) => ({
      ...phase,
      chapters: phase.chapterIds.map((chapterId) => state.chapters[chapterId]).filter(Boolean),
    })),
  };
}

function ensureLocalArcMigration(state, arcId) {
  const arc = state.arcs[arcId];
  if (!arc) {
    return false;
  }

  const nextArc = ensureArcPhasesData(arc);
  const changed = JSON.stringify({
    chapterIds: arc.chapterIds ?? [],
    phases: arc.phases ?? [],
  }) !== JSON.stringify({
    chapterIds: nextArc.chapterIds,
    phases: nextArc.phases,
  });

  if (changed) {
    state.arcs[arcId] = {
      ...state.arcs[arcId],
      chapterIds: nextArc.chapterIds,
      phases: nextArc.phases,
    };
  }

  return changed;
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
      const current = state.users[userId] ?? { id: userId, name: patch.name ?? "Creator", email: patch.email ?? "", emailLower: normalizeEmail(patch.email), penName: "" };
      state.users[userId] = {
        ...current,
        ...patch,
        emailLower: normalizeEmail(patch.email ?? current.email),
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
    async listIncomingStoryTransfers(email) {
      const state = loadLocalState();
      const emailLower = normalizeEmail(email);
      if (!emailLower) {
        return [];
      }

      return Object.values(state.stories)
        .filter((story) => story.pendingTransferStatus === "pending" && story.pendingTransferEmailLower === emailLower)
        .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
        .map((story) => normalizeStory(story, state));
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
    async listEditorStories(email) {
      const emailLower = normalizeEmail(email);
      if (!emailLower) {
        return [];
      }

      const state = loadLocalState();
      return Object.values(state.stories)
        .filter((story) => (story.editorEmails ?? []).includes(emailLower))
        .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
        .map((story) => storySummary(story));
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
      let changed = false;
      for (const arcId of state.stories[storyId]?.arcIds ?? []) {
        changed = ensureLocalArcMigration(state, arcId) || changed;
      }
      if (changed) {
        saveLocalState(state);
      }
      const story = state.stories[storyId];
      return story ? normalizeStory(story, state) : null;
    },
    async getArc(arcId) {
      const state = loadLocalState();
      const changed = ensureLocalArcMigration(state, arcId);
      if (changed) {
        saveLocalState(state);
      }
      const arc = state.arcs[arcId];
      return arc ? normalizeArc(arc, state) : null;
    },
    async getChapter(chapterId) {
      const state = loadLocalState();
      const chapter = state.chapters[chapterId] ?? null;
      return chapter
        ? {
            ...chapter,
            renderMode: chapter.renderMode ?? "markdown",
            htmlBackground: chapter.htmlBackground ?? "",
            assets: chapter.assets ?? [],
            soundtracks: chapter.soundtracks ?? [],
          }
        : null;
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
        editorEmails: [],
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
    async addStoryEditor(storyId, email) {
      const emailLower = normalizeEmail(email);
      if (!emailLower) {
        throw new Error("Enter a valid editor email.");
      }

      const state = loadLocalState();
      const story = state.stories[storyId];
      if (!story) {
        throw new Error("Story not found.");
      }

      story.editorEmails = [...new Set([...(story.editorEmails ?? []), emailLower])];
      story.updatedAt = new Date().toISOString();
      saveLocalState(state);
      return normalizeStory(story, state);
    },
    async requestStoryTransfer(storyId, targetEmail, requestedBy) {
      const state = loadLocalState();
      const story = state.stories[storyId];
      if (!story) {
        throw new Error("Story not found.");
      }

      const targetEmailLower = normalizeEmail(targetEmail);
      if (!targetEmailLower) {
        throw new Error("Enter a valid Gmail address.");
      }

      story.pendingTransfer = {
        targetEmail: String(targetEmail).trim(),
        targetEmailLower,
        requestedBy: requestedBy?.id ?? story.creatorId,
        requestedByName: requestedBy?.name ?? story.creatorName,
        requestedAt: new Date().toISOString(),
        status: "pending",
      };
      story.pendingTransferEmailLower = targetEmailLower;
      story.pendingTransferStatus = "pending";
      story.updatedAt = new Date().toISOString();
      saveLocalState(state);
      return normalizeStory(story, state);
    },
    async cancelStoryTransfer(storyId) {
      const state = loadLocalState();
      const story = state.stories[storyId];
      if (!story) {
        throw new Error("Story not found.");
      }

      story.pendingTransfer = null;
      story.pendingTransferEmailLower = "";
      story.pendingTransferStatus = "";
      story.updatedAt = new Date().toISOString();
      saveLocalState(state);
      return normalizeStory(story, state);
    },
    async acceptStoryTransfer(storyId, user) {
      const state = loadLocalState();
      const story = state.stories[storyId];
      if (!story) {
        throw new Error("Story not found.");
      }

      if (!matchesPendingTransferEmail(story, user?.email)) {
        throw new Error("This transfer request is no longer available.");
      }

      const userEmailLower = normalizeEmail(user?.email);

      const profile = state.users[user.id] ?? {
        id: user.id,
        name: user.name ?? "Creator",
        email: user.email ?? "",
        emailLower: userEmailLower,
        penName: user.penName ?? "",
      };
      state.users[user.id] = profile;

      story.creatorId = user.id;
      story.creatorName = profile.penName?.trim() || profile.name || user.name || "Creator";
      story.pendingTransfer = null;
      story.pendingTransferEmailLower = "";
      story.pendingTransferStatus = "";
      story.updatedAt = new Date().toISOString();
      saveLocalState(state);
      return normalizeStory(story, state);
    },
    async declineStoryTransfer(storyId, email) {
      const state = loadLocalState();
      const story = state.stories[storyId];
      if (!story) {
        throw new Error("Story not found.");
      }

      if (!matchesPendingTransferEmail(story, email)) {
        throw new Error("This transfer request is no longer available.");
      }

      story.pendingTransfer = null;
      story.pendingTransferEmailLower = "";
      story.pendingTransferStatus = "";
      story.updatedAt = new Date().toISOString();
      saveLocalState(state);
      return normalizeStory(story, state);
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
        soundtracks: [],
        phases: [buildDefaultPhase()],
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
      arc.phases = patch.phases ?? arc.phases;
      arc.chapterIds = patch.chapterIds ?? arc.chapterIds;
      arc.soundtracks = patch.soundtracks ?? arc.soundtracks ?? [];
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
        renderMode: "markdown",
        htmlBackground: "",
        assets: [],
        soundtracks: [],
        createdAt: now,
        updatedAt: now,
      };
      arc.chapterIds.push(id);
      if (!arc.phases?.length) {
        arc.phases = [buildDefaultPhase()];
      }
      arc.phases[0].chapterIds.push(id);
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
    async createPhase(arcId, title) {
      const state = loadLocalState();
      ensureLocalArcMigration(state, arcId);
      const arc = state.arcs[arcId];
      const phase = {
        id: makeId("phase"),
        title: title?.trim() || "New Phase",
        chapterIds: [],
      };
      arc.phases.push(phase);
      arc.updatedAt = new Date().toISOString();
      state.stories[arc.storyId].updatedAt = arc.updatedAt;
      saveLocalState(state);
      return phase;
    },
    async renamePhase(arcId, phaseId, title) {
      const state = loadLocalState();
      ensureLocalArcMigration(state, arcId);
      const arc = state.arcs[arcId];
      const phase = arc.phases.find((entry) => entry.id === phaseId);
      if (!phase) {
        throw new Error("Phase not found.");
      }

      const trimmedTitle = title?.trim() ?? "";
      if (!trimmedTitle) {
        if (arc.phases.length <= 1) {
          phase.title = DEFAULT_PHASE_TITLE;
        } else {
          const phaseIndex = arc.phases.findIndex((entry) => entry.id === phaseId);
          const targetIndex = phaseIndex < arc.phases.length - 1 ? phaseIndex + 1 : phaseIndex - 1;
          const targetPhase = arc.phases[targetIndex];
          targetPhase.chapterIds = [...(phase.chapterIds ?? []), ...(targetPhase.chapterIds ?? [])];
          arc.phases = arc.phases.filter((entry) => entry.id !== phaseId);
          arc.chapterIds = flattenPhaseChapterIds(arc.phases);
        }
      } else {
        phase.title = trimmedTitle;
      }
      arc.updatedAt = new Date().toISOString();
      state.stories[arc.storyId].updatedAt = arc.updatedAt;
      saveLocalState(state);
      return arc.phases.find((entry) => entry.id === phaseId) ?? null;
    },
    async moveChapterToPhase(arcId, chapterId, phaseId) {
      const state = loadLocalState();
      ensureLocalArcMigration(state, arcId);
      const arc = state.arcs[arcId];
      for (const phase of arc.phases) {
        phase.chapterIds = phase.chapterIds.filter((id) => id !== chapterId);
      }

      const targetPhase = arc.phases.find((entry) => entry.id === phaseId);
      if (!targetPhase) {
        throw new Error("Phase not found.");
      }

      targetPhase.chapterIds.push(chapterId);
      arc.chapterIds = flattenPhaseChapterIds(arc.phases);
      arc.updatedAt = new Date().toISOString();
      state.stories[arc.storyId].updatedAt = arc.updatedAt;
      saveLocalState(state);
    },
    async transferChapter(chapterId, targetArcId, targetPhaseId) {
      const state = loadLocalState();
      const chapter = state.chapters[chapterId];
      const targetArc = state.arcs[targetArcId];
      if (!chapter) {
        throw new Error("Chapter not found.");
      }
      if (!targetArc) {
        throw new Error("Target arc not found.");
      }

      ensureLocalArcMigration(state, chapter.arcId);
      ensureLocalArcMigration(state, targetArcId);

      const sourceArc = state.arcs[chapter.arcId];
      const nextTargetArc = state.arcs[targetArcId];
      const targetPhase = (nextTargetArc.phases ?? []).find((entry) => entry.id === targetPhaseId);
      if (!targetPhase) {
        throw new Error("Target phase not found.");
      }

      const now = new Date().toISOString();
      if (sourceArc) {
        sourceArc.chapterIds = (sourceArc.chapterIds ?? []).filter((id) => id !== chapterId);
        sourceArc.phases = (sourceArc.phases ?? []).map((phase) => ({
          ...phase,
          chapterIds: (phase.chapterIds ?? []).filter((id) => id !== chapterId),
        }));
        sourceArc.updatedAt = now;
        if (state.stories[sourceArc.storyId]) {
          state.stories[sourceArc.storyId].updatedAt = now;
        }
      }

      nextTargetArc.phases = (nextTargetArc.phases ?? []).map((phase) =>
        phase.id === targetPhaseId
          ? { ...phase, chapterIds: [...(phase.chapterIds ?? []), chapterId] }
          : phase,
      );
      nextTargetArc.chapterIds = flattenPhaseChapterIds(nextTargetArc.phases);
      nextTargetArc.updatedAt = now;
      if (state.stories[nextTargetArc.storyId]) {
        state.stories[nextTargetArc.storyId].updatedAt = now;
      }

      state.chapters[chapterId] = {
        ...chapter,
        arcId: targetArcId,
        updatedAt: now,
      };

      saveLocalState(state);
      return state.chapters[chapterId];
    },
    async reorderPhaseChapters(arcId, phaseId, chapterIds) {
      const state = loadLocalState();
      ensureLocalArcMigration(state, arcId);
      const arc = state.arcs[arcId];
      const phase = arc.phases.find((entry) => entry.id === phaseId);
      if (!phase) {
        throw new Error("Phase not found.");
      }

      phase.chapterIds = [...chapterIds];
      arc.chapterIds = flattenPhaseChapterIds(arc.phases);
      arc.updatedAt = new Date().toISOString();
      state.stories[arc.storyId].updatedAt = arc.updatedAt;
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
        arc.phases = (arc.phases ?? []).map((phase) => ({
          ...phase,
          chapterIds: (phase.chapterIds ?? []).filter((id) => id !== chapterId),
        }));
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
    pendingTransfer: story.pendingTransfer ?? null,
    pendingTransferEmailLower: story.pendingTransferEmailLower ?? "",
    pendingTransferStatus: story.pendingTransferStatus ?? "",
    arcIds: story.arcIds ?? [],
    tags: story.tags ?? [],
    editorEmails: story.editorEmails ?? [],
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
  const arcs = [];
  for (const item of sortByIdOrder(
    arcSnapshots.docs.map((entry) => ({ id: entry.id, ...entry.data(), chapterIds: entry.data().chapterIds ?? [] })),
    story.arcIds ?? [],
  )) {
    const preparedArc = ensureArcPhasesData(item);
    arcs.push(preparedArc);
  }

  const chapterMaps = await Promise.all(
    arcs.map(async (arc) => {
      const chapterSnapshots = await getDocs(query(collection(db, "chapters"), where("arcId", "==", arc.id)));
      return [
        arc.id,
        sortByIdOrder(
          chapterSnapshots.docs.map((item) => ({
            id: item.id,
            ...item.data(),
            assets: item.data().assets ?? [],
            soundtracks: item.data().soundtracks ?? [],
            renderMode: item.data().renderMode ?? "markdown",
            htmlBackground: item.data().htmlBackground ?? "",
          })),
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
      phases: arc.phases.map((phase) => ({
        ...phase,
        chapters: (chaptersByArcId[arc.id] ?? []).filter((chapter) => (phase.chapterIds ?? []).includes(chapter.id)),
      })),
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
    emailLower: normalizeEmail(user.email),
    penName: user.penName ?? (current.exists() ? current.data().penName : "") ?? "",
    structureView: user.structureView ?? (current.exists() ? current.data().structureView : "list") ?? "list",
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
        emailLower: normalizeEmail(patch.email ?? (current.exists() ? current.data().email : "")),
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
    async listIncomingStoryTransfers(email) {
      const emailLower = normalizeEmail(email);
      if (!emailLower) {
        return [];
      }

      const storySnapshots = await getDocs(
        query(
          collection(db, "stories"),
          where("pendingTransferStatus", "==", "pending"),
          where("pendingTransferEmailLower", "==", emailLower),
        ),
      );
      return storySnapshots.docs
        .map((item) => storySummary({ id: item.id, ...item.data() }))
        .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
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
    async listEditorStories(email) {
      const emailLower = normalizeEmail(email);
      if (!emailLower) {
        return [];
      }

      const storySnapshots = await getDocs(query(collection(db, "stories"), where("editorEmails", "array-contains", emailLower)));
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
      const rawArc = applyDocId(arcSnapshot);
      const arc = rawArc ? ensureArcPhasesData(rawArc) : null;
      if (!arc) {
        return null;
      }

      const chapterSnapshots = await getDocs(query(collection(db, "chapters"), where("arcId", "==", arcId)));
      return {
        ...arc,
        chapterIds: arc.chapterIds ?? [],
        phases: arc.phases.map((phase) => ({
          ...phase,
          chapters: sortByIdOrder(
            chapterSnapshots.docs
              .map((item) => ({
                id: item.id,
                ...item.data(),
                assets: item.data().assets ?? [],
                soundtracks: item.data().soundtracks ?? [],
                renderMode: item.data().renderMode ?? "markdown",
                htmlBackground: item.data().htmlBackground ?? "",
              }))
              .filter((chapter) => (phase.chapterIds ?? []).includes(chapter.id)),
            phase.chapterIds ?? [],
          ),
        })),
        chapters: sortByIdOrder(
          chapterSnapshots.docs.map((item) => ({
            id: item.id,
            ...item.data(),
            assets: item.data().assets ?? [],
            soundtracks: item.data().soundtracks ?? [],
            renderMode: item.data().renderMode ?? "markdown",
            htmlBackground: item.data().htmlBackground ?? "",
          })),
          arc.chapterIds ?? [],
        ),
      };
    },
    async getChapter(chapterId) {
      const chapterSnapshot = await getDoc(doc(db, "chapters", chapterId));
      const chapter = applyDocId(chapterSnapshot);
      return chapter
        ? {
            ...chapter,
            assets: chapter.assets ?? [],
            soundtracks: chapter.soundtracks ?? [],
            renderMode: chapter.renderMode ?? "markdown",
            htmlBackground: chapter.htmlBackground ?? "",
          }
        : null;
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
        editorEmails: [],
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
    async addStoryEditor(storyId, email) {
      const emailLower = normalizeEmail(email);
      if (!emailLower) {
        throw new Error("Enter a valid editor email.");
      }

      const story = await fetchStoryBundle(db, storyId);
      if (!story) {
        throw new Error("Story not found.");
      }

      const editorEmails = [...new Set([...(story.editorEmails ?? []), emailLower])];
      await updateDoc(doc(db, "stories", storyId), {
        editorEmails,
        updatedAt: new Date().toISOString(),
      });
      return fetchStoryBundle(db, storyId);
    },
    async requestStoryTransfer(storyId, targetEmail, requestedBy) {
      const targetEmailLower = normalizeEmail(targetEmail);
      if (!targetEmailLower) {
        throw new Error("Enter a valid Gmail address.");
      }

      await updateDoc(doc(db, "stories", storyId), {
        pendingTransfer: {
          targetEmail: String(targetEmail).trim(),
          targetEmailLower,
          requestedBy: requestedBy?.id ?? "",
          requestedByName: requestedBy?.name ?? "Creator",
          requestedAt: new Date().toISOString(),
          status: "pending",
        },
        pendingTransferEmailLower: targetEmailLower,
        pendingTransferStatus: "pending",
        updatedAt: new Date().toISOString(),
      });
      return fetchStoryBundle(db, storyId);
    },
    async cancelStoryTransfer(storyId) {
      await updateDoc(doc(db, "stories", storyId), {
        pendingTransfer: null,
        pendingTransferEmailLower: "",
        pendingTransferStatus: "",
        updatedAt: new Date().toISOString(),
      });
      return fetchStoryBundle(db, storyId);
    },
    async acceptStoryTransfer(storyId, user) {
      const story = await fetchStoryBundle(db, storyId);
      if (!story) {
        throw new Error("Story not found.");
      }
      if (!matchesPendingTransferEmail(story, user?.email)) {
        throw new Error("This transfer request is no longer available.");
      }

      const userEmailLower = normalizeEmail(user?.email);

      await touchUserProfile(db, user);
      const profileSnapshot = await getDoc(doc(db, "users", user.id));
      const profile = applyDocId(profileSnapshot) ?? user;
      const displayName = profile.penName?.trim() || profile.name || user.name || "Creator";
      const now = new Date().toISOString();
      await updateDoc(doc(db, "stories", storyId), {
        creatorId: user.id,
        creatorName: displayName,
        pendingTransfer: null,
        pendingTransferEmailLower: "",
        pendingTransferStatus: "",
        updatedAt: now,
      });
      return fetchStoryBundle(db, storyId);
    },
    async declineStoryTransfer(storyId, email) {
      const story = await fetchStoryBundle(db, storyId);
      if (!story) {
        throw new Error("Story not found.");
      }
      if (!matchesPendingTransferEmail(story, email)) {
        throw new Error("This transfer request is no longer available.");
      }

      await updateDoc(doc(db, "stories", storyId), {
        pendingTransfer: null,
        pendingTransferEmailLower: "",
        pendingTransferStatus: "",
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
        soundtracks: [],
        phases: [buildDefaultPhase()],
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
        renderMode: "markdown",
        htmlBackground: "",
        assets: [],
        soundtracks: [],
        createdAt: now,
        updatedAt: now,
      };

      await setDoc(doc(db, "chapters", id), payload);
      const preparedArc = ensureArcPhasesData(arc);
      if (!preparedArc.phases.length) {
        preparedArc.phases = [buildDefaultPhase()];
      }
      preparedArc.phases[0].chapterIds.push(id);
      await updateDoc(arcRef, {
        chapterIds: [...(arc.chapterIds ?? []), id],
        phases: preparedArc.phases,
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
    async createPhase(arcId, title) {
      const arcRef = doc(db, "arcs", arcId);
      const arcSnapshot = await getDoc(arcRef);
      const rawArc = applyDocId(arcSnapshot);
      const arc = rawArc ? ensureArcPhasesData(rawArc) : null;
      if (!arc) {
        throw new Error("Arc not found.");
      }

      const phase = {
        id: makeId("phase"),
        title: title?.trim() || "New Phase",
        chapterIds: [],
      };
      const phases = [...arc.phases, phase];
      const now = new Date().toISOString();
      await updateDoc(arcRef, {
        phases,
        chapterIds: flattenPhaseChapterIds(phases),
        updatedAt: now,
      });
      await updateDoc(doc(db, "stories", arc.storyId), {
        updatedAt: now,
      });
      return phase;
    },
    async renamePhase(arcId, phaseId, title) {
      const arcRef = doc(db, "arcs", arcId);
      const arcSnapshot = await getDoc(arcRef);
      const rawArc = applyDocId(arcSnapshot);
      const arc = rawArc ? ensureArcPhasesData(rawArc) : null;
      if (!arc) {
        throw new Error("Arc not found.");
      }

      const phase = arc.phases.find((entry) => entry.id === phaseId);
      if (!phase) {
        throw new Error("Phase not found.");
      }

      const trimmedTitle = title?.trim() ?? "";
      let phases;
      if (!trimmedTitle) {
        if (arc.phases.length <= 1) {
          phases = arc.phases.map((entry) =>
            entry.id === phaseId ? { ...entry, title: DEFAULT_PHASE_TITLE } : entry,
          );
        } else {
          const phaseIndex = arc.phases.findIndex((entry) => entry.id === phaseId);
          const targetIndex = phaseIndex < arc.phases.length - 1 ? phaseIndex + 1 : phaseIndex - 1;
          phases = arc.phases
            .map((entry, index) =>
              index === targetIndex
                ? { ...entry, chapterIds: [...(phase.chapterIds ?? []), ...(entry.chapterIds ?? [])] }
                : entry,
            )
            .filter((entry) => entry.id !== phaseId);
        }
      } else {
        phases = arc.phases.map((entry) =>
          entry.id === phaseId ? { ...entry, title: trimmedTitle } : entry,
        );
      }
      const now = new Date().toISOString();
      await updateDoc(arcRef, {
        phases,
        chapterIds: flattenPhaseChapterIds(phases),
        updatedAt: now,
      });
      await updateDoc(doc(db, "stories", arc.storyId), {
        updatedAt: now,
      });
      return phases.find((phase) => phase.id === phaseId);
    },
    async moveChapterToPhase(arcId, chapterId, phaseId) {
      const arcRef = doc(db, "arcs", arcId);
      const arcSnapshot = await getDoc(arcRef);
      const rawArc = applyDocId(arcSnapshot);
      const arc = rawArc ? ensureArcPhasesData(rawArc) : null;
      if (!arc) {
        throw new Error("Arc not found.");
      }

      const phases = arc.phases.map((phase) => ({
        ...phase,
        chapterIds: (phase.chapterIds ?? []).filter((id) => id !== chapterId),
      }));
      const target = phases.find((phase) => phase.id === phaseId);
      if (!target) {
        throw new Error("Phase not found.");
      }
      target.chapterIds.push(chapterId);
      const now = new Date().toISOString();
      await updateDoc(arcRef, {
        phases,
        chapterIds: flattenPhaseChapterIds(phases),
        updatedAt: now,
      });
      await updateDoc(doc(db, "stories", arc.storyId), {
        updatedAt: now,
      });
    },
    async transferChapter(chapterId, targetArcId, targetPhaseId) {
      const chapterRef = doc(db, "chapters", chapterId);
      const chapterSnapshot = await getDoc(chapterRef);
      const chapter = applyDocId(chapterSnapshot);
      if (!chapter) {
        throw new Error("Chapter not found.");
      }

      const sourceArcRef = doc(db, "arcs", chapter.arcId);
      const targetArcRef = doc(db, "arcs", targetArcId);
      const [sourceArcSnapshot, targetArcSnapshot] = await Promise.all([
        getDoc(sourceArcRef),
        getDoc(targetArcRef),
      ]);
      const rawSourceArc = applyDocId(sourceArcSnapshot);
      const rawTargetArc = applyDocId(targetArcSnapshot);
      const sourceArc = rawSourceArc ? ensureArcPhasesData(rawSourceArc) : null;
      const targetArc = rawTargetArc ? ensureArcPhasesData(rawTargetArc) : null;
      if (!sourceArc) {
        throw new Error("Source arc not found.");
      }
      if (!targetArc) {
        throw new Error("Target arc not found.");
      }

      const targetPhase = (targetArc.phases ?? []).find((phase) => phase.id === targetPhaseId);
      if (!targetPhase) {
        throw new Error("Target phase not found.");
      }

      const nextSourcePhases = sourceArc.phases.map((phase) => ({
        ...phase,
        chapterIds: (phase.chapterIds ?? []).filter((id) => id !== chapterId),
      }));
      const nextTargetPhases = targetArc.phases.map((phase) =>
        phase.id === targetPhaseId
          ? { ...phase, chapterIds: [...(phase.chapterIds ?? []), chapterId] }
          : phase,
      );

      const now = new Date().toISOString();
      await Promise.all([
        updateDoc(sourceArcRef, {
          phases: nextSourcePhases,
          chapterIds: flattenPhaseChapterIds(nextSourcePhases),
          updatedAt: now,
        }),
        updateDoc(targetArcRef, {
          phases: nextTargetPhases,
          chapterIds: flattenPhaseChapterIds(nextTargetPhases),
          updatedAt: now,
        }),
        updateDoc(chapterRef, {
          arcId: targetArcId,
          updatedAt: now,
        }),
      ]);

      await Promise.all([
        updateDoc(doc(db, "stories", sourceArc.storyId), {
          updatedAt: now,
        }),
        updateDoc(doc(db, "stories", targetArc.storyId), {
          updatedAt: now,
        }),
      ]);

      return this.getChapter(chapterId);
    },
    async reorderPhaseChapters(arcId, phaseId, chapterIds) {
      const arcRef = doc(db, "arcs", arcId);
      const arcSnapshot = await getDoc(arcRef);
      const rawArc = applyDocId(arcSnapshot);
      const arc = rawArc ? ensureArcPhasesData(rawArc) : null;
      if (!arc) {
        throw new Error("Arc not found.");
      }

      const phases = arc.phases.map((phase) =>
        phase.id === phaseId ? { ...phase, chapterIds: [...chapterIds] } : phase,
      );
      const now = new Date().toISOString();
      await updateDoc(arcRef, {
        phases,
        chapterIds: flattenPhaseChapterIds(phases),
        updatedAt: now,
      });
      await updateDoc(doc(db, "stories", arc.storyId), {
        updatedAt: now,
      });
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
          phases: (arc.phases ?? []).map((phase) => ({
            ...phase,
            chapterIds: (phase.chapterIds ?? []).filter((id) => id !== chapterId),
          })),
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
  };
}

export async function createDataAdapter(authClient) {
  if (authClient?.mode === "firebase" && authClient.db) {
    return createFirebaseAdapter(authClient);
  }

  return createLocalAdapter();
}
