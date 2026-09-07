import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from "plugin-inspect-react-code"

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // Absolute base for Cloudflare Pages custom domains (olhodetandera.com).
  base: "/",
  plugins: [
    // Dev-only inspector — keep it out of the Pages production bundle.
    ...(mode === "production" ? [] : [inspectAttr()]),
    react(),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2022",
    cssMinify: true,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three") || id.includes("@react-three")) {
            return "three"
          }
          if (id.includes("node_modules/gsap") || id.includes("node_modules/lenis")) {
            return "motion"
          }
          if (id.includes("node_modules/framer-motion")) {
            return "framer"
          }
        },
      },
    },
  },
}))
