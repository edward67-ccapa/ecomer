<?php

namespace App\Http\Controllers;

use App\Models\Plantilla;
use App\Models\Site;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $baseUrl = url('/');
        $urls = [];

        // 1. URL Principal del sistema
        $urls[] = [
            'loc' => $baseUrl,
            'lastmod' => now()->toIso8601String(),
            'changefreq' => 'daily',
            'priority' => '1.0',
        ];

        // 2. Sitios publicados y sus secciones
        $sites = Site::where('estado', 'publicado')
            ->with(['dominio', 'plantilla.secciones'])
            ->get();

        foreach ($sites as $site) {
            $dominio = $site->dominio?->nombre ?? $site->slug;
            $siteUrl = "{$baseUrl}/{$dominio}";
            $siteLastMod = $site->updated_at ? $site->updated_at->toIso8601String() : now()->toIso8601String();

            // Página principal del sitio
            $urls[] = [
                'loc' => $siteUrl,
                'lastmod' => $siteLastMod,
                'changefreq' => 'daily',
                'priority' => '0.9',
            ];

            // Secciones dinámicas de la plantilla del sitio
            if ($site->plantilla && $site->plantilla->secciones) {
                foreach ($site->plantilla->secciones as $seccion) {
                    if (! $seccion->activa || strtolower($seccion->slug) === 'nav') {
                        continue;
                    }
                    $urls[] = [
                        'loc' => "{$siteUrl}/{$seccion->slug}",
                        'lastmod' => $seccion->updated_at ? $seccion->updated_at->toIso8601String() : $siteLastMod,
                        'changefreq' => 'weekly',
                        'priority' => '0.8',
                    ];
                }
            }

            // Secciones estándar y legales habilitadas
            $standardSections = [
                'productos',
                'servicios',
                'marcas',
                'catalogo',
                'terminos-y-condiciones',
                'politica-de-privacidad',
                'politica-de-envios',
                'politica-de-devolucion',
            ];

            foreach ($standardSections as $sec) {
                $urls[] = [
                    'loc' => "{$siteUrl}/{$sec}",
                    'lastmod' => $siteLastMod,
                    'changefreq' => 'monthly',
                    'priority' => '0.6',
                ];
            }
        }

        // 3. Catálogo global de Plantillas
        $plantillas = Plantilla::where('activa', true)->get();
        if ($plantillas->isNotEmpty()) {
            $urls[] = [
                'loc' => "{$baseUrl}/plantillas",
                'lastmod' => now()->toIso8601String(),
                'changefreq' => 'weekly',
                'priority' => '0.7',
            ];

            foreach ($plantillas as $plantilla) {
                $urls[] = [
                    'loc' => "{$baseUrl}/plantillas/{$plantilla->slug}",
                    'lastmod' => $plantilla->updated_at ? $plantilla->updated_at->toIso8601String() : now()->toIso8601String(),
                    'changefreq' => 'weekly',
                    'priority' => '0.7',
                ];
            }
        }

        // Desduplicar por 'loc'
        $uniqueUrls = collect($urls)->unique('loc')->values()->all();

        $content = view('sitemap.xml', ['urls' => $uniqueUrls])->render();

        return response($content, 200, [
            'Content-Type' => 'application/xml; charset=utf-8',
        ]);
    }
}
