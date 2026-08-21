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

Route::get('/{dominio}/{seccion}', [SitePageController::class, 'show'])->name('sitios.show');
Route::get('/{dominio}', [SitePageController::class, 'redirectToFirst'])->name('sitios.home');
