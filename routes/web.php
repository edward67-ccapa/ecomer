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

Route::get('/{param1}/{param2}/catalogo/descargar-pdf', [SitePageController::class, 'descargarCatalogo'])->name('catalogo.descargar2');
Route::get('/{dominio}/catalogo/descargar-pdf', [SitePageController::class, 'descargarCatalogo'])->name('catalogo.descargar1');

Route::get('/{param1}/{param2}/{param3}', [SitePageController::class, 'show'])->name('sitios.show3');
Route::get('/{dominio}/{seccion}', [SitePageController::class, 'show'])->name('sitios.show');
Route::get('/{dominio}', [SitePageController::class, 'redirectToFirst'])->name('sitios.home');
