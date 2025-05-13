import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Add public directory configuration
  publicDir: "public",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // Ensure assets are copied
    copyPublicDir: true,
  },
});
