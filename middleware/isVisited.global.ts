import { defineNuxtRouteMiddleware, navigateTo} from '#app'

export default defineNuxtRouteMiddleware((to) => {
    const hasVisited = localStorage.getItem('hasVisited');

    if (!hasVisited && to.path !== '/welcome') {
        return navigateTo('/welcome');
    }
});
