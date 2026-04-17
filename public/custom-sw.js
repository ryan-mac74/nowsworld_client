// Listen to push events coming from the backend Web Push protocol
self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }

  const VITE_PROJECT_NAME = import.meta.env.VITE_PROJECT_NAME || "NowSWorld";

  try {
    const data = event.data.json();
    const title = data.title || VITE_PROJECT_NAME;
    const options = {
      body: data.body || "You have a New Notification!",
      icon: "/logo-192.png",
      badge: "/badge-icon.png",
      data: {
        url: data.url || "/", // when notification is clicked
      },
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.error("❌ Error parsing push event data:", err);
  }
});

// Handle notification click events to navigate user to the specified URL
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = new URL(
    event.notification.data.url || "/",
    self.location.origin,
  ).href;

  // Look for an existing window/tab with the same URL
  // If none found => Open a new one
  const promiseChain = clients
    .matchAll({
      type: "window",
      includeUncontrolled: true,
    })
    .then((windowClients) => {
      let matchingClient = null;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];

        if (windowClient.url === urlToOpen) {
          matchingClient = windowClient;
          break;
        }
      }

      if (matchingClient) {
        return matchingClient.focus();
      }

      return clients.openWindow(urlToOpen);
    });

  event.waitUntil(promiseChain);
});
