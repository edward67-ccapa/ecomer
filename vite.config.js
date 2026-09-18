import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig } from 'vite';

export default defineConfig({
    esbuild: {
        drop: ['console', 'debugger'],
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules/react-icons')) {
                        return 'vendor-react-icons';
                    }
                    if (id.includes('node_modules/framer-motion')) {
                        return 'vendor-framer-motion';
                    }
                    if (id.includes('node_modules/swiper')) {
                        return 'vendor-swiper';
                    }
                    if (id.includes('node_modules/@inertiajs') || id.includes('node_modules/axios')) {
                        return 'vendor-inertia';
                    }
                },
            },
        },
        chunkSizeWarningLimit: 1000,
    },
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/css/filament/admin/theme.css',
                'resources/js/app.jsx',
            ],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        inertia(),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
});