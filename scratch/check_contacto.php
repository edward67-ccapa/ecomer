<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$secciones = \App\Models\Seccion::where('slug', 'contacto')
    ->orWhere('nombre', 'like', '%contacto%')
    ->get();

foreach ($secciones as $s) {
    echo "=== Plantilla ID: {$s->plantilla_id} | Seccion ID: {$s->id} | {$s->nombre} (slug: {$s->slug}) ===" . PHP_EOL;
    foreach ($s->preguntas as $p) {
        echo "  - label: '{$p->label}' | tipo: '{$p->tipo}'" . PHP_EOL;
        if (!empty($p->opciones)) {
            echo "    opciones: " . json_encode($p->opciones, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . PHP_EOL;
        }
    }
}
