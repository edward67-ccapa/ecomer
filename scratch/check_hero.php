<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$sites = \App\Models\Site::with('plantilla')->get();
foreach ($sites as $site) {
    echo "Site: {$site->id} - {$site->nombre} (Plantilla: {$site->plantilla_id})\n";
    $resp = \App\Models\Respuesta::where('site_id', $site->id)->get();
    foreach ($resp as $r) {
        if (str_contains($r->valor, 'lismer') || str_contains($r->valor, 'banner') || str_contains($r->valor, '.png') || str_contains($r->valor, '.jpg') || str_contains($r->valor, '.webp')) {
            echo "  Pregunta {$r->pregunta_id}: {$r->valor}\n";
        }
    }
}

$plantillas = \App\Models\Plantilla::all();
foreach ($plantillas as $p) {
    echo "Plantilla: {$p->id} - {$p->nombre}\n";
    $resp = \App\Models\Respuesta::where('plantilla_id', $p->id)->whereNull('site_id')->get();
    foreach ($resp as $r) {
        if (str_contains($r->valor, 'lismer') || str_contains($r->valor, 'banner') || str_contains($r->valor, '.png') || str_contains($r->valor, '.jpg') || str_contains($r->valor, '.webp')) {
            echo "  Pregunta {$r->pregunta_id}: {$r->valor}\n";
        }
    }
}
