import { openDB } from 'idb';
import { RestClient } from '@/services/RestClient';
async function cacheApiData() {
    const db = await openDB('my-app-db', 1, {
        upgrade(db) {
            const store = db.createObjectStore('apiData', { keyPath: 'endpoint' });
            store.createIndex('byEndpoint', 'endpoint');
        },
    });

    const canteens = await RestClient.getAllCanteens();
    await db.put('apiData', { endpoint: 'canteen', data: canteens });

    const startDate = new Date().toISOString().slice(0, 10);
    const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const menuPromises = canteens.map((canteen: any) => {
        return RestClient.getMenueForCanteenInPeriod(canteen.id, startDate, endDate)
            .then(data => {
                // Cache the response for each canteen ID
                return db.put('apiData', { endpoint: `menue/${canteen.id}`, data });
            })
            .catch(error => {
                console.error(`Error caching menu for canteen ID ${canteen.id}:`, error);
            });
    });

    await Promise.all(menuPromises);

    console.log('API data cached successfully!');
}


export default async function ({ app }: { app: any }) {
    await cacheApiData();
}

