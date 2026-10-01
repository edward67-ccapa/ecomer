<?php

use App\Http\Controllers\PlantillasController;
use App\Http\Controllers\SitePageController;
use App\Models\Site;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;



Route::get('/', function () {
    $site = Site::where('estado', 'publicado')->with('dominio')->first();
    $dominio = $site?->dominio?->nombre ?? 'TortasLucha';

    return redirect()->to("/{$dominio}/Inicio");
})->name('welcome');

Route::get('/plantillas', [PlantillasController::class, 'index'])->name('plantillas.index');

Route::get('/plantillas/{plantilla:slug}/catalogo/descargar-pdf', [PlantillasController::class, 'descargarCatalogo'])->name('plantillas.descargarCatalogo');

Route::get('/plantillas/{plantilla:slug}/{seccion?}', [PlantillasController::class, 'preview'])
    ->where('seccion', '[a-zA-Z0-9\-]+')
    ->name('plantillas.preview');

Route::get('/storage/{path}', function (string $path) {
    $cleanPath = ltrim($path, '/');
    $filename = basename($cleanPath);

    $candidatePaths = [
        storage_path('app/public/' . $cleanPath),
        public_path('storage/' . $cleanPath),
        storage_path($cleanPath),
    ];

    $resolvedPath = null;
    foreach ($candidatePaths as $candidate) {
        if (file_exists($candidate) && is_file($candidate)) {
            $resolvedPath = $candidate;
            break;
        }
    }

    if (! $resolvedPath) {
        $searchDirs = [
            storage_path('app/public'),
            storage_path('sites'),
            storage_path('productos'),
            storage_path(),
            public_path('storage'),
        ];

        foreach ($searchDirs as $dir) {
            if (is_dir($dir)) {
                try {
                    $iterator = new RecursiveIteratorIterator(
                        new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS)
                    );
                    foreach ($iterator as $file) {
                        if ($file->isFile() && $file->getFilename() === $filename) {
                            $resolvedPath = $file->getRealPath();
                            break 2;
                        }
                    }
                } catch (\Throwable $e) {
                    // Ignore iterator exceptions
                }
            }
        }
    }

    if ($resolvedPath && file_exists($resolvedPath) && is_file($resolvedPath)) {
        $mimeType = @mime_content_type($resolvedPath) ?: 'image/webp';
        return response()->file($resolvedPath, [
            'Content-Type' => $mimeType,
            'Cache-Control' => 'public, max-age=31536000',
        ]);
    }

    $extension = strtolower(pathinfo($cleanPath, PATHINFO_EXTENSION));
    if (in_array($extension, ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'])) {
        $placeholderSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#F3F4F6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9CA3AF" font-family="sans-serif" font-size="16">Imagen no encontrada</text></svg>';

        return response($placeholderSvg, 200, [
            'Content-Type' => 'image/svg+xml',
            'Cache-Control' => 'no-cache',
        ]);
    }

    abort(404);
})->where('path', '.*')->name('storage.local');

Route::get('/limpiar-cache-opcache', function () {
    if (function_exists('opcache_reset')) {
        @opcache_reset();
    }

    $compiledPaths = array_filter(array_unique([
        config('view.compiled'),
        env('VIEW_COMPILED_PATH'),
        storage_path('framework/views'),
        storage_path('framework/cache'),
        storage_path('framework/sessions'),
    ]));

    foreach ($compiledPaths as $path) {
        if ($path && is_dir($path)) {
            $files = glob($path . '/*');
            if (is_array($files)) {
                foreach ($files as $file) {
                    if (is_file($file)) {
                        @unlink($file);
                    }
                }
            }
        }
    }

    \Illuminate\Support\Facades\Artisan::call('optimize:clear');
    \Illuminate\Support\Facades\Artisan::call('view:clear');
    \Illuminate\Support\Facades\Artisan::call('config:clear');
    \Illuminate\Support\Facades\Artisan::call('cache:clear');
    return 'Caché de vistas compilaras (VIEW_COMPILED_PATH), OPcache y Laravel limpiados exitosamente.';
});

Route::get('/comprobar-archivos', function () {
    $filePath = app_path('Filament/Resources/Sites/Schemas/SiteForm.php');
    if (! file_exists($filePath)) {
        return response()->json(['error' => 'El archivo no existe en: ' . $filePath]);
    }
    $content = file_get_contents($filePath);
    $hasSelectMultiple = str_contains($content, "Select::make('tiendas')") && str_contains($content, '->multiple()');
    $hasOldMultiSelect = str_contains($content, "MultiSelect::make('tiendas')");

    return response()->json([
        'ruta_archivo_en_servidor' => $filePath,
        'fecha_ultima_modificacion' => date('Y-m-d H:i:s', filemtime($filePath)),
        'resultado' => $hasSelectMultiple ? '✅ ARCHIVO NUEVO (Usa Select::make multiple)' : ($hasOldMultiSelect ? '❌ ARCHIVO VIEJO (Aún usa MultiSelect::make antiguo)' : 'DESCONOCIDO'),
    ]);
});

Route::get('/{param1}/{param2}/catalogo/descargar-pdf', [SitePageController::class, 'descargarCatalogo'])->name('catalogo.descargar2');
Route::get('/{dominio}/catalogo/descargar-pdf', [SitePageController::class, 'descargarCatalogo'])->name('catalogo.descargar1');

Route::get('/{param1}/{param2}/{param3}', [SitePageController::class, 'show'])->name('sitios.show3');
Route::get('/{dominio}/{seccion}', [SitePageController::class, 'show'])->name('sitios.show');
Route::get('/{dominio}', [SitePageController::class, 'redirectToFirst'])->name('sitios.home');
