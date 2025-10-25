import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/decisionspinner-mini-app",
  plugins: [react()],
  define: {
    "process.env": {},
  },
  server: {
    port: 5173,
    host: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
