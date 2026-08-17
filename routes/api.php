<?php

use App\Http\Controllers\Api\v1\PlantillaApiController;
use App\Http\Controllers\Api\v1\ProductoApiController;
use App\Http\Controllers\Api\v1\SiteApiController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Plantillas (Templates)
    Route::get('/plantillas', [PlantillaApiController::class, 'index']);
    Route::get('/plantillas/{plantilla:slug}', [PlantillaApiController::class, 'show']);
    Route::get('/plantillas/{plantilla:slug}/preview/{seccion?}', [PlantillaApiController::class, 'preview']);

    // Sitios (Sites)
    Route::get('/sites', [SiteApiController::class, 'index']);
    Route::get('/sites/{dominio}/{site}', [SiteApiController::class, 'showSite']);
    Route::get('/sites/{dominio}/{site}/{seccion}', [SiteApiController::class, 'showSection']);

    // Productos / Ecommerce
    Route::get('/tiendas/{tienda}', [ProductoApiController::class, 'showTienda']);
    Route::get('/tiendas/{tienda}/productos', [ProductoApiController::class, 'indexByTienda']);
    Route::get('/productos/{producto:slug}', [ProductoApiController::class, 'show']);
});
