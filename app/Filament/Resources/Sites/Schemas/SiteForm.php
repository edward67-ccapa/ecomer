<?php

namespace App\Filament\Resources\Sites\Schemas;

use App\Filament\Resources\Plantillas\Schemas\PlantillaForm;
use App\Models\Dominio;
use App\Models\Plantilla;
use App\Models\User;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Component;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class SiteForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('General')
                    ->schema([
                        Grid::make(2)->schema([
                            Select::make('user_id')
                                ->label('Usuario')
                                ->options(fn () => User::pluck('name', 'id'))
                                ->default(fn () => auth()->id())
                                ->required()
                                ->searchable()
                                ->live(),
                            Select::make('plantilla_id')
                                ->label('Plantilla')
                                ->options(fn () => Plantilla::where('activa', true)->pluck('nombre', 'id'))
                                ->required()
                                ->searchable()
                                ->live()
                                ->afterStateUpdated(fn (Set $set, ?string $state) => $set('estilos', Plantilla::find($state)?->estilos ?? [])),
                            Select::make('dominio_id')
                                ->label('Dominio')
                                ->options(fn (Get $get) => Dominio::where('user_id', $get('user_id'))->pluck('nombre', 'id'))
                                ->searchable(),
                            Select::make('estado')
                                ->options([
                                    'borrador' => 'Borrador',
                                    'publicado' => 'Publicado',
                                ])
                                ->default('borrador')
                                ->required(),
                            TextInput::make('nombre')
                                ->required()
                                ->maxLength(255)
                                ->live(onBlur: true)
                                ->afterStateUpdated(fn (Set $set, ?string $state) => $set('slug', Str::slug($state))),
                            TextInput::make('slug')
                                ->required()
                                ->maxLength(255),
                            FileUpload::make('imagen')
                                ->label('Logo / imagen')
                                ->image()
                                ->imageEditor()
                                ->directory('sites')
                                ->columnSpanFull(),
                        ]),
                    ]),
                Section::make('Estilos globales')
                    ->description('Sobrescribe los estilos por defecto de la plantilla.')
                    ->visible(fn (Get $get) => filled($get('plantilla_id')))
                    ->schema([
                        Grid::make(3)->schema([
                            ColorPicker::make('estilos.color_primario'),
                            ColorPicker::make('estilos.color_secundario'),
                            Select::make('estilos.tipografia_titulos')
                                ->options(PlantillaForm::fuentes())
                                ->searchable(),
                            Select::make('estilos.tipografia_texto')
                                ->options(PlantillaForm::fuentes())
                                ->searchable(),
                            TextInput::make('estilos.radio_bordes')
                                ->placeholder('0.5rem'),
                            TextInput::make('estilos.espaciado')
                                ->placeholder('1rem'),
                        ]),
                    ]),
                Section::make('Contenido')
                    ->description('Responde las preguntas de la plantilla; se agrupan por sección.')
                    ->visible(fn (Get $get) => filled($get('plantilla_id')))
                    ->schema(fn (Get $get): array => self::respuestasFields($get)),
            ]);
    }

    /**
     * @return array<int, Component>
     */
    private static function respuestasFields(Get $get): array
    {
        $plantilla = Plantilla::with('secciones.preguntas')->find($get('plantilla_id'));

        if (! $plantilla) {
            return [];
        }

        $components = [];

        foreach ($plantilla->secciones as $seccion) {
            $fields = [];

            foreach ($seccion->preguntas as $pregunta) {
                $statePath = "respuestas.{$pregunta->id}.valor";

                $field = match ($pregunta->tipo) {
                    'area' => Textarea::make($statePath)->rows(3),
                    'imagen' => FileUpload::make($statePath)
                        ->image()
                        ->imageEditor()
                        ->directory('sites/contenido'),
                    'galeria' => FileUpload::make($statePath)
                        ->image()
                        ->multiple()
                        ->directory('sites/contenido'),
                    'color' => ColorPicker::make($statePath),
                    'enlace' => TextInput::make($statePath)->url(),
                    default => TextInput::make($statePath),
                };

                $fields[] = $field
                    ->label($pregunta->label)
                    ->helperText($pregunta->ayuda)
                    ->required($pregunta->requerida);
            }

            $components[] = Section::make($seccion->nombre)
                ->schema($fields)
                ->columns(2);
        }

        return $components;
    }
}
