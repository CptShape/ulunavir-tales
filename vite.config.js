import { defineConfig } from "vite";

export default defineConfig({
  base: "/ulunavir-tales/",
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
        },
      },
    },
  },
});