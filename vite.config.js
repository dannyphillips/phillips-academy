import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';
// https://vitejs.dev/config/
export default defineConfig({
    base: '/phillips-academy',
    publicDir: 'public',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        assetsDir: 'assets',
        chunkSizeWarningLimit: 1000
    },
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['assets/logo-circle-crop.png'],
            manifest: {
                name: "Phillips Homeschool Academy",
                short_name: "PHA Tasks",
                description: "A task management app for homeschool children",
                theme_color: "#1E3A8A",
                background_color: "#F5F1EA",
                display: "standalone",
                orientation: "portrait",
                start_url: "/phillips-academy/",
                scope: "/phillips-academy/",
                icons: [
                    {
                        src: "/phillips-academy/assets/logo-circle-crop.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "maskable"
                    },
                    {
                        src: "/phillips-academy/assets/logo-circle-crop.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any"
                    },
                    {
                        src: "/phillips-academy/assets/apple-touch-icon.png",
                        sizes: "180x180",
                        type: "image/png",
                        purpose: "any"
                    }
                ]
            },
            devOptions: {
                enabled: true,
                type: 'module',
                navigateFallback: 'index.html'
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
                maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3MB
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    }
                ],
                cleanupOutdatedCaches: true,
                skipWaiting: true,
                clientsClaim: true,
                sourcemap: false,
                navigateFallback: './index.html',
                navigateFallbackDenylist: [/^\/api/, /^\/assets\//], // Don't redirect asset requests
                globIgnores: [
                    '**/assets/**/*',
                    '**/*.map',
                    '**/manifest.webmanifest'
                ]
            }
        }),
        {
            name: 'copy-404',
            closeBundle: function () {
                fs.copyFileSync('public/404.html', 'dist/404.html');
            }
        }
    ],
    define: {
        'process.env': process.env
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx']
    }
});
