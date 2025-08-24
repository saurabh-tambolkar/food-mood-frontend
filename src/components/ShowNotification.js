
export const showNotification = (title, body, icon = "/notIcon.png") => {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
    return;
  }

  if (Notification.permission === "granted") {
    new Notification(title, {
      body: body,
      icon: icon, // Small icon in the notification bar
      badge: icon, // (Android-like devices) small monochrome icon
      image: "/banner.jpg", // Big image in notification body
      vibrate: [200, 100, 200], // For mobile/PWA, vibration pattern
      tag: "msg-alert", // Grouping key to avoid duplicate popups
      renotify: true, // If same tag, still notify again
      requireInteraction: false, // Keeps notification open until user dismisses (some browsers)
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        showNotification(title, body, icon); // Retry
      }
    });
  }
};
