// sw.js

import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';
import { precacheAndRoute } from 'workbox-precaching';
import { RestClient } from "~/services/RestClient";

// Precache the necessary resources
precacheAndRoute(self.__WB_MANIFEST || []);

// Register the network-first caching strategy for all routes under https://mensa.projekt-ipa.tech/api/
registerRoute(
    ({ url }) => url.origin === 'https://mensa.projekt-ipa.tech' && url.pathname.startsWith('/api/'),
    new NetworkFirst({
        cacheName: 'api-cache',
        plugins: [
            // Customize cache expiration
        ],
    })
);

// Open a connection to the IndexedDB database
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('offline', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore('canteens', { keyPath: 'id' });
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            resolve(db);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

// Add canteens data to IndexedDB
function addCanteensToDB(canteens, db) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('canteens', 'readwrite');
        const objectStore = transaction.objectStore('canteens');

        transaction.oncomplete = () => {
            resolve();
        };

        transaction.onerror = (event) => {
            reject(event.target.error);
        };

        canteens.forEach((canteen) => {
            objectStore.put(canteen);
        });
    });
}

// Perform API call and cache the response during installation
self.addEventListener('install', (event) => {
    event.waitUntil(
        RestClient.getAllCanteens()
            .then((canteens) => {
                return openDatabase().then((db) => {
                    return addCanteensToDB(canteens, db).then(() => {
                        db.close();
                    });
                });
            })
            .catch((error) => {
                console.error('Error fetching canteens:', error);
            })
    );
});

// DELETE OLD CACHES
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            // Delete old caches
            const deletePromises = cacheNames.map((cacheName) => {
                if (cacheName.startsWith('your-cache-prefix-')) {
                    return caches.delete(cacheName);
                }
            });

            return Promise.all(deletePromises);
        })
    );

    // Trigger the install event again
    self.skipWaiting();
});
