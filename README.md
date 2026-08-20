# Ulunavir Tales

Ulunavir Tales is a static single-page app designed for GitHub Pages, with a clean path toward Firebase Auth + Firestore for data and a future Vercel upload backend for chapter assets.

## Current capabilities

- Left sidebar with `Main Menu`, `Creator`, `Browser`, and `Log in`
- Creator flow for:
  - listing stories
  - searching by title
  - filtering by tags
  - creating stories
  - managing arcs inside a story
  - managing chapters inside an arc
  - editing chapter markdown
  - dragging image assets onto a chapter
- Browser flow for public stories, including grouping by creator
- Story visibility modes: `public`, `unlisted`, `private`
- Local demo mode that persists app data in `localStorage`
- Firebase-ready runtime config seam

## File structure

- [index.html](./index.html)
- [src/main.js](./src/main.js)
- [src/data.js](./src/data.js)
- [src/firebase.js](./src/firebase.js)
- [src/styles.css](./src/styles.css)

## Local development

This project now uses Vite for local development and production builds.

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
```

## Firebase mode

Set a global config before `src/main.js` loads:

```html
<script>
  window.STORYFORGE_CONFIG = {
    mode: "firebase",
    firebase: {
      apiKey: "your-key",
      authDomain: "your-project.firebaseapp.com",
      projectId: "your-project-id",
      appId: "your-app-id",
      storageBucket: "your-project.firebasestorage.app"
    }
  };
</script>
```

Firebase mode now uses real Firebase Auth and Firestore. If the Firebase env vars are missing, the app falls back to local demo mode.

Create a `.env` file from [.env.example](./.env.example):

```bash
cp .env.example .env
```

Then fill in your Firebase project values.

## Firestore schema

- `users/{userId}`
- `stories/{storyId}`
- `arcs/{arcId}`
- `chapters/{chapterId}`

Each story stores its `arcIds` in order, and each arc stores its `chapterIds` in order so reordering is preserved.

## Firestore rules

Use [firestore.rules](./firestore.rules) as the starting point:

- public stories are readable by everyone
- unlisted stories are readable by link
- private stories are readable only by the creator
- only the creator can write their stories, arcs, and chapters

## Recommended production storage split

- Firestore:
  - story metadata
  - arc metadata
  - chapter titles
  - chapter markdown body
  - chapter asset metadata
  - visibility settings
- Vercel-backed object storage:
  - uploaded images and future binary assets

Why:

- Firestore is a good fit for structured text and hierarchy metadata.
- Raw images should not be stored in Firestore documents.
- A Vercel upload endpoint can validate the session, store the file, and return a stable public URL for markdown embeds.

## Suggested next backend step

Build a small Vercel upload API that:

1. verifies the signed-in Firebase user
2. accepts chapter image uploads
3. stores the file in object storage
4. returns `{ url, width, height, contentType }`
5. writes asset metadata back to Firestore

Then update chapter saving so dropped files upload first and the editor inserts the returned URLs instead of local `data:` URLs.
