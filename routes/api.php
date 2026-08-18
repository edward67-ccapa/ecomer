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
    Route::get('/plantillas/{plantilla:slug}/productos', [ProductoApiController::class, 'indexByPlantilla']);
    Route::get('/plantillas/{plantilla:slug}/productos/destacados', [ProductoApiController::class, 'destacadosByPlantilla']);

    // Sitios (Sites)
    Route::get('/sites', [SiteApiController::class, 'index']);
    Route::get('/sites/{dominio}/{site}', [SiteApiController::class, 'showSite']);
    Route::get('/sites/{dominio}/{site}/{seccion}', [SiteApiController::class, 'showSection']);
    Route::get('/sites/{dominio}/{site}/productos', [ProductoApiController::class, 'indexBySite']);
    Route::get('/sites/{dominio}/{site}/productos/destacados', [ProductoApiController::class, 'destacadosBySite']);

    // Productos / Ecommerce
    Route::get('/productos', [ProductoApiController::class, 'index']);
    Route::get('/productos/destacados', [ProductoApiController::class, 'destacados']);
    Route::get('/productos/{producto:slug}', [ProductoApiController::class, 'show']);
    Route::get('/tiendas/{tienda}', [ProductoApiController::class, 'showTienda']);
    Route::get('/tiendas/{tienda}/productos', [ProductoApiController::class, 'indexByTienda']);
});
