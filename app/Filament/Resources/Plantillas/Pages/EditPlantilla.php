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
        $data['respuestas'] = $this->record->respuestas
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

        return $data;
    }

    protected function afterSave(): void
    {
        $this->guardarRespuestas();
    }

    private function guardarRespuestas(): void
    {
        $respuestas = $this->form->getState()['respuestas'] ?? [];

        foreach ($respuestas as $preguntaId => $item) {
            $valor = $item['valor'] ?? null;
            $enlace = $item['enlace'] ?? null;

            if (is_array($valor)) {
                $valor = json_encode($valor);
            }

            Respuesta::updateOrCreate(
                ['plantilla_id' => $this->record->id, 'pregunta_id' => $preguntaId],
                ['site_id' => null, 'valor' => $valor, 'enlace' => $enlace],
            );
        }
    }
}
