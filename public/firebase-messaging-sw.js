/* public/firebase-messaging-sw.js */

// Não use `import` aqui
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBmbOSv-VzwquztgfiJ4UQJYivpi1YAlBE",
  authDomain: "sim-med-6881d.firebaseapp.com",
  projectId: "sim-med-6881d",
  storageBucket: "sim-med-6881d.firebasestorage.app",
  messagingSenderId: "978516162485",
  appId: "1:978516162485:web:b4a061e22a85bb5872cbfc",
  measurementId: "G-7752L5YB37"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});