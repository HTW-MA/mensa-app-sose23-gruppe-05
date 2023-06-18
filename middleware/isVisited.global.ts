import { defineNuxtRouteMiddleware, navigateTo} from '#app'

export default defineNuxtRouteMiddleware((to) => {
    console.log('to: ', to);
    console.log('Visited: ', localStorage.getItem('hasVisited'));
    const hasVisited = localStorage.getItem('hasVisited');

    if (!hasVisited && to.path !== '/welcome') {
        return navigateTo('/welcome');
    }   
});