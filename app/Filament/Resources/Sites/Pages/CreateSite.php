<?php

namespace App\Filament\Resources\Sites\Pages;

use App\Filament\Resources\Sites\SiteResource;
use App\Models\Dominio;
use App\Models\Plantilla;
use App\Models\Respuesta;
use Filament\Resources\Pages\CreateRecord;

class CreateSite extends CreateRecord
{
    protected static string $resource = SiteResource::class;

    public function mount(): void
    {
        parent::mount();

        if ($plantillaId = request()->query('plantilla_id')) {
            $plantilla = Plantilla::with(['respuestas', 'tiendas'])->find($plantillaId);

            if ($plantilla) {
                $this->form->fill([
                    'plantilla_id' => $plantilla->id,
                    'estado' => 'publicado',
                    'dominio_id' => Dominio::where('user_id', auth()->id())->value('id'),
                    'tiendas' => $plantilla->tiendas->pluck('id')->all(),
                    'estilos' => $plantilla->estilos,
                    'respuestas' => $plantilla->respuestas
                        ->mapWithKeys(function (Respuesta $respuesta): array {
                            $valor = $respuesta->valor;
                            if (is_string($valor) && is_array($decoded = json_decode($valor, true))) {
                                $valor = $decoded;
                            }

                            return [
                                $respuesta->pregunta_id => [
                                    'valor' => $valor,
                                    'enlace' => $respuesta->enlace,
                                ],
                            ];
                        })
                        ->all(),
                ]);
            }
        }
    }

    protected function afterCreate(): void
    {
        // Copiar respuestas de plantilla si existe
        $plantillaId = $this->form->getState()['plantilla_id'] ?? null;
        if ($plantillaId) {
            $plantillaRespuestas = Respuesta::where('plantilla_id', $plantillaId)->get();
            foreach ($plantillaRespuestas as $respuesta) {
                Respuesta::create([
                    'site_id' => $this->record->id,
                    'pregunta_id' => $respuesta->pregunta_id,
                    'valor' => $respuesta->valor,
                    'enlace' => $respuesta->enlace,
                ]);
            }
        }

        // Guardar respuestas del formulario (sobrescriben las de plantilla si existen)
        $this->guardarRespuestas($this->record->id);
    }

    private function guardarRespuestas(int $siteId): void
    {
        $respuestas = $this->form->getState()['respuestas'] ?? [];

        if (empty($respuestas)) {
            return;
        }

        $validPreguntaIds = \App\Models\Pregunta::whereIn('id', array_keys($respuestas))->pluck('id')->all();

        foreach ($respuestas as $preguntaId => $item) {
            if (! in_array((int) $preguntaId, $validPreguntaIds, true)) {
                continue;
            }

            $valor = $item['valor'] ?? null;
            $enlace = $item['enlace'] ?? null;

            // Si es array, convertir a JSON
            if (is_array($valor)) {
                $valor = json_encode($valor);
            }

            Respuesta::updateOrCreate(
                ['site_id' => $siteId, 'pregunta_id' => $preguntaId],
                ['valor' => $valor, 'enlace' => $enlace],
            );
        }
    }
}
