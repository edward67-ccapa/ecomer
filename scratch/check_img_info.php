<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$p = \App\Models\Pregunta::with('seccion')->find(138);
echo "Pregunta 138: label={$p->label}, tipo={$p->tipo}, seccion={$p->seccion->nombre} (slug={$p->seccion->slug})\n";

$imgRelative = 'storage/plantillas/ecomer/contenido/18a4u9LEWHdfqZfApJBj9fFXm2b6MbzKjUAVZg1n.webp';
$imgPath = public_path($imgRelative);
if (file_exists($imgPath)) {
    $info = getimagesize($imgPath);
    echo "Image path: {$imgPath}\n";
    echo "Dimensions: {$info[0]} x {$info[1]} (aspect ratio: " . round($info[0] / $info[1], 2) . ")\n";
} else {
    echo "File not found at $imgPath\n";
    $search = glob(public_path('storage/plantillas/*/*/*.*'));
    foreach ($search as $f) {
        if (str_contains($f, '18a4u9LE')) {
            $info = getimagesize($f);
            echo "Found at $f: {$info[0]} x {$info[1]}\n";
        }
    }
}
