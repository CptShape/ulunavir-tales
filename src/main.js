import { createDataAdapter } from "./data.js";
import { getRuntimeConfig, initializeFirebase } from "./firebase.js";

const appRoot = document.querySelector("#app");

const state = {
  adapter: null,
  authClient: null,
  currentUser: JSON.parse(localStorage.getItem("storyforge-session") ?? "null"),
  route: { name: "home", params: {} },
  dragActive: false,
  saveStatus: "",
  authError: "",
  loadError: "",
  soundtrack: {
    arcId: "",
    queue: [],
    currentIndex: 0,
    paused: true,
    volume: 70,
    volumeOpen: false,
    mode: "idle",
    ready: false,
    autoplayAttempted: false,
    activeKey: "",
    youtubePlayer: null,
    syncToken: 0,
  },
};

const SOUNDTRACK_STORAGE_KEY = "storyforge-soundtrack-state";

function loadStoredSoundtrackState() {
  try {
    const raw = localStorage.getItem(SOUNDTRACK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStoredSoundtrackState() {
  const { arcId, currentIndex, paused, volume } = state.soundtrack;
  localStorage.setItem(SOUNDTRACK_STORAGE_KEY, JSON.stringify({ arcId, currentIndex, paused, volume }));
}

function getDisplayName(user = getUser()) {
  if (!user) {
    return "Guest";
  }

  return user.penName?.trim() || user.name || "Creator";
}

function getStructureView(user = getUser()) {
  return user?.structureView === "grid" ? "grid" : "list";
}

function persistSession(user) {
  state.currentUser = user;
  localStorage.setItem("storyforge-session", JSON.stringify(user));
}

function clearLingeringModals() {
  document.querySelectorAll(".modal-backdrop").forEach((node) => node.remove());
}

function navigate(hash) {
  const nextHash = `#${hash}`;
  if (window.location.hash === nextHash) {
    safeRender();
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    return;
  }

  window.location.hash = hash;
}

function parseRoute() {
  const raw = window.location.hash.replace(/^#/, "") || "/";
  const [pathOnly] = raw.split("?");
  const parts = pathOnly.split("/").filter(Boolean);

  if (parts.length === 0) {
    return { name: "home", params: {} };
  }

  if (parts[0] === "creator") {
    return { name: "creator", params: {} };
  }

  if (parts[0] === "browser") {
    return { name: "browser", params: {} };
  }

  if (parts[0] === "settings") {
    return { name: "settings", params: {} };
  }

  if (parts[0] === "stories" && parts[1]) {
    if (parts[2] === "arcs" && parts[3] && parts[4] === "chapters" && parts[5]) {
      return { name: "chapter", params: { storyId: parts[1], arcId: parts[3], chapterId: parts[5] } };
    }

    if (parts[2] === "arcs" && parts[3]) {
      return { name: "arc", params: { storyId: parts[1], arcId: parts[3] } };
    }

    return { name: "story", params: { storyId: parts[1] } };
  }

  return { name: "not-found", params: {} };
}

function getRouteQuery() {
  return new URLSearchParams(window.location.hash.split("?")[1] ?? "");
}

function getUser() {
  if (state.currentUser) {
    return state.currentUser;
  }

  if (state.authClient?.mode === "firebase") {
    return null;
  }

  return {
    id: "demo-user",
    name: "Demo Creator",
    email: "demo@storyforge.local",
    mode: "demo",
    structureView: "list",
  };
}

function isOwner(story) {
  return Boolean(story?.creatorId && getUser()?.id && story.creatorId === getUser().id);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function makeClientId(prefix) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function normalizeTrackLabel(value, fallback = "Soundtrack") {
  return value?.trim() || fallback;
}

function extractYouTubeVideoId(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.replace(/\//g, "") || null;
    }

    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v");
      }

      const parts = parsed.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "live"].includes(parts[0])) {
        return parts[1] ?? null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

function parseSoundtrackEntry(entry) {
  const rawUrl = entry?.url?.trim();
  const url = rawUrl && !/^https?:\/\//i.test(rawUrl) ? `https://${rawUrl}` : rawUrl;
  if (!url) {
    return null;
  }

  const youtubeId = extractYouTubeVideoId(url);
  if (youtubeId) {
    return {
      id: entry.id ?? makeClientId("soundtrack"),
      label: normalizeTrackLabel(entry.label, "YouTube track"),
      url,
      source: "youtube",
      videoId: youtubeId,
    };
  }

  return null;
}

function buildSoundtrackQueue(soundtracks = []) {
  return soundtracks.map(parseSoundtrackEntry).filter(Boolean);
}

function getSoundtrackLayer() {
  let layer = document.querySelector("#soundtrack-layer");
  if (layer) {
    return layer;
  }

  layer = document.createElement("div");
  layer.id = "soundtrack-layer";
  layer.innerHTML = `
    <div id="youtube-soundtrack-host"></div>
  `;
  document.body.append(layer);
  return layer;
}

function loadExternalScript(src, readyCheck) {
  if (readyCheck()) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existing = [...document.querySelectorAll("script")].find((node) => node.src === src);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
    document.head.append(script);
  });
}

function getActiveSoundtrack() {
  const queue = state.soundtrack.queue ?? [];
  if (!queue.length) {
    return null;
  }

  const index = Math.max(0, Math.min(state.soundtrack.currentIndex, queue.length - 1));
  return queue[index] ?? null;
}

function updateQuickToolButton() {
  const active = getActiveSoundtrack();
  const musicButton = document.querySelector("[data-action='toggle-soundtrack']");
  if (musicButton) {
    musicButton.disabled = !active;
    musicButton.classList.toggle("is-active", Boolean(active) && !state.soundtrack.paused);
    musicButton.setAttribute("aria-pressed", String(Boolean(active) && !state.soundtrack.paused));
    musicButton.setAttribute("title", active ? `${state.soundtrack.paused ? "Resume" : "Pause"} ${active.label}` : "No soundtrack available");
  }

  const volumeButton = document.querySelector("[data-action='toggle-volume-popout']");
  if (volumeButton) {
    volumeButton.disabled = !active;
    volumeButton.classList.toggle("is-open", state.soundtrack.volumeOpen);
    volumeButton.style.setProperty("--volume-fill", `${clampVolume(state.soundtrack.volume)}%`);
    volumeButton.setAttribute("title", active ? `Volume ${clampVolume(state.soundtrack.volume)}%` : "No soundtrack available");
  }

  const slider = document.querySelector("#soundtrack-volume-slider");
  if (slider) {
    slider.value = String(clampVolume(state.soundtrack.volume));
  }

  const value = document.querySelector("#soundtrack-volume-value");
  if (value) {
    value.textContent = `${clampVolume(state.soundtrack.volume)}%`;
  }

  const popout = document.querySelector(".volume-popout");
  if (popout) {
    popout.hidden = !state.soundtrack.volumeOpen;
  }
}

function persistSoundtrackUi() {
  saveStoredSoundtrackState();
  updateQuickToolButton();
}

function clearSoundtrackUi() {
  const host = document.querySelector("#soundtrack-status");
  if (host) {
    host.textContent = "No soundtrack loaded.";
  }
  updateQuickToolButton();
}

function setSoundtrackStatus(message) {
  const host = document.querySelector("#soundtrack-status");
  if (host) {
    host.textContent = message;
  }
}

function pauseCurrentSoundtrack() {
  const active = getActiveSoundtrack();
  if (state.soundtrack.mode === "youtube" && state.soundtrack.youtubePlayer?.pauseVideo) {
    state.soundtrack.youtubePlayer.pauseVideo();
  }

  state.soundtrack.paused = true;
  if (active) {
    setSoundtrackStatus(`Paused: ${active.label}`);
  }
  persistSoundtrackUi();
}

function playCurrentSoundtrack() {
  const active = getActiveSoundtrack();
  if (!active) {
    return;
  }

  if (state.soundtrack.mode === "youtube" && state.soundtrack.youtubePlayer?.playVideo) {
    state.soundtrack.youtubePlayer.playVideo();
  }

  state.soundtrack.paused = false;
  setSoundtrackStatus(`Now playing: ${active.label}`);
  persistSoundtrackUi();
}

function advanceSoundtrack() {
  if (!state.soundtrack.queue.length) {
    return;
  }

  state.soundtrack.currentIndex = (state.soundtrack.currentIndex + 1) % state.soundtrack.queue.length;
  state.soundtrack.activeKey = "";
  state.soundtrack.ready = false;
  state.soundtrack.autoplayAttempted = false;
  persistSoundtrackUi();
  syncSoundtrackPlayback();
}

function clampVolume(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
}

function applySoundtrackVolume() {
  const volume = clampVolume(state.soundtrack.volume);
  state.soundtrack.volume = volume;
  if (state.soundtrack.youtubePlayer?.setVolume) {
    state.soundtrack.youtubePlayer.setVolume(volume);
  }
  persistSoundtrackUi();
}

function setSoundtrackVolume(value) {
  state.soundtrack.volume = clampVolume(value);
  applySoundtrackVolume();
}

function adjustSoundtrackVolume(delta) {
  setSoundtrackVolume(clampVolume(state.soundtrack.volume + delta));
}

async function ensureYouTubePlayer(track, token) {
  await loadExternalScript("https://www.youtube.com/iframe_api", () => Boolean(window.YT?.Player));

  if (token !== state.soundtrack.syncToken) {
    return;
  }

  getSoundtrackLayer();

  if (!state.soundtrack.youtubePlayer) {
    await new Promise((resolve) => {
      const start = () => {
        state.soundtrack.youtubePlayer = new window.YT.Player("youtube-soundtrack-host", {
          height: "200",
          width: "320",
          videoId: track.videoId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            rel: 0,
          },
          events: {
            onReady: () => resolve(),
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.ENDED) {
                advanceSoundtrack();
                return;
              }

              if (event.data === window.YT.PlayerState.PLAYING) {
                state.soundtrack.paused = false;
                persistSoundtrackUi();
              }

              if (event.data === window.YT.PlayerState.PAUSED) {
                state.soundtrack.paused = true;
                persistSoundtrackUi();
              }
            },
          },
        });
      };

      if (window.YT?.Player) {
        start();
      } else {
        const previous = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          previous?.();
          start();
        };
      }
    });
  } else {
    state.soundtrack.youtubePlayer.loadVideoById(track.videoId);
  }

  if (token !== state.soundtrack.syncToken) {
    return;
  }

  state.soundtrack.mode = "youtube";
  state.soundtrack.ready = true;
  state.soundtrack.activeKey = track.id;
  applySoundtrackVolume();
  setSoundtrackStatus(`Now playing: ${track.label}`);
  if (!state.soundtrack.paused) {
    state.soundtrack.youtubePlayer.playVideo();
  }
  updateQuickToolButton();
}

