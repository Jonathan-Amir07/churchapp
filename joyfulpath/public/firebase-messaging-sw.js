importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

const firebaseConfig = {
  // Config injected or loaded from env
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
  messagingSenderId: "REPLACE_WITH_YOUR_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID"
};

try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: '/icon-192x192.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} catch (err) {
  console.log('Firebase SW failed to initialize', err);
}
