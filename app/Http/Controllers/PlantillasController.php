<?php

namespace App\Http\Controllers;

use App\Models\Plantilla;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlantillasController extends Controller
{
    public function index(Request $request): Response
    {
        $plantillas = Plantilla::withCount('secciones')
            ->where('activa', true)
            ->orderBy('nombre')
            ->get()
            ->map(fn (Plantilla $plantilla): array => [
                'id' => $plantilla->id,
                'slug' => $plantilla->slug,
                'tipo' => $plantilla->tipo,
                'nombre' => $plantilla->nombre,
                'descripcion' => $plantilla->descripcion,
                'imagen' => $plantilla->imagen ? asset('storage/'.$plantilla->imagen) : null,
                'secciones' => $plantilla->secciones_count,
                'estilos' => $plantilla->estilos,
            ]);

        return Inertia::render('plantillas/Index', [
            'plantillas' => $plantillas,
        ]);
    }
}
