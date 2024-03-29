import { defineNuxtRouteMiddleware, navigateTo} from '#app'

export default defineNuxtRouteMiddleware((to) => {
    const hasVisited = localStorage.getItem('hasVisited');
    const favoriteCanteenId = localStorage.getItem('favoriteCanteenId');

    if ((favoriteCanteenId === null || favoriteCanteenId === "") && !hasVisited && to.path !== '/welcome') {
        return navigateTo('/welcome');
    } else if (to.path === '/') {
        const favCanteenId = localStorage.getItem('favoriteCanteenId');
        return navigateTo('canteens/' + favCanteenId);
    }

});