async function syncSoundtrackPlayback() {
  const token = ++state.soundtrack.syncToken;
  const track = getActiveSoundtrack();

  if (!track) {
    state.soundtrack.arcId = "";
    state.soundtrack.queue = [];
    state.soundtrack.mode = "idle";
    state.soundtrack.ready = false;
    state.soundtrack.activeKey = "";
    pauseCurrentSoundtrack();
    clearSoundtrackUi();
    return;
  }

  try {
    if (track.source === "youtube") {
      await ensureYouTubePlayer(track, token);
      return;
    }
  } catch (error) {
    state.saveStatus = `Soundtrack error: ${String(error.message || error)}`;
    setSoundtrackStatus("Soundtrack could not be loaded.");
    updateQuickToolButton();
  }
}

function activateSoundtrackQueue(arcId, queue) {
  const stored = loadStoredSoundtrackState();
  const queueChanged = arcId !== state.soundtrack.arcId || JSON.stringify(queue.map((entry) => entry.id)) !== JSON.stringify((state.soundtrack.queue ?? []).map((entry) => entry.id));

  state.soundtrack.arcId = arcId;
  state.soundtrack.queue = queue;

  if (queueChanged) {
    state.soundtrack.currentIndex =
      stored.arcId === arcId && typeof stored.currentIndex === "number"
        ? Math.max(0, Math.min(stored.currentIndex, queue.length - 1))
        : 0;
    state.soundtrack.paused = stored.arcId === arcId ? Boolean(stored.paused) : false;
    state.soundtrack.volume = typeof stored.volume === "number" ? clampVolume(stored.volume) : state.soundtrack.volume;
    state.soundtrack.ready = false;
    state.soundtrack.activeKey = "";
  }

  persistSoundtrackUi();
  syncSoundtrackPlayback();
}

function deactivateSoundtrackQueue() {
  state.soundtrack.arcId = "";
  state.soundtrack.queue = [];
  state.soundtrack.currentIndex = 0;
  state.soundtrack.paused = true;
  state.soundtrack.volumeOpen = false;
  state.soundtrack.activeKey = "";
  state.soundtrack.ready = false;
  if (state.soundtrack.youtubePlayer?.pauseVideo) {
    state.soundtrack.youtubePlayer.pauseVideo();
  }
  clearSoundtrackUi();
  saveStoredSoundtrackState();
}

function renderMarkdown(markdown) {
  const escaped = escapeHtml(markdown);
  const fenced = escaped.replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${code.trim()}</code></pre>`);
  const imageified = fenced.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<p><img alt="$1" src="$2" /></p>');
  const linked = imageified.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  const bolded = linked.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  const italicized = bolded.replace(/\*(.+?)\*/g, "<em>$1</em>");
  const headings = italicized
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>");

  const listNormalized = headings.replace(/(?:^|\n)- (.*(?:\n- .*)*)/g, (match) => {
    const items = match
      .trim()
      .split("\n")
      .map((line) => line.replace(/^- /, "").trim())
      .map((item) => `<li>${item}</li>`)
      .join("");
    return `\n<ul>${items}</ul>`;
  });

  return listNormalized
    .split(/\n{2,}/)
    .map((block) => {
      if (/^<(h\d|ul|pre|p)/.test(block.trim())) {
        return block;
      }

      return `<p>${block.replace(/\n/g, "<br />")}</p>`;
    })
    .join("");
}

function normalizeDateValue(value) {
  if (!value) {
    return null;
  }

  if (typeof value.toDate === "function") {
    return value.toDate();
  }

  if (typeof value.seconds === "number") {
    return new Date(value.seconds * 1000);
  }

  return new Date(value);
}

function formatDate(value) {
  const date = normalizeDateValue(value);

  if (!date || Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function byQuery(items, query, accessor) {
  if (!query) {
    return items;
  }

  const lower = query.toLowerCase();
  return items.filter((item) => accessor(item).toLowerCase().includes(lower));
}

function uniqueTags(stories) {
  return [...new Set(stories.flatMap((story) => story.tags))].sort((a, b) => a.localeCompare(b));
}

function renderQuickTools(content = "") {
  return `
    <aside class="quick-tools">
      <div class="quick-tools-frame">
        <div class="quick-tools-label">Quick Tools</div>
        <div class="quick-tools-body">
          ${content || '<div class="quick-tools-empty">No tools</div>'}
        </div>
      </div>
    </aside>
  `;
}

function layout(content, activeTab, quickToolsContent = "") {
  const user = getUser();
  const authNotice = state.authError
    ? `<div class="notice"><strong>Sign-in error</strong><div class="muted">${escapeHtml(state.authError)}</div></div>`
    : "";
  const loadNotice = state.loadError
    ? `<div class="notice"><strong>Load error</strong><div class="muted">${escapeHtml(state.loadError)}</div></div>`
    : "";
  const statusNotice = state.saveStatus
    ? `<div class="notice"><strong>Status</strong><div class="muted">${escapeHtml(state.saveStatus)}</div></div>`
    : "";

  appRoot.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div>
          <div class="brand">
            <div class="brand-mark">SF</div>
            <div class="brand-text">
              <h1>Ulunavir Tales</h1>
              <p>Creator workspace</p>
            </div>
          </div>
          <nav class="nav-list">
            ${navLink("/", "Main Menu", activeTab === "home")}
            ${navLink("/creator", "Creator", activeTab === "creator")}
            ${navLink("/browser", "Browser", activeTab === "browser")}
          </nav>
        </div>
        <div class="stack">
          <button class="notice account-card" data-action="open-settings" ${user ? "" : "disabled"}>
            <strong>${escapeHtml(getDisplayName(user))}</strong>
            <div class="muted">${escapeHtml(user?.email ?? (state.authClient?.mode === "firebase" ? "Sign in to create and manage stories" : "Local demo mode"))}</div>
          </button>
          <button class="login-button" data-action="toggle-login">
            ${state.currentUser ? "Log out" : "Log in"}
          </button>
        </div>
      </aside>
      <main class="content">${content}</main>
      ${renderQuickTools(quickToolsContent)}
    </div>
  `;

  if (authNotice || loadNotice || statusNotice) {
    const contentRoot = appRoot.querySelector(".content");
    contentRoot.insertAdjacentHTML("afterbegin", `${statusNotice}${loadNotice}${authNotice}`);
  }
}

async function renderSettings() {
  const user = getUser();
  if (!user) {
    return renderMissing("Sign in to manage account settings.");
  }

  layout(
    `
      <div class="stack">
        <div class="page-title">
          <div>
            <h2>Settings</h2>
            <p class="muted">Manage how your author profile appears inside Ulunavir Tales.</p>
          </div>
        </div>
        <section class="panel stack">
          <div class="notice">
            <strong>Account name</strong>
            <div class="muted">${escapeHtml(user.name ?? "Creator")}</div>
          </div>
          <div class="inline-form settings-form">
            <input id="pen-name-input" placeholder="${escapeHtml(user.name ?? "Creator")}" value="${escapeHtml(user.penName ?? "")}" />
            <button class="ghost-button" data-action="save-pen-name">Save pen name</button>
          </div>
          <div class="muted">
            Leave it empty to fall back to your account name.
          </div>
        </section>
      </div>
    `,
    "home",
  );
}

function navLink(path, label, active) {
  return `<a class="nav-link ${active ? "is-active" : ""}" href="#${path}"><span>${label}</span></a>`;
}

function heroCard() {
  return `
    <section class="hero">
      <div class="stack">
        <div class="status-pill">Static frontend, Firestore-ready data model</div>
        <div>
          <h2>Build stories, arcs, and chapters from one focused workspace.</h2>
          <p class="muted">
            This first version already supports creator and browser flows, story visibility,
            chapter editing in markdown, and drag-and-drop assets in local mode.
          </p>
        </div>
      </div>
    </section>
  `;
}

