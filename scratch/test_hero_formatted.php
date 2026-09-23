<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$p = \App\Models\Plantilla::find(7);
$resp = \App\Models\Respuesta::where('plantilla_id', 7)->whereNull('site_id')->get()->keyBy('pregunta_id');

foreach ($p->secciones->take(4) as $sec) {
    echo "=== Seccion {$sec->id}: {$sec->nombre} (slug: {$sec->slug}) ===\n";
    $formatted = \App\Http\Controllers\SitePageController::formatearPreguntas($sec->preguntas, $resp);
    echo json_encode($formatted, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n\n";
}
