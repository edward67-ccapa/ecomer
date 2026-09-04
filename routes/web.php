<?php

use App\Http\Controllers\PlantillasController;
use App\Http\Controllers\SitePageController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $site = \App\Models\Site::where('estado', 'publicado')->with('dominio')->first();
    $dominio = $site?->dominio?->nombre ?? 'TortasLucha';
    return redirect()->to("/{$dominio}/Inicio");
})->name('welcome');

Route::get('/plantillas', [PlantillasController::class, 'index'])->name('plantillas.index');

Route::get('/plantillas/{plantilla:slug}/{seccion?}', [PlantillasController::class, 'preview'])
    ->where('seccion', '[a-zA-Z0-9\-]+')
    ->name('plantillas.preview');

Route::get('/storage/{path}', function (string $path) {
    $disk = \Illuminate\Support\Facades\Storage::disk('public');

    $targetFile = null;
    if ($disk->exists($path)) {
        $targetFile = $path;
    } else {
        $filename = basename($path);
        foreach ($disk->allFiles() as $file) {
            if (basename($file) === $filename) {
                $targetFile = $file;
                break;
            }
        }
    }

    if (! $targetFile) {
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        if (in_array($extension, ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'])) {
            $placeholderSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#F3F4F6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9CA3AF" font-family="sans-serif" font-size="16">Imagen no encontrada</text></svg>';
            return response($placeholderSvg, 200, [
                'Content-Type' => 'image/svg+xml',
                'Cache-Control' => 'no-cache',
            ]);
        }
        abort(404);
    }

    $fullPath = $disk->path($targetFile);
    $mimeType = $disk->mimeType($targetFile) ?: 'application/octet-stream';

    return response($disk->get($targetFile), 200, [
        'Content-Type' => $mimeType,
        'Cache-Control' => 'public, max-age=31536000',
    ]);
})->where('path', '.*')->name('storage.local');

Route::get('/{param1}/{param2}/{param3}', [SitePageController::class, 'show'])->name('sitios.show3');
Route::get('/{dominio}/{seccion}', [SitePageController::class, 'show'])->name('sitios.show');
Route::get('/{dominio}', [SitePageController::class, 'redirectToFirst'])->name('sitios.home');

