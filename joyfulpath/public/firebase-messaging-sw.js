importScripts('https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/11.2.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: self.FirebaseConfig?.apiKey || "REPLACE_WITH_YOUR_API_KEY",
  authDomain: self.FirebaseConfig?.authDomain || "",
  projectId: self.FirebaseConfig?.projectId || "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: self.FirebaseConfig?.storageBucket || "",
  messagingSenderId: self.FirebaseConfig?.messagingSenderId || "REPLACE_WITH_YOUR_SENDER_ID",
  appId: self.FirebaseConfig?.appId || "REPLACE_WITH_YOUR_APP_ID"
};

try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  /**
   * Handle background notifications
   */
  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    
    const notificationTitle = payload.notification?.title || 'JoyfulPath Notification';
    const notificationOptions = {
      body: payload.notification?.body || '',
      icon: '/logo-192x192.png',
      badge: '/badge-72x72.png',
      tag: payload.data?.category || 'notification',
      requireInteraction: payload.data?.requireInteraction === 'true',
      data: payload.data || {},
      actions: [
        { action: 'open', title: 'Open' },
        { action: 'close', title: 'Close' }
      ]
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });

  /**
   * Handle notification clicks
   */
  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    if (event.action === 'close') return;

    const data = event.notification.data;
    const urlToOpen = data.click_action || '/';

    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  });
} catch (err) {
  console.log('Firebase SW failed to initialize', err);
}