function renderIncomingTransferPanel(transfers) {
  if (!transfers.length) {
    return "";
  }

  return `
    <section class="panel stack">
      <div class="section-header">
        <div>
          <h3>Ownership Requests</h3>
          <p class="muted">Stories shared with you stay with the current owner until you accept.</p>
        </div>
        <span class="pill">${transfers.length} pending</span>
      </div>
      <div class="story-list">
        ${transfers.map((story) => `
          <article class="list-card">
            <div class="stack">
              <div>
                <h3>${escapeHtml(story.title)}</h3>
                <p class="muted">Requested by ${escapeHtml(story.pendingTransfer?.requestedByName ?? story.creatorName)} on ${escapeHtml(formatDate(story.pendingTransfer?.requestedAt ?? story.updatedAt))}</p>
              </div>
              <div class="card-actions">
                <button class="primary-button" data-action="accept-story-transfer" data-story-id="${story.id}">Accept</button>
                <button class="ghost-button" data-action="decline-story-transfer" data-story-id="${story.id}">Decline</button>
                <a class="ghost-button" href="#/stories/${story.id}?view=browser">Preview</a>
              </div>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

async function renderHome() {
  const user = getUser();
  let transfers = [];
  if (user?.email) {
    try {
      transfers = await state.adapter.listIncomingStoryTransfers?.(user.email) ?? [];
    } catch (error) {
      console.error("Incoming transfer list failed:", error);
      state.loadError = "Ownership requests could not be loaded right now.";
    }
  }
  layout(
    `
      <div class="stack">
        ${heroCard()}
        ${renderIncomingTransferPanel(transfers)}
        <section class="grid cols-2">
          <article class="panel">
            <h3>Main Menu</h3>
            <p class="muted">
              Start from the creator workspace to make stories, organize arcs, and draft
              chapters. Use the browser to explore public stories grouped by creator.
            </p>
          </article>
          <article class="panel">
            <h3>Storage Plan</h3>
            <p class="muted">
              Markdown chapter text fits cleanly in Firestore documents. Image uploads should
              move to object storage behind a Vercel endpoint in the next step.
            </p>
          </article>
        </section>
      </div>
    `,
    "home",
  );
}

async function renderCreator() {
  const user = getUser();
  const stories = await state.adapter.listCreatorStories(user?.id);
  let transfers = [];
  if (user?.email) {
    try {
      transfers = await state.adapter.listIncomingStoryTransfers?.(user.email) ?? [];
    } catch (error) {
      console.error("Incoming transfer list failed:", error);
      state.loadError = "Ownership requests could not be loaded right now.";
    }
  }
  const query = getRouteQuery();
  const search = query.get("q") ?? "";
  const tag = query.get("tag") ?? "";
  const filtered = byQuery(stories, search, (story) => `${story.title} ${story.tags.join(" ")}`).filter((story) =>
    tag ? story.tags.includes(tag) : true,
  );
  const tags = uniqueTags(stories);
  const loginNotice =
    state.authClient?.mode === "firebase" && !user
      ? '<div class="notice">Sign in with Firebase to create, edit, and manage your own stories.</div>'
      : "";

  layout(
    `
      <div class="stack">
        <div class="page-title">
          <div>
            <h2>Creator</h2>
            <p class="muted">Manage your stories, search by title, and filter by tags.</p>
          </div>
          <button class="primary-button" data-action="create-story" ${user ? "" : "disabled"}>Create</button>
        </div>
        ${renderIncomingTransferPanel(transfers)}
        ${loginNotice}
        <section class="panel stack">
          <div class="search-row">
            <input id="story-search" placeholder="Search by story title or tag" value="${escapeHtml(search)}" />
            <select id="story-tag-filter">
              <option value="">All tags</option>
              ${tags.map((entry) => `<option value="${escapeHtml(entry)}" ${tag === entry ? "selected" : ""}>${escapeHtml(entry)}</option>`).join("")}
            </select>
            <button class="ghost-button" data-action="apply-story-filters">Filter</button>
          </div>
          <div class="chip-row">
            ${tags.map((entry) => `<a class="pill" href="#/creator?tag=${encodeURIComponent(entry)}">${escapeHtml(entry)}</a>`).join("")}
          </div>
        </section>
        <section class="story-list">
          ${filtered.length ? filtered.map(renderStoryCard).join("") : '<div class="empty-state">No stories match this filter yet.</div>'}
        </section>
      </div>
    `,
    "creator",
  );
}

function renderStoryCard(story) {
  return `
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${escapeHtml(story.title)}</h3>
          <p class="muted">Updated ${formatDate(story.updatedAt)}</p>
        </div>
        <span class="status-pill">${escapeHtml(story.visibility)}</span>
      </div>
      <div class="chip-row">
        ${story.tags.map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("")}
      </div>
      <div class="card-actions">
        <a class="primary-button" href="#/stories/${story.id}">Open story</a>
        <span class="pill">${story.arcs.length} arc(s)</span>
        <button class="danger-button" data-action="delete-story" data-story-id="${story.id}">Delete</button>
      </div>
    </article>
  `;
}

async function renderBrowser() {
  const stories = await state.adapter.listBrowserStories(getUser()?.id);
  const query = getRouteQuery();
  const groupByCreator = query.get("group") !== "flat";
  const creatorFilter = query.get("creator") ?? "";
  const filtered = creatorFilter ? stories.filter((story) => story.creatorName === creatorFilter) : stories;
  const creators = [...new Set(stories.map((story) => story.creatorName))];

  let body = "";

  if (!filtered.length) {
    body = '<div class="empty-state">No public stories are available yet.</div>';
  } else if (groupByCreator) {
    body = creators
      .filter((creator) => !creatorFilter || creator === creatorFilter)
      .map((creator) => {
        const creatorStories = filtered.filter((story) => story.creatorName === creator);
        if (!creatorStories.length) {
          return "";
        }

        return `
          <section class="panel stack">
            <div class="section-header">
              <h3>${escapeHtml(creator)}</h3>
              <span class="pill">${creatorStories.length} public stories</span>
            </div>
            <div class="story-list">${creatorStories.map(renderBrowserStoryCard).join("")}</div>
          </section>
        `;
      })
      .join("");
  } else {
    body = `<section class="story-list">${filtered.map(renderBrowserStoryCard).join("")}</section>`;
  }

  layout(
    `
      <div class="stack">
        <div class="page-title">
          <div>
            <h2>Browser</h2>
            <p class="muted">Explore public stories and browse them by creator.</p>
          </div>
          <div class="toolbar">
            <select id="browser-creator-filter">
              <option value="">All creators</option>
              ${creators.map((creator) => `<option value="${escapeHtml(creator)}" ${creatorFilter === creator ? "selected" : ""}>${escapeHtml(creator)}</option>`).join("")}
            </select>
            <select id="browser-group-mode">
              <option value="grouped" ${groupByCreator ? "selected" : ""}>Grouped by creator</option>
              <option value="flat" ${groupByCreator ? "" : "selected"}>Flat list</option>
            </select>
            <button class="ghost-button" data-action="apply-browser-filters">Apply</button>
          </div>
        </div>
        ${body}
      </div>
    `,
    "browser",
  );
}

function renderBrowserStoryCard(story) {
  return `
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${escapeHtml(story.title)}</h3>
          <p class="muted">by ${escapeHtml(story.creatorName)}</p>
        </div>
        <span class="pill">${story.arcs.length} arc(s)</span>
      </div>
      <div class="chip-row">
        ${story.tags.map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("")}
      </div>
      <a class="primary-button" href="#/stories/${story.id}?view=browser">Read structure</a>
    </article>
  `;
}

async function renderStoryPage(storyId) {
  const story = await state.adapter.getStory(storyId);
  if (!story) {
    return renderMissing("Story not found.");
  }

  const owner = isOwner(story);
  const browserView = getRouteQuery().get("view") === "browser";
  const structureView = getStructureView();
  const transferPanelOpen = getRouteQuery().get("transfer") === "1";
  const pendingTransfer = story.pendingTransferStatus === "pending" ? story.pendingTransfer : null;
  if (story.visibility === "private" && !owner) {
    return renderMissing("This story is private.");
  }

  layout(
    `
      <div class="stack">
        ${breadcrumbs([
          [browserView ? "#/browser" : "#/creator", browserView ? "Browser" : "Creator"],
          ["", story.title],
        ])}
        <div class="page-title">
          <div>
            <h2>${escapeHtml(story.title)}</h2>
            <p class="muted">Set visibility, manage arcs, and organize the reading order.</p>
          </div>
          <div class="card-actions">
            <div class="view-toggle" role="group" aria-label="Structure view">
              <button class="ghost-button ${structureView === "grid" ? "is-active" : ""}" data-action="set-structure-view" data-view="grid">Compact Grid</button>
              <button class="ghost-button ${structureView === "list" ? "is-active" : ""}" data-action="set-structure-view" data-view="list">List</button>
            </div>
            ${browserView && owner ? '<a class="ghost-button" href="#/stories/' + story.id + '">Edit</a>' : ""}
            ${owner && !browserView ? '<button class="ghost-button" type="button" data-action="open-story-transfer" data-story-id="' + story.id + '">Transfer Ownership</button>' : ""}
            ${owner && !browserView ? '<button class="primary-button" data-action="create-arc" data-story-id="' + story.id + '">New arc</button>' : ""}
          </div>
        </div>
        <section class="panel stack">
          <div class="inline-form">
            <input id="story-title-input" value="${escapeHtml(story.title)}" ${owner ? "" : "disabled"} />
            <input id="story-tags-input" value="${escapeHtml(story.tags.join(", "))}" ${owner ? "" : "disabled"} />
            <select id="story-visibility-input" ${owner ? "" : "disabled"}>
              ${["public", "unlisted", "private"].map((value) => `<option value="${value}" ${story.visibility === value ? "selected" : ""}>${value}</option>`).join("")}
            </select>
            ${owner ? '<button class="ghost-button" data-action="save-story-settings" data-story-id="' + story.id + '">Save</button>' : ""}
          </div>
          <div class="notice">
            <strong>${escapeHtml(story.creatorName)}</strong>
            <div class="muted">Created ${formatDate(story.createdAt)}. Visibility is currently ${escapeHtml(story.visibility)}.</div>
          </div>
          ${owner && pendingTransfer ? `
            <div class="notice">
              <strong>Transfer pending</strong>
              <div class="muted">Waiting for ${escapeHtml(pendingTransfer.targetEmail ?? "")} to accept. Ownership stays with you until they do.</div>
              <div class="card-actions">
                <button class="ghost-button" data-action="cancel-story-transfer" data-story-id="${story.id}">Cancel transfer</button>
              </div>
            </div>
          ` : ""}
          ${owner && !browserView && transferPanelOpen ? `
            <div class="notice stack">
              <div>
                <strong>Transfer ownership</strong>
                <div class="muted">Enter the recipient Gmail and type TRANSFER. The story stays with you until they accept.</div>
              </div>
              <div class="inline-form">
                <input id="story-transfer-email-input" placeholder="friend@gmail.com" />
                <input id="story-transfer-confirm-input" placeholder="Type TRANSFER" />
              </div>
              <div class="card-actions">
                <button class="primary-button" data-action="submit-story-transfer" data-story-id="${story.id}">Send request</button>
                <button class="ghost-button" data-action="close-story-transfer" data-story-id="${story.id}">Close</button>
              </div>
              <div class="muted">Wrong email does not remove the story from you. It only creates a pending request that you can cancel.</div>
            </div>
          ` : ""}
        </section>
        <section class="nested-list ${structureView === "list" ? "is-list-view" : ""}">
          ${story.arcs.length ? story.arcs.map((arc, index) => renderArcCard(arc, story, owner, index, browserView)).join("") : '<div class="empty-state">No arcs yet. Create the first arc to start structuring this story.</div>'}
        </section>
      </div>
    `,
    browserView ? "browser" : owner ? "creator" : "browser",
  );
}

function renderArcCard(arc, story, owner, index, browserView = false) {
  return `
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${escapeHtml(arc.title)}</h3>
          <p class="muted">${arc.chapters.length} chapter(s)</p>
        </div>
        ${owner ? `
          <div class="order-buttons">
            <button class="small-button" data-action="move-arc-up" data-story-id="${story.id}" data-index="${index}" ${index === 0 ? "disabled" : ""}>↑</button>
            <button class="small-button" data-action="move-arc-down" data-story-id="${story.id}" data-index="${index}" ${index === story.arcs.length - 1 ? "disabled" : ""}>↓</button>
          </div>` : ""}
      </div>
      <div class="card-actions">
        <a class="primary-button" href="#/stories/${story.id}/arcs/${arc.id}${browserView ? "?view=browser" : ""}">Open arc</a>
        ${owner && !browserView ? `<button class="danger-button" data-action="delete-arc" data-story-id="${story.id}" data-arc-id="${arc.id}">Delete</button>` : ""}
      </div>
    </article>
  `;
}

function renderPhaseHeader(phase, owner, browserView = false, arcId = "") {
  return `
    <div class="phase-separator">
      <span class="phase-line"></span>
      ${
        owner && !browserView
          ? `<button class="phase-title" data-action="rename-phase" data-arc-id="${arcId}" data-phase-id="${phase.id}" data-phase-title="${escapeHtml(phase.title)}">${escapeHtml(phase.title)}</button>`
          : `<span class="phase-title">${escapeHtml(phase.title)}</span>`
      }
      <span class="phase-line"></span>
    </div>
  `;
}

function renderSoundtrackPanel(chapter) {
  const soundtracks = chapter.soundtracks ?? [];
  return `
    <section class="panel stack">
      <div class="section-header">
        <div>
          <h3>Soundtracks</h3>
          <p class="muted">Add YouTube links that should play only for this chapter.</p>
        </div>
        <span class="pill">${soundtracks.length} track(s)</span>
      </div>
      <div class="inline-form soundtrack-form">
        <input id="soundtrack-label-input" placeholder="Optional label, for example Tavern Theme" />
        <input id="soundtrack-url-input" placeholder="https://youtube.com/... or https://youtu.be/..." />
        <button class="ghost-button" data-action="add-soundtrack" data-chapter-id="${chapter.id}">Add soundtrack</button>
      </div>
      <div class="soundtrack-list">
        ${
          soundtracks.length
            ? soundtracks.map((track) => `
                <article class="soundtrack-item">
                  <div>
                    <strong>${escapeHtml(track.label?.trim() || "Untitled soundtrack")}</strong>
                    <div class="muted mono">${escapeHtml(track.url ?? "")}</div>
                  </div>
                  <button class="danger-button" data-action="delete-soundtrack" data-chapter-id="${chapter.id}" data-soundtrack-id="${track.id}">Remove</button>
                </article>
              `).join("")
            : '<div class="empty-state">No soundtrack links yet.</div>'
        }
      </div>
    </section>
  `;
}

function renderChapterQuickTools(soundtrackQueue) {
  if (!soundtrackQueue.length) {
    return "";
  }

  const active = getActiveSoundtrack();
  const volume = clampVolume(state.soundtrack.volume);
  return `
    <div class="quick-tool-stack">
      <button
        class="quick-tool-button ${active && !state.soundtrack.paused ? "is-active" : ""}"
        data-action="toggle-soundtrack"
        aria-pressed="${String(Boolean(active) && !state.soundtrack.paused)}"
        title="${escapeHtml(active ? `${state.soundtrack.paused ? "Resume" : "Pause"} ${active.label}` : "No soundtrack available")}"
      >
        <span class="quick-tool-icon">♪</span>
      </button>
      <button
        class="quick-tool-button volume-button ${state.soundtrack.volumeOpen ? "is-open" : ""}"
        data-action="toggle-volume-popout"
        data-wheel-volume="true"
        style="--volume-fill: ${volume}%;"
        title="${escapeHtml(active ? `Volume ${volume}%` : "No soundtrack available")}"
      >
        <span class="quick-tool-icon">◔</span>
      </button>
      <div class="volume-popout" ${state.soundtrack.volumeOpen ? "" : "hidden"}>
        <input
          id="soundtrack-volume-slider"
          class="volume-slider"
          type="range"
          min="0"
          max="100"
          step="1"
          value="${volume}"
          data-action="set-volume"
        />
        <div id="soundtrack-volume-value" class="quick-tool-status">${volume}%</div>
      </div>
      <div class="quick-tool-caption">Music</div>
      <div id="soundtrack-status" class="quick-tool-status">${escapeHtml(active ? `${state.soundtrack.paused ? "Paused" : "Now playing"}: ${active.label}` : "No soundtrack loaded.")}</div>
    </div>
  `;
}

async function renderArcPage(storyId, arcId) {
  const [story, arc] = await Promise.all([state.adapter.getStory(storyId), state.adapter.getArc(arcId)]);
  if (!story || !arc) {
    return renderMissing("Arc not found.");
  }

  const owner = isOwner(story);
  const browserView = getRouteQuery().get("view") === "browser";
  const structureView = getStructureView();
  if (story.visibility === "private" && !owner) {
    return renderMissing("This story is private.");
  }

  const phaseSections = (arc.phases ?? []).map((phase) => `
    <section class="phase-block stack">
      ${renderPhaseHeader(phase, owner, browserView, arc.id)}
      <div class="nested-list ${structureView === "list" ? "is-list-view" : ""}">
        ${
          phase.chapters.length
            ? phase.chapters.map((chapter, index) => renderChapterCard(chapter, story, arc, owner, index, browserView, phase)).join("")
            : '<div class="empty-state">No chapters in this phase yet.</div>'
        }
      </div>
    </section>
  `).join("");

  layout(
    `
      <div class="stack">
        ${breadcrumbs([
          [browserView ? "#/browser" : owner ? "#/creator" : "#/browser", browserView ? "Browser" : owner ? "Creator" : "Browser"],
          ["#/stories/" + story.id + (browserView ? "?view=browser" : ""), story.title],
          ["", arc.title],
        ])}
        <div class="page-title">
          <div>
            <h2>${escapeHtml(arc.title)}</h2>
            <p class="muted">Manage the chapter list and reading order for this arc.</p>
          </div>
          <div class="card-actions">
            <div class="view-toggle" role="group" aria-label="Structure view">
              <button class="ghost-button ${structureView === "grid" ? "is-active" : ""}" data-action="set-structure-view" data-view="grid">Compact Grid</button>
              <button class="ghost-button ${structureView === "list" ? "is-active" : ""}" data-action="set-structure-view" data-view="list">List</button>
            </div>
            ${browserView && owner ? '<a class="ghost-button" href="#/stories/' + story.id + '/arcs/' + arc.id + '">Edit</a>' : ""}
            ${owner && !browserView ? '<button class="ghost-button" data-action="create-phase" data-arc-id="' + arc.id + '">New phase</button>' : ""}
            ${owner && !browserView ? '<button class="primary-button" data-action="create-chapter" data-arc-id="' + arc.id + '" data-story-id="' + story.id + '">New chapter</button>' : ""}
          </div>
        </div>
        ${owner && !browserView ? `
          <section class="panel">
            <div class="inline-form">
              <input id="arc-title-input" value="${escapeHtml(arc.title)}" />
              <button class="ghost-button" data-action="save-arc-title" data-arc-id="${arc.id}" data-story-id="${story.id}">Rename arc</button>
            </div>
        </section>` : ""}
        ${phaseSections || '<div class="empty-state">No chapters yet. Add one to begin writing.</div>'}
      </div>
    `,
    browserView ? "browser" : owner ? "creator" : "browser",
  );

  if (owner && !browserView) {
    const transferButton = document.querySelector("#story-transfer-button");
    if (transferButton) {
      transferButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        showStoryTransferModal(story.id);
      });
    }
  }
}

