import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

function copyDirSync(src: string, dest: string) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function syncClientDistPlugin(): Plugin {
  return {
    name: "sync-client-dist",
    closeBundle: {
      order: "pre",
      async handler() {
        const distClient = path.resolve(process.cwd(), "dist/client");
        const publicDir = path.resolve(process.cwd(), "public");
        const nitroAssets = path.resolve(
          process.cwd(),
          "node_modules/.nitro/vite/services/ssr/assets",
        );

        fs.mkdirSync(distClient, { recursive: true });
        copyDirSync(publicDir, distClient);

        if (fs.existsSync(nitroAssets)) {
          const distAssets = path.join(distClient, "assets");
          copyDirSync(nitroAssets, distAssets);
        }
      },
    },
  };
}

function postBuildSyncPlugin(): Plugin {
  return {
    name: "post-build-sync",
    closeBundle: {
      order: "post",
      async handler() {
        const distClient = path.resolve(process.cwd(), "dist/client");
        const outputPublic = path.resolve(process.cwd(), ".output/public");
        if (fs.existsSync(distClient) && fs.existsSync(outputPublic)) {
          for (const file of fs.readdirSync(distClient)) {
            if (file.startsWith("sw.js") || file.startsWith("workbox-")) {
              fs.copyFileSync(path.join(distClient, file), path.join(outputPublic, file));
            }
          }
        }
      },
    },
  };
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    tanstackStart({
      server: { entry: "server" },
    }),
    nitro(process.env["VERCEL"] ? { preset: "vercel" } : {}),
    viteReact(),
    syncClientDistPlugin(),
    VitePWA({
      strategies: "generateSW",
      registerType: "autoUpdate",
      injectRegister: null,
      filename: "sw.js",
      outDir: process.env["VERCEL"] ? ".vercel/output/static" : "dist/client",
      devOptions: { enabled: false },
      manifest: false,
      workbox: {
        globDirectory: "dist/client",
        globPatterns: ["**/*.{js,css,html,png,ico,svg,webmanifest,woff2}"],
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: "/offline.html",
        navigateFallbackDenylist: [/^\/api\//],
        additionalManifestEntries: [{ url: "/offline.html", revision: "1" }],
        runtimeCaching: [
          {
            urlPattern: ({ request }: { request: Request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: { cacheName: "leafcheck-pages", networkTimeoutSeconds: 5 },
          },
          {
            urlPattern: ({ url, request }: { url: URL; request: Request }) =>
              url.origin === self.location.origin &&
              ["style", "script", "image", "font"].includes(request.destination),
            handler: "CacheFirst",
            options: {
              cacheName: "leafcheck-assets",
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: /^https:\/\/(api|air-quality-api|geocoding-api)\.open-meteo\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "leafcheck-weather",
              networkTimeoutSeconds: 6,
              expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 6 },
            },
          },
        ],
      },
    }),
    postBuildSyncPlugin(),
  ],
});
