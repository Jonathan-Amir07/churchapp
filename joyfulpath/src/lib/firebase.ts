import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "mock-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mock-auth-domain",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mock-project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mock-storage-bucket",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "mock-sender-id",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "mock-app-id"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const requestForToken = async () => {
  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn('[Firebase] Messaging not supported in this browser.');
      return null;
    }

    if (!process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY) {
      console.warn('[Firebase] Missing VAPID key in environment variables.');
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('[Firebase] Notification permission not granted.');
      return null;
    }

    const registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js') 
      || await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      
    if (!registration) {
      console.warn('[Firebase] Service Worker registration failed.');
      return null;
    }

    const messaging = getMessaging(app);
    const currentToken = await getToken(messaging, { 
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration
    });
    
    if (currentToken) {
      console.log('Firebase token retrieved successfully.');
      return currentToken;
    } else {
      console.warn('[Firebase] No registration token available.');
      return null;
    }
  } catch (err: any) {
    console.error('[Firebase] Token retrieval failed:', err.message || err);
    console.error('[Firebase] Full error details:', err);
    return null; // Gracefully fail
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    isSupported().then((supported) => {
      if (supported) {
        const messaging = getMessaging(app);
        onMessage(messaging, (payload) => {
          resolve(payload);
        });
      }
    });
  });

export { app };