function renderChapterCard(chapter, story, arc, owner, index, browserView = false, phase = null) {
  return `
    <article class="list-card">
      <div class="split-header">
        <div>
          <h3>${escapeHtml(chapter.title || "Untitled chapter")}</h3>
          <p class="muted">Updated ${formatDate(chapter.updatedAt)}</p>
        </div>
        ${owner && !browserView ? `
          <div class="order-buttons">
            <button class="small-button" data-action="move-chapter-up" data-arc-id="${arc.id}" data-phase-id="${phase?.id ?? ""}" data-index="${index}" ${index === 0 ? "disabled" : ""}>↑</button>
            <button class="small-button" data-action="move-chapter-down" data-arc-id="${arc.id}" data-phase-id="${phase?.id ?? ""}" data-index="${index}" ${phase && index === phase.chapters.length - 1 ? "disabled" : ""}>↓</button>
          </div>` : ""}
      </div>
      ${
        owner && !browserView
          ? `<select class="phase-select" data-action="move-chapter-phase" data-arc-id="${arc.id}" data-chapter-id="${chapter.id}">
              ${(arc.phases ?? []).map((entry) => `<option value="${entry.id}" ${entry.id === phase?.id ? "selected" : ""}>${escapeHtml(entry.title)}</option>`).join("")}
            </select>`
          : ""
      }
      <div class="card-actions">
        <a class="primary-button" href="#/stories/${story.id}/arcs/${arc.id}/chapters/${chapter.id}${browserView ? "?view=browser" : ""}">Open chapter</a>
        ${owner && !browserView ? `<button class="small-button" title="Move chapter" data-action="open-transfer-chapter" data-story-id="${story.id}" data-arc-id="${arc.id}" data-phase-id="${phase?.id ?? ""}" data-chapter-id="${chapter.id}">↗</button>` : ""}
        ${owner && !browserView ? `<button class="danger-button" data-action="delete-chapter" data-story-id="${story.id}" data-arc-id="${arc.id}" data-chapter-id="${chapter.id}">Delete</button>` : ""}
      </div>
    </article>
  `;
}

