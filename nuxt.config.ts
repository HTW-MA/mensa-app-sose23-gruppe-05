// https://nuxt.com/docs/api/configuration/nuxt-config


export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            apiKey: '', // can be overridden by NUXT_PUBLIC_API_BASE environment variable
        }
    },
    // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
    ssr: false,

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
        '@/assets/app.css',
        'bootstrap/dist/css/bootstrap.min.css',
        'leaflet/dist/leaflet.css'
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        '~/plugins/firebase.js',
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
        strategies: 'injectManifest',
        manifest: {
            theme_color: '#ff992b',
            name: 'MensaMania',
            short_name: 'MensaMania',
            start_url: '/',
            display: "standalone",
            orientation: "portrait",
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
            swDest: '/sw.js',
            globPatterns: ['**/*.{js,css,html,png,svg,ico,vue}'],
            runtimeCaching: [
                {
                    urlPattern: ({ url }) => url.origin === 'https://mensa.projekt-ipa.tech' && url.pathname.startsWith('/api/'),
                    handler: 'NetworkFirst',
                    options: {
                        cacheName: 'api-cache',
                        expiration: {
                            maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
                        }
                    }
                }
            ],
            importScripts: [
                '/sw.js?apiKey=IxzGn/rZqdwcAEWYiRh7d6+goi+8IjQiwJXNuXcCqcxCF80yUjGYFpjtYhlJZ1mSpermRXL7Iz6jarukJxGsbTpBXfWNAx79H2iDMyWed/zlilSwJ87mI6jMViiYVxzwZJvNo8CptnSn/ECXtJIpcD8tj51fLaydAigxeqz0Vgy1MMs4wV6zX8x62iFP8nN7+B3fIfYHj+73aCM1e9Mqv3oIHIwbZTMK84KeAeMDq/5zL8NaWXOrDlvmmCi04DV9V7d7FPlEVbNeBCsjQOUIOdhbq+3z5G6jTrzjpC/El7EhXohaaiOyFgFJdmDiUrWGmF1VIJdB9QyMRyqZ+HUD9A==',
                '/firebase-messaging-sw.js',],
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
