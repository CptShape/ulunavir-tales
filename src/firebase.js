import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const DEFAULT_CONFIG = {
  mode: "local",
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    appId: "",
    storageBucket: "",
    messagingSenderId: "",
  },
};

function getEnvConfig() {
  const env = import.meta.env ?? {};

  return {
    mode: env.VITE_APP_MODE ?? DEFAULT_CONFIG.mode,
    firebase: {
      apiKey: env.VITE_FIREBASE_API_KEY ?? "",
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
      projectId: env.VITE_FIREBASE_PROJECT_ID ?? "",
      appId: env.VITE_FIREBASE_APP_ID ?? "",
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
    },
  };
}

function getConfig() {
  const provided = globalThis.STORYFORGE_CONFIG ?? {};
  const envConfig = getEnvConfig();

  return {
    ...DEFAULT_CONFIG,
    ...envConfig,
    ...provided,
    firebase: {
      ...DEFAULT_CONFIG.firebase,
      ...envConfig.firebase,
      ...(provided.firebase ?? {}),
    },
  };
}

function isFirebaseConfigured(config) {
  return config.mode === "firebase" && Boolean(config.firebase.projectId && config.firebase.apiKey && config.firebase.appId);
}

export function initializeFirebase() {
  const config = getConfig();

  if (!isFirebaseConfigured(config)) {
    return {
      mode: "local",
      auth: null,
      db: null,
      signIn: async () => null,
      signOut: async () => null,
      watchAuth: (callback) => {
        callback(null);
        return () => {};
      },
    };
  }

  const app = getApps().length ? getApp() : initializeApp(config.firebase);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const provider = new GoogleAuthProvider();

  return {
    mode: "firebase",
    auth,
    db,
    signIn: async () => {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    },
    signOut: async () => signOut(auth),
    watchAuth: (callback) => onAuthStateChanged(auth, callback),
  };
}

export function getRuntimeConfig() {
  return getConfig();
}