function renderChapterPager(storyId, arcId, previousChapter, nextChapter, browserView = false) {
  if (!previousChapter && !nextChapter) {
    return "";
  }

  return `
    <div class="chapter-pager">
      ${previousChapter ? `<a class="ghost-button" href="#/stories/${storyId}/arcs/${arcId}/chapters/${previousChapter.id}${browserView ? "?view=browser" : ""}">Previous Chapter</a>` : ""}
      ${nextChapter ? `<a class="ghost-button" href="#/stories/${storyId}/arcs/${arcId}/chapters/${nextChapter.id}${browserView ? "?view=browser" : ""}">Next Chapter</a>` : ""}
    </div>
  `;
}

async function renderChapterPage(storyId, arcId, chapterId) {
  const [story, arc, chapter] = await Promise.all([
    state.adapter.getStory(storyId),
    state.adapter.getArc(arcId),
    state.adapter.getChapter(chapterId),
  ]);

  if (!story || !arc || !chapter) {
    return renderMissing("Chapter not found.");
  }

  const owner = isOwner(story);
  const browserView = getRouteQuery().get("view") === "browser";
  if (story.visibility === "private" && !owner) {
    return renderMissing("This story is private.");
  }
  const assets = chapter.assets ?? [];
  const soundtrackQueue = browserView ? buildSoundtrackQueue(chapter.soundtracks ?? []) : [];
  const chapterIndex = (arc.chapters ?? []).findIndex((entry) => entry.id === chapterId);
  const previousChapter = chapterIndex > 0 ? arc.chapters[chapterIndex - 1] : null;
  const nextChapter = chapterIndex >= 0 && chapterIndex < arc.chapters.length - 1 ? arc.chapters[chapterIndex + 1] : null;
  const chapterPagerTop = renderChapterPager(story.id, arc.id, previousChapter, nextChapter, browserView);
  const chapterPagerBottom = renderChapterPager(story.id, arc.id, previousChapter, nextChapter, browserView);
  const editorContent = owner && !browserView
    ? `
        <div class="editor-shell">
          <section class="editor-pane">
            <div class="editor-controls">
              <input id="chapter-title-input" value="${escapeHtml(chapter.title)}" ${owner ? "" : "disabled"} />
              <textarea id="chapter-body-input" class="markdown-area" ${owner ? "" : "disabled"}>${escapeHtml(chapter.body)}</textarea>
              ${chapterPagerBottom}
              ${owner ? `
                <div class="panel asset-helper">
                  <div class="section-header">
                    <h3>Image link helper</h3>
                    <span class="pill">Manual Imgur or external URLs</span>
                  </div>
                  <div class="inline-form asset-form">
                    <input id="asset-name-input" placeholder="Image label, for example cover-art" />
                    <input id="asset-url-input" placeholder="https://i.imgur.com/your-image.jpg" />
                    <button class="ghost-button" data-action="add-external-asset" data-chapter-id="${chapter.id}">Add image</button>
                  </div>
                  <div class="notice">
                    Upload the image to Imgur first, then paste the direct image URL here. This saves the asset for the chapter without changing your markdown body.
                  </div>
                </div>
              ` : ""}
              <div class="asset-list">
                ${assets.length ? assets.map(renderAssetItem).join("") : '<div class="empty-state">No assets in this chapter yet.</div>'}
              </div>
              ${renderSoundtrackPanel(chapter)}
              <div class="notice mono">${escapeHtml(state.saveStatus || "Tip: use `![alt](image-url)` to place pasted external images into the chapter body.")}</div>
            </div>
          </section>
          <section class="preview-pane">
            <h3>Preview</h3>
            <div class="markdown-preview">${renderMarkdown(chapter.body || "*Start writing to preview your chapter here.*")}</div>
          </section>
        </div>
      `
    : `
        <section class="panel stack">
          <div class="section-header">
            <h3>Reading view</h3>
            <span class="pill">${assets.length} asset(s)</span>
          </div>
          <div class="markdown-preview">${renderMarkdown(chapter.body || "*This chapter is empty.*")}</div>
        </section>
        ${chapterPagerBottom}
        ${assets.length ? `<section class="panel stack"><h3>Referenced images</h3><div class="asset-list">${assets.map(renderAssetItem).join("")}</div></section>` : ""}
      `;

  layout(
    `
      <div class="stack">
        ${breadcrumbs([
          [browserView ? "#/browser" : owner ? "#/creator" : "#/browser", browserView ? "Browser" : owner ? "Creator" : "Browser"],
          ["#/stories/" + story.id + (browserView ? "?view=browser" : ""), story.title],
          ["#/stories/" + story.id + "/arcs/" + arc.id + (browserView ? "?view=browser" : ""), arc.title],
          ["", chapter.title || "Untitled chapter"],
        ])}
        <div class="page-title">
          <div>
            <h2>${escapeHtml(chapter.title || "Untitled chapter")}</h2>
            <p class="muted">${owner && !browserView ? "Write in markdown, add image links, and save your draft." : "Read this chapter in a clean, read-only view."}</p>
          </div>
          <div class="card-actions">
            ${browserView && owner ? `<a class="ghost-button" href="#/stories/${story.id}/arcs/${arc.id}/chapters/${chapter.id}">Edit</a>` : ""}
            ${owner && !browserView ? `<button class="primary-button" data-action="save-chapter" data-chapter-id="${chapter.id}">Save</button>` : ""}
          </div>
        </div>
        ${chapterPagerTop}
        ${editorContent}
      </div>
    `,
    browserView ? "browser" : owner ? "creator" : "browser",
    renderChapterQuickTools(soundtrackQueue),
  );

  if (browserView && soundtrackQueue.length) {
    activateSoundtrackQueue(chapter.id, soundtrackQueue);
  } else {
    deactivateSoundtrackQueue();
  }
}

function renderAssetItem(asset) {
  const sourceUrl = asset.url ?? asset.dataUrl ?? "";
  const previewable = Boolean(sourceUrl);
  return `
    <article class="asset-item">
      ${previewable ? `<img src="${sourceUrl}" alt="${escapeHtml(asset.name)}" />` : ""}
      <strong>${escapeHtml(asset.name)}</strong>
      <div class="muted mono">![${escapeHtml(asset.name)}](${sourceUrl})</div>
    </article>
  `;
}

