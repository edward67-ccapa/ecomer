<?php

namespace App\Filament\Resources\Sites\Pages;

use App\Filament\Resources\Sites\SiteResource;
use App\Models\Pregunta;
use App\Models\Respuesta;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Js;

class EditSite extends EditRecord
{
    protected static string $resource = SiteResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function getCancelFormAction(): Action
    {
        $url = $this->previousUrl ?? static::getResource()::getUrl('index');

        return parent::getCancelFormAction()
            ->url($url)
            ->alpineClickHandler('window.location.href = '.Js::from($url));
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $this->record->load(['respuestas', 'plantilla.secciones.preguntas.children.children']);

        $allPreguntas = collect();
        if ($this->record->plantilla) {
            foreach ($this->record->plantilla->secciones as $seccion) {
                foreach ($seccion->preguntas as $pregunta) {
                    $allPreguntas->push($pregunta);
                    if ($pregunta->children) {
                        foreach ($pregunta->children as $child) {
                            $allPreguntas->push($child);
                            if ($child->children) {
                                foreach ($child->children as $grandChild) {
                                    $allPreguntas->push($grandChild);
                                }
                            }
                        }
                    }
                }
            }
        }
        $preguntasById = $allPreguntas->keyBy('id');

        $respuestasMap = $this->record->respuestas
            ->mapWithKeys(function (Respuesta $respuesta) use ($preguntasById): array {
                $pregunta = $preguntasById->get($respuesta->pregunta_id);
                $valor = $respuesta->valor;

                if (is_string($valor)) {
                    $decoded = json_decode($valor, true);
                    if (json_last_error() === JSON_ERROR_NONE && (is_array($decoded) || is_object($decoded))) {
                        $valor = $decoded;
                    }
                }

                $isRepeaterOrMultiple = $pregunta && (
                    $pregunta->tipo === 'grupo' ||
                    $pregunta->tipo === 'galeria' ||
                    $pregunta->estructura === 'array'
                );

                if ($isRepeaterOrMultiple) {
                    if (! is_array($valor)) {
                        if (is_string($valor) && trim($valor) !== '') {
                            $valor = $pregunta->tipo === 'grupo' ? [] : [trim($valor)];
                        } else {
                            $valor = [];
                        }
                    } else {
                        if ($pregunta && $pregunta->tipo !== 'grupo') {
                            $valor = array_values(array_filter(array_map(function ($item) {
                                if (is_array($item)) {
                                    return $item['nombre'] ?? $item['titulo'] ?? $item['valor'] ?? $item['label'] ?? null;
                                }

                                return is_scalar($item) ? (string) $item : null;
                            }, $valor)));
                        }
                    }
                } else {
                    if (is_array($valor)) {
                        $first = reset($valor);
                        if (is_array($first)) {
                            $valor = $first['nombre'] ?? $first['titulo'] ?? $first['valor'] ?? $first['label'] ?? null;
                        } else {
                            $valor = is_scalar($first) ? (string) $first : null;
                        }
                    }
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
            $plantillaRespuestasMap = Respuesta::where('plantilla_id', $this->record->plantilla_id)
                ->get()
                ->keyBy('pregunta_id');

            foreach ($allPreguntas as $pregunta) {
                if (! isset($respuestasMap[$pregunta->id])) {
                    $pResp = $plantillaRespuestasMap->get($pregunta->id);
                    $valor = $pResp?->valor;

                    if (is_string($valor)) {
                        $decoded = json_decode($valor, true);
                        if (json_last_error() === JSON_ERROR_NONE && (is_array($decoded) || is_object($decoded))) {
                            $valor = $decoded;
                        }
                    }

                    $isRepeaterOrMultiple = $pregunta->tipo === 'grupo' || $pregunta->tipo === 'galeria' || $pregunta->estructura === 'array';
                    if ($isRepeaterOrMultiple) {
                        if (! is_array($valor)) {
                            if (is_string($valor) && trim($valor) !== '') {
                                $valor = $pregunta->tipo === 'grupo' ? [] : [trim($valor)];
                            } else {
                                $valor = [];
                            }
                        } else {
                            if ($pregunta->tipo !== 'grupo') {
                                $valor = array_values(array_filter(array_map(function ($item) {
                                    if (is_array($item)) {
                                        return $item['nombre'] ?? $item['titulo'] ?? $item['valor'] ?? $item['label'] ?? null;
                                    }

                                    return is_scalar($item) ? (string) $item : null;
                                }, $valor)));
                            }
                        }
                    } else {
                        if (is_array($valor)) {
                            $first = reset($valor);
                            if (is_array($first)) {
                                $valor = $first['nombre'] ?? $first['titulo'] ?? $first['valor'] ?? $first['label'] ?? null;
                            } else {
                                $valor = is_scalar($first) ? (string) $first : null;
                            }
                        }
                    }

                    $respuestasMap[$pregunta->id] = [
                        'valor' => $valor,
                        'enlace' => $pResp?->enlace,
                    ];
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
        $respuestas = $this->data['respuestas'] ?? $this->form->getRawState()['respuestas'] ?? [];

        if (empty($respuestas)) {
            return;
        }

        $existingRespuestas = Respuesta::where('site_id', $siteId)
            ->get()
            ->keyBy('pregunta_id');

        $validPreguntaIds = Pregunta::whereIn('id', array_keys($respuestas))->pluck('id')->all();

        $dirtyRespuestas = [];
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

            $existing = $existingRespuestas->get((int) $preguntaId);

            // Comprobación PATCH: Si no ha cambiado nada, omitir actualización
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

        DB::transaction(function () use ($dirtyRespuestas, $siteId) {
            foreach ($dirtyRespuestas as $preguntaId => $item) {
                Respuesta::updateOrCreate(
                    ['site_id' => $siteId, 'pregunta_id' => $preguntaId],
                    ['valor' => $item['valor'], 'enlace' => $item['enlace']],
                );
            }
        });
    }
}
