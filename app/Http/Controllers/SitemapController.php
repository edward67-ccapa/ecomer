<?php

namespace App\Http\Controllers;

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

        // 2. Sitios publicados y sus rutas/secciones reales
        $sites = Site::where('estado', 'publicado')
            ->with(['dominio', 'plantilla.secciones', 'servicios.servicios', 'marcas', 'tiendas'])
            ->get();

        foreach ($sites as $site) {
            $dominio = $site->dominio?->nombre ?? $site->slug;
            $siteUrl = "{$baseUrl}/{$dominio}";
            $siteLastMod = $site->updated_at ? $site->updated_at->toIso8601String() : now()->toIso8601String();

            // Inicio del sitio
            $urls[] = [
                'loc' => $siteUrl,
                'lastmod' => $siteLastMod,
                'changefreq' => 'daily',
                'priority' => '0.9',
            ];

            // Secciones dinámicas de la plantilla del sitio (nosotros, contacto, etc.)
            if ($site->plantilla && $site->plantilla->secciones) {
                foreach ($site->plantilla->secciones as $seccion) {
                    if (! $seccion->activa || strtolower($seccion->slug) === 'nav' || strtolower($seccion->slug) === 'inicio') {
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

            // Servicios (si el sitio tiene servicios activos)
            if ($site->servicios && $site->servicios->where('activo', true)->isNotEmpty()) {
                $urls[] = [
                    'loc' => "{$siteUrl}/servicios",
                    'lastmod' => $siteLastMod,
                    'changefreq' => 'weekly',
                    'priority' => '0.8',
                ];
            }

            // Productos (si el sitio tiene tienda o productos habilitados)
            $tiendaIds = $site->tiendas->pluck('id')->all();
            if (empty($tiendaIds) && $site->tienda_id) {
                $tiendaIds = [$site->tienda_id];
            }
            if (empty($tiendaIds) && $site->plantilla) {
                $tiendaIds = $site->plantilla->tiendas->pluck('id')->all();
            }

            if (! empty($tiendaIds)) {
                $urls[] = [
                    'loc' => "{$siteUrl}/productos",
                    'lastmod' => $siteLastMod,
                    'changefreq' => 'daily',
                    'priority' => '0.8',
                ];

                $urls[] = [
                    'loc' => "{$siteUrl}/productos?liquidaciones=1",
                    'lastmod' => $siteLastMod,
                    'changefreq' => 'weekly',
                    'priority' => '0.7',
                ];
            }

            // Marcas (si el sitio tiene marcas registradas)
            $marcas = $site->marcas->where('activa', true);
            if ($marcas->isEmpty() && $site->plantilla) {
                $marcas = $site->plantilla->marcas->where('activa', true);
            }
            if ($marcas->isNotEmpty()) {
                $urls[] = [
                    'loc' => "{$siteUrl}/marcas",
                    'lastmod' => $siteLastMod,
                    'changefreq' => 'monthly',
                    'priority' => '0.7',
                ];
            }

            // Catálogo (si está activo en sus estilos)
            $estilos = array_replace_recursive($site->plantilla->estilos ?? [], $site->estilos ?? []);
            if (! empty($estilos['catalogo']['activo'])) {
                $urls[] = [
                    'loc' => "{$siteUrl}/catalogo",
                    'lastmod' => $siteLastMod,
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