function renderMissing(message) {
  layout(
    `
      <div class="stack">
        <section class="panel">
          <h2>Not found</h2>
          <p class="muted">${escapeHtml(message)}</p>
        </section>
      </div>
    `,
    "home",
  );
}

function breadcrumbs(items) {
  return `<div class="breadcrumbs">${items
    .map(([href, label]) => (href ? `<a href="${href}">${escapeHtml(label)}</a>` : `<span>${escapeHtml(label)}</span>`))
    .join("<span>/</span>")}</div>`;
}

async function render() {
  clearLingeringModals();
  state.loadError = "";
  state.route = parseRoute();

  switch (state.route.name) {
    case "home":
      deactivateSoundtrackQueue();
      return renderHome();
    case "creator":
      deactivateSoundtrackQueue();
      return renderCreator();
    case "browser":
      deactivateSoundtrackQueue();
      return renderBrowser();
    case "settings":
      deactivateSoundtrackQueue();
      return renderSettings();
    case "story":
      deactivateSoundtrackQueue();
      return renderStoryPage(state.route.params.storyId);
    case "arc":
      deactivateSoundtrackQueue();
      return renderArcPage(state.route.params.storyId, state.route.params.arcId);
    case "chapter":
      return renderChapterPage(state.route.params.storyId, state.route.params.arcId, state.route.params.chapterId);
    default:
      deactivateSoundtrackQueue();
      return renderMissing("This page does not exist.");
  }
}

async function safeRender() {
  try {
    await render();
  } catch (error) {
    console.error("Render failed:", error);
    state.loadError = String(error?.message || error || "The page could not be rendered.");
    appRoot.innerHTML = `
      <main class="content">
        <section class="panel stack">
          <h2>Page failed to load</h2>
          <p class="muted">${escapeHtml(state.loadError)}</p>
          <div class="card-actions">
            <a class="ghost-button" href="#/">Main Menu</a>
            <a class="ghost-button" href="#/creator">Creator</a>
          </div>
        </section>
      </main>
    `;
  }
}

function readStoryFormValues() {
  return {
    title: document.querySelector("#story-title-input")?.value.trim() ?? "",
    tags: (document.querySelector("#story-tags-input")?.value ?? "")
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean),
    visibility: document.querySelector("#story-visibility-input")?.value ?? "private",
  };
}

