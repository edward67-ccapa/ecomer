<?php

namespace App\Http\Controllers;

use App\Models\Site;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $scheme = (request()->secure() || request()->header('X-Forwarded-Proto') === 'https') ? 'https' : 'http';
        $host = request()->getHost();
        $port = request()->getPort();
        $portStr = ($port && ! in_array($port, [80, 443])) ? ":{$port}" : '';

        $baseUrl = "{$scheme}://{$host}{$portStr}";
        $urls = [];

        // 1. URL Principal del sistema
        $urls[] = [
            'loc' => $this->formatUrl($baseUrl),
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
                'loc' => $this->formatUrl($siteUrl),
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
                        'loc' => $this->formatUrl("{$siteUrl}/{$seccion->slug}"),
                        'lastmod' => $seccion->updated_at ? $seccion->updated_at->toIso8601String() : $siteLastMod,
                        'changefreq' => 'weekly',
                        'priority' => '0.8',
                    ];
                }
            }

            // Servicios (si el sitio tiene servicios activos)
            if ($site->servicios && $site->servicios->where('activo', true)->isNotEmpty()) {
                $urls[] = [
                    'loc' => $this->formatUrl("{$siteUrl}/servicios"),
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
                    'loc' => $this->formatUrl("{$siteUrl}/productos"),
                    'lastmod' => $siteLastMod,
                    'changefreq' => 'daily',
                    'priority' => '0.8',
                ];

                $urls[] = [
                    'loc' => $this->formatUrl("{$siteUrl}/productos?liquidaciones=1"),
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
                    'loc' => $this->formatUrl("{$siteUrl}/marcas"),
                    'lastmod' => $siteLastMod,
                    'changefreq' => 'monthly',
                    'priority' => '0.7',
                ];
            }

            // Catálogo (si está activo en sus estilos)
            $estilos = array_replace_recursive($site->plantilla->estilos ?? [], $site->estilos ?? []);
            if (! empty($estilos['catalogo']['activo'])) {
                $urls[] = [
                    'loc' => $this->formatUrl("{$siteUrl}/catalogo"),
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

    /**
     * Format and encode URL strictly according to XML Sitemap standard.
     */
    private function formatUrl(string $url): string
    {
        $parsed = parse_url($url);
        if (! $parsed) {
            return htmlspecialchars($url, ENT_QUOTES | ENT_XML1, 'UTF-8');
        }

        $scheme = $parsed['scheme'] ?? (request()->secure() ? 'https' : 'http');
        $host = $parsed['host'] ?? request()->getHost();
        $port = isset($parsed['port']) ? ":{$parsed['port']}" : '';

        $path = $parsed['path'] ?? '';
        $pathSegments = array_map(fn ($seg) => rawurlencode(rawurldecode($seg)), explode('/', $path));
        $encodedPath = implode('/', $pathSegments);

        $queryStr = '';
        if (! empty($parsed['query'])) {
            parse_str($parsed['query'], $queryParams);
            $queryStr = '?'.http_build_query($queryParams);
        }

        $fullUrl = "{$scheme}://{$host}{$port}{$encodedPath}{$queryStr}";

        return htmlspecialchars($fullUrl, ENT_QUOTES | ENT_XML1, 'UTF-8');
    }
}
