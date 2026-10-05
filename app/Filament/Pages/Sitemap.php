<?php

namespace App\Filament\Pages;

use App\Models\Plantilla;
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
        $sites = Site::where('estado', 'publicado')->with(['dominio', 'plantilla.secciones'])->get();

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
                    if (! $seccion->activa || strtolower($seccion->slug) === 'nav') {
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
        }

        $plantillas = Plantilla::where('activa', true)->get();
        if ($plantillas->isNotEmpty()) {
            $urls[] = [
                'loc' => "{$baseUrl}/plantillas",
                'tipo' => 'Catálogo de Plantillas',
                'changefreq' => 'weekly',
                'priority' => '0.7',
            ];

            foreach ($plantillas as $plantilla) {
                $urls[] = [
                    'loc' => "{$baseUrl}/plantillas/{$plantilla->slug}",
                    'tipo' => "Plantilla ({$plantilla->nombre})",
                    'changefreq' => 'weekly',
                    'priority' => '0.7',
                ];
            }
        }

        $this->urls = collect($urls)->unique('loc')->values()->all();
    }
}
