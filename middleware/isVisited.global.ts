import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { get, createStore } from 'idb-keyval';

export default defineNuxtRouteMiddleware((to) => {

    const userDB = 'userDB';
    const userStore = createStore('userDB', 'userStore');

    if (to.path !== '/welcome' || to.matched.length === 0) {
        console.log('IndexedDB checking coming from other Pages:');
        get('userProfile', userStore).then((userProfile) => {
            console.log('IndexedDB: userDB userProfile: ', userProfile);
            if (userProfile === undefined) {
                return navigateTo('/welcome', { redirectCode: 301 });
            } else if (userProfile.hasVisited && userProfile.favoriteCanteenId !== null && userProfile.favoriteCanteenId !== "") {
                return navigateTo('/canteens/' + userProfile.favoriteCanteenId, { redirectCode: 301 });
            }
        }).catch((error) => {
            console.error('Error getting userProfile:', error);
        });
    };

     if (to.path === '/welcome') {
       console.log('IndexedDB checking on Welcome Page:');
       get('userProfile', userStore).then((userProfile) => {
        console.log('IndexedDB: userDB userProfile: ', userProfile);
        if (userProfile === undefined) {
            return;
        } else if (userProfile.hasVisited && userProfile.favoriteCanteenId !== null && userProfile.favoriteCanteenId !== "") {
            return navigateTo('/canteens/' + userProfile.favoriteCanteenId, { redirectCode: 301 });
        }
    }).catch((error) => {
        console.error('Error getting userProfile:', error);
    });
    }
});
