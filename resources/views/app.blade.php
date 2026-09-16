<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color and prevent FOUC image expansion --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }

            img, svg, video, canvas {
                max-width: 100% !important;
                height: auto;
            }

            /* Swiper critical fallback rules to prevent image pop on F5 refresh */
            .swiper {
                width: 100%;
                overflow: hidden;
                display: block;
            }
            .swiper-wrapper {
                display: flex;
                width: 100%;
            }
            .swiper-slide {
                flex-shrink: 0;
                box-sizing: border-box;
            }
            @media (min-width: 480px) {
                .swiper-slide {
                    width: 33.333% !important;
                }
            }
            @media (min-width: 768px) {
                .swiper-slide {
                    width: 25% !important;
                }
            }
            @media (min-width: 1024px) {
                .swiper-slide {
                    width: 20% !important;
                }
            }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx', "resources/js/pages/{$page['component']}.jsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>