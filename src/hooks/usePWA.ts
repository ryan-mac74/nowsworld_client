import { useEffect, useRef, useState } from "react";
import { registerSW } from "virtual:pwa-register";

export default function usePWA() {
  const updateSWRef = useRef<((reloadPage?: boolean) => Promise<void>) | null>(null);
  const [needRefresh, setNeedRefresh] = useState(false);

  useEffect(() => {
    // Register service worker with custom callbacks
    const update = registerSW({
      onNeedRefresh() {
        console.log("ℹ️ App needs refresh");
        setNeedRefresh(true);
      },
      onOfflineReady() {
        console.log("✅ App ready offline");
      },
    });

    updateSWRef.current = update; // no re-render
  }, []);

  useEffect(() => {
    if (!needRefresh || !updateSWRef.current) {
      return;
    }

    const lastPrompt = localStorage.getItem("pwa-update-dismissed");
    const now = Date.now();

    // Don't prompt again when dismissed within the last 24 hours
    if (lastPrompt && (now - Number(lastPrompt)) < (24 * 60 * 60 * 1000)) {
      return;
    }

    const accepted = confirm("🔄 New version available. Update now?");

    if (accepted) {
      updateSWRef.current(true);
    } else {
      // Save dismissal time
      localStorage.setItem("pwa-update-dismissed", now.toString());
    }
  }, [needRefresh]);
}
