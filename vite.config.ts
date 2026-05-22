import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  // Load env variables from the root directory
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: "prompt",

        // Enable Service Worker in dev
        devOptions: {
          enabled: true,
          type: "module",
        },

        manifest: {
          name: "NowSWorld <NSW>",
          short_name: "NowSWorld",
          description: "Social Media PWA",
          theme_color: "#000000",
          background_color: "#ffffff",
          display: "standalone",
          orientation: "portrait",
          start_url: "/",
          icons: [
            {
              src: "/logo-192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/logo-512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },

        workbox: {
          // Inject custom Service Worker script
          importScripts: ["/custom-sw.js"],

          // Exclude API routes and static images/assets from SPA fallback
          navigateFallbackDenylist: [/^\/api/, /^\/.*\.(png|jpg|jpeg|svg|gif|webp|ico|txt)$/i],
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.pathname.startsWith("/api/public"),
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "api-public-cache",
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60, // 1 hour
                },
              },
            },
          ],
        },
      }),
    ],

    server: {
      // If in dev => allow all
      // Else => allowed hosts only
      allowedHosts:
        mode === "development"
          ? true
          : (env.VITE_ALLOWED_HOSTS || "http://localhost:5173")
            .split(",").map(host => host.trim()),

      proxy: {
        "/api": {
          target: env.APP_URL || "http://localhost:3000",
          changeOrigin: true,
          secure: false,
        },
      },
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});