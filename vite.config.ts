import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub project Pages: /phillips-academy/. For a user/org site at the domain root, set VITE_BASE_PATH=/ in CI.
const base = process.env.VITE_BASE_PATH ?? '/'
const pwa = (p: string) => {
  const b = base.endsWith('/') ? base : `${base}/`
  return b + p.replace(/^\//, '')
}

// https://vitejs.dev/config/
export default defineConfig({
    base,
    publicDir: 'public',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        assetsDir: 'assets',
        chunkSizeWarningLimit: 500,
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    if (id.includes('node_modules/firebase')) return 'vendor-firebase';
                    if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) return 'vendor-react';
                    if (id.includes('node_modules/lucide-react')) return 'vendor-icons';
                }
            }
        }
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
                start_url: pwa(''),
                scope: base.endsWith('/') ? base : `${base}/`,
                icons: [
                    {
                        src: pwa('assets/logo-circle-crop.png'),
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "maskable"
                    },
                    {
                        src: pwa('assets/logo-circle-crop.png'),
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any"
                    },
                    {
                        src: pwa('assets/apple-touch-icon.png'),
                        sizes: "180x180",
                        type: "image/png",
                        purpose: "any"
                    }
                ]
            }
        })
    ]
})
