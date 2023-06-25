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
        registerType: 'autoUpdate',
        manifest: {
            theme_color: '#ff992b',
            name: 'MensaMania',
            short_name: 'MM',
            start_url: '/welcome',
            lang: 'de',
            icons: [
                {
                    src: 'icons/icon16x16.png',
                    sizes: '16x16',
                    type: 'image/png',
                },
                {
                    src: 'icons/icon32x32.png',
                    sizes: '32x32',
                    type: 'image/png',
                },
                {
                    src: 'icons/icon64x64.png',
                    sizes: '64x64',
                    type: 'image/png',
                },
                {
                    src: 'icons/icon128x128.png',
                    sizes: '128x128',
                    type: 'image/png',
                },
                {
                    src: 'icons/icon144x144.png',
                    sizes: '144x144',
                    type: 'image/png',
                },
                {
                    src: 'icons/icon256x256.png',
                    sizes: '256x256',
                    type: 'image/png',
                },
                {
                    src: 'icons/icon512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any maskable',
                }
            ],
        },
        workbox: {
            navigateFallback: '/',
            globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        },
        client: {
            installPrompt: true,
            periodicSyncForUpdates: 20,
        },
        devOptions: {
            enabled: true,
            suppressWarnings: true,
            navigateFallbackAllowlist: [/^\/$/],
            type: 'module',
        },
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
    },
    devServerHandlers: [],
})
