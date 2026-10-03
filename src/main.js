import { createDataAdapter } from "./data.js";
import { getRuntimeConfig, initializeFirebase } from "./firebase.js";

const appRoot = document.querySelector("#app");

const AUDIO_CHANNEL_CONFIG = {
  soundtrack: { label: "Soundtrack", shortLabel: "Music", loop: true, autoCue: true },
  ambience: { label: "Ambience", shortLabel: "Ambience", loop: true, autoCue: true },
  "sound-effect": { label: "Sound Effect", shortLabel: "Effect", loop: false, autoCue: false },
};

function createAudioChannelState(type) {
  return {
    type,
    currentIndex: 0,
    paused: true,
    volume: type === "sound-effect" ? 85 : 70,
    mode: "idle",
    ready: false,
    activeKey: "",
    youtubePlayer: null,
    youtubePlayerHost: "",
    standbyPlayer: null,
    standbyPlayerHost: "",
    standbyTrackId: "",
    standbyStartSeconds: 0,
    standbyReady: false,
    standbyWarming: false,
    standbyToken: 0,
    standbyPauseTimer: null,
    currentCueIndex: -1,
    syncToken: 0,
    manualPause: false,
    recoveryTimer: null,
    recoveryAttempts: 0,
    cueMode: false,
  };
}

const state = {
  adapter: null,
  authClient: null,
  currentUser: JSON.parse(localStorage.getItem("storyforge-session") ?? "null"),
  route: { name: "home", params: {} },
  dragActive: false,
  saveStatus: "",
  authError: "",
  authErrorCode: "",
  loadError: "",
  editorCharacters: [],
  soundtrack: {
    chapterId: "",
    queues: { soundtrack: [], ambience: [], "sound-effect": [] },
    cueTimelines: { soundtrack: [], ambience: [] },
    channels: {
      soundtrack: createAudioChannelState("soundtrack"),
      ambience: createAudioChannelState("ambience"),
      "sound-effect": createAudioChannelState("sound-effect"),
    },
    masterVolume: 100,
    volumeOpen: "",
    cueObserver: null,
    editorMode: false,
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
  const channels = Object.fromEntries(Object.entries(state.soundtrack.channels).map(([type, channel]) => [type, {
    currentIndex: channel.currentIndex,
    paused: channel.paused,
    volume: channel.volume,
  }]));
  localStorage.setItem(SOUNDTRACK_STORAGE_KEY, JSON.stringify({
    chapterId: state.soundtrack.chapterId,
    masterVolume: state.soundtrack.masterVolume,
    channels,
  }));
}

function getDisplayName(user = getUser()) {
  if (!user) {
    return "Guest";
  }

  return user.penName?.trim() || user.name || "Creator";
}

function getPublicChapterUrl(storyId, arcId, chapterId) {
  const configuredBase = getRuntimeConfig().publicAppUrl?.trim();
  const runtimeBase = `${window.location.origin}${window.location.pathname}`;
  const base = (configuredBase || runtimeBase).replace(/#.*$/, "").replace(/\/?$/, "/");
  return `${base}#/stories/${encodeURIComponent(storyId)}/arcs/${encodeURIComponent(arcId)}/chapters/${encodeURIComponent(chapterId)}?view=browser`;
}

async function sendChapterAnnouncement({ storyId, arcId, chapterId }) {
  const apiUrl = getRuntimeConfig().announcementApiUrl?.trim();
  if (!apiUrl) {
    return { skipped: true, reason: "Announcement API is not configured." };
  }

  const authUser = state.authClient?.auth?.currentUser;
  if (!authUser?.getIdToken) {
    throw new Error("A Firebase sign-in is required for Discord announcements.");
  }

  const token = await authUser.getIdToken();
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      storyId,
      arcId,
      chapterId,
      chapterUrl: getPublicChapterUrl(storyId, arcId, chapterId),
    }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || `Announcement request failed (${response.status}).`);
  }

  return result;
}

function getBackendApiUrl(endpointName) {
  const announcementApiUrl = getRuntimeConfig().announcementApiUrl?.trim();
  if (!announcementApiUrl) {
    return "";
  }

  const url = new URL(announcementApiUrl, window.location.href);
  url.pathname = `/api/${endpointName}`;
  url.search = "";
  url.hash = "";
  return url.toString();
}

async function sendChapterEngagement(action, payload) {
  const apiUrl = getBackendApiUrl("chapter-engagement");
  if (!apiUrl) {
    throw new Error("Chapter engagement API is not configured.");
  }

  const authUser = state.authClient?.auth?.currentUser;
  if (!authUser?.getIdToken) {
    throw new Error("A Firebase sign-in is required for comments and reactions.");
  }

  const token = await authUser.getIdToken();
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action,
      storyId: state.route.params.storyId,
      arcId: state.route.params.arcId,
      ...payload,
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || `Chapter engagement request failed (${response.status}).`);
  }
  return result;
}

function getReaderSettings(user = getUser()) {
  const settings = user?.readerSettings ?? {};
  return {
    fontSize: Math.max(14, Math.min(24, Number(settings.fontSize) || 17)),
    lineHeight: Math.max(1.4, Math.min(2.4, Number(settings.lineHeight) || 1.85)),
    width: Math.max(620, Math.min(1200, Number(settings.width) || 920)),
  };
}

function isChapterPublished(chapter) {
  return chapter?.published !== false;
}

