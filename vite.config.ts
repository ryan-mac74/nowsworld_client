import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  // Load env variables from the root directory
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      // If in dev => allow all
      // Else => use domain name
      allowedHosts: mode === 'development'
        ? true
        : [env.VITE_FRONTEND_URL || "http://localhost:5173"],

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