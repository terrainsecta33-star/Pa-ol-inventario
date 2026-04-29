// sw.js — Service Worker para Pañol Inventario PWA
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "AIzaSyCehZgrVcKo6MlX9aKVxL3M-8KoQU0TuWA",
  authDomain:        "panol-inventario.firebaseapp.com",
  projectId:         "panol-inventario",
  storageBucket:     "panol-inventario.firebasestorage.app",
  messagingSenderId: "721748391874",
  appId:             "1:721748391874:web:8d251bfd7f280a9501885b"
});

const messaging = firebase.messaging();

// Notificaciones cuando la app está en BACKGROUND o cerrada
messaging.onBackgroundMessage(payload => {
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body:    body,
    icon:    '/icon-192.png',
    badge:   '/icon-192.png',
    vibrate: [200, 100, 200],
    data:    payload.data
  });
});

// Cache básico para modo offline
const CACHE_NAME = 'panol-v2';
const URLS_CACHE = ['/', '/index.html'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(URLS_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
