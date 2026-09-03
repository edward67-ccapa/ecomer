<?php

namespace App\Filament\Resources\Plantillas\Pages;

use App\Filament\Resources\Plantillas\PlantillaResource;
use App\Models\Respuesta;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditPlantilla extends EditRecord
{
    protected static string $resource = PlantillaResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $this->record->load([
            'respuestas',
            'secciones.preguntas.children',
        ]);

        $respuestasMap = $this->record->respuestas
            ->mapWithKeys(function (Respuesta $respuesta): array {
                $valor = $respuesta->valor;
                if (is_string($valor) && is_array($decoded = json_decode($valor, true))) {
                    $valor = $decoded;
                }

                return [
                    $respuesta->pregunta_id => [
                        'valor' => $valor,
                        'enlace' => $respuesta->enlace,
                        'activar_enlace' => filled($respuesta->enlace),
                    ],
                ];
            })
            ->all();

        foreach ($this->record->secciones as $seccion) {
            foreach ($seccion->preguntas as $pregunta) {
                if (! isset($respuestasMap[$pregunta->id])) {
                    $respuestasMap[$pregunta->id] = [
                        'valor' => null,
                        'enlace' => null,
                        'activar_enlace' => false,
                    ];
                }
            }
        }

        $data['respuestas'] = $respuestasMap;

        return $data;
    }

    protected function afterSave(): void
    {
        $this->guardarRespuestas();
    }

    private function guardarRespuestas(): void
    {
        $respuestas = $this->data['respuestas'] ?? $this->form->getRawState()['respuestas'] ?? [];

        if (empty($respuestas)) {
            return;
        }

        $existingRespuestas = Respuesta::where('plantilla_id', $this->record->id)
            ->whereNull('site_id')
            ->get()
            ->keyBy('pregunta_id');

        $validPreguntaIds = \App\Models\Pregunta::whereIn('id', array_keys($respuestas))->pluck('id')->all();

        $dirtyRespuestas = [];
        foreach ($respuestas as $preguntaId => $item) {
            if (! in_array((int) $preguntaId, $validPreguntaIds, true)) {
                continue;
            }

            $valor = $item['valor'] ?? null;
            $enlace = $item['enlace'] ?? null;

            if (is_array($valor)) {
                $valor = json_encode($valor);
            }

            $existing = $existingRespuestas->get((int) $preguntaId);

            // Si el valor y el enlace no han cambiado, ignorar totalmente
            if ($existing && (string) $existing->valor === (string) $valor && (string) $existing->enlace === (string) $enlace) {
                continue;
            }

            $dirtyRespuestas[$preguntaId] = [
                'valor' => $valor,
                'enlace' => $enlace,
            ];
        }

        // Si no hay cambios en la pestaña actual ni en ninguna otra, salir ALTOQUE (0ms, 0 queries)
        if (empty($dirtyRespuestas)) {
            return;
        }

        \Illuminate\Support\Facades\DB::transaction(function () use ($dirtyRespuestas) {
            foreach ($dirtyRespuestas as $preguntaId => $item) {
                Respuesta::updateOrCreate(
                    ['plantilla_id' => $this->record->id, 'pregunta_id' => $preguntaId],
                    ['site_id' => null, 'valor' => $item['valor'], 'enlace' => $item['enlace']],
                );
            }
        });
    }
}