function swap(array, from, to) {
  const next = [...array];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

async function showTransferChapterModal({ chapterId, currentStoryId, currentArcId, currentPhaseId }) {
  const user = getUser();
  if (!user?.id) {
    state.saveStatus = "Sign in first to move chapters between your stories.";
    return render();
  }

  const stories = await state.adapter.listCreatorStories(user.id);
  if (!stories.length) {
    state.saveStatus = "You need at least one story before moving chapters.";
    return render();
  }

  const detailedStories = await Promise.all(stories.map((story) => state.adapter.getStory(story.id)));
  const availableStories = detailedStories.filter(Boolean).filter((story) => (story.arcs ?? []).length > 0);
  if (!availableStories.length) {
    state.saveStatus = "Create an arc first, then you can move chapters into it.";
    return render();
  }

  const modal = document.createElement("div");
  modal.className = "modal-backdrop";
  modal.innerHTML = `
    <div class="modal-card stack transfer-modal">
      <div>
        <h3>Move chapter</h3>
        <p class="muted">Choose one of your stories, then pick the destination arc and phase.</p>
      </div>
      <select id="transfer-story-select"></select>
      <select id="transfer-arc-select"></select>
      <select id="transfer-phase-select"></select>
      <div class="notice" id="transfer-summary"></div>
      <div class="card-actions">
        <button class="primary-button" id="transfer-confirm">Move chapter</button>
        <button class="ghost-button" id="transfer-cancel">Cancel</button>
      </div>
    </div>
  `;
  document.body.append(modal);

  const storySelect = modal.querySelector("#transfer-story-select");
  const arcSelect = modal.querySelector("#transfer-arc-select");
  const phaseSelect = modal.querySelector("#transfer-phase-select");
  const summary = modal.querySelector("#transfer-summary");
  const confirmButton = modal.querySelector("#transfer-confirm");
  const close = () => modal.remove();

  function selectedStory() {
    return availableStories.find((story) => story.id === storySelect.value) ?? availableStories[0];
  }

  function selectedArc() {
    return selectedStory()?.arcs.find((arc) => arc.id === arcSelect.value) ?? selectedStory()?.arcs?.[0] ?? null;
  }

  function selectedPhase() {
    return selectedArc()?.phases.find((phase) => phase.id === phaseSelect.value) ?? selectedArc()?.phases?.[0] ?? null;
  }

  function renderSummary() {
    const story = selectedStory();
    const arc = selectedArc();
    const phase = selectedPhase();
    const sameSpot = story?.id === currentStoryId && arc?.id === currentArcId && phase?.id === currentPhaseId;
    summary.innerHTML = sameSpot
      ? "This chapter is already in that exact phase."
      : `Destination: <strong>${escapeHtml(story?.title ?? "-")}</strong> / <strong>${escapeHtml(arc?.title ?? "-")}</strong> / <strong>${escapeHtml(phase?.title ?? "-")}</strong>`;
    confirmButton.disabled = !story || !arc || !phase || sameSpot;
  }

  function fillPhases() {
    const arc = selectedArc();
    phaseSelect.innerHTML = (arc?.phases ?? [])
      .map((phase) => `<option value="${phase.id}" ${phase.id === currentPhaseId && arc.id === currentArcId ? "selected" : ""}>${escapeHtml(phase.title)}</option>`)
      .join("");
    renderSummary();
  }

  function fillArcs() {
    const story = selectedStory();
    arcSelect.innerHTML = (story?.arcs ?? [])
      .map((arc) => `<option value="${arc.id}" ${arc.id === currentArcId && story.id === currentStoryId ? "selected" : ""}>${escapeHtml(arc.title)}</option>`)
      .join("");
    fillPhases();
  }

  storySelect.innerHTML = availableStories
    .map((story) => `<option value="${story.id}" ${story.id === currentStoryId ? "selected" : ""}>${escapeHtml(story.title)}</option>`)
    .join("");

  storySelect.addEventListener("change", fillArcs);
  arcSelect.addEventListener("change", fillPhases);
  phaseSelect.addEventListener("change", renderSummary);

  modal.querySelector("#transfer-cancel").addEventListener("click", close);
  confirmButton.addEventListener("click", async () => {
    const phase = selectedPhase();
    const arc = selectedArc();
    if (!phase || !arc) {
      return;
    }

    await state.adapter.transferChapter(chapterId, arc.id, phase.id);
    close();
    state.saveStatus = "Chapter moved to a new story location.";
    return render();
  });

  fillArcs();
}

async function showLoginModal() {
  if (state.currentUser) {
    await state.authClient.signOut();
    persistSession(null);
    state.saveStatus = "Signed out.";
    state.authError = "";
    return render();
  }

  if (state.authClient.mode === "firebase") {
    try {
      const user = await state.authClient.signIn();
      persistSession({
        id: user.uid,
        name: user.displayName || user.email || "Creator",
        email: user.email,
        mode: "firebase",
        structureView: "list",
      });
      state.authError = "";
      state.saveStatus = "Signed in with Firebase.";
      return render();
    } catch (error) {
      console.error("Firebase sign-in failed:", error);
      state.saveStatus = "";
      state.authError = formatAuthError(error);
      return render();
    }
  }

  const modal = document.createElement("div");
  modal.className = "modal-backdrop";
  modal.innerHTML = `
    <div class="modal-card stack">
      <div>
        <h3>Log in</h3>
        <p class="muted">Local demo mode uses a simple profile so you can keep building right away.</p>
      </div>
      <input id="login-name" placeholder="Display name" value="Demo Creator" />
      <input id="login-email" placeholder="Email" value="demo@storyforge.local" />
      <div class="card-actions">
        <button class="primary-button" id="modal-login-submit">Continue</button>
        <button class="ghost-button" id="modal-login-cancel">Cancel</button>
      </div>
    </div>
  `;
  document.body.append(modal);

  modal.querySelector("#modal-login-cancel").addEventListener("click", () => modal.remove());
  modal.querySelector("#modal-login-submit").addEventListener("click", () => {
    const name = modal.querySelector("#login-name").value.trim() || "Creator";
    const email = modal.querySelector("#login-email").value.trim() || "local@storyforge.local";
    persistSession({
      id: `local-${name.toLowerCase().replaceAll(/\s+/g, "-")}`,
      name,
      email,
      mode: "local",
      structureView: "list",
    });
    modal.remove();
    state.saveStatus = "Signed in with a local demo profile.";
    state.authError = "";
    render();
  });
}

function formatAuthError(error) {
  const code = error?.code ? String(error.code) : "";
  const message = error?.message ? String(error.message) : "Unknown sign-in error.";

  if (code === "auth/unauthorized-domain") {
    return "This site domain is not authorized in Firebase Auth. Add your local/dev domain and your GitHub Pages domain in Firebase Console > Authentication > Settings > Authorized domains.";
  }

  if (code === "auth/popup-closed-by-user") {
    return "The sign-in popup closed before Firebase completed the login. If it closes instantly every time, double-check Authorized domains and the Google sign-in provider setup.";
  }

  if (code === "auth/operation-not-allowed") {
    return "Google sign-in is not enabled for this Firebase project. Enable it in Firebase Console > Authentication > Sign-in method.";
  }

  if (code === "auth/invalid-api-key") {
    return "Your Firebase API key is invalid. Recheck the values in your `.env` file and restart the dev server.";
  }

  if (code === "auth/network-request-failed") {
    return "Firebase could not complete the sign-in request. Check your connection and any browser privacy extensions blocking popups or auth requests.";
  }

  return code ? `${code}: ${message}` : message;
}

async function handleDrop(files) {
  const chapterId = state.route.params.chapterId;
  const chapter = await state.adapter.getChapter(chapterId);
  if (!chapter) {
    return;
  }

  const nextAssets = [...(chapter.assets ?? [])];

  for (const file of files) {
    const dataUrl = await readFileAsDataUrl(file);
    nextAssets.push({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type,
      size: file.size,
      dataUrl,
    });
  }

  const bodyInput = document.querySelector("#chapter-body-input");
  const appendix = nextAssets
    .slice((chapter.assets ?? []).length)
    .map((asset) => `\n![${asset.name}](${asset.dataUrl})`)
    .join("");

  await state.adapter.updateChapter(chapterId, {
    assets: nextAssets,
    body: `${bodyInput.value}${appendix}`,
  });

  state.dragActive = false;
  state.saveStatus = "Assets added to the chapter. In production these should upload to object storage instead of local state.";
  await render();
}

function normalizeExternalImageUrl(value) {
  const url = value.trim();
  if (!url) {
    throw new Error("Add an image URL first.");
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("That image URL is not valid.");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Use an http or https image URL.");
  }

  const isImgurHost = parsed.hostname === "imgur.com" || parsed.hostname === "www.imgur.com" || parsed.hostname === "i.imgur.com";
  const fileName = parsed.pathname.split("/").filter(Boolean).pop() ?? "";
  const hasExtension = /\.[a-z0-9]{2,5}$/i.test(fileName);
  if (isImgurHost && fileName && !hasExtension) {
    parsed.pathname = `${parsed.pathname}.png`;
  }

  return parsed.toString();
}

async function addExternalAsset(chapterId) {
  const chapter = await state.adapter.getChapter(chapterId);
  if (!chapter) {
    throw new Error("Chapter not found.");
  }

  const nameInput = document.querySelector("#asset-name-input");
  const urlInput = document.querySelector("#asset-url-input");
  const titleInput = document.querySelector("#chapter-title-input");
  const bodyInput = document.querySelector("#chapter-body-input");

  const name = nameInput?.value.trim() || "image";
  const url = normalizeExternalImageUrl(urlInput?.value ?? "");
  const nextAsset = {
    id: crypto.randomUUID(),
    name,
    type: "image/external",
    url,
  };

  const nextAssets = [...(chapter.assets ?? []), nextAsset];

  await state.adapter.updateChapter(chapterId, {
    title: titleInput?.value.trim() || chapter.title || "Untitled Chapter",
    body: bodyInput?.value ?? chapter.body ?? "",
    assets: nextAssets,
  });

  if (nameInput) {
    nameInput.value = "";
  }
  if (urlInput) {
    urlInput.value = "";
  }

  state.saveStatus = "External image link added to the chapter assets.";
  await render();
}

async function syncUserProfile() {
  const user = getUser();
  if (!user?.id) {
    return;
  }

  const profile = await state.adapter.getUserProfile?.(user.id);
  if (profile) {
    persistSession({
      ...user,
      name: profile.name ?? user.name,
      email: profile.email ?? user.email,
      penName: profile.penName ?? "",
      structureView: profile.structureView ?? user.structureView ?? "list",
    });
  }
}

function confirmDelete(label) {
  return window.confirm(`Are you sure you want to delete this ${label}? This cannot be undone.`);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

document.addEventListener("click", async (event) => {
  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) {
    return;
  }

  const action = actionTarget.dataset.action;

  if (action === "toggle-login") {
    return showLoginModal();
  }

  if (action === "open-settings") {
    return navigate("/settings");
  }

  if (action === "set-structure-view") {
    const user = getUser();
    const structureView = actionTarget.dataset.view === "list" ? "list" : "grid";

    if (!user?.id) {
      persistSession({
        ...user,
        structureView,
      });
      return render();
    }

    const profile = await state.adapter.updateUserProfile(user.id, {
      name: user.name,
      email: user.email,
      penName: user.penName ?? "",
      structureView,
    });
    persistSession({
      ...user,
      structureView: profile.structureView ?? structureView,
      penName: profile.penName ?? user.penName ?? "",
      name: profile.name ?? user.name,
      email: profile.email ?? user.email,
    });
    return render();
  }

  if (action === "apply-story-filters") {
    const q = document.querySelector("#story-search").value.trim();
    const tag = document.querySelector("#story-tag-filter").value;
    return navigate(`/creator${q || tag ? `?${new URLSearchParams({ q, tag }).toString()}` : ""}`);
  }

  if (action === "apply-browser-filters") {
    const creator = document.querySelector("#browser-creator-filter").value;
    const group = document.querySelector("#browser-group-mode").value;
    return navigate(`/browser?${new URLSearchParams({ creator, group }).toString()}`);
  }

  if (action === "create-story") {
    const user = getUser();
    if (!user) {
      state.saveStatus = "Sign in first to create stories in Firebase mode.";
      return showLoginModal();
    }
    const story = await state.adapter.createStory({
      creatorId: user.id,
      creatorName: getDisplayName(user),
      title: "Untitled Story",
      tags: ["draft"],
      visibility: "private",
    });
    return navigate(`/stories/${story.id}`);
  }

  if (action === "save-story-settings") {
    const storyId = actionTarget.dataset.storyId;
    const values = readStoryFormValues();
    await state.adapter.updateStory(storyId, values);
    state.saveStatus = "Story details saved.";
    return render();
  }

  if (action === "open-story-transfer") {
    const query = getRouteQuery();
    query.set("transfer", "1");
    return navigate(`/stories/${actionTarget.dataset.storyId}?${query.toString()}`);
  }

  if (action === "close-story-transfer") {
    const query = getRouteQuery();
    query.delete("transfer");
    const nextQuery = query.toString();
    return navigate(`/stories/${actionTarget.dataset.storyId}${nextQuery ? `?${nextQuery}` : ""}`);
  }

  if (action === "submit-story-transfer") {
    const user = getUser();
    if (!user?.email) {
      state.saveStatus = "Sign in with an email address before transferring ownership.";
      return render();
    }

    const email = document.querySelector("#story-transfer-email-input")?.value.trim() ?? "";
    const confirmation = document.querySelector("#story-transfer-confirm-input")?.value.trim() ?? "";
    if (!email) {
      state.saveStatus = "Enter the recipient Gmail address first.";
      return render();
    }
    if (email.toLowerCase() === String(user.email).trim().toLowerCase()) {
      state.saveStatus = "You cannot transfer a story to your own email.";
      return render();
    }
    if (confirmation !== "TRANSFER") {
      state.saveStatus = "Type TRANSFER exactly to confirm ownership transfer.";
      return render();
    }

    await state.adapter.requestStoryTransfer(actionTarget.dataset.storyId, email, {
      id: user.id,
      name: getDisplayName(user),
      email: user.email,
    });
    state.saveStatus = "Ownership transfer request sent. The story stays with you until the recipient accepts.";
    const query = getRouteQuery();
    query.delete("transfer");
    const nextQuery = query.toString();
    return navigate(`/stories/${actionTarget.dataset.storyId}${nextQuery ? `?${nextQuery}` : ""}`);
  }

  if (action === "cancel-story-transfer") {
    await state.adapter.cancelStoryTransfer(actionTarget.dataset.storyId);
    state.saveStatus = "Ownership transfer cancelled.";
    return render();
  }

  if (action === "accept-story-transfer") {
    const user = getUser();
    try {
      await state.adapter.acceptStoryTransfer(actionTarget.dataset.storyId, {
        id: user.id,
        name: user.name,
        email: user.email,
        penName: user.penName ?? "",
      });
      state.saveStatus = "Story ownership transferred to you.";
      return navigate("/creator");
    } catch (error) {
      state.saveStatus = `Transfer accept failed: ${String(error?.message || error)}`;
      return render();
    }
  }

  if (action === "decline-story-transfer") {
    const user = getUser();
    try {
      await state.adapter.declineStoryTransfer(actionTarget.dataset.storyId, user.email);
      state.saveStatus = "Ownership transfer declined.";
      return render();
    } catch (error) {
      state.saveStatus = `Transfer decline failed: ${String(error?.message || error)}`;
      return render();
    }
  }

  if (action === "create-arc") {
    const storyId = actionTarget.dataset.storyId;
    const arc = await state.adapter.createArc(storyId, `Arc ${Math.floor(Math.random() * 90 + 10)}`);
    return navigate(`/stories/${storyId}/arcs/${arc.id}`);
  }

  if (action === "save-arc-title") {
    await state.adapter.updateArc(actionTarget.dataset.arcId, {
      title: document.querySelector("#arc-title-input").value.trim() || "Untitled Arc",
    });
    state.saveStatus = "Arc title saved.";
    return render();
  }

  if (action === "add-soundtrack") {
    const chapter = await state.adapter.getChapter(actionTarget.dataset.chapterId);
    const label = document.querySelector("#soundtrack-label-input")?.value.trim() ?? "";
    const url = document.querySelector("#soundtrack-url-input")?.value.trim() ?? "";
    const parsed = parseSoundtrackEntry({ id: makeClientId("soundtrack"), label, url });
    if (!parsed) {
      state.saveStatus = "Please enter a valid YouTube link.";
      return render();
    }
    await state.adapter.updateChapter(chapter.id, {
      soundtracks: [...(chapter.soundtracks ?? []), { id: parsed.id, label: parsed.label, url: parsed.url }],
    });
    state.saveStatus = "Soundtrack added.";
    return render();
  }

  if (action === "delete-soundtrack") {
    const chapter = await state.adapter.getChapter(actionTarget.dataset.chapterId);
    await state.adapter.updateChapter(chapter.id, {
      soundtracks: (chapter.soundtracks ?? []).filter((track) => track.id !== actionTarget.dataset.soundtrackId),
    });
    state.saveStatus = "Soundtrack removed.";
    return render();
  }

  if (action === "move-arc-up" || action === "move-arc-down") {
    const story = await state.adapter.getStory(actionTarget.dataset.storyId);
    const index = Number(actionTarget.dataset.index);
    const delta = action === "move-arc-up" ? -1 : 1;
    await state.adapter.reorderArcs(story.id, swap(story.arcIds, index, index + delta));
    return render();
  }

  if (action === "create-chapter") {
    const chapter = await state.adapter.createChapter(actionTarget.dataset.arcId, "Untitled Chapter");
    return navigate(`/stories/${actionTarget.dataset.storyId}/arcs/${actionTarget.dataset.arcId}/chapters/${chapter.id}`);
  }

  if (action === "create-phase") {
    const title = window.prompt("Phase title", "New Phase");
    if (title === null) {
      return;
    }
    await state.adapter.createPhase(actionTarget.dataset.arcId, title);
    state.saveStatus = "Phase created.";
    return render();
  }

  if (action === "rename-phase") {
    const title = window.prompt("Rename phase", actionTarget.dataset.phaseTitle || "Phase");
    if (title === null) {
      return;
    }
    await state.adapter.renamePhase(actionTarget.dataset.arcId, actionTarget.dataset.phaseId, title);
    state.saveStatus = "Phase renamed.";
    return render();
  }

  if (action === "open-transfer-chapter") {
    return showTransferChapterModal({
      chapterId: actionTarget.dataset.chapterId,
      currentStoryId: actionTarget.dataset.storyId,
      currentArcId: actionTarget.dataset.arcId,
      currentPhaseId: actionTarget.dataset.phaseId,
    });
  }

  if (action === "move-chapter-up" || action === "move-chapter-down") {
    const arc = await state.adapter.getArc(actionTarget.dataset.arcId);
    const phase = (arc.phases ?? []).find((entry) => entry.id === actionTarget.dataset.phaseId);
    if (!phase) {
      return;
    }
    const index = Number(actionTarget.dataset.index);
    const delta = action === "move-chapter-up" ? -1 : 1;
    await state.adapter.reorderPhaseChapters(arc.id, phase.id, swap(phase.chapterIds, index, index + delta));
    return render();
  }

  if (action === "save-chapter") {
    const chapterId = actionTarget.dataset.chapterId;
    await state.adapter.updateChapter(chapterId, {
      title: document.querySelector("#chapter-title-input").value.trim() || "Untitled Chapter",
      body: document.querySelector("#chapter-body-input").value,
    });
    state.saveStatus = "Chapter saved.";
    return render();
  }

  if (action === "save-pen-name") {
    const user = getUser();
    const penName = document.querySelector("#pen-name-input").value.trim();
    const profile = await state.adapter.updateUserProfile(user.id, {
      name: user.name,
      email: user.email,
      penName,
    });
    persistSession({
      ...user,
      penName: profile.penName ?? "",
      name: profile.name ?? user.name,
      email: profile.email ?? user.email,
    });
    state.saveStatus = penName ? "Pen name saved." : "Pen name cleared. Account name will be used.";
    return render();
  }

  if (action === "delete-story") {
    if (!confirmDelete("story")) {
      return;
    }
    await state.adapter.deleteStory(actionTarget.dataset.storyId);
    state.saveStatus = "Story deleted.";
    return navigate("/creator");
  }

  if (action === "delete-arc") {
    if (!confirmDelete("arc")) {
      return;
    }
    await state.adapter.deleteArc(actionTarget.dataset.arcId);
    state.saveStatus = "Arc deleted.";
    return navigate(`/stories/${actionTarget.dataset.storyId}`);
  }

  if (action === "delete-chapter") {
    if (!confirmDelete("chapter")) {
      return;
    }
    await state.adapter.deleteChapter(actionTarget.dataset.chapterId);
    state.saveStatus = "Chapter deleted.";
    return navigate(`/stories/${actionTarget.dataset.storyId}/arcs/${actionTarget.dataset.arcId}`);
  }

  if (action === "add-external-asset") {
    try {
      return await addExternalAsset(actionTarget.dataset.chapterId);
    } catch (error) {
      state.saveStatus = String(error.message || error);
      return render();
    }
  }

  if (action === "toggle-soundtrack") {
    if (!getActiveSoundtrack()) {
      return;
    }

    if (state.soundtrack.paused) {
      playCurrentSoundtrack();
    } else {
      pauseCurrentSoundtrack();
    }
    return;
  }

  if (action === "toggle-volume-popout") {
    if (!getActiveSoundtrack()) {
      return;
    }

    state.soundtrack.volumeOpen = !state.soundtrack.volumeOpen;
    updateQuickToolButton();
    return;
  }
});

document.addEventListener("change", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLSelectElement)) {
    return;
  }

  if (target.dataset.action === "move-chapter-phase") {
    await state.adapter.moveChapterToPhase(target.dataset.arcId, target.dataset.chapterId, target.value);
    state.saveStatus = "Chapter moved to another phase.";
    return render();
  }
});

