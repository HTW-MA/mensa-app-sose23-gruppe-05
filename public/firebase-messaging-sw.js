
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js');



firebase.initializeApp({
        apiKey: "AIzaSyD2e-6EjpMrnj1FKUxBMLPs4wr2-EM3NQ8",
        authDomain: "mensa-d7a51.firebaseapp.com",
        projectId: "mensa-d7a51",
        storageBucket: "mensa-d7a51.appspot.com",
        messagingSenderId: "12239127205",
        appId: "1:12239127205:web:cc877cd1e9923a2fa6034c",
        measurementId: "G-H9JJ41W0PM"
});

const messaging = firebase.messaging();

self.addEventListener('push', function(event) {
    const payload = event.data.json();
    const { title, body } = payload.data;

    const notificationOptions = {
        body: body || 'Default notification body',
        // Add other notification options as needed
    };

    event.waitUntil(
        self.registration.showNotification(title, notificationOptions)
    );
});

// SELF MESSAGING
self.addEventListener('fetch', function(event) {
    event.respondWith(fetchAndCache(event.request));
});

async function fetchAndCache(request) {
    const cache = await caches.open('background-fetch-cache');
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
}


