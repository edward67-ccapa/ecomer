<?php

namespace App\Filament\Pages;

use App\Models\Site;
use BackedEnum;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use UnitEnum;

class Sitemap extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedGlobeAlt;

    protected static ?string $navigationLabel = 'Sitemap XML';

    protected static string|UnitEnum|null $navigationGroup = 'Mis sitios';

    protected static ?int $navigationSort = 3;

    protected string $view = 'filament.pages.sitemap';

    public string $sitemapUrl = '';

    public array $urls = [];

    public function mount(): void
    {
        $this->sitemapUrl = url('/sitemap.xml');

        $baseUrl = url('/');
        $sites = Site::where('estado', 'publicado')
            ->with(['dominio', 'plantilla.secciones', 'servicios.servicios', 'marcas', 'tiendas'])
            ->get();

        $urls = [];
        $urls[] = [
            'loc' => $baseUrl,
            'tipo' => 'Principal / Raíz',
            'changefreq' => 'daily',
            'priority' => '1.0',
        ];

        foreach ($sites as $site) {
            $dominio = $site->dominio?->nombre ?? $site->slug;
            $siteUrl = "{$baseUrl}/{$dominio}";

            $urls[] = [
                'loc' => $siteUrl,
                'tipo' => "Sitio ({$site->nombre})",
                'changefreq' => 'daily',
                'priority' => '0.9',
            ];

            if ($site->plantilla && $site->plantilla->secciones) {
                foreach ($site->plantilla->secciones as $seccion) {
                    if (! $seccion->activa || strtolower($seccion->slug) === 'nav' || strtolower($seccion->slug) === 'inicio') {
                        continue;
                    }
                    $urls[] = [
                        'loc' => "{$siteUrl}/{$seccion->slug}",
                        'tipo' => "Sección ({$seccion->nombre})",
                        'changefreq' => 'weekly',
                        'priority' => '0.8',
                    ];
                }
            }

            if ($site->servicios && $site->servicios->where('activo', true)->isNotEmpty()) {
                $urls[] = [
                    'loc' => "{$siteUrl}/servicios",
                    'tipo' => "Servicios ({$site->nombre})",
                    'changefreq' => 'weekly',
                    'priority' => '0.8',
                ];
            }

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
                    'tipo' => "Catálogo Productos ({$site->nombre})",
                    'changefreq' => 'daily',
                    'priority' => '0.8',
                ];

                $urls[] = [
                    'loc' => "{$siteUrl}/productos?liquidaciones=1",
                    'tipo' => "Liquidaciones ({$site->nombre})",
                    'changefreq' => 'weekly',
                    'priority' => '0.7',
                ];
            }

            $marcas = $site->marcas->where('activa', true);
            if ($marcas->isEmpty() && $site->plantilla) {
                $marcas = $site->plantilla->marcas->where('activa', true);
            }
            if ($marcas->isNotEmpty()) {
                $urls[] = [
                    'loc' => "{$siteUrl}/marcas",
                    'tipo' => "Marcas ({$site->nombre})",
                    'changefreq' => 'monthly',
                    'priority' => '0.7',
                ];
            }

            $estilos = array_replace_recursive($site->plantilla->estilos ?? [], $site->estilos ?? []);
            if (! empty($estilos['catalogo']['activo'])) {
                $urls[] = [
                    'loc' => "{$siteUrl}/catalogo",
                    'tipo' => "Descarga Catálogo ({$site->nombre})",
                    'changefreq' => 'weekly',
                    'priority' => '0.7',
                ];
            }
        }

        $this->urls = collect($urls)->unique('loc')->values()->all();
    }
}