document.addEventListener("input", (event) => {
  if (event.target instanceof HTMLInputElement && event.target.dataset.action === "set-volume") {
    setSoundtrackVolume(event.target.value);
    return;
  }

  if (event.target.id === "chapter-body-input") {
    const preview = document.querySelector(".markdown-preview");
    if (preview) {
      preview.innerHTML = renderMarkdown(event.target.value || "*Start writing to preview your chapter here.*");
    }
  }

  if (event.target.id === "chapter-title-input") {
    const title = event.target.value.trim() || "Untitled chapter";
    const header = document.querySelector(".page-title h2");
    if (header) {
      header.textContent = title;
    }
  }
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  if (!target.closest(".quick-tool-stack")) {
    if (state.soundtrack.volumeOpen) {
      state.soundtrack.volumeOpen = false;
      updateQuickToolButton();
    }
  }
});

document.addEventListener("wheel", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  if (!target.closest("[data-wheel-volume='true']")) {
    return;
  }

  if (!getActiveSoundtrack()) {
    return;
  }

  event.preventDefault();
  adjustSoundtrackVolume(event.deltaY < 0 ? 5 : -5);
}, { passive: false });

document.addEventListener("dragover", (event) => {
  if (state.route.name !== "chapter") {
    return;
  }

  event.preventDefault();
  state.dragActive = true;
  const zone = document.querySelector("[data-dropzone='assets']");
  if (zone) {
    zone.classList.add("is-active");
  }
});

document.addEventListener("dragleave", (event) => {
  if (state.route.name !== "chapter" || event.relatedTarget) {
    return;
  }

  state.dragActive = false;
  const zone = document.querySelector("[data-dropzone='assets']");
  if (zone) {
    zone.classList.remove("is-active");
  }
});

document.addEventListener("drop", async (event) => {
  if (state.route.name !== "chapter") {
    return;
  }

  event.preventDefault();
  const zone = document.querySelector("[data-dropzone='assets']");
  if (zone) {
    zone.classList.remove("is-active");
  }

  const files = [...event.dataTransfer.files].filter((file) => file.type.startsWith("image/"));
  if (files.length) {
    await handleDrop(files);
  }
});

window.addEventListener("hashchange", () => {
  state.saveStatus = "";
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  safeRender();
});

async function bootstrap() {
  const authClient = initializeFirebase();
  state.authClient = authClient;
  state.adapter = await createDataAdapter(authClient);

  if (state.authClient.mode === "firebase") {
    state.authClient.watchAuth((user) => {
      if (!user) {
        persistSession(null);
        safeRender();
      } else {
        persistSession({
          id: user.uid,
          name: user.displayName || user.email || "Creator",
          email: user.email,
          mode: "firebase",
        });
        syncUserProfile().finally(() => safeRender());
      }
    });
  } else if (state.currentUser?.id) {
    await syncUserProfile();
  }

  if (!window.location.hash) {
    navigate("/");
  } else {
    safeRender();
  }
}

bootstrap().catch((error) => {
  appRoot.innerHTML = `
    <main class="content">
      <section class="panel">
        <h2>App failed to start</h2>
        <p class="muted">${escapeHtml(String(error.message || error))}</p>
        <p class="muted">Current mode: ${escapeHtml(getRuntimeConfig().mode)}</p>
      </section>
    </main>
  `;
});
