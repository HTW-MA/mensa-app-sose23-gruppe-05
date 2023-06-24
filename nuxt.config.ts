// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
    ssr: false,

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
        '@/assets/app.css',
        'bootstrap/dist/css/bootstrap.min.css'
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        '@vite-pwa/nuxt',
        'nuxt-icon'
    ],

    // PWA module configuration: https://go.nuxtjs.dev/pwa
    pwa: {
        manifest: {
            lang: 'en'
        }
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
    },
    devServerHandlers: [],
})
