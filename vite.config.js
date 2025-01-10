import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';
// https://vitejs.dev/config/
export default defineConfig({
    base: '/phillips-academy/',
    publicDir: 'public',
    build: {
        assetsDir: 'assets',
        rollupOptions: {
            output: {
                assetFileNames: function (assetInfo) {
                    var extType = assetInfo.name.split('.')[1];
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                        extType = 'img';
                    }
                    return "assets/".concat(extType, "/[name]-[hash][extname]");
                },
            },
        },
        outDir: 'dist',
        emptyOutDir: true,
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
                start_url: "./",
                scope: "./",
                icons: [
                    {
                        src: "./assets/logo-circle-crop.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "any maskable"
                    },
                    {
                        src: "./assets/logo-circle-crop.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any maskable"
                    },
                    {
                        src: "./assets/apple-touch-icon.png",
                        sizes: "180x180",
                        type: "image/png",
                        purpose: "apple touch icon"
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
                navigateFallbackDenylist: [/^\/api/],
                globIgnores: [
                    '**/assets/**/*', // Exclude assets from precaching
                    '**/*.map', // Exclude source maps
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
