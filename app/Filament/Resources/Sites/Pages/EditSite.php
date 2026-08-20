<?php

namespace App\Filament\Resources\Sites\Pages;

use App\Filament\Resources\Sites\SiteResource;
use App\Models\Respuesta;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSite extends EditRecord
{
    protected static string $resource = SiteResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $this->record->load(['respuestas', 'plantilla.secciones.preguntas.children']);

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
                    ],
                ];
            })
            ->all();

        if ($this->record->plantilla) {
            foreach ($this->record->plantilla->secciones as $seccion) {
                foreach ($seccion->preguntas as $pregunta) {
                    if (! isset($respuestasMap[$pregunta->id])) {
                        $respuestasMap[$pregunta->id] = [
                            'valor' => null,
                            'enlace' => null,
                        ];
                    }
                }
            }
        }

        $data['respuestas'] = $respuestasMap;

        return $data;
    }

    protected function afterSave(): void
    {
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
