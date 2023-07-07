
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyARpL1Z6-H-g1oC3gWHbRQLLRFLTjx-7qU",
    authDomain: "mensamania-511e4.firebaseapp.com",
    projectId: "mensamania-511e4",
    storageBucket: "mensamania-511e4.appspot.com",
    messagingSenderId: "532145483873",
    appId: "1:532145483873:web:c951dafd1bffa282ce3a20",
    measurementId: "G-LF14FHEVS7"
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


