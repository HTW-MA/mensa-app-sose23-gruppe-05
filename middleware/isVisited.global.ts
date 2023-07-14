import { defineNuxtRouteMiddleware, navigateTo } from '#app'

export default defineNuxtRouteMiddleware((to) => {

    const request = indexedDB.open('userDB', 1);

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('userStore', 'readonly')
        const userStore = transaction.objectStore('userStore');
        const getRequest = userStore.get(1);

        getRequest.onsuccess = (event) => {
            const userProfile = event.target.result;
            const hasVisitedFromUserProfile = userProfile.hasVisited;
            const favoriteCanteenIdFromUserProfile = userProfile.favoriteCanteenId;

            if ((favoriteCanteenIdFromUserProfile === null || favoriteCanteenIdFromUserProfile === "") && !hasVisitedFromUserProfile && to.path !== '/welcome') {
                return navigateTo('/welcome');
            } else if (to.path === '/') {
                return navigateTo('/canteens/' + favoriteCanteenIdFromUserProfile);
            } else if (to.path === '/welcome' && hasVisitedFromUserProfile) {
                return navigateTo('/canteens/' + favoriteCanteenIdFromUserProfile);
            }

        };

        getRequest.onerror = (event) => {
            console.error('Error retrieving canteens from IndexedDB:', event.target.error);
        };
    };

    request.onerror = (event) => {
        console.error('Error opening IndexedDB:', event.target.error);
    };
});
