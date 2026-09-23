<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$p = \App\Models\Plantilla::find(7);
if ($p) {
    // Check how PlantillasController or SitePageController builds the data
    $controller = new \App\Http\Controllers\PlantillasController();
    // Look at how secciones are fetched
    $secciones = $p->secciones()->with(['preguntas.children.children'])->orderBy('orden')->get();
    $respuestas = \App\Models\Respuesta::where('plantilla_id', 7)->whereNull('site_id')->get()->keyBy('pregunta_id');

    foreach ($secciones as $sec) {
        if (str_contains(strtolower($sec->slug), 'hero') || str_contains(strtolower($sec->nombre), 'inicio')) {
            echo "Seccion {$sec->id}: {$sec->nombre} (slug: {$sec->slug})\n";
            foreach ($sec->preguntas as $pr) {
                $val = $respuestas->get($pr->id)?->valor;
                echo "  Pregunta {$pr->id} [{$pr->label}]: " . substr(json_encode($val), 0, 100) . "\n";
            }
        }
    }
}
