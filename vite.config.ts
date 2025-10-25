import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import mkcert from "vite-plugin-mkcert"; // Import mkcert if using https locally

// https://vitejs.dev/config/
export default defineConfig({
  base: "/decision-spin-app/", // Ensure this matches your repo name for GitHub Pages
  plugins: [
    react(),
    // mkcert() // Uncomment if you need HTTPS for local dev (might require setup)
  ],
  define: {
    "process.env": {},
  },
  server: {
    port: 5173,
    host: true,
    // https: true, // Uncomment if using mkcert
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    target: "es2022", // Explicitly set build target to support top-level await
  },
});
