<?php

use App\Http\Controllers\Api\v1\PlantillaApiController;
use App\Http\Controllers\Api\v1\ProductoApiController;
use App\Http\Controllers\Api\v1\SiteApiController;
use App\Http\Controllers\Api\v1\TikTokApiController;
use Illuminate\Support\Facades\Route;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

Route::options('{any}', function () {
    return response()->json([], 200, [
        'Access-Control-Allow-Origin' => '*',
        'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers' => '*',
    ]);
})->where('any', '.*');

Route::post('/contacto', function (Request $request) {
    $validated = $request->validate([
        'nombre' => 'required|string|max:255',
        'email' => 'nullable|email|max:255',
        'telefono' => 'nullable|string|max:50',
        'fecha' => 'nullable|string|max:50',
        'mensaje' => 'required|string|max:2000',
    ]);

    $nombre = $validated['nombre'];
    $email = $validated['email'] ?? 'No especificado';
    $telefono = $validated['telefono'] ?? 'No especificado';
    $fecha = $validated['fecha'] ?? 'No especificado';
    $mensaje = $validated['mensaje'];

    $cuerpo = "Has recibido un nuevo mensaje desde el formulario de contacto de tu sitio web:\n\n"
        . "👤 Nombre: {$nombre}\n"
        . "📧 Correo del cliente: {$email}\n"
        . "📱 Teléfono: {$telefono}\n"
        . "📅 Fecha del evento/entrega: {$fecha}\n"
        . "💬 Mensaje:\n{$mensaje}\n";

    try {
        $destinatario = config('mail.from.address') ?: env('MAIL_FROM_ADDRESS');

        if (! $destinatario) {
            throw new \Exception('No se ha configurado MAIL_FROM_ADDRESS en el archivo .env');
        }

        Mail::raw($cuerpo, function ($msg) use ($nombre, $destinatario) {
            $msg->to($destinatario)
                ->subject("Nuevo Mensaje de Contacto - {$nombre}");
        });
        return response()->json(['success' => true, 'message' => 'Correo enviado exitosamente.']);
    } catch (\Throwable $e) {
        \Illuminate\Support\Facades\Log::error("Error enviando correo de contacto: " . $e->getMessage());
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});

Route::prefix('v1')->group(function () {
    Route::options('{any}', function () {
        return response()->json([], 200, [
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers' => '*',
        ]);
    })->where('any', '.*');

    // Plantillas (Templates)
    Route::get('/plantillas', [PlantillaApiController::class, 'index']);
    Route::get('/plantillas/{plantilla:slug}', [PlantillaApiController::class, 'show']);
    Route::get('/plantillas/{plantilla:slug}/preview/{seccion?}', [PlantillaApiController::class, 'preview']);
    Route::get('/plantillas/{plantilla:slug}/productos', [ProductoApiController::class, 'indexByPlantilla']);
    Route::get('/plantillas/{plantilla:slug}/productos/destacados', [ProductoApiController::class, 'destacadosByPlantilla']);

    // Sitios (Sites)
    Route::get('/sites', [SiteApiController::class, 'index']);
    Route::get('/sites/{dominio}/productos/destacados', [ProductoApiController::class, 'destacadosBySite']);
    Route::get('/sites/{dominio}/productos', [ProductoApiController::class, 'indexBySite']);
    Route::get('/sites/{dominio}/{seccion}', [SiteApiController::class, 'showSection']);
    Route::get('/sites/{dominio}', [SiteApiController::class, 'showSite']);
    Route::get('/sites/{dominio}/{site}/productos/destacados', [ProductoApiController::class, 'destacadosBySite']);
    Route::get('/sites/{dominio}/{site}/productos', [ProductoApiController::class, 'indexBySite']);
    Route::get('/sites/{dominio}/{site}/{seccion}', [SiteApiController::class, 'showSection']);
    Route::get('/sites/{dominio}/{site}', [SiteApiController::class, 'showSite']);

    // Productos / Ecommerce
    Route::get('/productos', [ProductoApiController::class, 'index']);
    Route::get('/productos/destacados', [ProductoApiController::class, 'destacados']);
    Route::get('/productos/{producto:slug}', [ProductoApiController::class, 'show']);
    // TikTok oEmbed Proxy
    Route::get('/tiktok-oembed', [TikTokApiController::class, 'oembed']);
});

Route::get('/tiktok-oembed', [TikTokApiController::class, 'oembed']);

