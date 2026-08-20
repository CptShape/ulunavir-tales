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
};

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

function navigate(hash) {
  const nextHash = `#${hash}`;
  if (window.location.hash === nextHash) {
    render();
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

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
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

function layout(content, activeTab) {
  const user = getUser();
  const authNotice = state.authError
    ? `<div class="notice"><strong>Sign-in error</strong><div class="muted">${escapeHtml(state.authError)}</div></div>`
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
    </div>
  `;

  if (authNotice) {
    const contentRoot = appRoot.querySelector(".content");
    contentRoot.insertAdjacentHTML("afterbegin", authNotice);
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

async function renderHome() {
  layout(
    `
      <div class="stack">
        ${heroCard()}
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
  const chapterIndex = (arc.chapters ?? []).findIndex((entry) => entry.id === chapterId);
  const previousChapter = chapterIndex > 0 ? arc.chapters[chapterIndex - 1] : null;
  const nextChapter = chapterIndex >= 0 && chapterIndex < arc.chapters.length - 1 ? arc.chapters[chapterIndex + 1] : null;
  const chapterPager = renderChapterPager(story.id, arc.id, previousChapter, nextChapter, browserView);
  const editorContent = owner && !browserView
    ? `
        <div class="editor-shell">
          <section class="editor-pane">
            <div class="editor-controls">
              <input id="chapter-title-input" value="${escapeHtml(chapter.title)}" ${owner ? "" : "disabled"} />
              <textarea id="chapter-body-input" class="markdown-area" ${owner ? "" : "disabled"}>${escapeHtml(chapter.body)}</textarea>
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
                    Upload the image to Imgur first, then paste the direct image URL here. This will save the link on the chapter and append the markdown automatically.
                  </div>
                </div>
              ` : ""}
              <div class="asset-list">
                ${assets.length ? assets.map(renderAssetItem).join("") : '<div class="empty-state">No assets in this chapter yet.</div>'}
              </div>
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
        ${chapterPager}
        ${editorContent}
        ${chapterPager}
      </div>
    `,
    browserView ? "browser" : owner ? "creator" : "browser",
  );
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
  state.route = parseRoute();

  switch (state.route.name) {
    case "home":
      return renderHome();
    case "creator":
      return renderCreator();
    case "browser":
      return renderBrowser();
    case "settings":
      return renderSettings();
    case "story":
      return renderStoryPage(state.route.params.storyId);
    case "arc":
      return renderArcPage(state.route.params.storyId, state.route.params.arcId);
    case "chapter":
      return renderChapterPage(state.route.params.storyId, state.route.params.arcId, state.route.params.chapterId);
    default:
      return renderMissing("This page does not exist.");
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
      await state.adapter.seedDemoStory?.({
        id: user.uid,
        name: user.displayName || user.email || "Creator",
        email: user.email,
      });
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

  return parsed.toString();
}

async function addExternalAsset(chapterId) {
  const chapter = await state.adapter.getChapter(chapterId);
  if (!chapter) {
    throw new Error("Chapter not found.");
  }

  const nameInput = document.querySelector("#asset-name-input");
  const urlInput = document.querySelector("#asset-url-input");
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
  const nextBody = `${bodyInput?.value ?? chapter.body ?? ""}\n![${name}](${url})`;

  await state.adapter.updateChapter(chapterId, {
    assets: nextAssets,
    body: nextBody,
  });

  state.saveStatus = "External image link added and markdown updated.";
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
  render();
});

async function bootstrap() {
  const authClient = initializeFirebase();
  state.authClient = authClient;
  state.adapter = await createDataAdapter(authClient);

  if (state.authClient.mode === "firebase") {
    state.authClient.watchAuth((user) => {
      if (!user) {
        persistSession(null);
        render();
      } else {
        persistSession({
          id: user.uid,
          name: user.displayName || user.email || "Creator",
          email: user.email,
          mode: "firebase",
        });
        syncUserProfile().finally(() => render());
      }
    });
  } else if (state.currentUser?.id) {
    await syncUserProfile();
  }

  if (!window.location.hash) {
    navigate("/");
  } else {
    render();
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
