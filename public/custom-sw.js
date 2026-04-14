// Listen to push events coming from the backend Web Push protocol
self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }

  try {
    const data = event.data.json();

    const title = data.title || "<NSW> New Update";
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

  // Open the URL specified in the notification data
  const urlToOpen = event.notification.data.url;
  event.waitUntil(clients.openWindow(urlToOpen));
});
