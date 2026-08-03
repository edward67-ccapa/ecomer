<?php

use App\Http\Controllers\PlantillasController;
use App\Http\Controllers\SitePageController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('welcome');

Route::get('/plantillas', [PlantillasController::class, 'index'])->name('plantillas.index');

Route::get('/plantillas/{plantilla:slug}/{seccion?}', [PlantillasController::class, 'preview'])
    ->where('seccion', '[a-zA-Z0-9\-]+')
    ->name('plantillas.preview');

Route::get('/{dominio}/{site}/{seccion}', [SitePageController::class, 'show'])->name('sitios.show');
Route::get('/{dominio}/{site}', [SitePageController::class, 'redirectToFirst'])->name('sitios.home');