function canReadChapter(chapter, editable) {
  return editable || isChapterPublished(chapter);
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

function normalizeEmail(value) {
  return String(value ?? "").trim().toLowerCase();
}

async function resolveCurrentUserEmail() {
  const user = getUser();
  const sessionEmail = normalizeEmail(user?.email);
  if (sessionEmail) {
    return sessionEmail;
  }

  if (!user?.id || !state.adapter?.getUserProfile) {
    return "";
  }

  const profile = await state.adapter.getUserProfile(user.id);
  const profileEmail = normalizeEmail(profile?.email);
  if (profileEmail) {
    persistSession({
      ...user,
      email: profile.email,
      name: profile.name || user.name,
      penName: profile.penName ?? user.penName ?? "",
      structureView: profile.structureView ?? user.structureView ?? "list",
      readerSettings: profile.readerSettings ?? user.readerSettings ?? getReaderSettings(user),
    });
  }

  return profileEmail;
}

function isStoryEditor(story) {
  const email = normalizeEmail(getUser()?.email);
  return Boolean(email && (story?.editorEmails ?? []).includes(email));
}

function canEditStory(story) {
  return isOwner(story) || isStoryEditor(story);
}

function canReadStory(story) {
  return story?.visibility !== "private" || canEditStory(story);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const SAFE_HTML_TAGS = new Set([
  "a",
  "blockquote",
  "br",
  "code",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "img",
  "li",
  "ol",
  "p",
  "pre",
  "s",
  "span",
  "strong",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
]);

const VOID_HTML_TAGS = new Set(["br", "hr", "img"]);
const SAFE_STYLE_PROPERTIES = new Set([
  "background-color",
  "color",
  "font-family",
  "font-size",
  "font-style",
  "font-weight",
  "line-height",
  "text-align",
  "text-decoration",
]);

function isSafeUrl(value, { image = false } = {}) {
  const raw = String(value ?? "").trim();
  if (!raw) {
    return false;
  }

  if (raw.startsWith("#") || raw.startsWith("/")) {
    return true;
  }

  if (image && /^data:image\/(png|jpe?g|gif|webp);base64,/i.test(raw)) {
    return true;
  }

  try {
    const parsed = new URL(raw, window.location.origin);
    return ["http:", "https:", "mailto:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function sanitizeStyle(value) {
  return String(value ?? "")
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [property, ...rest] = entry.split(":");
      const name = property?.trim().toLowerCase();
      const styleValue = rest.join(":").trim();

      if (!SAFE_STYLE_PROPERTIES.has(name) || !styleValue) {
        return "";
      }

      if (/url\s*\(|expression\s*\(|javascript:/i.test(styleValue)) {
        return "";
      }

      return `${name}: ${styleValue.replace(/[<>"']/g, "")}`;
    })
    .filter(Boolean)
    .join("; ");
}

function sanitizeHtmlAttributes(tagName, rawAttributes = "") {
  const attrs = [];
  const attrPattern = /([a-zA-Z:-]+)(?:\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>`]+)))?/g;
  let match;

  while ((match = attrPattern.exec(rawAttributes)) !== null) {
    const name = match[1].toLowerCase();
    const value = match[3] ?? match[4] ?? match[5] ?? "";

    if (name.startsWith("on")) {
      continue;
    }

    if (name === "style") {
      const style = sanitizeStyle(value);
      if (style) {
        attrs.push(`style="${escapeHtml(style)}"`);
      }
      continue;
    }

    if (["title", "alt"].includes(name)) {
      attrs.push(`${name}="${escapeHtml(value)}"`);
      continue;
    }

    if (tagName === "a" && name === "href" && isSafeUrl(value)) {
      attrs.push(`href="${escapeHtml(value)}"`);
      continue;
    }

    if (tagName === "img" && name === "src" && isSafeUrl(value, { image: true })) {
      attrs.push(`src="${escapeHtml(value)}"`);
      continue;
    }
  }

  if (tagName === "a" && attrs.some((attr) => attr.startsWith("href="))) {
    attrs.push('target="_blank"', 'rel="noreferrer"');
  }

  return attrs.length ? ` ${attrs.join(" ")}` : "";
}

function protectSafeHtml(markdown) {
  const tokens = [];
  const source = String(markdown ?? "");
  const protectedSource = source.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, (raw, tag, attrs) => {
    const tagName = tag.toLowerCase();
    if (!SAFE_HTML_TAGS.has(tagName)) {
      return raw;
    }

    const isClosing = /^<\s*\//.test(raw);
    if (isClosing) {
      if (VOID_HTML_TAGS.has(tagName)) {
        return "";
      }
      const token = `ULUNAVIR_SAFE_HTML_${tokens.length}`;
      tokens.push(`</${tagName}>`);
      return token;
    }

    const token = `ULUNAVIR_SAFE_HTML_${tokens.length}`;
    const sanitizedAttrs = sanitizeHtmlAttributes(tagName, attrs);
    const close = VOID_HTML_TAGS.has(tagName) ? " />" : ">";
    tokens.push(`<${tagName}${sanitizedAttrs}${close}`);
    return token;
  });

  return { protectedSource, tokens };
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

function parseYouTubeStartSeconds(url) {
  try {
    const parsed = new URL(url);
    const rawTime =
      parsed.searchParams.get("t")
      ?? parsed.searchParams.get("start")
      ?? parsed.searchParams.get("time_continue");

    if (!rawTime) {
      return 0;
    }

    if (/^\d+$/.test(rawTime)) {
      return Math.max(0, Number(rawTime));
    }

    const match = rawTime.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/i);
    if (!match) {
      return 0;
    }

    const hours = Number(match[1] ?? 0);
    const minutes = Number(match[2] ?? 0);
    const seconds = Number(match[3] ?? 0);
    return (hours * 3600) + (minutes * 60) + seconds;
  } catch {
    return 0;
  }
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
      startSeconds: parseYouTubeStartSeconds(url),
      trackType: normalizeAudioTrackType(entry.trackType),
      volumeMultiplier: clampVolumeMultiplier(entry.volumeMultiplier),
    };
  }

  return null;
}

function parseVideoEntry(entry) {
  const rawUrl = entry?.url?.trim();
  const url = rawUrl && !/^https?:\/\//i.test(rawUrl) ? `https://${rawUrl}` : rawUrl;
  if (!url) {
    return null;
  }

  const youtubeId = extractYouTubeVideoId(url);
  if (!youtubeId) {
    return null;
  }

  return {
    id: entry.id ?? makeClientId("video"),
    label: normalizeTrackLabel(entry.label, "YouTube video"),
    url,
    source: "youtube",
    videoId: youtubeId,
    startSeconds: parseYouTubeStartSeconds(url),
  };
}

function buildSoundtrackQueue(soundtracks = []) {
  return soundtracks.map(parseSoundtrackEntry).filter(Boolean);
}

function buildSoundtrackLabelMap(soundtracks = []) {
  return new Map(buildSoundtrackQueue(soundtracks).map((track) => [track.id, {
    label: track.label,
    trackType: track.trackType,
  }]));
}

function buildVideoMap(videos = []) {
  return new Map(videos.map(parseVideoEntry).filter(Boolean).map((video) => [video.id, video]));
}

function hasMarkdownMusicMarkers(chapter) {
  return getChapterRenderMode(chapter) === "markdown" && /\[music:\s*[^\]]+\]/i.test(chapter?.body ?? "");
}

function buildAudioCueTimelines(body, queue) {
  const trackById = new Map(queue.map((track) => [track.id, track]));
  const timelines = { soundtrack: [], ambience: [] };
  const markerPattern = /\[(music|music-end):\s*([^\]]+)\]/gi;

  for (const match of String(body ?? "").matchAll(markerPattern)) {
    const markerType = match[1].toLowerCase();
    const value = match[2].trim();
    const offset = match.index ?? -1;
    if (markerType === "music-end") {
      const trackType = value.toLowerCase();
      if (trackType === "soundtrack" || trackType === "ambience") {
        timelines[trackType].push({ kind: "end", trackType, offset });
      }
      continue;
    }

    const track = trackById.get(value);
    if (track && AUDIO_CHANNEL_CONFIG[track.trackType]?.autoCue) {
      timelines[track.trackType].push({ kind: "track", trackType: track.trackType, trackId: track.id, offset });
    }
  }

  return timelines;
}

function getNextCueTrack(type, afterIndex = -1) {
  const nextEvent = (state.soundtrack.cueTimelines[type] ?? [])[afterIndex + 1];
  if (!nextEvent || nextEvent.kind === "end") {
    return null;
  }
  return getAudioQueue(type).find((track) => track.id === nextEvent.trackId)
    ? { ...nextEvent, track: getAudioQueue(type).find((track) => track.id === nextEvent.trackId) }
    : null;
}

function normalizeAudioTrackType(value) {
  return Object.hasOwn(AUDIO_CHANNEL_CONFIG, value) ? value : "soundtrack";
}

function clampVolume(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
}

function clampVolumeMultiplier(value) {
  const number = Number(value);
  return Math.max(0, Math.min(200, Number.isFinite(number) ? Math.round(number) : 100));
}

function normalizeAudioSettings(settings = {}) {
  return {
    masterVolume: settings.masterVolume === undefined ? 100 : clampVolume(settings.masterVolume),
    soundtrackVolume: settings.soundtrackVolume === undefined ? 70 : clampVolume(settings.soundtrackVolume),
    ambienceVolume: settings.ambienceVolume === undefined ? 70 : clampVolume(settings.ambienceVolume),
    soundEffectVolume: settings.soundEffectVolume === undefined ? 85 : clampVolume(settings.soundEffectVolume),
  };
}

function getCurrentAudioSettings(chapter = {}) {
  if (state.soundtrack.chapterId !== chapter.id) {
    return normalizeAudioSettings(chapter.audioSettings);
  }

  return {
    masterVolume: clampVolume(state.soundtrack.masterVolume),
    soundtrackVolume: clampVolume(state.soundtrack.channels.soundtrack.volume),
    ambienceVolume: clampVolume(state.soundtrack.channels.ambience.volume),
    soundEffectVolume: clampVolume(state.soundtrack.channels["sound-effect"].volume),
  };
}

function clearSoundtrackCueObserver() {
  if (state.soundtrack.cueObserver) {
    state.soundtrack.cueObserver.disconnect();
    state.soundtrack.cueObserver = null;
  }
}

function getSoundtrackLayer() {
  let layer = document.querySelector("#soundtrack-layer");
  if (layer) {
    return layer;
  }

  layer = document.createElement("div");
  layer.id = "soundtrack-layer";
  layer.innerHTML = Object.keys(AUDIO_CHANNEL_CONFIG)
    .flatMap((type) => [
      `<div id="youtube-audio-${type}-host"></div>`,
      ...(AUDIO_CHANNEL_CONFIG[type].loop ? [`<div id="youtube-audio-${type}-standby-host"></div>`] : []),
    ])
    .join("");
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

function getAudioChannel(type) {
  return state.soundtrack.channels[normalizeAudioTrackType(type)];
}

function getAudioQueue(type) {
  return state.soundtrack.queues[normalizeAudioTrackType(type)] ?? [];
}

function getActiveSoundtrack(type = "soundtrack") {
  const channel = getAudioChannel(type);
  const queue = getAudioQueue(type);
  if (!queue.length) {
    return null;
  }

  const index = Math.max(0, Math.min(channel.currentIndex, queue.length - 1));
  return queue[index] ?? null;
}

function updateQuickToolButton() {
  Object.keys(AUDIO_CHANNEL_CONFIG).forEach((type) => {
    const channel = getAudioChannel(type);
    const active = getActiveSoundtrack(type);
    const playButton = document.querySelector(`[data-action='toggle-audio-channel'][data-audio-channel='${type}']`);
    if (playButton) {
      playButton.disabled = !active;
      playButton.classList.toggle("is-active", Boolean(active) && !channel.paused);
      playButton.setAttribute("aria-pressed", String(Boolean(active) && !channel.paused));
      playButton.setAttribute("title", active ? `${channel.paused ? "Resume" : "Pause"} ${AUDIO_CHANNEL_CONFIG[type].label}` : `No ${AUDIO_CHANNEL_CONFIG[type].label.toLowerCase()} available`);
    }

    const volumeButton = document.querySelector(`[data-action='toggle-audio-volume'][data-audio-volume='${type}']`);
    if (volumeButton) {
      volumeButton.disabled = !getAudioQueue(type).length;
      volumeButton.classList.toggle("is-open", state.soundtrack.volumeOpen === type);
      volumeButton.style.setProperty("--volume-fill", `${channel.volume}%`);
      volumeButton.setAttribute("title", `${AUDIO_CHANNEL_CONFIG[type].label} volume ${channel.volume}%`);
    }

    const slider = document.querySelector(`[data-action='set-audio-volume'][data-audio-volume='${type}']`);
    if (slider) slider.value = String(channel.volume);
    const value = document.querySelector(`[data-audio-volume-value='${type}']`);
    if (value) value.textContent = `${channel.volume}%`;
  });

  const masterButton = document.querySelector(`[data-action='toggle-audio-volume'][data-audio-volume='master']`);
  if (masterButton) {
    masterButton.classList.toggle("is-open", state.soundtrack.volumeOpen === "master");
    masterButton.style.setProperty("--volume-fill", `${state.soundtrack.masterVolume}%`);
    masterButton.setAttribute("title", `Master volume ${state.soundtrack.masterVolume}%`);
  }
  const masterSlider = document.querySelector(`[data-action='set-audio-volume'][data-audio-volume='master']`);
  if (masterSlider) masterSlider.value = String(state.soundtrack.masterVolume);
  const masterValue = document.querySelector(`[data-audio-volume-value='master']`);
  if (masterValue) masterValue.textContent = `${state.soundtrack.masterVolume}%`;

  document.querySelectorAll("[data-volume-popout]").forEach((popout) => {
    popout.hidden = popout.dataset.volumePopout !== state.soundtrack.volumeOpen;
  });

  document.querySelectorAll("[data-action='preview-soundtrack']").forEach((button) => {
    const track = Object.values(state.soundtrack.queues).flat().find((entry) => entry.id === button.dataset.soundtrackId);
    const channel = track ? getAudioChannel(track.trackType) : null;
    const playing = Boolean(track && channel && channel.activeKey === track.id && !channel.paused);
    button.classList.toggle("is-active", playing);
    button.textContent = playing ? "Stop preview" : "Preview";
    button.setAttribute("aria-pressed", String(playing));
  });
}

function persistSoundtrackUi() {
  saveStoredSoundtrackState();
  updateQuickToolButton();
}

function clearSoundtrackUi() {
  Object.keys(AUDIO_CHANNEL_CONFIG).forEach((type) => setSoundtrackStatus(type, `No ${AUDIO_CHANNEL_CONFIG[type].label.toLowerCase()} loaded.`));
  updateQuickToolButton();
}

function setSoundtrackStatus(type, message) {
  const host = document.querySelector(`[data-audio-status='${type}']`);
  if (host) {
    host.textContent = message;
  }
}

function clearSoundtrackRecovery(type) {
  const channel = getAudioChannel(type);
  if (channel.recoveryTimer) {
    clearTimeout(channel.recoveryTimer);
    channel.recoveryTimer = null;
  }
}

function requestSoundtrackRecovery(type, reason = "Playback interrupted", delay = 2200) {
  const channel = getAudioChannel(type);
  const active = getActiveSoundtrack(type);
  if (!active || channel.paused || channel.manualPause) {
    return;
  }

  clearSoundtrackRecovery(type);
  const expectedTrackId = active.id;
  const expectedToken = channel.syncToken;
  setSoundtrackStatus(type, `${reason}. Trying to resume...`);

  channel.recoveryTimer = setTimeout(() => {
    const current = getActiveSoundtrack(type);
    if (
      !current
      || current.id !== expectedTrackId
      || expectedToken !== channel.syncToken
      || channel.paused
      || channel.manualPause
      || !channel.youtubePlayer
    ) {
      return;
    }

    channel.recoveryAttempts += 1;
    try {
      if (channel.recoveryAttempts % 4 === 0 && current.videoId) {
        loadYouTubeTrack(type, current);
      } else {
        channel.youtubePlayer.playVideo();
      }
      setSoundtrackStatus(type, `Resuming: ${current.label}`);
    } catch (error) {
      setSoundtrackStatus(type, `Playback recovery failed: ${String(error.message || error)}`);
    }
  }, delay);
}

function pauseCurrentSoundtrack(type) {
  const channel = getAudioChannel(type);
  const active = getActiveSoundtrack(type);
  clearSoundtrackRecovery(type);
  channel.manualPause = true;
  if (channel.mode === "youtube" && channel.youtubePlayer?.pauseVideo) {
    channel.youtubePlayer.pauseVideo();
  }

  channel.paused = true;
  if (active) {
    setSoundtrackStatus(type, `Paused: ${active.label}`);
  }
  persistSoundtrackUi();
}

function stopSoundtrackAtMarker(type, cueIndex = -1) {
  const channel = getAudioChannel(type);
  channel.currentCueIndex = cueIndex;
  cancelStandbyPreload(type);
  if (!getActiveSoundtrack(type) || channel.paused) {
    return;
  }

  pauseCurrentSoundtrack(type);
  setSoundtrackStatus(type, `${AUDIO_CHANNEL_CONFIG[type].label} ended by chapter cue.`);
}

function playCurrentSoundtrack(type) {
  const channel = getAudioChannel(type);
  const active = getActiveSoundtrack(type);
  if (!active) {
    return;
  }

  clearSoundtrackRecovery(type);
  channel.manualPause = false;
  channel.recoveryAttempts = 0;
  if (channel.mode === "youtube" && channel.youtubePlayer?.playVideo) {
    channel.youtubePlayer.playVideo();
  } else {
    syncSoundtrackPlayback(type);
  }

  channel.paused = false;
  setSoundtrackStatus(type, `Now playing: ${active.label}`);
  persistSoundtrackUi();
}

function loopCurrentSoundtrack(type) {
  const channel = getAudioChannel(type);
  const active = getActiveSoundtrack(type);
  if (!active || channel.manualPause || !AUDIO_CHANNEL_CONFIG[type].loop) {
    return;
  }

  clearSoundtrackRecovery(type);
  channel.paused = false;
  channel.recoveryAttempts = 0;

  try {
    if (channel.youtubePlayer?.seekTo) {
      channel.youtubePlayer.seekTo(0, true);
      channel.youtubePlayer.playVideo();
    } else if (channel.youtubePlayer?.loadVideoById && active.videoId) {
      loadYouTubeTrack(type, active, 0);
    }
    setSoundtrackStatus(type, `Looping: ${active.label}`);
    requestSoundtrackRecovery(type, "Loop did not restart", 5000);
  } catch (error) {
    setSoundtrackStatus(type, `Loop failed: ${String(error.message || error)}`);
  }
}

function isTrackAlreadyActive(type, trackId) {
  const channel = getAudioChannel(type);
  const current = getActiveSoundtrack(type);
  return current?.id === trackId && channel.activeKey === trackId;
}

function playSoundtrackById(trackId, options = {}) {
  const allTracks = Object.values(state.soundtrack.queues).flat();
  const selected = allTracks.find((track) => track.id === trackId);
  if (!selected) {
    setSoundtrackStatus("soundtrack", "Music cue points to a missing track.");
    return;
  }

  const type = selected.trackType;
  const config = AUDIO_CHANNEL_CONFIG[type];
  if (options.source !== "button" && !config.autoCue) {
    return;
  }

  const channel = getAudioChannel(type);
  const queue = getAudioQueue(type);
  const index = queue.findIndex((track) => track.id === trackId);
  if (index < 0) {
    setSoundtrackStatus(type, "Music cue points to a missing track.");
    return;
  }

  if (Number.isFinite(Number(options.cueIndex))) {
    channel.currentCueIndex = Number(options.cueIndex);
  }

  if (isTrackAlreadyActive(type, trackId)) {
    if (!config.loop && options.source === "button") {
      channel.paused = false;
      channel.manualPause = false;
      loadYouTubeTrack(type, selected);
      setSoundtrackStatus(type, `Playing: ${selected.label}`);
      persistSoundtrackUi();
      return;
    }

    if (channel.paused) {
      if (config.loop) {
        playCurrentSoundtrack(type);
      }
    }
    if (config.loop && !state.soundtrack.editorMode) preloadNextCue(type, channel.currentCueIndex);
    return;
  }

  channel.currentIndex = index;
  channel.paused = false;
  channel.manualPause = false;
  channel.ready = false;
  channel.activeKey = "";
  channel.recoveryAttempts = 0;
  clearSoundtrackRecovery(type);
  persistSoundtrackUi();
  syncSoundtrackPlayback(type);

  if (options.source === "button") {
    setSoundtrackStatus(type, `Cue selected: ${queue[index].label}`);
  }
}

function applySoundtrackVolume(type) {
  const channel = getAudioChannel(type);
  const track = getActiveSoundtrack(type);
  channel.volume = clampVolume(channel.volume);
  const multiplier = clampVolumeMultiplier(track?.volumeMultiplier);
  const effectiveVolume = clampVolume((state.soundtrack.masterVolume * channel.volume * multiplier) / 10000);
  if (channel.youtubePlayer?.setVolume) {
    channel.youtubePlayer.setVolume(effectiveVolume);
  }
  persistSoundtrackUi();
}

function setAudioVolume(scope, value) {
  if (scope === "master") {
    state.soundtrack.masterVolume = clampVolume(value);
    Object.keys(AUDIO_CHANNEL_CONFIG).forEach(applySoundtrackVolume);
    return;
  }

  const type = normalizeAudioTrackType(scope);
  getAudioChannel(type).volume = clampVolume(value);
  applySoundtrackVolume(type);
}

function adjustAudioVolume(scope, delta) {
  const current = scope === "master" ? state.soundtrack.masterVolume : getAudioChannel(scope).volume;
  setAudioVolume(scope, current + delta);
}

function handleYouTubePlayerState(type, event) {
  const channel = getAudioChannel(type);
  const player = event.target;
  if (player === channel.standbyPlayer) {
    if (event.data === window.YT.PlayerState.PLAYING && channel.standbyWarming) {
      const token = channel.standbyToken;
      if (channel.standbyPauseTimer) clearTimeout(channel.standbyPauseTimer);
      channel.standbyPauseTimer = setTimeout(() => {
        if (token !== channel.standbyToken || player !== channel.standbyPlayer) return;
        player.pauseVideo?.();
        player.seekTo?.(channel.standbyStartSeconds, true);
      }, 450);
    }
    if (event.data === window.YT.PlayerState.PAUSED && channel.standbyWarming) {
      channel.standbyWarming = false;
      channel.standbyReady = true;
      player.seekTo?.(channel.standbyStartSeconds, true);
    }
    return;
  }

  if (player !== channel.youtubePlayer) return;

  if (event.data === window.YT.PlayerState.ENDED) {
    clearSoundtrackRecovery(type);
    channel.recoveryAttempts = 0;
    if (AUDIO_CHANNEL_CONFIG[type].loop) {
      loopCurrentSoundtrack(type);
      return;
    }
    channel.paused = true;
    channel.manualPause = true;
    setSoundtrackStatus(type, `Finished: ${getActiveSoundtrack(type)?.label ?? AUDIO_CHANNEL_CONFIG[type].label}`);
    persistSoundtrackUi();
    return;
  }

  if (event.data === window.YT.PlayerState.PLAYING) {
    clearSoundtrackRecovery(type);
    channel.paused = false;
    channel.manualPause = false;
    channel.recoveryAttempts = 0;
    const active = getActiveSoundtrack(type);
    if (active) setSoundtrackStatus(type, `Now playing: ${active.label}`);
    persistSoundtrackUi();
  }

  if (event.data === window.YT.PlayerState.PAUSED) {
    if (channel.manualPause) {
      channel.paused = true;
      persistSoundtrackUi();
      return;
    }
    requestSoundtrackRecovery(type, "Playback paused by YouTube");
  }

  if (event.data === window.YT.PlayerState.BUFFERING) {
    requestSoundtrackRecovery(type, "Playback is buffering", 4500);
  }

  if (event.data === window.YT.PlayerState.CUED || event.data === window.YT.PlayerState.UNSTARTED) {
    requestSoundtrackRecovery(type, "Playback is waiting");
  }
}

function handleYouTubePlayerError(type, event) {
  const channel = getAudioChannel(type);
  if (event.target === channel.standbyPlayer) {
    channel.standbyWarming = false;
    channel.standbyReady = false;
    return;
  }

  if (event.target !== channel.youtubePlayer) return;
  const active = getActiveSoundtrack(type);
  setSoundtrackStatus(type, `YouTube player error${event?.data ? ` ${event.data}` : ""}. Retrying...`);
  if (active) requestSoundtrackRecovery(type, "YouTube player error", 1500);
}

function cancelStandbyPreload(type) {
  const channel = getAudioChannel(type);
  channel.standbyToken += 1;
  if (channel.standbyPauseTimer) {
    clearTimeout(channel.standbyPauseTimer);
    channel.standbyPauseTimer = null;
  }
  channel.standbyWarming = false;
  channel.standbyReady = false;
  channel.standbyTrackId = "";
  channel.standbyStartSeconds = 0;
  channel.standbyPlayer?.pauseVideo?.();
}

async function ensureStandbyPlayer(type) {
  const channel = getAudioChannel(type);
  if (channel.standbyPlayer) return channel.standbyPlayer;

  await loadExternalScript("https://www.youtube.com/iframe_api", () => Boolean(window.YT?.Player));
  getSoundtrackLayer();
  const primaryHost = `youtube-audio-${type}-host`;
  const secondaryHost = `youtube-audio-${type}-standby-host`;
  const hostId = channel.youtubePlayerHost === primaryHost ? secondaryHost : primaryHost;
  let resolveReady;
  const ready = new Promise((resolve) => { resolveReady = resolve; });
  channel.standbyPlayerHost = hostId;
  channel.standbyPlayer = new window.YT.Player(hostId, {
    height: "200",
    width: "320",
    playerVars: { autoplay: 0, controls: 0, rel: 0 },
    events: {
      onReady: () => resolveReady(),
      onStateChange: (event) => handleYouTubePlayerState(type, event),
      onError: (event) => handleYouTubePlayerError(type, event),
    },
  });
  await ready;
  return channel.standbyPlayer;
}

async function preloadTrack(type, track) {
  if (!track || state.soundtrack.editorMode || !AUDIO_CHANNEL_CONFIG[type].loop) return;
  const channel = getAudioChannel(type);
  if (channel.standbyTrackId === track.id && (channel.standbyReady || channel.standbyWarming)) return;

  const chapterId = state.soundtrack.chapterId;
  const token = ++channel.standbyToken;
  const player = await ensureStandbyPlayer(type);
  if (token !== channel.standbyToken || chapterId !== state.soundtrack.chapterId || player !== channel.standbyPlayer) return;

  if (channel.standbyPauseTimer) clearTimeout(channel.standbyPauseTimer);
  channel.standbyTrackId = track.id;
  channel.standbyStartSeconds = Math.max(0, Number(track.startSeconds) || 0);
  channel.standbyReady = false;
  channel.standbyWarming = true;
  player.mute?.();
  player.loadVideoById?.({ videoId: track.videoId, startSeconds: channel.standbyStartSeconds });
}

function preloadNextCue(type, afterIndex = -1) {
  const next = getNextCueTrack(type, afterIndex);
  if (!next) {
    cancelStandbyPreload(type);
    return;
  }
  preloadTrack(type, next.track);
}

function activatePreloadedTrack(type, track) {
  const channel = getAudioChannel(type);
  if (!channel.standbyPlayer || !channel.standbyReady || channel.standbyTrackId !== track.id) return false;

  clearSoundtrackRecovery(type);
  channel.standbyToken += 1;
  if (channel.standbyPauseTimer) {
    clearTimeout(channel.standbyPauseTimer);
    channel.standbyPauseTimer = null;
  }

  const previousPlayer = channel.youtubePlayer;
  const previousHost = channel.youtubePlayerHost;
  channel.youtubePlayer = channel.standbyPlayer;
  channel.youtubePlayerHost = channel.standbyPlayerHost;
  channel.standbyPlayer = previousPlayer;
  channel.standbyPlayerHost = previousHost;
  channel.standbyTrackId = "";
  channel.standbyStartSeconds = 0;
  channel.standbyReady = false;
  channel.standbyWarming = false;

  channel.standbyPlayer?.pauseVideo?.();
  channel.standbyPlayer?.mute?.();
  channel.youtubePlayer.unMute?.();
  channel.mode = "youtube";
  channel.ready = true;
  channel.activeKey = track.id;
  channel.paused = false;
  channel.manualPause = false;
  channel.recoveryAttempts = 0;
  applySoundtrackVolume(type);
  channel.youtubePlayer.playVideo?.();
  setSoundtrackStatus(type, `Now playing: ${track.label}`);
  requestSoundtrackRecovery(type, "Preloaded track did not start", 3500);
  updateQuickToolButton();
  preloadNextCue(type, channel.currentCueIndex);
  return true;
}

function loadYouTubeTrack(type, track, startSeconds = track.startSeconds ?? 0) {
  const player = getAudioChannel(type).youtubePlayer;
  if (!player?.loadVideoById) {
    return;
  }

  player.loadVideoById({
    videoId: track.videoId,
    startSeconds: Math.max(0, Number(startSeconds) || 0),
  });
}

async function ensureYouTubePlayer(type, track, token) {
  const channel = getAudioChannel(type);
  await loadExternalScript("https://www.youtube.com/iframe_api", () => Boolean(window.YT?.Player));

  if (token !== channel.syncToken) {
    return;
  }

  getSoundtrackLayer();

  if (!channel.youtubePlayer) {
    await new Promise((resolve) => {
      const start = () => {
        const primaryHost = `youtube-audio-${type}-host`;
        const secondaryHost = `youtube-audio-${type}-standby-host`;
        const hostId = channel.standbyPlayerHost === primaryHost ? secondaryHost : primaryHost;
        channel.youtubePlayerHost = hostId;
        channel.youtubePlayer = new window.YT.Player(hostId, {
          height: "200",
          width: "320",
          videoId: track.videoId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            rel: 0,
            start: track.startSeconds || 0,
          },
          events: {
            onReady: () => resolve(),
            onStateChange: (event) => handleYouTubePlayerState(type, event),
            onError: (event) => handleYouTubePlayerError(type, event),
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
    loadYouTubeTrack(type, track);
  }

  if (token !== channel.syncToken) {
    return;
  }

  channel.mode = "youtube";
  channel.ready = true;
  channel.activeKey = track.id;
  applySoundtrackVolume(type);
  setSoundtrackStatus(type, `Now playing: ${track.label}`);
  if (!channel.paused) {
    channel.manualPause = false;
    channel.youtubePlayer.playVideo();
    requestSoundtrackRecovery(type, "Playback did not start", 5000);
  }
  if (channel.cueMode) preloadNextCue(type, channel.currentCueIndex);
  updateQuickToolButton();
}

async function syncSoundtrackPlayback(type) {
  const channel = getAudioChannel(type);
  const token = ++channel.syncToken;
  const track = getActiveSoundtrack(type);

  if (!track) {
    channel.mode = "idle";
    channel.ready = false;
    channel.activeKey = "";
    channel.paused = true;
    channel.manualPause = true;
    channel.youtubePlayer?.pauseVideo?.();
    setSoundtrackStatus(type, `No ${AUDIO_CHANNEL_CONFIG[type].label.toLowerCase()} loaded.`);
    updateQuickToolButton();
    return;
  }

  try {
    if (track.source === "youtube") {
      if (activatePreloadedTrack(type, track)) return;
      await ensureYouTubePlayer(type, track, token);
      return;
    }
  } catch (error) {
    state.saveStatus = `${AUDIO_CHANNEL_CONFIG[type].label} error: ${String(error.message || error)}`;
    setSoundtrackStatus(type, `${AUDIO_CHANNEL_CONFIG[type].label} could not be loaded.`);
    updateQuickToolButton();
  }
}

function activateSoundtrackQueue(chapterId, queue, options = {}) {
  const contextChanged = chapterId !== state.soundtrack.chapterId;
  const editorMode = Boolean(options.editorMode);
  const modeChanged = editorMode !== state.soundtrack.editorMode;
  const settings = normalizeAudioSettings(options.audioSettings);
  const nextQueues = Object.fromEntries(Object.keys(AUDIO_CHANNEL_CONFIG).map((type) => [
    type,
    queue.filter((track) => track.trackType === type),
  ]));
  const nextCueTimelines = buildAudioCueTimelines(options.body, queue);
  const cueIds = new Set([...String(options.body ?? "").matchAll(/\[music:\s*([^\]]+)\]/gi)].map((match) => match[1].trim()));
  clearSoundtrackCueObserver();
  state.soundtrack.chapterId = chapterId;
  state.soundtrack.editorMode = editorMode;
  if (contextChanged) {
    state.soundtrack.masterVolume = settings.masterVolume;
    state.soundtrack.channels.soundtrack.volume = settings.soundtrackVolume;
    state.soundtrack.channels.ambience.volume = settings.ambienceVolume;
    state.soundtrack.channels["sound-effect"].volume = settings.soundEffectVolume;
  }

  Object.keys(AUDIO_CHANNEL_CONFIG).forEach((type) => {
    const channel = getAudioChannel(type);
    const previousIds = getAudioQueue(type).map((track) => track.id).join("|");
    const nextIds = nextQueues[type].map((track) => track.id).join("|");
    const queueChanged = previousIds !== nextIds;
    const timelineChanged = type !== "sound-effect"
      && JSON.stringify(state.soundtrack.cueTimelines[type] ?? []) !== JSON.stringify(nextCueTimelines[type] ?? []);
    state.soundtrack.queues[type] = nextQueues[type];
    if (type !== "sound-effect") state.soundtrack.cueTimelines[type] = nextCueTimelines[type];
    channel.cueMode = AUDIO_CHANNEL_CONFIG[type].autoCue && nextQueues[type].some((track) => cueIds.has(track.id));

    if (contextChanged || queueChanged || modeChanged || timelineChanged) {
      clearSoundtrackRecovery(type);
      cancelStandbyPreload(type);
      channel.syncToken += 1;
      channel.currentIndex = 0;
      channel.currentCueIndex = -1;
      channel.paused = editorMode || channel.cueMode || !AUDIO_CHANNEL_CONFIG[type].autoCue;
      channel.manualPause = channel.paused;
      channel.ready = false;
      channel.activeKey = "";
      channel.recoveryAttempts = 0;
      channel.youtubePlayer?.pauseVideo?.();
    }

    if (!nextQueues[type].length) {
      channel.paused = true;
      channel.manualPause = true;
      setSoundtrackStatus(type, `No ${AUDIO_CHANNEL_CONFIG[type].label.toLowerCase()} loaded.`);
      return;
    }

    applySoundtrackVolume(type);

    if (editorMode) {
      setSoundtrackStatus(type, `Use Preview to play ${AUDIO_CHANNEL_CONFIG[type].label.toLowerCase()} in the editor.`);
      return;
    }

    if (channel.cueMode) {
      setSoundtrackStatus(type, `Waiting for ${AUDIO_CHANNEL_CONFIG[type].label.toLowerCase()} cue.`);
      preloadNextCue(type, channel.currentCueIndex);
      return;
    }

    if (AUDIO_CHANNEL_CONFIG[type].autoCue && (contextChanged || queueChanged || !channel.activeKey)) {
      channel.paused = false;
      channel.manualPause = false;
      syncSoundtrackPlayback(type);
    } else if (!AUDIO_CHANNEL_CONFIG[type].autoCue) {
      setSoundtrackStatus(type, "Sound effects play only from their cue buttons.");
    }
  });

  persistSoundtrackUi();
  observeSoundtrackCues();
}

function observeSoundtrackCues() {
  if (state.soundtrack.editorMode) {
    return;
  }

  const cues = [...document.querySelectorAll("[data-music-trigger], [data-music-end]")];
  const allTracks = Object.values(state.soundtrack.queues).flat();
  if (!cues.length || !allTracks.length) {
    return;
  }

  const trackById = new Map(allTracks.map((track) => [track.id, track]));
  state.soundtrack.cueObserver = new IntersectionObserver(
    (entries) => {
      const visibleCues = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      const triggeredTypes = new Set();
      visibleCues.forEach((entry) => {
        const endType = entry.target?.dataset?.musicEnd;
        const cueIndex = Number(entry.target?.dataset?.musicCueIndex ?? -1);
        if (endType && ["soundtrack", "ambience"].includes(endType)) {
          if (!triggeredTypes.has(endType)) {
            triggeredTypes.add(endType);
            stopSoundtrackAtMarker(endType, cueIndex);
          }
          return;
        }

        const trackId = entry.target?.dataset?.musicTrigger;
        const track = trackById.get(trackId);
        if (!track || !AUDIO_CHANNEL_CONFIG[track.trackType].autoCue || triggeredTypes.has(track.trackType)) return;
        triggeredTypes.add(track.trackType);
        playSoundtrackById(trackId, { source: "scroll", cueIndex });
      });
    },
    {
      root: null,
      rootMargin: "-20% 0px -55% 0px",
      threshold: [0, 0.35, 0.75],
    },
  );

  cues.forEach((cue) => state.soundtrack.cueObserver.observe(cue));
}

function deactivateSoundtrackQueue() {
  clearSoundtrackCueObserver();
  state.soundtrack.chapterId = "";
  state.soundtrack.volumeOpen = "";
  Object.keys(AUDIO_CHANNEL_CONFIG).forEach((type) => {
    const channel = getAudioChannel(type);
    clearSoundtrackRecovery(type);
    cancelStandbyPreload(type);
    state.soundtrack.queues[type] = [];
    channel.syncToken += 1;
    channel.currentIndex = 0;
    channel.paused = true;
    channel.manualPause = true;
    channel.activeKey = "";
    channel.ready = false;
    channel.recoveryAttempts = 0;
    channel.cueMode = false;
    channel.youtubePlayer?.pauseVideo?.();
  });
  clearSoundtrackUi();
  saveStoredSoundtrackState();
}

function renderMusicCue(trackId, soundtrackLabels, showMusicCues, cueIndex = -1) {
  const cleanId = String(trackId ?? "").trim();
  if (!cleanId) {
    return "";
  }

  const metadata = soundtrackLabels.get(cleanId) ?? { label: cleanId, trackType: "soundtrack" };
  const label = metadata.label ?? cleanId;
  const trackType = normalizeAudioTrackType(metadata.trackType);
  if (!showMusicCues) {
    return `<span class="music-cue track-${trackType}" data-music-trigger="${escapeHtml(cleanId)}" data-music-cue-index="${cueIndex}"></span>`;
  }

  return `
    <span class="music-cue is-visible track-${trackType}" data-music-trigger="${escapeHtml(cleanId)}" data-music-cue-index="${cueIndex}">
      <button class="music-cue-play" type="button" data-action="play-music-cue" data-music-trigger="${escapeHtml(cleanId)}" data-music-cue-index="${cueIndex}" title="Play ${escapeHtml(label)}">▶</button>
      <span>${escapeHtml(AUDIO_CHANNEL_CONFIG[trackType].label)}: ${escapeHtml(label)}</span>
    </span>
  `;
}

function renderMusicEndCue(trackType, showMusicCues, cueIndex = -1) {
  const type = String(trackType ?? "").trim().toLowerCase();
  if (!["soundtrack", "ambience"].includes(type)) {
    return `<span class="music-end-cue is-invalid">Unknown music track: ${escapeHtml(type)}</span>`;
  }

  if (!showMusicCues) {
    return `<span class="music-end-cue track-${type}" data-music-end="${type}" data-music-cue-index="${cueIndex}"></span>`;
  }

  return `
    <span class="music-end-cue is-visible track-${type}" data-music-end="${type}" data-music-cue-index="${cueIndex}">
      <span aria-hidden="true">■</span>
      <span>End ${escapeHtml(AUDIO_CHANNEL_CONFIG[type].label)}</span>
    </span>
  `;
}

function renderVideoEmbed(videoId, videos) {
  const cleanId = String(videoId ?? "").trim();
  const video = videos.get(cleanId);
  if (!video) {
    return `<div class="video-embed-missing">Missing video: ${escapeHtml(cleanId)}</div>`;
  }

  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
  });
  if (video.startSeconds) {
    params.set("start", String(video.startSeconds));
  }

  return `
    <figure class="chapter-video">
      <iframe
        src="https://www.youtube.com/embed/${escapeHtml(video.videoId)}?${params.toString()}"
        title="${escapeHtml(video.label)}"
        width="100%"
        height="506"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        loading="lazy"
      ></iframe>
      <figcaption>${escapeHtml(video.label)}</figcaption>
    </figure>
  `;
}

function renderChapterImageFrame(imageHtml) {
  return `
    <figure class="chapter-image-frame is-fill" data-image-view="fill" data-auto-image-view="true">
      <button class="small-button image-view-toggle" type="button" data-action="toggle-image-view" title="Toggle image view">Desired</button>
      ${imageHtml}
    </figure>
  `;
}

function renderMarkdownImage(alt, src) {
  return renderChapterImageFrame(`<img alt="${alt}" src="${escapeHtml(getDisplayImageUrl(src))}" />`);
}

function normalizeCharacterKey(value) {
  return String(value ?? "").trim().replace(/\s+/g, " ").toLowerCase();
}

function normalizeCharacterColor(value, fallback) {
  const color = String(value ?? "").trim();
  return /^#[0-9a-f]{6}$/i.test(color) ? color : fallback;
}

function buildDialogCharacterMap(characters = []) {
  return new Map(characters.map((character) => [normalizeCharacterKey(character.name), {
    ...character,
    mainColor: normalizeCharacterColor(character.mainColor, "#8f5f35"),
    secondaryColor: normalizeCharacterColor(character.secondaryColor, "#d7b56d"),
  }]));
}

function renderInlineDialogMarkdown(value) {
  return escapeHtml(String(value ?? ""))
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

function renderDialogBlock(dialog, characters) {
  const character = characters.get(normalizeCharacterKey(dialog.characterName));
  const mainColor = normalizeCharacterColor(character?.mainColor, "#705846");
  const secondaryColor = normalizeCharacterColor(character?.secondaryColor, "#c3a77a");
  const displayName = dialog.displayName?.trim() || character?.name || dialog.characterName;
  return `
    <blockquote class="dialog-block ${character ? "" : "is-missing"}" style="--dialog-main: ${mainColor}; --dialog-secondary: ${secondaryColor};">
      <div class="dialog-speaker">${escapeHtml(displayName)}</div>
      <div class="dialog-message">${renderInlineDialogMarkdown(dialog.message)}</div>
    </blockquote>
  `;
}

function renderMarkdown(markdown, options = {}) {
  const source = String(markdown ?? "");
  const soundtrackLabels = options.soundtrackLabels ?? new Map();
  const videos = options.videos ?? new Map();
  const characters = options.characters ?? new Map();
  const showMusicCues = Boolean(options.showMusicCues);
  const dialogs = [];
  const dialogProtectedSource = source.replace(
    /^\s*\[dialog:\s*([^:\]\r\n]+?)(?:\s*:\s*([^\]\r\n]+?))?\]\s*(.*?)\s*$/gim,
    (_, characterName, displayName, message) => {
      const token = `ULUNAVIR_DIALOG_BLOCK_${dialogs.length}`;
      dialogs.push({ characterName: characterName.trim(), displayName: displayName?.trim() ?? "", message });
      return `\n\n${token}\n\n`;
    },
  );
  const extraBreakToken = "ULUNAVIR_SAFE_EXTRA_BREAK";
  const normalized = dialogProtectedSource.replace(/\n{3,}/g, (match) => `\n\n${`${extraBreakToken}\n`.repeat(match.length - 2)}\n`);
  let escaped = escapeHtml(normalized);
  escaped = escaped.replaceAll(extraBreakToken, "<br />");
  const fenced = escaped.replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${code.trim()}</code></pre>`);
  const imageified = fenced.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (_, alt, src) => renderMarkdownImage(alt, src),
  );
  const linked = imageified.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  const bolded = linked.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  const italicized = bolded.replace(/\*(.+?)\*/g, "<em>$1</em>");
  const cueIndexes = { soundtrack: 0, ambience: 0 };
  const musicMarked = italicized
    .replace(/\[(music|music-end):\s*([^\]]+)\]/gi, (_, markerType, value) => {
      if (markerType.toLowerCase() === "music-end") {
        const trackType = String(value).trim().toLowerCase();
        const cueIndex = Object.hasOwn(cueIndexes, trackType) ? cueIndexes[trackType]++ : -1;
        return renderMusicEndCue(trackType, showMusicCues, cueIndex);
      }

      const trackId = String(value).trim();
      const metadata = soundtrackLabels.get(trackId);
      const trackType = normalizeAudioTrackType(metadata?.trackType);
      const cueIndex = metadata && Object.hasOwn(cueIndexes, trackType) ? cueIndexes[trackType]++ : -1;
      return renderMusicCue(trackId, soundtrackLabels, showMusicCues, cueIndex);
    })
    .replace(/\[video:\s*([^\]]+)\]/gi, (_, videoId) => renderVideoEmbed(videoId, videos))
    .replace(/ULUNAVIR_DIALOG_BLOCK_(\d+)/g, (_, index) => renderDialogBlock(dialogs[Number(index)], characters));
  const headings = musicMarked
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
      if (/^<(h\d|ul|ol|pre|p|blockquote|table|hr|br|figure|div)\b/.test(block.trim())) {
        return block;
      }

      return `<p>${block.replace(/\n/g, "<br />")}</p>`;
    })
    .join("");
}

function renderHtmlDocument(html) {
  return String(html ?? "")
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(
      /\bsrc=(["'])(https?:\/\/t\d+\.pixhost\.(?:to|cc)\/thumbs\/[^"']+)\1/gi,
      (_, quote, src) => `src=${quote}${escapeHtml(getDisplayImageUrl(src))}${quote}`,
    )
    .replace(/<img\b[^>]*>/gi, (imageHtml) => renderChapterImageFrame(imageHtml))
    .replace(/\n{3,}/g, (match) => `\n\n${"<br />\n".repeat(match.length - 2)}\n`);
}

function getChapterRenderMode(chapter) {
  return chapter?.renderMode === "html" ? "html" : "markdown";
}

function getChapterHtmlBackground(chapter) {
  return chapter?.htmlBackground || "";
}

function isLightColor(hex) {
  const normalized = String(hex ?? "").replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(normalized)) {
    return false;
  }

  const red = parseInt(normalized.slice(0, 2), 16);
  const green = parseInt(normalized.slice(2, 4), 16);
  const blue = parseInt(normalized.slice(4, 6), 16);
  return (red * 299 + green * 587 + blue * 114) / 1000 > 170;
}

function renderChapterBody(chapter, fallback, options = {}) {
  const mode = getChapterRenderMode(chapter);
  const body = chapter?.body || fallback;

  if (mode === "html") {
    const background = getChapterHtmlBackground(chapter);
    const styles = [];
    if (background) {
      styles.push(`background-color: ${background}`);
      if (isLightColor(background)) {
        styles.push("color: #1d1712");
      }
    }
    return `<div class="html-document-surface" ${styles.length ? `style="${escapeHtml(styles.join("; "))}"` : ""}>${renderHtmlDocument(body)}</div>`;
  }

  return renderMarkdown(body, {
    soundtrackLabels: buildSoundtrackLabelMap(chapter?.soundtracks ?? []),
    videos: buildVideoMap(chapter?.videos ?? []),
    characters: buildDialogCharacterMap(chapter?.characters ?? []),
    showMusicCues: Boolean(options.showMusicCues),
  });
}

function getChapterTextStats(body = "", mode = "markdown") {
  let text = String(body ?? "");
  if (mode === "html") {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = text;
    text = wrapper.textContent ?? "";
  } else {
    text = text
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
      .replace(/\[music-end:\s*[^\]]+\]/gi, " ")
      .replace(/\[music:\s*[^\]]+\]/gi, " ")
      .replace(/\[video:\s*[^\]]+\]/gi, " ")
      .replace(/^\s*\[dialog:\s*[^\]]+\]\s*/gim, "")
      .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
      .replace(/[#>*_`~\-]/g, " ");
  }

  const normalized = text.replace(/\s+/g, " ").trim();
  return {
    words: normalized ? normalized.split(" ").length : 0,
    characters: text.replace(/\s+$/g, "").length,
  };
}

function renderChapterStats(chapter) {
  const stats = getChapterTextStats(chapter?.body ?? "", getChapterRenderMode(chapter));
  return `<div id="chapter-text-stats" class="chapter-text-stats">Words: ${stats.words} · Characters: ${stats.characters}</div>`;
}

function getWordImagePlaceholders(body = "") {
  const ids = new Set();
  const source = String(body ?? "");
  [...source.matchAll(/data-word-image-placeholder=["'](\d+)["']/gi)].forEach((match) => ids.add(Number(match[1])));
  [...source.matchAll(/\[IMAGE\s+(\d+)\s+HERE\]/gi)].forEach((match) => ids.add(Number(match[1])));
  return [...ids].filter((id) => Number.isFinite(id)).sort((a, b) => a - b);
}

function renderWordImagePanel(chapter) {
  const placeholders = getWordImagePlaceholders(chapter.body);
  if (getChapterRenderMode(chapter) !== "html" || !placeholders.length) {
    return "";
  }

  return `
    <section class="panel stack word-image-panel">
      <div class="section-header">
        <div>
          <h3>Word Images</h3>
          <p class="muted">Paste Imgur, Pixhost, or direct image URLs to replace the Word image placeholders in their original positions.</p>
        </div>
        <span class="pill">${placeholders.length} placeholder(s)</span>
      </div>
      <div class="word-image-list">
        ${placeholders.map((id) => `
          <div class="inline-form word-image-row">
            <label>IMAGE ${id}</label>
            <input data-word-image-url="${id}" placeholder="https://i.imgur.com/example.png or https://pixhost.to/show/..." />
            <button class="ghost-button" type="button" data-action="replace-word-image" data-chapter-id="${chapter.id}" data-image-index="${id}">Apply</button>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function convertImportedImageMarkers(html) {
  return String(html ?? "").replace(/<img\b([^>]*?)>/gi, (raw, attrs) => {
    const match = attrs.match(/\bsrc=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const src = match?.[1] ?? match?.[2] ?? match?.[3] ?? "";
    const imageMatch = src.match(/^#word-import-image-(\d+)$/);

    if (!imageMatch) {
      return raw;
    }

    const index = imageMatch[1];
    return `<p><strong>[IMAGE ${index} HERE]</strong><br><span style="color: #c8b595;">Upload this Word image to Imgur or Pixhost, then replace this line with:</span><br><code>![word-image-${index}](PASTE_IMAGE_URL_HERE)</code></p>`;
  });
}

function cleanupImportedWordHtml(html) {
  return String(html ?? "")
    // Word line numbering sometimes arrives as real text nodes: 123Text, 45Text, etc.
    .replace(/([.!?:;])\s*\d{1,4}(?=[A-ZÇĞİÖŞÜ])/g, "$1 ")
    .replace(/(<(?:p|h[1-6]|li|blockquote)\b[^>]*>)\s*[o0]\s*(?=[A-ZÇĞİÖŞÜ])/gi, "$1")
    .replace(/(<(?:p|h[1-6]|li|blockquote)\b[^>]*>)\s*\d{1,4}\s*(?=[A-ZÇĞİÖŞÜ])/gi, "$1")
    .replace(/<p>\s*(?:\d{1,4}|[o0])\s*<\/p>/gi, "")
    .replace(/(?:^|\n)\s*(?:\d{1,4}|[o0])\s*(?=\n|$)/gi, "\n")
    .replace(/>\s+</g, "><")
    .replace(/<\/(h[1-6]|p|blockquote|ul|ol|li|table|tr)>\s*/gi, "</$1>\n\n")
    .replace(/\s*<(h[1-6]|p|blockquote|ul|ol|table)\b/gi, "\n<$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function xmlChildren(node, localName) {
  return [...(node?.childNodes ?? [])].filter((child) => child.nodeType === 1 && child.localName === localName);
}

function xmlFirst(node, localName) {
  return xmlChildren(node, localName)[0] ?? null;
}

function xmlAttr(node, name) {
  return node?.getAttribute(`w:${name}`) ?? node?.getAttribute(name) ?? "";
}

function wordColor(value) {
  const color = String(value ?? "").trim();
  if (!color || color.toLowerCase() === "auto") {
    return "";
  }

  return color.startsWith("#") ? color : `#${color}`;
}

function wordHighlight(value) {
  const colors = {
    black: "#000000",
    blue: "#2f65d9",
    cyan: "#00cfe8",
    green: "#37b24d",
    magenta: "#d63384",
    red: "#d9480f",
    yellow: "#ffe066",
    white: "#ffffff",
  };

  return colors[String(value ?? "").toLowerCase()] ?? "";
}

function getWordRunStyles(run) {
  const runProperties = xmlFirst(run, "rPr");
  if (!runProperties) {
    return [];
  }

  const styles = [];
  const color = wordColor(xmlAttr(xmlFirst(runProperties, "color"), "val"));
  const highlight = wordHighlight(xmlAttr(xmlFirst(runProperties, "highlight"), "val"));
  const size = Number(xmlAttr(xmlFirst(runProperties, "sz"), "val"));
  const fonts = xmlFirst(runProperties, "rFonts");
  const fontFamily = xmlAttr(fonts, "ascii") || xmlAttr(fonts, "hAnsi");
  const underline = xmlFirst(runProperties, "u");
  const verticalAlign = xmlAttr(xmlFirst(runProperties, "vertAlign"), "val");

  if (xmlFirst(runProperties, "b")) {
    styles.push("font-weight: 700");
  }
  if (xmlFirst(runProperties, "i")) {
    styles.push("font-style: italic");
  }
  if (underline && xmlAttr(underline, "val") !== "none") {
    styles.push("text-decoration: underline");
  }
  if (xmlFirst(runProperties, "strike")) {
    styles.push("text-decoration: line-through");
  }
  if (color) {
    styles.push(`color: ${color}`);
  }
  if (highlight) {
    styles.push(`background-color: ${highlight}`);
  }
  if (Number.isFinite(size) && size > 0) {
    styles.push(`font-size: ${size / 2}pt`);
  }
  if (fontFamily) {
    styles.push(`font-family: ${fontFamily.replace(/[<>"']/g, "")}`);
  }
  if (verticalAlign === "superscript") {
    styles.push("vertical-align: super", "font-size: 0.72em");
  }
  if (verticalAlign === "subscript") {
    styles.push("vertical-align: sub", "font-size: 0.72em");
  }

  return styles;
}

function renderWordImagePlaceholder(index) {
  return `<div class="word-image-placeholder" data-word-image-placeholder="${index}"><strong>[IMAGE ${index} HERE]</strong><br />Upload this Word image to Imgur or Pixhost, then replace this block with the Word Images panel.</div>`;
}

function renderWordRun(run, context) {
  const chunks = [];

  for (const child of [...run.childNodes]) {
    if (child.nodeType !== 1) {
      continue;
    }

    if (child.localName === "t" || child.localName === "instrText") {
      chunks.push(escapeHtml(child.textContent ?? ""));
    } else if (child.localName === "tab") {
      chunks.push("&nbsp;&nbsp;&nbsp;&nbsp;");
    } else if (child.localName === "br" || child.localName === "cr") {
      chunks.push("<br />");
    } else if (child.localName === "drawing" || child.localName === "pict") {
      context.imageIndex += 1;
      chunks.push(renderWordImagePlaceholder(context.imageIndex));
    }
  }

  const content = chunks.join("");
  if (!content) {
    return "";
  }

  const styles = getWordRunStyles(run);
  return styles.length ? `<span style="${escapeHtml(styles.join("; "))}">${content}</span>` : content;
}

function renderWordParagraph(paragraph, context) {
  const paragraphProperties = xmlFirst(paragraph, "pPr");
  const paragraphStyle = xmlAttr(xmlFirst(paragraphProperties, "pStyle"), "val").toLowerCase();
  const alignment = xmlAttr(xmlFirst(paragraphProperties, "jc"), "val");
  const styles = [];
  let tag = "p";

  const headingMatch = paragraphStyle.match(/heading([1-6])/);
  if (headingMatch) {
    tag = `h${headingMatch[1]}`;
  } else if (paragraphStyle === "title") {
    tag = "h1";
  } else if (paragraphStyle === "subtitle") {
    tag = "h2";
  }

  if (alignment) {
    const normalized = alignment === "both" ? "justify" : alignment;
    styles.push(`text-align: ${normalized}`);
  }

  const content = [...paragraph.childNodes].map((child) => {
    if (child.nodeType !== 1) {
      return "";
    }

    if (child.localName === "r") {
      return renderWordRun(child, context);
    }

    if (child.localName === "hyperlink") {
      return xmlChildren(child, "r").map((run) => renderWordRun(run, context)).join("");
    }

    return "";
  }).join("").trim();

  if (!content) {
    return "";
  }

  return `<${tag}${styles.length ? ` style="${escapeHtml(styles.join("; "))}"` : ""}>${content}</${tag}>`;
}

function renderWordTable(table, context) {
  const rows = xmlChildren(table, "tr").map((row) => {
    const cells = xmlChildren(row, "tc").map((cell) => {
      const content = xmlChildren(cell, "p").map((paragraph) => renderWordParagraph(paragraph, context)).filter(Boolean).join("");
      return `<td>${content}</td>`;
    }).join("");
    return `<tr>${cells}</tr>`;
  }).join("");

  return rows ? `<table><tbody>${rows}</tbody></table>` : "";
}

async function convertDocxToRichHtml(arrayBuffer) {
  const { default: JSZip } = await import("jszip");
  const zip = await JSZip.loadAsync(arrayBuffer);
  const documentFile = zip.file("word/document.xml");
  if (!documentFile) {
    throw new Error("This .docx file does not contain a readable Word document.");
  }

  const xml = await documentFile.async("text");
  const documentXml = new DOMParser().parseFromString(xml, "application/xml");
  const body = documentXml.getElementsByTagNameNS("*", "body")[0];
  const context = { imageIndex: 0 };
  const html = [...(body?.childNodes ?? [])].map((child) => {
    if (child.nodeType !== 1) {
      return "";
    }

    if (child.localName === "p") {
      return renderWordParagraph(child, context);
    }

    if (child.localName === "tbl") {
      return renderWordTable(child, context);
    }

    return "";
  }).filter(Boolean).join("\n\n");

  return { html, imageCount: context.imageIndex };
}

function insertTextIntoTextarea(textarea, text) {
  const start = textarea.selectionStart ?? textarea.value.length;
  const end = textarea.selectionEnd ?? textarea.value.length;
  const before = textarea.value.slice(0, start);
  const after = textarea.value.slice(end);
  const prefix = before && !before.endsWith("\n") ? "\n\n" : "";
  const suffix = after && !text.endsWith("\n") ? "\n\n" : "";

  textarea.value = `${before}${prefix}${text}${suffix}${after}`;
  const cursor = before.length + prefix.length + text.length;
  textarea.focus();
  textarea.setSelectionRange(cursor, cursor);
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

function getEditorChapterDraft() {
  const mode = document.querySelector("#chapter-render-mode-input")?.value === "html" ? "html" : "markdown";
  const htmlBackground = document.querySelector("#chapter-html-background-input")?.value ?? "";
  const body = document.querySelector("#chapter-body-input")?.value ?? "";
  return {
    body,
    renderMode: mode,
    htmlBackground: mode === "html" ? htmlBackground : "",
  };
}

async function getChapterEditorPatch(chapter, overrides = {}) {
  const draft = getEditorChapterDraft();
  const coverInput = document.querySelector("#chapter-cover-input");
  const coverModeInput = document.querySelector("#chapter-cover-mode-input");
  const rawCover = coverInput instanceof HTMLInputElement ? coverInput.value.trim() : (chapter.coverImageUrl ?? "");
  const coverImageUrl = rawCover ? await normalizeExternalImageUrl(rawCover) : "";
  const coverImageMode = coverModeInput instanceof HTMLSelectElement && ["fill", "fit", "stretch"].includes(coverModeInput.value)
    ? coverModeInput.value
    : (chapter.coverImageMode ?? "fill");
  return {
    title: document.querySelector("#chapter-title-input")?.value.trim() || chapter.title || "Untitled Chapter",
    body: draft.body,
    coverImageUrl,
    coverImageMode,
    published: document.querySelector("#chapter-published-input")?.checked ?? isChapterPublished(chapter),
    hasEverBeenPublished: chapter.hasEverBeenPublished ?? isChapterPublished(chapter),
    dmNotes: document.querySelector("#chapter-dm-notes-input")?.value ?? chapter.dmNotes ?? "",
    renderMode: draft.renderMode,
    htmlBackground: draft.htmlBackground,
    audioSettings: getCurrentAudioSettings(chapter),
    characters: state.editorCharacters,
    ...overrides,
  };
}

function updateChapterPreviewFromEditor() {
  const preview = document.querySelector(".markdown-preview");
  if (!preview) {
    return;
  }

  const draft = getEditorChapterDraft();
  draft.soundtracks = Object.values(state.soundtrack.queues).flat();
  draft.characters = state.editorCharacters;
  preview.dataset.previewMode = draft.renderMode;
  preview.innerHTML = renderChapterBody(draft, draft.renderMode === "html" ? "" : "*Start writing to preview your chapter here.*", { showMusicCues: true });
  initializeChapterImageViews(preview);
  clearSoundtrackCueObserver();
  observeSoundtrackCues();
  const statsNode = document.querySelector("#chapter-text-stats");
  if (statsNode) {
    const stats = getChapterTextStats(draft.body, draft.renderMode);
    statsNode.textContent = `Words: ${stats.words} · Characters: ${stats.characters}`;
  }
}

async function importDocxIntoEditor(file) {
  if (!file) {
    return;
  }

  if (!file.name.toLowerCase().endsWith(".docx")) {
    throw new Error("Please choose a .docx Word file.");
  }

  const bodyInput = document.querySelector("#chapter-body-input");
  if (!(bodyInput instanceof HTMLTextAreaElement)) {
    throw new Error("Chapter editor is not available.");
  }
  const chapterId = state.route.params.chapterId;
  const titleInput = document.querySelector("#chapter-title-input");

  const result = await convertDocxToRichHtml(await file.arrayBuffer());
  const converted = cleanupImportedWordHtml(result.html);
  if (!converted) {
    throw new Error("No readable text was found in that Word file.");
  }

  await state.adapter.updateChapter(chapterId, {
    title: titleInput?.value.trim() || "Untitled Chapter",
    body: converted,
    renderMode: "html",
    htmlBackground: "",
  });

  const images = result.imageCount ? ` ${result.imageCount} image placeholder(s) added.` : "";
  state.saveStatus = `Word file imported into the editor.${images}`;
  const statusNode = document.querySelector(".notice.mono");
  if (statusNode) {
    statusNode.textContent = state.saveStatus;
  }
  await render();
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

function sanitizeFileName(value, fallback = "Untitled") {
  return String(value ?? fallback)
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, "-")
    .replace(/\s+/g, " ")
    .slice(0, 90) || fallback;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
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
  const readerSettings = getReaderSettings(user);
  const readerStyle = `--reader-font-size:${readerSettings.fontSize}px;--reader-line-height:${readerSettings.lineHeight};--reader-width:${readerSettings.width}px;`;
  const authNotice = state.authError
    ? `
        <div class="notice">
          <strong>Sign-in error</strong>
          <div class="muted">${escapeHtml(state.authError)}</div>
          ${state.authErrorCode === "auth/invalid-credential" || state.authErrorCode === "auth/internal-error"
            ? '<div class="card-actions"><button class="ghost-button" data-action="sign-in-redirect">Try redirect sign-in</button></div>'
            : ""}
        </div>
      `
    : "";
  const loadNotice = state.loadError
    ? `<div class="notice"><strong>Load error</strong><div class="muted">${escapeHtml(state.loadError)}</div></div>`
    : "";
  const statusNotice = state.saveStatus
    ? `<div class="notice"><strong>Status</strong><div class="muted">${escapeHtml(state.saveStatus)}</div></div>`
    : "";

  appRoot.innerHTML = `
    <div class="app-shell" style="${readerStyle}">
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

  initializeChapterImageViews();
}

function setChapterImageView(frame, mode, explicit = true) {
  const nextMode = mode === "desired" ? "desired" : "fill";
  frame.dataset.imageView = nextMode;
  if (explicit) {
    frame.dataset.autoImageView = "false";
  }
  frame.classList.toggle("is-desired", nextMode === "desired");
  frame.classList.toggle("is-fill", nextMode !== "desired");

  const button = frame.querySelector("[data-action='toggle-image-view']");
  if (button) {
    button.textContent = nextMode === "desired" ? "Fill" : "Desired";
    button.title = nextMode === "desired" ? "Switch to fill view" : "Switch to desired view";
  }
}

function applyAutomaticChapterImageView(frame) {
  if (frame.dataset.autoImageView === "false") {
    return;
  }

  const image = frame.querySelector("img");
  if (!image?.naturalWidth || !image?.naturalHeight) {
    return;
  }

  setChapterImageView(frame, image.naturalHeight > image.naturalWidth ? "desired" : "fill", false);
}

function initializeChapterImageViews(root = document) {
  root.querySelectorAll(".chapter-image-frame").forEach((frame) => {
    const image = frame.querySelector("img");
    if (!image) {
      return;
    }

    if (image.complete) {
      applyAutomaticChapterImageView(frame);
      return;
    }

    image.addEventListener("load", () => applyAutomaticChapterImageView(frame), { once: true });
  });
}

async function renderSettings() {
  const user = getUser();
  if (!user) {
    return renderMissing("Sign in to manage account settings.");
  }
  const readerSettings = getReaderSettings(user);

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
        <section class="panel stack">
          <div class="section-header">
            <div>
              <h3>Reader Settings</h3>
              <p class="muted">Tune the reading view for long chapters.</p>
            </div>
          </div>
          <div class="inline-form settings-form">
            <label>
              <span class="muted">Font size</span>
              <input id="reader-font-size-input" type="number" min="14" max="24" value="${readerSettings.fontSize}" />
            </label>
            <label>
              <span class="muted">Line height</span>
              <input id="reader-line-height-input" type="number" min="1.4" max="2.4" step="0.05" value="${readerSettings.lineHeight}" />
            </label>
            <label>
              <span class="muted">Page width</span>
              <input id="reader-width-input" type="number" min="620" max="1200" step="20" value="${readerSettings.width}" />
            </label>
            <button class="ghost-button" data-action="save-reader-settings">Save reader settings</button>
          </div>
          <article
            id="reader-settings-preview"
            class="reader-settings-preview markdown-preview"
            style="--reader-font-size:${readerSettings.fontSize}px;--reader-line-height:${readerSettings.lineHeight};--reader-width:${readerSettings.width}px;"
          >
            <h3>The Candlelit Archive</h3>
            <p>
              Rain tapped against the stained glass while the old librarian unfolded a map
              that smelled of dust, sea salt, and dragon smoke.
            </p>
            <p>
              This sample updates live so you can feel the font size, line height, and page
              width before saving your reader settings.
            </p>
          </article>
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
  let stories = [];
  let editorStories = [];
  let transfers = [];
  let userEmail = "";

  try {
    stories = await state.adapter.listCreatorStories(user?.id);
  } catch (error) {
    console.error("Creator story list failed:", error);
    state.loadError = "Your stories could not be loaded right now.";
  }

  if (user) {
    try {
      userEmail = await resolveCurrentUserEmail();
    } catch (error) {
      console.error("User email resolve failed:", error);
    }
  }

  if (userEmail) {
    try {
      editorStories = await state.adapter.listEditorStories?.(userEmail) ?? [];
    } catch (error) {
      console.error("Editor story list failed:", error);
      state.loadError = "Editor permissions could not be loaded right now.";
    }

    try {
      transfers = await state.adapter.listIncomingStoryTransfers?.(userEmail) ?? [];
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
        <section class="panel stack">
          <div class="section-header">
            <div>
              <h3>Your Stories</h3>
              <p class="muted">Stories where you are the author.</p>
            </div>
            <span class="pill">${filtered.length} story(s)</span>
          </div>
          <div class="story-list">
            ${filtered.length ? filtered.map((story) => renderStoryCard(story, { authorView: true })).join("") : '<div class="empty-state">No stories match this filter yet.</div>'}
          </div>
        </section>
        <section class="panel stack">
          <div class="section-header">
            <div>
              <h3>Editor Permission</h3>
              <p class="muted">Stories where the author has added you as an editor.</p>
            </div>
            <span class="pill">${editorStories.length} story(s)</span>
          </div>
          <div class="story-list">
            ${editorStories.length ? editorStories.map((story) => renderStoryCard(story, { editorView: true })).join("") : '<div class="empty-state">No editor permissions yet.</div>'}
          </div>
        </section>
      </div>
    `,
    "creator",
  );
}

function getCoverMode(item) {
  return ["fit", "stretch"].includes(item?.coverImageMode) ? item.coverImageMode : "fill";
}

function renderCoverMedia(item, options = {}) {
  const coverUrl = item?.coverImageUrl ? getDisplayImageUrl(item.coverImageUrl) : "";
  const coverMode = getCoverMode(item);
  const title = item?.title || options.fallbackTitle || "Untitled";
  return `
    <div class="chapter-cover entity-cover cover-mode-${coverMode} ${coverUrl ? "has-cover" : "no-cover"}">
      ${coverUrl
        ? `<img src="${escapeHtml(coverUrl)}" alt="Cover for ${escapeHtml(title)}" />`
        : `<div class="chapter-cover-placeholder" aria-hidden="true"><span>${options.placeholder ?? "✦"}</span></div>`}
      ${options.badge ?? ""}
    </div>
  `;
}

function renderStoryCard(story, options = {}) {
  const browserView = Boolean(options.browserView);
  const storyUrl = `#/stories/${story.id}${browserView ? "?view=browser" : ""}`;
  return `
    <article class="chapter-card entity-card story-cover-card">
      ${renderCoverMedia(story, {
        placeholder: "◆",
        badge: `<span class="status-pill cover-card-badge">${escapeHtml(story.visibility)}</span>`,
      })}
      <h3 class="chapter-card-title">${escapeHtml(story.title || "Untitled story")}</h3>
      ${options.editorView || browserView ? `<p class="muted entity-card-byline">by ${escapeHtml(story.creatorName)}</p>` : ""}
      <p class="muted chapter-card-date">Updated ${formatDate(story.updatedAt)}</p>
      <div class="chip-row entity-card-tags">
        ${story.tags.map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("")}
      </div>
      <div class="entity-card-meta">
        <span class="pill">${story.arcs.length} arc(s)</span>
      </div>
      ${options.authorView ? `
        <div class="entity-card-actions" aria-label="Story actions">
          <button class="small-button chapter-icon-button danger-icon" title="Delete story" aria-label="Delete story" data-action="delete-story" data-story-id="${story.id}">🗑</button>
        </div>
      ` : ""}
      <a class="primary-button chapter-open-button" href="${storyUrl}"><span aria-hidden="true">&#128214;</span> ${browserView ? "Read Story" : "Open Story"}</a>
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
  return renderStoryCard(story, { browserView: true });
}

function renderEditorChips(story, editable = false) {
  const editors = story.editorEmails ?? [];
  if (!editors.length) {
    return "";
  }

  return `
    <div class="editor-chip-list" aria-label="Story editors">
      ${editors.map((email) => `
        <span class="editor-chip">
          <span>${escapeHtml(email)}</span>
          ${editable ? `
            <button
              class="small-button editor-remove-button"
              type="button"
              title="Remove editor"
              data-action="remove-story-editor"
              data-story-id="${story.id}"
              data-editor-email="${escapeHtml(email)}"
            >🗑</button>
          ` : ""}
        </span>
      `).join("")}
    </div>
  `;
}

async function renderStoryPage(storyId) {
  const story = await state.adapter.getStory(storyId);
  if (!story) {
    return renderMissing("Story not found.");
  }

  const owner = isOwner(story);
  const editable = canEditStory(story);
  const browserView = getRouteQuery().get("view") === "browser";
  const transferPanelOpen = getRouteQuery().get("transfer") === "1";
  const pendingTransfer = story.pendingTransferStatus === "pending" ? story.pendingTransfer : null;
  if (!canReadStory(story)) {
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
            ${browserView && editable ? '<a class="ghost-button" href="#/stories/' + story.id + '">Edit</a>' : ""}
            ${editable && !browserView ? '<button class="ghost-button" data-action="export-story" data-story-id="' + story.id + '">Export</button>' : ""}
            ${owner && !browserView ? '<button class="ghost-button" type="button" data-action="add-story-editor" data-story-id="' + story.id + '">Add an Editor</button>' : ""}
            ${owner && !browserView ? '<button class="ghost-button" type="button" data-action="open-story-transfer" data-story-id="' + story.id + '">Transfer Ownership</button>' : ""}
            ${editable && !browserView ? '<button class="primary-button" data-action="create-arc" data-story-id="' + story.id + '">New arc</button>' : ""}
          </div>
        </div>
        <section class="panel stack">
          <div class="inline-form">
            <input id="story-title-input" value="${escapeHtml(story.title)}" ${editable ? "" : "disabled"} />
            <input id="story-tags-input" value="${escapeHtml(story.tags.join(", "))}" ${editable ? "" : "disabled"} />
            <select id="story-visibility-input" ${editable ? "" : "disabled"}>
              ${["public", "unlisted", "private"].map((value) => `<option value="${value}" ${story.visibility === value ? "selected" : ""}>${value}</option>`).join("")}
            </select>
            ${editable ? '<button class="ghost-button" data-action="save-story-settings" data-story-id="' + story.id + '">Save</button>' : ""}
          </div>
          ${editable && !browserView ? `
            <div class="chapter-cover-control entity-cover-control">
              <label for="story-cover-input">Story cover image</label>
              <input id="story-cover-input" value="${escapeHtml(story.coverImageUrl ?? "")}" placeholder="Paste an Imgur, Pixhost, or direct image URL" />
              <label for="story-cover-mode-input">Cover placement</label>
              <select id="story-cover-mode-input">
                <option value="fill" ${getCoverMode(story) === "fill" ? "selected" : ""}>Fill — cover the full area, crop if needed</option>
                <option value="fit" ${getCoverMode(story) === "fit" ? "selected" : ""}>Fit — show the complete image without cropping</option>
                <option value="stretch" ${getCoverMode(story) === "stretch" ? "selected" : ""}>Stretch — resize the image to the exact card shape</option>
              </select>
            </div>
          ` : ""}
          <div class="notice">
            <strong>${escapeHtml(story.creatorName)}</strong>
            <div class="muted">Created ${formatDate(story.createdAt)}. Visibility is currently ${escapeHtml(story.visibility)}.</div>
            ${story.editorEmails?.length ? `
              <div class="muted">Editors</div>
              ${renderEditorChips(story, owner && !browserView)}
            ` : ""}
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
        <section class="nested-list arc-card-grid">
          ${story.arcs.length ? story.arcs.map((arc, index) => renderArcCard(arc, story, editable, index, browserView)).join("") : '<div class="empty-state">No arcs yet. Create the first arc to start structuring this story.</div>'}
        </section>
      </div>
    `,
    browserView ? "browser" : editable ? "creator" : "browser",
  );
}

function renderArcCard(arc, story, owner, index, browserView = false) {
  const arcUrl = `#/stories/${story.id}/arcs/${arc.id}${browserView ? "?view=browser" : ""}`;
  return `
    <article class="chapter-card entity-card arc-cover-card">
      ${renderCoverMedia(arc, { placeholder: "◇" })}
      <h3 class="chapter-card-title">${escapeHtml(arc.title || "Untitled arc")}</h3>
      <p class="muted chapter-card-date">Updated ${formatDate(arc.updatedAt)}</p>
      <div class="entity-card-meta">
        <span class="pill">${arc.chapters.length} chapter(s)</span>
      </div>
      ${owner && !browserView ? `
        <div class="entity-card-actions" aria-label="Arc actions">
          <button class="small-button chapter-icon-button" title="Move arc up" aria-label="Move arc up" data-action="move-arc-up" data-story-id="${story.id}" data-index="${index}" ${index === 0 ? "disabled" : ""}>↑</button>
          <button class="small-button chapter-icon-button" title="Move arc down" aria-label="Move arc down" data-action="move-arc-down" data-story-id="${story.id}" data-index="${index}" ${index === story.arcs.length - 1 ? "disabled" : ""}>↓</button>
          <button class="small-button chapter-icon-button danger-icon" title="Delete arc" aria-label="Delete arc" data-action="delete-arc" data-story-id="${story.id}" data-arc-id="${arc.id}">🗑</button>
        </div>
      ` : ""}
      <a class="primary-button chapter-open-button" href="${arcUrl}"><span aria-hidden="true">&#128214;</span> Open Arc</a>
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

function renderCharacterPanel(chapter) {
  const characters = chapter.characters ?? [];
  const markdownMode = getChapterRenderMode(chapter) === "markdown";
  return `
    <section class="panel stack character-panel">
      <div class="section-header">
        <div>
          <h3>Characters</h3>
          <p class="muted">Create reusable speaker colors for dialogue in this chapter.</p>
        </div>
        <span class="pill">${characters.length} character(s)</span>
      </div>
      ${markdownMode ? `
        <div class="character-form">
          <input id="character-name-input" placeholder="Character name, for example Serylda" />
          <label class="character-color-control">
            <span>Main color</span>
            <input id="character-main-color-input" type="color" value="#8f5f35" />
          </label>
          <label class="character-color-control">
            <span>Secondary color</span>
            <input id="character-secondary-color-input" type="color" value="#d7b56d" />
          </label>
          <button class="ghost-button" data-action="add-character" data-chapter-id="${chapter.id}">Add character</button>
        </div>
        <div class="notice character-syntax"><span class="mono">Use [dialog: Serylda] Hello or [dialog: Serylda: ???] Hello.</span></div>
      ` : '<div class="notice">Character dialogue blocks are available in Markdown Mode only.</div>'}
      <div class="character-list">
        ${characters.length ? characters.map((character) => {
          const mainColor = normalizeCharacterColor(character.mainColor, "#8f5f35");
          const secondaryColor = normalizeCharacterColor(character.secondaryColor, "#d7b56d");
          const marker = `[dialog: ${character.name}] `;
          return `
            <article class="character-item" style="--character-main: ${mainColor}; --character-secondary: ${secondaryColor};">
              <div class="character-item-header">
                <div class="character-swatches" aria-label="Character colors">
                  <span class="character-swatch" style="background: ${mainColor}"></span>
                  <span class="character-swatch" style="background: ${secondaryColor}"></span>
                </div>
                <strong>${escapeHtml(character.name)}</strong>
              </div>
              <div class="muted mono">${escapeHtml(marker)}Hello</div>
              ${markdownMode ? `
                <div class="card-actions">
                  <button class="small-button" data-action="insert-dialog-marker" data-character-name="${escapeHtml(character.name)}">Insert dialog</button>
                  <button class="small-button" data-action="copy-dialog-marker" data-character-name="${escapeHtml(character.name)}">Copy</button>
                  <button class="small-button danger-icon" title="Delete character" aria-label="Delete character" data-action="delete-character" data-chapter-id="${chapter.id}" data-character-id="${character.id}">🗑</button>
                </div>
              ` : ""}
            </article>
          `;
        }).join("") : '<div class="empty-state">No characters in this chapter yet.</div>'}
      </div>
    </section>
  `;
}

function renderSoundtrackPanel(chapter) {
  const soundtracks = chapter.soundtracks ?? [];
  const markdownMode = getChapterRenderMode(chapter) === "markdown";
  return `
    <section class="panel stack soundtrack-panel">
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
        <select id="soundtrack-track-type-input" aria-label="Audio track">
          <option value="soundtrack" selected>Soundtrack</option>
          <option value="ambience">Ambience</option>
          <option value="sound-effect">Sound Effect</option>
        </select>
        <button class="ghost-button" data-action="add-soundtrack" data-chapter-id="${chapter.id}">Add soundtrack</button>
      </div>
      <div class="soundtrack-list">
        ${
          soundtracks.length
            ? soundtracks.map((track) => {
              const trackType = normalizeAudioTrackType(track.trackType);
              const multiplier = clampVolumeMultiplier(track.volumeMultiplier);
              return `
                <article class="soundtrack-item track-${trackType}">
                  <div>
                    <strong>${escapeHtml(track.label?.trim() || "Untitled soundtrack")}</strong>
                    <span class="audio-track-pill">${escapeHtml(AUDIO_CHANNEL_CONFIG[trackType].label)}</span>
                    ${markdownMode ? `<div class="muted mono">[music: ${escapeHtml(track.id)}]</div>` : ""}
                    <div class="muted mono">${escapeHtml(track.url ?? "")}</div>
                  </div>
                  <div class="soundtrack-settings">
                    <label>
                      <span>Track</span>
                      <select data-action="update-soundtrack-setting" data-setting="trackType" data-chapter-id="${chapter.id}" data-soundtrack-id="${track.id}">
                        <option value="soundtrack" ${trackType === "soundtrack" ? "selected" : ""}>Soundtrack</option>
                        <option value="ambience" ${trackType === "ambience" ? "selected" : ""}>Ambience</option>
                        <option value="sound-effect" ${trackType === "sound-effect" ? "selected" : ""}>Sound Effect</option>
                      </select>
                    </label>
                    <label>
                      <span>Track volume <output data-track-volume-output="${track.id}">${multiplier}%</output></span>
                      <input type="range" min="0" max="200" step="5" value="${multiplier}" data-action="update-soundtrack-setting" data-setting="volumeMultiplier" data-chapter-id="${chapter.id}" data-soundtrack-id="${track.id}" />
                    </label>
                  </div>
                  <div class="card-actions">
                    <button class="small-button" data-action="preview-soundtrack" data-soundtrack-id="${track.id}" aria-pressed="false">Preview</button>
                    ${markdownMode ? `<button class="small-button" data-action="copy-soundtrack-marker" data-soundtrack-id="${track.id}">Copy cue</button>` : ""}
                    <button class="danger-button" data-action="delete-soundtrack" data-chapter-id="${chapter.id}" data-soundtrack-id="${track.id}">Remove</button>
                  </div>
                </article>
              `;
            }).join("")
            : '<div class="empty-state">No soundtrack links yet.</div>'
        }
      </div>
    </section>
  `;
}

function renderVideoPanel(chapter) {
  const videos = chapter.videos ?? [];
  const markdownMode = getChapterRenderMode(chapter) === "markdown";
  return `
    <section class="panel stack video-panel">
      <div class="section-header">
        <div>
          <h3>Videos</h3>
          <p class="muted">Add YouTube videos and place them inside this markdown chapter.</p>
        </div>
        <span class="pill">${videos.length} video(s)</span>
      </div>
      ${
        markdownMode
          ? `<div class="inline-form video-form">
              <input id="video-label-input" placeholder="Optional label, for example Prophecy Scene" />
              <input id="video-url-input" placeholder="https://youtube.com/watch?v=...&t=20s" />
              <button class="ghost-button" data-action="add-video" data-chapter-id="${chapter.id}">Add video</button>
            </div>`
          : '<div class="notice">Video embeds are available in Markdown Mode only.</div>'
      }
      <div class="video-list">
        ${
          videos.length
            ? videos.map((video) => `
                <article class="video-item">
                  <div>
                    <strong>${escapeHtml(video.label?.trim() || "Untitled video")}</strong>
                    ${markdownMode ? `<div class="muted mono">[video: ${escapeHtml(video.id)}]</div>` : ""}
                    <div class="muted mono">${escapeHtml(video.url ?? "")}</div>
                  </div>
                  <div class="card-actions">
                    ${markdownMode ? `<button class="small-button" data-action="copy-video-marker" data-video-id="${video.id}">Copy embed</button>` : ""}
                    <button class="danger-button" data-action="delete-video" data-chapter-id="${chapter.id}" data-video-id="${video.id}">Remove</button>
                  </div>
                </article>
              `).join("")
            : '<div class="empty-state">No video links yet.</div>'
        }
      </div>
    </section>
  `;
}

function renderChapterEngagementPanel(chapter, editable = false) {
  const user = getUser();
  const reactions = chapter.reactions ?? {};
  const emojis = ["🔥", "😮", "💀", "❤️"];
  const comments = chapter.comments ?? [];
  return `
    <section class="panel stack engagement-panel">
      <div class="section-header">
        <div>
          <h3>Comments / Reactions</h3>
          <p class="muted">Leave table chatter without changing the chapter text.</p>
        </div>
      </div>
      <div class="reaction-row">
        ${emojis.map((emoji) => {
          const users = reactions[emoji] ?? [];
          const active = user?.id && users.includes(user.id);
          return `<button class="ghost-button ${active ? "is-active" : ""}" data-action="toggle-reaction" data-chapter-id="${chapter.id}" data-emoji="${emoji}" ${user ? "" : "disabled"}>${emoji} ${users.length}</button>`;
        }).join("")}
      </div>
      <div class="comment-list">
        ${comments.length ? comments.map((comment, index) => {
          const canDelete = Boolean(user?.id && (editable || comment.userId === user.id));
          return `
            <article class="notice">
              <div class="comment-header">
                <div>
                  <strong>${escapeHtml(comment.userName ?? "Reader")}</strong>
                  <div class="muted">${formatDate(comment.createdAt)}</div>
                </div>
                ${canDelete ? `<button class="small-button danger-icon" type="button" title="Delete comment" aria-label="Delete comment" data-action="delete-comment" data-chapter-id="${chapter.id}" data-comment-id="${escapeHtml(comment.id ?? "")}" data-comment-index="${index}">🗑</button>` : ""}
              </div>
              <p>${escapeHtml(comment.body ?? "")}</p>
            </article>
          `;
        }).join("") : '<div class="empty-state">No comments yet.</div>'}
      </div>
      ${user ? `
        <div class="inline-form">
          <input id="chapter-comment-input" placeholder="Write a comment..." />
          <button class="ghost-button" data-action="add-comment" data-chapter-id="${chapter.id}">Add comment</button>
        </div>
      ` : '<div class="muted">Sign in to react or comment.</div>'}
    </section>
  `;
}

function renderChapterQuickTools(soundtrackQueue, chapter) {
  if (!soundtrackQueue.length) {
    return "";
  }

  const settings = state.soundtrack.chapterId === chapter.id
    ? getCurrentAudioSettings(chapter)
    : normalizeAudioSettings(chapter.audioSettings);
  const volumes = {
    master: settings.masterVolume,
    soundtrack: settings.soundtrackVolume,
    ambience: settings.ambienceVolume,
    "sound-effect": settings.soundEffectVolume,
  };
  const queueTypes = new Set(soundtrackQueue.map((track) => track.trackType));
  const renderVolumeControl = (scope, label, icon) => `
    <button
      class="quick-tool-button volume-button track-${scope} ${state.soundtrack.volumeOpen === scope ? "is-open" : ""}"
      data-action="toggle-audio-volume"
      data-audio-volume="${scope}"
      data-wheel-volume="true"
      style="--volume-fill: ${volumes[scope]}%;"
      title="${escapeHtml(label)} volume ${volumes[scope]}%"
      ${scope !== "master" && !queueTypes.has(scope) ? "disabled" : ""}
    ><span class="quick-tool-icon">${icon}</span></button>
    <div class="volume-popout" data-volume-popout="${scope}" ${state.soundtrack.volumeOpen === scope ? "" : "hidden"}>
      <strong>${escapeHtml(label)}</strong>
      <input class="volume-slider" type="range" min="0" max="100" step="1" value="${volumes[scope]}" data-action="set-audio-volume" data-audio-volume="${scope}" />
      <div class="quick-tool-status" data-audio-volume-value="${scope}">${volumes[scope]}%</div>
    </div>
  `;
  const renderChannelPlay = (type, icon) => {
    const channel = getAudioChannel(type);
    const active = state.soundtrack.chapterId === chapter.id ? getActiveSoundtrack(type) : null;
    return `
      <button
        class="quick-tool-button audio-play-button track-${type} ${active && !channel.paused ? "is-active" : ""}"
        data-action="toggle-audio-channel"
        data-audio-channel="${type}"
        aria-pressed="${String(Boolean(active) && !channel.paused)}"
        title="${escapeHtml(`${channel.paused ? "Play" : "Pause"} ${AUDIO_CHANNEL_CONFIG[type].label}`)}"
        ${queueTypes.has(type) ? "" : "disabled"}
      ><span class="quick-tool-icon">${icon}</span></button>
    `;
  };
  return `
    <div class="quick-tool-stack">
      ${renderVolumeControl("master", "Master", "M")}
      ${renderChannelPlay("soundtrack", "♪")}
      ${renderVolumeControl("soundtrack", "Soundtrack", "S")}
      ${renderChannelPlay("ambience", "≈")}
      ${renderVolumeControl("ambience", "Ambience", "A")}
      ${renderVolumeControl("sound-effect", "Sound Effect", "FX")}
      <div class="audio-channel-status" data-audio-status="soundtrack"></div>
      <div class="audio-channel-status" data-audio-status="ambience"></div>
      <div class="audio-channel-status" data-audio-status="sound-effect"></div>
    </div>
  `;
}

async function renderArcPage(storyId, arcId) {
  const [story, arc] = await Promise.all([state.adapter.getStory(storyId), state.adapter.getArc(arcId)]);
  if (!story || !arc) {
    return renderMissing("Arc not found.");
  }

  const editable = canEditStory(story);
  const browserView = getRouteQuery().get("view") === "browser";
  if (!canReadStory(story)) {
    return renderMissing("This story is private.");
  }

  const phaseSections = (arc.phases ?? []).map((phase) => {
    const visibleChapters = (phase.chapters ?? []).filter((chapter) => canReadChapter(chapter, editable, browserView));
    if (browserView && !visibleChapters.length) {
      return "";
    }
    return `
      <section class="phase-block stack">
        ${renderPhaseHeader(phase, editable, browserView, arc.id)}
        <div class="nested-list chapter-card-grid">
          ${
            visibleChapters.length
              ? visibleChapters.map((chapter, index) => renderChapterCard(chapter, story, arc, editable, index, browserView, phase)).join("")
              : '<div class="empty-state">No chapters in this phase yet.</div>'
          }
        </div>
      </section>
    `;
  }).join("");

  layout(
    `
      <div class="stack">
        ${breadcrumbs([
          [browserView ? "#/browser" : editable ? "#/creator" : "#/browser", browserView ? "Browser" : editable ? "Creator" : "Browser"],
          ["#/stories/" + story.id + (browserView ? "?view=browser" : ""), story.title],
          ["", arc.title],
        ])}
        <div class="page-title">
          <div>
            <h2>${escapeHtml(arc.title)}</h2>
            <p class="muted">Manage the chapter list and reading order for this arc.</p>
          </div>
          <div class="card-actions">
            ${browserView && editable ? '<a class="ghost-button" href="#/stories/' + story.id + '/arcs/' + arc.id + '">Edit</a>' : ""}
            ${editable && !browserView ? '<button class="ghost-button" data-action="create-phase" data-arc-id="' + arc.id + '">New phase</button>' : ""}
            ${editable && !browserView ? '<button class="primary-button" data-action="create-chapter" data-arc-id="' + arc.id + '" data-story-id="' + story.id + '">New chapter</button>' : ""}
          </div>
        </div>
        ${editable && !browserView ? `
          <section class="panel stack">
            <div class="inline-form">
              <input id="arc-title-input" value="${escapeHtml(arc.title)}" />
              <button class="ghost-button" data-action="save-arc-title" data-arc-id="${arc.id}" data-story-id="${story.id}">Save arc</button>
            </div>
            <div class="chapter-cover-control entity-cover-control">
              <label for="arc-cover-input">Arc cover image</label>
              <input id="arc-cover-input" value="${escapeHtml(arc.coverImageUrl ?? "")}" placeholder="Paste an Imgur, Pixhost, or direct image URL" />
              <label for="arc-cover-mode-input">Cover placement</label>
              <select id="arc-cover-mode-input">
                <option value="fill" ${getCoverMode(arc) === "fill" ? "selected" : ""}>Fill — cover the full area, crop if needed</option>
                <option value="fit" ${getCoverMode(arc) === "fit" ? "selected" : ""}>Fit — show the complete image without cropping</option>
                <option value="stretch" ${getCoverMode(arc) === "stretch" ? "selected" : ""}>Stretch — resize the image to the exact card shape</option>
              </select>
            </div>
        </section>` : ""}
        ${phaseSections || '<div class="empty-state">No chapters yet. Add one to begin writing.</div>'}
      </div>
    `,
    browserView ? "browser" : editable ? "creator" : "browser",
  );

  if (editable && !browserView) {
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
  const phases = arc.phases ?? [];
  const phaseIndex = phases.findIndex((entry) => entry.id === phase?.id);
  const isFirstInArc = phaseIndex <= 0 && index === 0;
  const isLastInArc = phaseIndex === phases.length - 1 && index === (phase?.chapters?.length ?? 0) - 1;
  const coverUrl = chapter.coverImageUrl ? getDisplayImageUrl(chapter.coverImageUrl) : "";
  const coverImageMode = ["fit", "stretch"].includes(chapter.coverImageMode) ? chapter.coverImageMode : "fill";
  const published = isChapterPublished(chapter);
  const chapterUrl = `#/stories/${story.id}/arcs/${arc.id}/chapters/${chapter.id}${browserView ? "?view=browser" : ""}`;
  return `
    <article class="chapter-card">
      <div class="chapter-cover cover-mode-${coverImageMode} ${coverUrl ? "has-cover" : "no-cover"}">
        ${coverUrl
          ? `<img src="${escapeHtml(coverUrl)}" alt="Cover for ${escapeHtml(chapter.title || "Untitled chapter")}" />`
          : '<div class="chapter-cover-placeholder" aria-hidden="true"><span>✦</span></div>'}
        <span class="chapter-lock ${published ? "is-published" : "is-draft"}" title="${published ? "Published" : "Draft"}" aria-label="${published ? "Published" : "Draft"}">${published ? "&#128275;" : "&#128274;"}</span>
      </div>
      <h3 class="chapter-card-title">${escapeHtml(chapter.title || "Untitled chapter")}</h3>
      <p class="muted chapter-card-date">Updated ${formatDate(chapter.updatedAt)}</p>
      ${owner && !browserView ? `
        <div class="chapter-card-actions" aria-label="Chapter actions">
          <button class="small-button chapter-icon-button" title="Move chapter up" aria-label="Move chapter up" data-action="move-chapter-up" data-arc-id="${arc.id}" data-chapter-id="${chapter.id}" ${isFirstInArc ? "disabled" : ""}>↑</button>
          <button class="small-button chapter-icon-button" title="Move chapter down" aria-label="Move chapter down" data-action="move-chapter-down" data-arc-id="${arc.id}" data-chapter-id="${chapter.id}" ${isLastInArc ? "disabled" : ""}>↓</button>
          <button class="small-button chapter-icon-button" title="Transfer chapter" aria-label="Transfer chapter" data-action="open-transfer-chapter" data-story-id="${story.id}" data-arc-id="${arc.id}" data-phase-id="${phase?.id ?? ""}" data-chapter-id="${chapter.id}">↗</button>
          <button class="small-button chapter-icon-button danger-icon" title="Delete chapter" aria-label="Delete chapter" data-action="delete-chapter" data-story-id="${story.id}" data-arc-id="${arc.id}" data-chapter-id="${chapter.id}">🗑</button>
        </div>
      ` : ""}
      <a class="primary-button chapter-open-button" href="${chapterUrl}"><span aria-hidden="true">&#128214;</span> Open Chapter</a>
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

  const editable = canEditStory(story);
  const browserView = getRouteQuery().get("view") === "browser";
  if (!canReadStory(story)) {
    return renderMissing("This story is private.");
  }
  if (!canReadChapter(chapter, editable, browserView)) {
    return renderMissing("This chapter is still a draft.");
  }
  const assets = chapter.assets ?? [];
  state.editorCharacters = [...(chapter.characters ?? [])];
  const renderMode = getChapterRenderMode(chapter);
  const htmlBackground = getChapterHtmlBackground(chapter);
  const soundtrackQueue = buildSoundtrackQueue(chapter.soundtracks ?? []);
  const readableChapters = (arc.chapters ?? []).filter((entry) => canReadChapter(entry, editable, browserView));
  const chapterIndex = readableChapters.findIndex((entry) => entry.id === chapterId);
  const previousChapter = chapterIndex > 0 ? readableChapters[chapterIndex - 1] : null;
  const nextChapter = chapterIndex >= 0 && chapterIndex < readableChapters.length - 1 ? readableChapters[chapterIndex + 1] : null;
  const chapterPagerTop = renderChapterPager(story.id, arc.id, previousChapter, nextChapter, browserView);
  const chapterPagerBottom = renderChapterPager(story.id, arc.id, previousChapter, nextChapter, browserView);
  const editorContent = editable && !browserView
    ? `
        <div class="editor-shell">
          <section class="editor-pane">
            <div class="editor-controls">
              <div class="editor-import-bar">
                <div class="card-actions">
                  <button class="ghost-button" type="button" data-action="open-docx-import">Import .docx</button>
                  ${renderMode === "html" ? '<button class="ghost-button" type="button" data-action="switch-markdown-mode">Markdown Mode</button>' : ""}
                </div>
                <span class="muted">${renderMode === "html" ? "HTML mode: Word content is locked. Switch to Markdown Mode to clear it and write normally." : "Markdown mode: import a Word file to switch this chapter to locked HTML mode."}</span>
                ${renderMode === "html" ? `
                  <label class="html-background-control">
                    <span>Background</span>
                    <input id="chapter-html-background-input" type="color" value="${escapeHtml(htmlBackground || "#120f0d")}" data-action="set-html-background" />
                    <button class="small-button" type="button" data-action="clear-html-background" title="Use site background">×</button>
                  </label>
                ` : ""}
                <input id="chapter-render-mode-input" type="hidden" value="${renderMode}" />
                <input id="docx-import-input" type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" hidden />
              </div>
              <input id="chapter-title-input" value="${escapeHtml(chapter.title)}" ${editable ? "" : "disabled"} />
              <div class="chapter-cover-control">
                <label for="chapter-cover-input">Chapter cover image</label>
                <div class="inline-form">
                  <input id="chapter-cover-input" value="${escapeHtml(chapter.coverImageUrl ?? "")}" placeholder="Paste an Imgur, Pixhost, or direct image URL" />
                  <button class="ghost-button" type="button" data-action="clear-chapter-cover" data-chapter-id="${chapter.id}">Clear cover</button>
                </div>
                <label for="chapter-cover-mode-input">Cover placement</label>
                <select id="chapter-cover-mode-input">
                  <option value="fill" ${(chapter.coverImageMode ?? "fill") === "fill" ? "selected" : ""}>Fill — cover the full area, crop if needed</option>
                  <option value="fit" ${chapter.coverImageMode === "fit" ? "selected" : ""}>Fit — show the complete image without cropping</option>
                  <option value="stretch" ${chapter.coverImageMode === "stretch" ? "selected" : ""}>Stretch — resize the image to the exact card shape</option>
                </select>
                <span class="muted">Paste a URL here, or use the cover button on one of the referenced images below.</span>
              </div>
              <div class="inline-form">
                <label class="toggle-row">
                  <input id="chapter-published-input" type="checkbox" ${isChapterPublished(chapter) ? "checked" : ""} />
                  <span>Published for readers</span>
                </label>
                <span class="pill">${isChapterPublished(chapter) ? "Published" : "Draft"}</span>
              </div>
              <textarea id="chapter-body-input" class="markdown-area" ${editable && renderMode !== "html" ? "" : "disabled"}>${escapeHtml(chapter.body)}</textarea>
              <section class="panel stack dm-notes-panel">
                <div class="section-header">
                  <div>
                    <h3>Chapter / DM Notes</h3>
                    <p class="muted">Private notes for authors and editors. Readers never see this.</p>
                  </div>
                </div>
                <textarea id="chapter-dm-notes-input" class="markdown-area notes-area" placeholder="Secret prep, reminders, NPC motives...">${escapeHtml(chapter.dmNotes ?? "")}</textarea>
              </section>
              ${chapterPagerBottom}
              ${renderWordImagePanel(chapter)}
              ${editable ? `
                <div class="panel asset-helper">
                  <div class="section-header">
                    <h3>Image link helper</h3>
                    <span class="pill">Manual Imgur, Pixhost, or external URLs</span>
                  </div>
                  <div class="inline-form asset-form">
                    <input id="asset-name-input" placeholder="Image label, for example cover-art" />
                    <input id="asset-url-input" placeholder="https://i.imgur.com/your-image.jpg or https://pixhost.to/show/..." />
                    <button class="ghost-button" data-action="add-external-asset" data-chapter-id="${chapter.id}">Add image</button>
                  </div>
                  <div class="notice">
                    Upload the image to Imgur or Pixhost first. You can paste a direct image URL, Pixhost Forum small image code, Pixhost HTML small image code, or a Pixhost show page when the browser allows it.
                  </div>
                  <div class="asset-list asset-tray">
                    ${assets.length ? assets.map((asset, index) => renderAssetItem(asset, index, { chapterId: chapter.id, editable: true })).join("") : '<div class="empty-state">No assets in this chapter yet.</div>'}
                  </div>
                </div>
              ` : ""}
              ${editable && !browserView ? renderCharacterPanel(chapter) : ""}
              ${renderVideoPanel(chapter)}
              ${renderSoundtrackPanel(chapter)}
              <div class="notice mono">${escapeHtml(state.saveStatus || "Tip: use `![alt](image-url)` to place pasted external images into the chapter body.")}</div>
            </div>
          </section>
          <section class="preview-pane">
            <h3>Preview</h3>
            ${renderChapterStats(chapter)}
            <div class="markdown-preview" data-preview-mode="${renderMode}">${renderChapterBody(chapter, "*Start writing to preview your chapter here.*", { showMusicCues: true })}</div>
          </section>
        </div>
      `
    : `
        <section class="panel stack">
          <div class="section-header">
            <h3>Reading view</h3>
            <span class="pill">${assets.length} asset(s)</span>
          </div>
          <div class="markdown-preview" data-preview-mode="${renderMode}">${renderChapterBody(chapter, "*This chapter is empty.*", { showMusicCues: browserView })}</div>
        </section>
        ${chapterPagerBottom}
        ${assets.length ? `<section class="panel stack"><h3>Referenced images</h3><div class="asset-list">${assets.map((asset, index) => renderAssetItem(asset, index)).join("")}</div></section>` : ""}
        ${renderChapterEngagementPanel(chapter, editable)}
      `;

  layout(
    `
      <div class="stack">
        ${breadcrumbs([
          [browserView ? "#/browser" : editable ? "#/creator" : "#/browser", browserView ? "Browser" : editable ? "Creator" : "Browser"],
          ["#/stories/" + story.id + (browserView ? "?view=browser" : ""), story.title],
          ["#/stories/" + story.id + "/arcs/" + arc.id + (browserView ? "?view=browser" : ""), arc.title],
          ["", chapter.title || "Untitled chapter"],
        ])}
        <div class="page-title">
          <div>
            <h2>${escapeHtml(chapter.title || "Untitled chapter")}</h2>
            <p class="muted">${editable && !browserView ? "Write in markdown, add image links, and save your draft." : "Read this chapter in a clean, read-only view."}</p>
          </div>
          <div class="card-actions">
            ${browserView && editable ? `<a class="ghost-button" href="#/stories/${story.id}/arcs/${arc.id}/chapters/${chapter.id}">Edit</a>` : ""}
            ${editable && !browserView ? `<a class="ghost-button" href="#/stories/${story.id}/arcs/${arc.id}/chapters/${chapter.id}?view=browser">Full Preview</a>` : ""}
            ${editable && !browserView ? `<button class="primary-button" data-action="save-chapter" data-chapter-id="${chapter.id}">Save</button>` : ""}
          </div>
        </div>
        ${chapterPagerTop}
        ${editorContent}
      </div>
    `,
    browserView ? "browser" : editable ? "creator" : "browser",
    renderChapterQuickTools(soundtrackQueue, chapter),
  );

  if (soundtrackQueue.length) {
    activateSoundtrackQueue(chapter.id, soundtrackQueue, {
      body: chapter.body,
      audioSettings: chapter.audioSettings,
      editorMode: editable && !browserView,
    });
  } else {
    deactivateSoundtrackQueue();
  }
}

function renderAssetItem(asset, index = 0, options = {}) {
  const sourceUrl = asset.url ?? asset.dataUrl ?? "";
  const displayUrl = sourceUrl ? getDisplayImageUrl(sourceUrl) : "";
  const previewable = Boolean(sourceUrl);
  const markdown = `![${asset.name}](${displayUrl})`;
  const actions = options.editable
    ? `
        <div class="asset-actions">
          <button class="small-button asset-action-button" type="button" title="Use as chapter cover" aria-label="Use as chapter cover" data-action="set-chapter-cover" data-chapter-id="${options.chapterId}" data-cover-url="${escapeHtml(displayUrl)}">▣</button>
          <button class="small-button asset-action-button" type="button" title="Copy markdown" data-action="copy-asset-markdown" data-markdown="${escapeHtml(markdown)}">⧉</button>
          <button class="small-button asset-action-button danger-icon" type="button" title="Remove image" data-action="delete-asset" data-chapter-id="${options.chapterId}" data-asset-index="${index}">🗑</button>
        </div>
      `
    : `
        <div class="asset-actions">
          <button class="small-button asset-action-button" type="button" title="Copy markdown" data-action="copy-asset-markdown" data-markdown="${escapeHtml(markdown)}">⧉</button>
        </div>
      `;
  return `
    <article class="asset-item">
      ${actions}
      ${previewable ? `<img src="${escapeHtml(displayUrl)}" alt="${escapeHtml(asset.name)}" />` : ""}
      <strong title="${escapeHtml(asset.name)}">${escapeHtml(asset.name)}</strong>
      <div class="muted mono asset-markdown" title="${escapeHtml(markdown)}">${escapeHtml(markdown)}</div>
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

async function readCoverFormValues(urlInputId, modeInputId, current = {}) {
  const rawUrl = document.querySelector(`#${urlInputId}`)?.value.trim() ?? current.coverImageUrl ?? "";
  const requestedMode = document.querySelector(`#${modeInputId}`)?.value ?? current.coverImageMode ?? "fill";
  return {
    coverImageUrl: rawUrl ? await normalizeExternalImageUrl(rawUrl) : "",
    coverImageMode: ["fit", "stretch"].includes(requestedMode) ? requestedMode : "fill",
  };
}

async function readStoryFormValues(story) {
  return {
    title: document.querySelector("#story-title-input")?.value.trim() ?? "",
    tags: (document.querySelector("#story-tags-input")?.value ?? "")
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean),
    visibility: document.querySelector("#story-visibility-input")?.value ?? "private",
    ...await readCoverFormValues("story-cover-input", "story-cover-mode-input", story),
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
    state.authErrorCode = "";
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
      state.authErrorCode = "";
      state.saveStatus = "Signed in with Firebase.";
      return render();
    } catch (error) {
      console.error("Firebase sign-in failed:", error);
      state.saveStatus = "";
      state.authError = formatAuthError(error);
      state.authErrorCode = error?.code ? String(error.code) : "";
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
    state.authErrorCode = "";
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

  if (code === "auth/invalid-credential" || code === "auth/internal-error") {
    return "Google returned an invalid popup credential. This usually means the Firebase Auth Google link for this account needs repair, or the browser Google session is corrupted.";
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

function isImgurHost(hostname) {
  return hostname === "imgur.com" || hostname === "www.imgur.com" || hostname === "i.imgur.com";
}

function isPixhostHost(hostname) {
  const normalized = hostname.replace(/^www\./i, "").toLowerCase();
  return normalized === "pixhost.to" || normalized === "pixhost.cc" || normalized === "pixho.st" || normalized.endsWith(".pixho.st");
}

function isPixhostShowUrl(parsed) {
  return isPixhostHost(parsed.hostname) && /^\/show\/\d+\/\d+_[^/]+$/i.test(parsed.pathname);
}

function hasImageExtension(parsed) {
  const fileName = parsed.pathname.split("/").filter(Boolean).pop() ?? "";
  return /\.(avif|gif|jpe?g|png|webp)$/i.test(fileName);
}

function getPixhostFullImageFromThumbnailUrl(parsed) {
  const normalizedHost = parsed.hostname.replace(/^www\./i, "").toLowerCase();
  const thumbnailMatch = normalizedHost.match(/^t(\d+)\.pixhost\.(?:to|cc)$/i);
  if (!thumbnailMatch) {
    return "";
  }

  const pathMatch = parsed.pathname.match(/^\/thumbs\/(\d+)\/(\d+)_(.+)$/i);
  if (!pathMatch) {
    return "";
  }

  const [, directoryId, imageId, fileName] = pathMatch;
  return `${parsed.protocol}//img${thumbnailMatch[1]}.pixhost.to/images/${directoryId}/${imageId}_${fileName}${parsed.search}`;
}

function getDisplayImageUrl(value) {
  try {
    const parsed = new URL(String(value ?? ""), window.location.href);
    return getPixhostFullImageFromThumbnailUrl(parsed) || parsed.toString();
  } catch {
    return String(value ?? "");
  }
}

function extractImageUrlFromPastedMarkup(value) {
  const source = String(value ?? "").trim();
  const patterns = [
    /\bsrc=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i,
    /\[img\]([^\[]+)\[\/img\]/i,
    /!\[[^\]]*\]\(([^)]+)\)/i,
  ];

  for (const pattern of patterns) {
    const match = source.match(pattern);
    const candidate = match?.[1] ?? match?.[2] ?? match?.[3] ?? "";
    if (candidate) {
      return candidate.trim();
    }
  }

  const urls = source.match(/https?:\/\/[^\s"'<>[\]()]+/gi) ?? [];
  return urls.find((candidate) => {
    try {
      return hasImageExtension(new URL(candidate));
    } catch {
      return false;
    }
  }) ?? source;
}

function getPixhostDirectImageFromDocument(doc, baseUrl) {
  const selectors = [
    "img.image-img",
    "img#image",
    ".image-img",
    ".image-show img",
    "#show_image img",
    'meta[property="og:image"]',
    'meta[name="twitter:image"]',
    'img[src*="pixhost"]',
    'img[src*="pixho.st"]',
  ];

  for (const selector of selectors) {
    const node = doc.querySelector(selector);
    const rawUrl = node?.getAttribute("src") ?? node?.getAttribute("content");
    if (!rawUrl || rawUrl.startsWith("data:")) {
      continue;
    }

    try {
      const candidate = new URL(rawUrl, baseUrl);
      if (hasImageExtension(candidate) || isPixhostHost(candidate.hostname)) {
        return candidate.toString();
      }
    } catch {
      // Ignore malformed candidates and keep checking the page.
    }
  }

  return "";
}

async function resolvePixhostShowUrl(parsed) {
  let response;
  try {
    response = await fetch(parsed.toString(), { credentials: "include" });
  } catch {
    throw new Error("Pixhost page could not be opened by the browser. Paste Pixhost's Forum small image, HTML small image, or direct image link instead.");
  }

  if (!response.ok) {
    throw new Error("Pixhost page could not be opened. Paste Pixhost's Forum small image, HTML small image, or direct image link instead.");
  }

  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  const directUrl = getPixhostDirectImageFromDocument(doc, parsed.toString());
  if (!directUrl) {
    throw new Error("Pixhost page could not be converted to a direct image. Paste Pixhost's Forum small image, HTML small image, or direct image link instead.");
  }

  return directUrl;
}

async function normalizeExternalImageUrl(value) {
  const url = extractImageUrlFromPastedMarkup(value);
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

  const fileName = parsed.pathname.split("/").filter(Boolean).pop() ?? "";
  const hasExtension = /\.[a-z0-9]{2,5}$/i.test(fileName);
  if (isImgurHost(parsed.hostname) && fileName && !hasExtension) {
    parsed.pathname = `${parsed.pathname}.png`;
  }

  const pixhostFullImageUrl = getPixhostFullImageFromThumbnailUrl(parsed);
  if (pixhostFullImageUrl) {
    return pixhostFullImageUrl;
  }

  if (isPixhostShowUrl(parsed)) {
    return resolvePixhostShowUrl(parsed);
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
  const url = await normalizeExternalImageUrl(urlInput?.value ?? "");
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

function renderExportChapterHtml(story, arc, phase, chapter) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(chapter.title || "Untitled Chapter")}</title>
  <style>
    body { margin: 0; padding: 48px; background: #120f0d; color: #eadfc8; font-family: Georgia, serif; line-height: 1.85; }
    main { max-width: 900px; margin: 0 auto; }
    h1, h2, h3 { color: #d3a24d; }
    img { max-width: 100%; border-radius: 12px; }
    .meta { color: #b8a88e; margin-bottom: 28px; }
    .draft { display: inline-block; padding: 4px 9px; border: 1px solid #8f6230; border-radius: 999px; color: #e2bd7a; }
  </style>
</head>
<body>
  <main>
    <div class="meta">${escapeHtml(story.title)} / ${escapeHtml(arc.title)} / ${escapeHtml(phase.title)} ${isChapterPublished(chapter) ? "" : '<span class="draft">Draft</span>'}</div>
    <h1>${escapeHtml(chapter.title || "Untitled Chapter")}</h1>
    ${renderChapterBody(chapter, "")}
  </main>
</body>
</html>`;
}

async function exportStoryArchive(storyId) {
  const story = await state.adapter.getStory(storyId);
  if (!story) {
    throw new Error("Story not found.");
  }

  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  const storyFolder = zip.folder(sanitizeFileName(story.title, "Story"));

  story.arcs.forEach((arc, arcIndex) => {
    const arcFolder = storyFolder.folder(`${String(arcIndex + 1).padStart(2, "0")} - ${sanitizeFileName(arc.title, "Arc")}`);
    (arc.phases ?? []).forEach((phase, phaseIndex) => {
      const phaseFolder = arcFolder.folder(`${String(phaseIndex + 1).padStart(2, "0")} - ${sanitizeFileName(phase.title, "Phase")}`);
      (phase.chapters ?? []).forEach((chapter, chapterIndex) => {
        const fileName = `${String(chapterIndex + 1).padStart(2, "0")} - ${sanitizeFileName(chapter.title, "Chapter")}.html`;
        phaseFolder.file(fileName, renderExportChapterHtml(story, arc, phase, chapter));
      });
    });
  });

  const blob = await zip.generateAsync({ type: "blob" });
  downloadBlob(blob, `${sanitizeFileName(story.title, "story-export")}.zip`);
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.opacity = "0";
  document.body.append(helper);
  helper.select();
  document.execCommand("copy");
  helper.remove();
}

async function deleteChapterAsset(chapterId, assetIndex) {
  const chapter = await state.adapter.getChapter(chapterId);
  if (!chapter) {
    throw new Error("Chapter not found.");
  }

  const assets = [...(chapter.assets ?? [])];
  if (assetIndex < 0 || assetIndex >= assets.length) {
    throw new Error("Image could not be found.");
  }

  assets.splice(assetIndex, 1);

  const titleInput = document.querySelector("#chapter-title-input");
  const bodyInput = document.querySelector("#chapter-body-input");

  await state.adapter.updateChapter(chapterId, {
    title: titleInput?.value.trim() || chapter.title || "Untitled Chapter",
    body: bodyInput?.value ?? chapter.body ?? "",
    assets,
  });

  state.saveStatus = "Image removed from chapter assets.";
  await render();
}

function replaceWordImagePlaceholder(body, imageIndex, imageUrl) {
  const imageHtml = `<img src="${escapeHtml(imageUrl)}" alt="word-image-${imageIndex}" />`;
  const source = String(body ?? "");
  const modernPattern = new RegExp(`<div\\b(?=[^>]*data-word-image-placeholder=["']${imageIndex}["'])[^>]*>[\\s\\S]*?<\\/div>`, "i");
  if (modernPattern.test(source)) {
    return source.replace(modernPattern, imageHtml);
  }

  const legacyPattern = new RegExp(`<[^>]+>[^<]*\\[IMAGE\\s+${imageIndex}\\s+HERE\\][\\s\\S]*?<\\/[^>]+>`, "i");
  if (legacyPattern.test(source)) {
    return source.replace(legacyPattern, imageHtml);
  }

  return source.replace(new RegExp(`\\[IMAGE\\s+${imageIndex}\\s+HERE\\]`, "i"), imageHtml);
}

async function applyWordImageReplacement(chapterId, imageIndex) {
  const chapter = await state.adapter.getChapter(chapterId);
  if (!chapter) {
    throw new Error("Chapter not found.");
  }

  const input = document.querySelector(`[data-word-image-url="${imageIndex}"]`);
  const url = await normalizeExternalImageUrl(input?.value ?? "");
  const nextBody = replaceWordImagePlaceholder(chapter.body ?? "", imageIndex, url);

  await state.adapter.updateChapter(chapterId, {
    body: nextBody,
    renderMode: "html",
    htmlBackground: getEditorChapterDraft().htmlBackground,
  });

  state.saveStatus = `IMAGE ${imageIndex} replaced.`;
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
      name: profile.name || user.name,
      email: profile.email || user.email,
      penName: profile.penName ?? "",
      structureView: profile.structureView ?? user.structureView ?? "list",
      readerSettings: profile.readerSettings ?? user.readerSettings ?? getReaderSettings(user),
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

  if (action === "toggle-image-view") {
    const frame = actionTarget.closest(".chapter-image-frame");
    if (!frame) {
      return;
    }

    const nextMode = frame.dataset.imageView === "desired" ? "fill" : "desired";
    setChapterImageView(frame, nextMode);
    return;
  }

  if (action === "sign-in-redirect") {
    state.saveStatus = "Opening full-page Google sign-in...";
    state.authError = "";
    state.authErrorCode = "";
    await state.authClient.signInWithRedirect?.();
    return render();
  }

  if (action === "play-music-cue") {
    const trackId = actionTarget.dataset.musicTrigger;
    if (trackId) {
      playSoundtrackById(trackId, {
        source: "button",
        cueIndex: Number(actionTarget.dataset.musicCueIndex ?? -1),
      });
    }
    return;
  }

  if (action === "toggle-login") {
    return showLoginModal();
  }

  if (action === "open-settings") {
    return navigate("/settings");
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
    const story = await state.adapter.getStory(storyId);
    const values = await readStoryFormValues(story);
    await state.adapter.updateStory(storyId, values);
    state.saveStatus = "Story details saved.";
    return render();
  }

  if (action === "add-story-editor") {
    const email = window.prompt("Editor Gmail address");
    if (email === null) {
      return;
    }
    if (!email.trim()) {
      state.saveStatus = "Enter an editor email first.";
      return render();
    }
    const userEmail = normalizeEmail(getUser()?.email);
    const editorEmail = normalizeEmail(email);
    if (userEmail && userEmail === editorEmail) {
      state.saveStatus = "You are already the author of this story.";
      return render();
    }

    await state.adapter.addStoryEditor(actionTarget.dataset.storyId, email);
    state.saveStatus = `Editor added: ${editorEmail}`;
    return render();
  }

  if (action === "remove-story-editor") {
    const email = actionTarget.dataset.editorEmail ?? "";
    if (!email) {
      state.saveStatus = "Editor email could not be found.";
      return render();
    }

    await state.adapter.removeStoryEditor(actionTarget.dataset.storyId, email);
    state.saveStatus = `Editor removed: ${normalizeEmail(email)}`;
    return render();
  }

  if (action === "export-story") {
    try {
      state.saveStatus = "Preparing story export...";
      const statusNode = document.querySelector(".notice .muted");
      if (statusNode) {
        statusNode.textContent = state.saveStatus;
      }
      await exportStoryArchive(actionTarget.dataset.storyId);
      state.saveStatus = "Story export downloaded.";
    } catch (error) {
      state.saveStatus = `Export failed: ${String(error.message || error)}`;
    }
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
    const arc = await state.adapter.getArc(actionTarget.dataset.arcId);
    await state.adapter.updateArc(actionTarget.dataset.arcId, {
      title: document.querySelector("#arc-title-input").value.trim() || "Untitled Arc",
      ...await readCoverFormValues("arc-cover-input", "arc-cover-mode-input", arc),
    });
    state.saveStatus = "Arc details saved.";
    return render();
  }

  if (action === "add-character") {
    const chapter = await state.adapter.getChapter(actionTarget.dataset.chapterId);
    const name = document.querySelector("#character-name-input")?.value.trim() ?? "";
    if (!name) {
      state.saveStatus = "Enter a character name first.";
      return render();
    }
    if (/[:\]]/.test(name)) {
      state.saveStatus = "Character names cannot contain : or ].";
      return render();
    }

    const mainColor = normalizeCharacterColor(
      document.querySelector("#character-main-color-input")?.value,
      "#8f5f35",
    );
    const secondaryColor = normalizeCharacterColor(
      document.querySelector("#character-secondary-color-input")?.value,
      "#d7b56d",
    );
    const characterKey = normalizeCharacterKey(name);
    const existing = (chapter.characters ?? []).find((character) => normalizeCharacterKey(character.name) === characterKey);
    const characters = existing
      ? (chapter.characters ?? []).map((character) => (
        character.id === existing.id ? { ...character, name, mainColor, secondaryColor } : character
      ))
      : [...(chapter.characters ?? []), { id: makeClientId("character"), name, mainColor, secondaryColor }];

    state.editorCharacters = characters;
    await state.adapter.updateChapter(chapter.id, await getChapterEditorPatch(chapter, { characters }));
    state.saveStatus = existing ? `${name}'s colors were updated.` : `${name} was added to this chapter.`;
    return render();
  }

  if (action === "insert-dialog-marker") {
    const textarea = document.querySelector("#chapter-body-input");
    if (!(textarea instanceof HTMLTextAreaElement) || textarea.disabled) {
      state.saveStatus = "Dialogue markers can only be inserted in Markdown Mode.";
      return render();
    }
    const name = actionTarget.dataset.characterName ?? "Character";
    insertTextIntoTextarea(textarea, `[dialog: ${name}] `);
    state.saveStatus = `Inserted a dialogue block for ${name}.`;
    const statusNode = document.querySelector(".notice.mono");
    if (statusNode) {
      statusNode.textContent = state.saveStatus;
    }
    return;
  }

  if (action === "copy-dialog-marker") {
    const name = actionTarget.dataset.characterName ?? "Character";
    const marker = `[dialog: ${name}] `;
    try {
      await copyTextToClipboard(marker);
      state.saveStatus = `Copied dialogue marker for ${name}.`;
    } catch (error) {
      state.saveStatus = `Copy failed. Use this marker manually: ${marker}`;
    }
    const statusNode = document.querySelector(".notice.mono");
    if (statusNode) {
      statusNode.textContent = state.saveStatus;
    }
    return;
  }

  if (action === "delete-character") {
    if (!confirmDelete("character")) {
      return;
    }
    const chapter = await state.adapter.getChapter(actionTarget.dataset.chapterId);
    const characters = (chapter.characters ?? []).filter(
      (character) => character.id !== actionTarget.dataset.characterId,
    );
    state.editorCharacters = characters;
    await state.adapter.updateChapter(chapter.id, await getChapterEditorPatch(chapter, { characters }));
    state.saveStatus = "Character removed. Existing dialogue text was kept and will use neutral colors.";
    return render();
  }

  if (action === "add-soundtrack") {
    const chapter = await state.adapter.getChapter(actionTarget.dataset.chapterId);
    const label = document.querySelector("#soundtrack-label-input")?.value.trim() ?? "";
    const url = document.querySelector("#soundtrack-url-input")?.value.trim() ?? "";
    const trackType = normalizeAudioTrackType(document.querySelector("#soundtrack-track-type-input")?.value);
    const parsed = parseSoundtrackEntry({ id: makeClientId("soundtrack"), label, url, trackType, volumeMultiplier: 100 });
    if (!parsed) {
      state.saveStatus = "Please enter a valid YouTube link.";
      return render();
    }
    const soundtracks = [...(chapter.soundtracks ?? []), {
      id: parsed.id,
      label: parsed.label,
      url: parsed.url,
      trackType: parsed.trackType,
      volumeMultiplier: parsed.volumeMultiplier,
    }];
    await state.adapter.updateChapter(chapter.id, await getChapterEditorPatch(chapter, { soundtracks }));
    state.saveStatus = "Soundtrack added.";
    return render();
  }

  if (action === "copy-soundtrack-marker") {
    const marker = `[music: ${actionTarget.dataset.soundtrackId}]`;
    try {
      await copyTextToClipboard(marker);
      state.saveStatus = `Copied music cue: ${marker}`;
    } catch (error) {
      state.saveStatus = `Copy failed. Use this cue manually: ${marker}`;
    }
    const statusNode = document.querySelector(".notice.mono");
    if (statusNode) {
      statusNode.textContent = state.saveStatus;
    }
    return;
  }

  if (action === "preview-soundtrack") {
    const trackId = actionTarget.dataset.soundtrackId;
    const track = Object.values(state.soundtrack.queues).flat().find((entry) => entry.id === trackId);
    if (!track) {
      state.saveStatus = "This audio track is not available for preview.";
      return render();
    }

    const channel = getAudioChannel(track.trackType);
    if (channel.activeKey === track.id && !channel.paused) {
      pauseCurrentSoundtrack(track.trackType);
      setSoundtrackStatus(track.trackType, `Preview stopped: ${track.label}`);
      return;
    }

    playSoundtrackById(track.id, { source: "button" });
    setSoundtrackStatus(track.trackType, `Previewing: ${track.label}`);
    return;
  }

  if (action === "delete-soundtrack") {
    const chapter = await state.adapter.getChapter(actionTarget.dataset.chapterId);
    await state.adapter.updateChapter(chapter.id, await getChapterEditorPatch(chapter, {
      soundtracks: (chapter.soundtracks ?? []).filter((track) => track.id !== actionTarget.dataset.soundtrackId),
    }));
    state.saveStatus = "Soundtrack removed.";
    return render();
  }

  if (action === "add-video") {
    const chapter = await state.adapter.getChapter(actionTarget.dataset.chapterId);
    const label = document.querySelector("#video-label-input")?.value.trim() ?? "";
    const url = document.querySelector("#video-url-input")?.value.trim() ?? "";
    const parsed = parseVideoEntry({ id: makeClientId("video"), label, url });
    if (!parsed) {
      state.saveStatus = "Please enter a valid YouTube video link.";
      return render();
    }
    const draft = getEditorChapterDraft();
    await state.adapter.updateChapter(chapter.id, {
      title: document.querySelector("#chapter-title-input")?.value.trim() || chapter.title || "Untitled Chapter",
      body: draft.body,
      published: document.querySelector("#chapter-published-input")?.checked ?? isChapterPublished(chapter),
      dmNotes: document.querySelector("#chapter-dm-notes-input")?.value ?? chapter.dmNotes ?? "",
      renderMode: draft.renderMode,
      htmlBackground: draft.htmlBackground,
      videos: [...(chapter.videos ?? []), { id: parsed.id, label: parsed.label, url: parsed.url }],
    });
    state.saveStatus = "Video added. Copy its embed marker into the chapter.";
    return render();
  }

  if (action === "copy-video-marker") {
    const marker = `[video: ${actionTarget.dataset.videoId}]`;
    try {
      await copyTextToClipboard(marker);
      state.saveStatus = `Copied video embed: ${marker}`;
    } catch (error) {
      state.saveStatus = `Copy failed. Use this marker manually: ${marker}`;
    }
    const statusNode = document.querySelector(".notice.mono");
    if (statusNode) {
      statusNode.textContent = state.saveStatus;
    }
    return;
  }

  if (action === "delete-video") {
    const chapter = await state.adapter.getChapter(actionTarget.dataset.chapterId);
    await state.adapter.updateChapter(chapter.id, {
      videos: (chapter.videos ?? []).filter((video) => video.id !== actionTarget.dataset.videoId),
    });
    state.saveStatus = "Video removed.";
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
    const arcBeforeRename = await state.adapter.getArc(actionTarget.dataset.arcId);
    await state.adapter.renamePhase(actionTarget.dataset.arcId, actionTarget.dataset.phaseId, title);
    if (!title.trim()) {
      state.saveStatus = (arcBeforeRename?.phases?.length ?? 0) <= 1
        ? "Only phase restored to Chapters."
        : "Phase deleted. Its chapters were moved into the next phase.";
    } else {
      state.saveStatus = "Phase renamed.";
    }
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
    await state.adapter.moveChapter(
      actionTarget.dataset.arcId,
      actionTarget.dataset.chapterId,
      action === "move-chapter-up" ? "up" : "down",
    );
    return render();
  }

  if (action === "save-chapter") {
    const chapterId = actionTarget.dataset.chapterId;
    const chapter = await state.adapter.getChapter(chapterId);
    const patch = await getChapterEditorPatch(chapter);
    await state.adapter.updateChapter(chapterId, patch);
    state.saveStatus = "Chapter saved.";
    if (patch.published) {
      try {
        const announcement = await sendChapterAnnouncement({
          storyId: state.route.params.storyId,
          arcId: state.route.params.arcId,
          chapterId,
        });
        if (announcement.skipped) {
          state.saveStatus = `Chapter saved. ${announcement.reason}`;
        } else {
          state.saveStatus = announcement.type === "published"
            ? "Chapter saved and its first publication was announced on Discord."
            : "Chapter saved and its update was announced on Discord.";
        }
      } catch (error) {
        state.saveStatus = `Chapter saved, but Discord announcement failed: ${String(error.message || error)}`;
      }
    }
    return render();
  }

  if (action === "set-chapter-cover" || action === "clear-chapter-cover") {
    const chapterId = actionTarget.dataset.chapterId;
    const chapter = await state.adapter.getChapter(chapterId);
    const coverImageUrl = action === "set-chapter-cover" ? actionTarget.dataset.coverUrl : "";
    await state.adapter.updateChapter(chapterId, await getChapterEditorPatch(chapter, { coverImageUrl }));
    state.saveStatus = coverImageUrl ? "Chapter cover updated." : "Chapter cover cleared.";
    return render();
  }

  if (action === "open-docx-import") {
    document.querySelector("#docx-import-input")?.click();
    return;
  }

  if (action === "switch-markdown-mode") {
    if (!window.confirm("Switch to Markdown Mode? This will clear the imported Word HTML from this chapter.")) {
      return;
    }
    await state.adapter.updateChapter(state.route.params.chapterId, {
      body: "",
      renderMode: "markdown",
      htmlBackground: "",
    });
    state.saveStatus = "Switched to Markdown Mode. Imported Word HTML was cleared.";
    return render();
  }

  if (action === "clear-html-background") {
    const input = document.querySelector("#chapter-html-background-input");
    if (input) {
      input.value = "#120f0d";
    }
    const modeInput = document.querySelector("#chapter-render-mode-input");
    if (modeInput) {
      modeInput.value = "html";
    }
    updateChapterPreviewFromEditor();
    state.saveStatus = "HTML background reset to the site background. Click Save to keep this.";
    const statusNode = document.querySelector(".notice.mono");
    if (statusNode) {
      statusNode.textContent = state.saveStatus;
    }
    return;
  }

  if (action === "save-pen-name") {
    const user = getUser();
    const penName = document.querySelector("#pen-name-input").value.trim();
    const profile = await state.adapter.updateUserProfile(user.id, {
      name: user.name,
      email: user.email,
      penName,
      structureView: user.structureView ?? "list",
      readerSettings: user.readerSettings ?? getReaderSettings(user),
    });
    persistSession({
      ...user,
      penName: profile.penName ?? "",
      name: profile.name ?? user.name,
      email: profile.email ?? user.email,
      structureView: profile.structureView ?? user.structureView ?? "list",
      readerSettings: profile.readerSettings ?? user.readerSettings ?? getReaderSettings(user),
    });
    state.saveStatus = penName ? "Pen name saved." : "Pen name cleared. Account name will be used.";
    return render();
  }

  if (action === "save-reader-settings") {
    const user = getUser();
    const readerSettings = {
      fontSize: Number(document.querySelector("#reader-font-size-input")?.value) || 17,
      lineHeight: Number(document.querySelector("#reader-line-height-input")?.value) || 1.85,
      width: Number(document.querySelector("#reader-width-input")?.value) || 920,
    };
    const profile = await state.adapter.updateUserProfile(user.id, {
      name: user.name,
      email: user.email,
      penName: user.penName ?? "",
      structureView: user.structureView ?? "list",
      readerSettings,
    });
    persistSession({
      ...user,
      ...profile,
      readerSettings,
    });
    state.saveStatus = "Reader settings saved.";
    return render();
  }

  if (action === "add-comment") {
    const user = getUser();
    const input = document.querySelector("#chapter-comment-input");
    const body = input?.value.trim() ?? "";
    if (!user || !body) {
      state.saveStatus = "Sign in and write a comment first.";
      return render();
    }
    const chapter = await state.adapter.getChapter(actionTarget.dataset.chapterId);
    try {
      if (state.authClient?.mode === "firebase") {
        await sendChapterEngagement("add-comment", { chapterId: chapter.id, commentBody: body });
      } else {
        await (state.adapter.updateChapterEngagement ?? state.adapter.updateChapter)(chapter.id, {
          comments: [
            ...(chapter.comments ?? []),
            {
              id: makeClientId("comment"),
              userId: user.id,
              userName: getDisplayName(user),
              body,
              createdAt: new Date().toISOString(),
            },
          ],
        });
      }
    } catch (error) {
      state.saveStatus = `Comment failed: ${String(error.message || error)}`;
      return render();
    }
    state.saveStatus = "Comment added.";
    return render();
  }

  if (action === "toggle-reaction") {
    const user = getUser();
    if (!user) {
      state.saveStatus = "Sign in to react.";
      return render();
    }
    const chapter = await state.adapter.getChapter(actionTarget.dataset.chapterId);
    const emoji = actionTarget.dataset.emoji;
    try {
      if (state.authClient?.mode === "firebase") {
        await sendChapterEngagement("toggle-reaction", { chapterId: chapter.id, emoji });
      } else {
        const reactions = { ...(chapter.reactions ?? {}) };
        const users = new Set(reactions[emoji] ?? []);
        if (users.has(user.id)) {
          users.delete(user.id);
        } else {
          users.add(user.id);
        }
        reactions[emoji] = [...users];
        await (state.adapter.updateChapterEngagement ?? state.adapter.updateChapter)(chapter.id, { reactions });
      }
    } catch (error) {
      state.saveStatus = `Reaction failed: ${String(error.message || error)}`;
      return render();
    }
    state.saveStatus = "Reaction updated.";
    return render();
  }

  if (action === "delete-comment") {
    const user = getUser();
    if (!user) {
      state.saveStatus = "Sign in to delete a comment.";
      return render();
    }

    const [chapter, story] = await Promise.all([
      state.adapter.getChapter(actionTarget.dataset.chapterId),
      state.adapter.getStory(state.route.params.storyId),
    ]);
    const comments = [...(chapter.comments ?? [])];
    const commentId = actionTarget.dataset.commentId;
    const fallbackIndex = Number(actionTarget.dataset.commentIndex);
    const commentIndex = commentId
      ? comments.findIndex((comment) => comment.id === commentId)
      : fallbackIndex;
    const comment = comments[commentIndex];
    if (!comment) {
      state.saveStatus = "Comment not found.";
      return render();
    }
    if (comment.userId !== user.id && !canEditStory(story)) {
      state.saveStatus = "Only the commenter or a story editor can delete this comment.";
      return render();
    }

    try {
      if (state.authClient?.mode === "firebase") {
        await sendChapterEngagement("delete-comment", {
          chapterId: chapter.id,
          commentId,
          commentIndex,
        });
      } else {
        comments.splice(commentIndex, 1);
        await (state.adapter.updateChapterEngagement ?? state.adapter.updateChapter)(chapter.id, { comments });
      }
    } catch (error) {
      state.saveStatus = `Comment deletion failed: ${String(error.message || error)}`;
      return render();
    }
    state.saveStatus = "Comment deleted.";
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

  if (action === "copy-asset-markdown") {
    try {
      await copyTextToClipboard(actionTarget.dataset.markdown ?? "");
      state.saveStatus = "Image markdown copied to clipboard.";
    } catch (error) {
      state.saveStatus = `Copy failed: ${String(error.message || error)}`;
    }
    const statusNode = document.querySelector(".notice.mono");
    if (statusNode) {
      statusNode.textContent = state.saveStatus;
    }
    return;
  }

  if (action === "delete-asset") {
    if (!confirmDelete("image")) {
      return;
    }
    try {
      return await deleteChapterAsset(actionTarget.dataset.chapterId, Number(actionTarget.dataset.assetIndex));
    } catch (error) {
      state.saveStatus = String(error.message || error);
      return render();
    }
  }

  if (action === "replace-word-image") {
    try {
      return await applyWordImageReplacement(actionTarget.dataset.chapterId, Number(actionTarget.dataset.imageIndex));
    } catch (error) {
      state.saveStatus = String(error.message || error);
      const statusNode = document.querySelector(".notice.mono");
      if (statusNode) {
        statusNode.textContent = state.saveStatus;
      }
      return;
    }
  }

  if (action === "toggle-audio-channel") {
    const type = normalizeAudioTrackType(actionTarget.dataset.audioChannel);
    if (!getActiveSoundtrack(type)) {
      return;
    }

    if (getAudioChannel(type).paused) {
      playCurrentSoundtrack(type);
    } else {
      pauseCurrentSoundtrack(type);
    }
    return;
  }

  if (action === "toggle-audio-volume") {
    const scope = actionTarget.dataset.audioVolume;
    state.soundtrack.volumeOpen = state.soundtrack.volumeOpen === scope ? "" : scope;
    updateQuickToolButton();
    return;
  }
});

document.addEventListener("change", async (event) => {
  const target = event.target;
  if (
    (target instanceof HTMLInputElement || target instanceof HTMLSelectElement)
    && target.dataset.action === "update-soundtrack-setting"
  ) {
    const chapter = await state.adapter.getChapter(target.dataset.chapterId);
    const soundtracks = (chapter.soundtracks ?? []).map((track) => {
      if (track.id !== target.dataset.soundtrackId) return track;
      if (target.dataset.setting === "trackType") {
        return { ...track, trackType: normalizeAudioTrackType(target.value) };
      }
      return { ...track, volumeMultiplier: clampVolumeMultiplier(target.value) };
    });
    await state.adapter.updateChapter(chapter.id, await getChapterEditorPatch(chapter, { soundtracks }));
    state.saveStatus = "Audio track settings saved.";
    return render();
  }

  if (target instanceof HTMLInputElement && target.id === "docx-import-input") {
    const file = target.files?.[0];
    target.value = "";
    if (!file) {
      return;
    }

    state.saveStatus = "Importing Word file...";
    const statusNode = document.querySelector(".notice.mono");
    if (statusNode) {
      statusNode.textContent = state.saveStatus;
    }

    try {
      await importDocxIntoEditor(file);
    } catch (error) {
      state.saveStatus = `Word import failed: ${String(error.message || error)}`;
      if (statusNode) {
        statusNode.textContent = state.saveStatus;
      }
    }
    return;
  }

});

document.addEventListener("input", (event) => {
  if (
    event.target instanceof HTMLInputElement
    && (
      event.target.id === "reader-font-size-input"
      || event.target.id === "reader-line-height-input"
      || event.target.id === "reader-width-input"
    )
  ) {
    const preview = document.querySelector("#reader-settings-preview");
    if (preview) {
      const fontSize = Number(document.querySelector("#reader-font-size-input")?.value) || 17;
      const lineHeight = Number(document.querySelector("#reader-line-height-input")?.value) || 1.85;
      const width = Number(document.querySelector("#reader-width-input")?.value) || 920;
      preview.style.setProperty("--reader-font-size", `${fontSize}px`);
      preview.style.setProperty("--reader-line-height", String(lineHeight));
      preview.style.setProperty("--reader-width", `${width}px`);
    }
    return;
  }

  if (event.target instanceof HTMLInputElement && event.target.dataset.action === "set-audio-volume") {
    setAudioVolume(event.target.dataset.audioVolume, event.target.value);
    return;
  }

  if (event.target instanceof HTMLInputElement && event.target.dataset.action === "update-soundtrack-setting") {
    const output = document.querySelector(`[data-track-volume-output='${event.target.dataset.soundtrackId}']`);
    if (output) output.textContent = `${clampVolumeMultiplier(event.target.value)}%`;
    return;
  }

  if (event.target instanceof HTMLInputElement && event.target.dataset.action === "set-html-background") {
    updateChapterPreviewFromEditor();
    return;
  }

  if (event.target.id === "chapter-body-input") {
    updateChapterPreviewFromEditor();
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
      state.soundtrack.volumeOpen = "";
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

  event.preventDefault();
  const button = target.closest("[data-wheel-volume='true']");
  adjustAudioVolume(button.dataset.audioVolume, event.deltaY < 0 ? 5 : -5);
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
    try {
      const redirectUser = await state.authClient.getRedirectUser?.();
      if (redirectUser) {
        persistSession({
          id: redirectUser.uid,
          name: redirectUser.displayName || redirectUser.email || "Creator",
          email: redirectUser.email,
          mode: "firebase",
        });
        state.authError = "";
        state.authErrorCode = "";
        state.saveStatus = "Signed in with Firebase.";
      }
    } catch (error) {
      console.error("Firebase redirect sign-in failed:", error);
      state.authError = formatAuthError(error);
      state.authErrorCode = error?.code ? String(error.code) : "";
    }

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
