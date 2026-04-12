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

        manifest: {
          name: "NowSWorld <NWS>",
          short_name: "NowSWorld",
          description: "Social Media App",
          theme_color: "#000000",
          background_color: "#ffffff",
          display: "standalone",
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
          runtimeCaching: [
            {
              // Cache API requests to enable 
              // offline functionality
              urlPattern: /\/api\/.*/,
              handler: "NetworkFirst",
              options: {
                cacheName: "api-cache",
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24, // 1 day
                },
              },
            },
          ],
        },
      }),
    ],

    server: {
      // If in dev => allow all
      // Else => use domain name
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