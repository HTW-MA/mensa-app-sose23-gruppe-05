let hasVisited = false;
import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { get, createStore } from 'idb-keyval';

export default defineNuxtRouteMiddleware(async (to, from) => {

    const userStore = createStore('userDB', 'userStore');
    const userProfile = await get('userProfile', userStore);
    
    console.log('Actual user profile: ', userProfile);
    if (userProfile === undefined) {
        hasVisited = false;
        console.log('User Profile  undefined, hasVisited: ', hasVisited);
    } else {
        hasVisited = userProfile.hasVisited;
        console.log('User Profile  defined, hasVisited: ', hasVisited);
    }


    if (to.matched.length === 0 && hasVisited === false) {
        console.log('User has not visited the page yet, redirecting to welcome page.')
        return navigateTo('/welcome');
    } else if (to.path === '/' && hasVisited === true) {
        console.log('User has already visited the welcome page, redirecting to favorite canteen page')
        console.log('Actual user profile: ', userProfile);
        return navigateTo(`/canteens/${userProfile.favoriteCanteenId}`);
    };


    if (to.path === '/welcome' && hasVisited === true && userProfile.favoriteCanteenId !== "") {
        console.log('User has already visited the welcome page and has no favorite canteen selected, redirecting to default favorite page')
        return navigateTo('/canteens/null');
    };

    if (to.matched.length > 0 && hasVisited === false && to.path !== '/welcome') {
        console.log('User has not visited the page yet, redirecting to welcome page.')
        return navigateTo('/welcome');
    }


});
