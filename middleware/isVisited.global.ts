import { defineNuxtRouteMiddleware, navigateTo} from '#app'

export default defineNuxtRouteMiddleware((to) => {
    console.log('to: ', to);
    console.log('Visited: ', localStorage.getItem('hasVisited'));
    console.log('Favorite Canteen: ', localStorage.getItem('favoriteCanteen'));
    console.log('User Role: ', localStorage.getItem('userRole'));
    const hasVisited = localStorage.getItem('hasVisited');

    if (!hasVisited && to.path !== '/welcome') {
        return navigateTo('/welcome');
    }   
});