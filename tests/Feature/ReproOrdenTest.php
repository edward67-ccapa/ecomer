<?php

use App\Filament\Resources\Plantillas\Pages\EditPlantilla;
use App\Models\Plantilla;
use Livewire\Livewire;

test('repro orden de preguntas nuevas', function () {
    $plantilla = Plantilla::create([
        'slug' => 'repro-orden',
        'tipo' => 'landing_page',
        'nombre' => 'Repro orden',
    ]);

    $seccion = $plantilla->secciones()->create([
        'slug' => 'inicio',
        'nombre' => 'Inicio',
        'orden' => 1,
    ]);

    $preguntas = collect();
    foreach (['portada', 'titulo1', 'subtitulo', 'boton'] as $i => $label) {
        $preguntas->push($seccion->preguntas()->create([
            'label' => $label,
            'tipo' => 'texto',
            'orden' => $i + 1,
        ]));
    }

    $existing = $preguntas->mapWithKeys(fn ($q) => ['record-'.$q->id => [
        'id' => $q->id, 'label' => $q->label, 'tipo' => 'texto', 'orden' => $q->orden,
    ]])->all();

    Livewire::test(EditPlantilla::class, ['record' => $plantilla->getRouteKey()])
        ->fillForm([
            'secciones' => [
                'record-'.$seccion->id => [
                    'id' => $seccion->id,
                    'nombre' => 'Inicio',
                    'slug' => 'inicio',
                    'orden' => 1,
                    'activa' => true,
                    'preguntas' => $existing + [
                        ['label' => 'nueva', 'tipo' => 'texto', 'orden' => 5],
                    ],
                ],
            ],
        ])
        ->call('save')
        ->assertHasNoFormErrors();

    dump('preguntas en DB tras guardar (orden asc):');
    foreach ($seccion->refresh()->preguntas()->get() as $q) {
        dump($q->id, $q->label, $q->orden);
    }

    dump('estado del form tras re-montar (order of respuestas.* fields):');
    $component = Livewire::test(EditPlantilla::class, ['record' => $plantilla->getRouteKey()]);
    $fields = $component->getForm()->getFlatFields();
    foreach (array_keys($fields) as $name) {
        if (str_starts_with($name, 'respuestas.')) {
            dump($name);
        }
    }
});
