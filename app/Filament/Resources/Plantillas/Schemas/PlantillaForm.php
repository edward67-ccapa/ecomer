<?php

namespace App\Filament\Resources\Plantillas\Schemas;

use App\Models\Plantilla;
use App\Models\Pregunta;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\MultiSelect;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Component;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;

class PlantillaForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Grid::make(2)
                    ->schema([
                        Section::make('General')
                            ->icon('heroicon-o-cog')
                            ->schema([
                                Grid::make(2)->schema([
                                    TextInput::make('nombre')
                                        ->required()
                                        ->maxLength(255),
                                    TextInput::make('slug')
                                        ->required()
                                        ->unique(ignoreRecord: true)
                                        ->maxLength(255),
                                    Select::make('tipo')
                                        ->options([
                                            'ecommerce' => 'Ecommerce',
                                            'landing_page' => 'Landing Page',
                                            'anuncio' => 'Anuncio / Promoción',
                                        ])
                                        ->default('ecommerce')
                                        ->required(),
                                    Toggle::make('activa')
                                        ->default(true),
                                ]),
                                Textarea::make('descripcion')
                                    ->rows(2),
                                FileUpload::make('imagen')
                                    ->image()
                                    ->imageEditor()
                                    ->directory('plantillas'),
                            ])
                            ->columnSpan(1),

                        Section::make('Estilos globales')
                            ->icon('heroicon-o-paint-brush')
                            ->description('Valores por defecto que copiarán los sites creados con esta plantilla.')
                            ->schema([
                                Grid::make(2)->schema([
                                    ColorPicker::make('estilos.color_primario')
                                        ->label('Color primario'),
                                    ColorPicker::make('estilos.color_secundario')
                                        ->label('Color secundario'),
                                    Select::make('estilos.tipografia_titulos')
                                        ->label('Tipografía para títulos')
                                        ->options(self::fuentes())
                                        ->searchable(),
                                    Select::make('estilos.tipografia_texto')
                                        ->label('Tipografía para texto')
                                        ->options(self::fuentes())
                                        ->searchable(),
                                    TextInput::make('estilos.radio_bordes')
                                        ->label('Radio de bordes')
                                        ->placeholder('0.5rem')
                                        ->helperText('Ejemplo: 0.5rem, 8px, 4px'),
                                    TextInput::make('estilos.espaciado')
                                        ->label('Espaciado general')
                                        ->placeholder('1rem')
                                        ->helperText('Ejemplo: 1rem, 16px, 8px'),
                                ]),
                            ])
                            ->columnSpan(1),
                    ])
                    ->columnSpanFull(),

                Section::make('Tiendas')
                    ->icon('heroicon-o-shopping-bag')
                    ->schema([
                        MultiSelect::make('tiendas')
                            ->label('Tiendas asociadas')
                            ->relationship('tiendas', 'nombre')
                            ->searchable()
                            ->preload(),
                    ])
                    ->columnSpanFull(),

                Section::make('Secciones')
                    ->icon('heroicon-o-squares-2x2')
                    ->description('Configura las secciones y preguntas de la plantilla')
                    ->columnSpanFull()
                    ->schema([
                        Repeater::make('secciones')
                            ->relationship()
                            ->label('Secciones de la plantilla')
                            ->reorderableWithDragAndDrop()
                            ->live()
                            ->grid(['default' => 1])
                            ->schema([
                                Grid::make(4)->schema([
                                    TextInput::make('nombre')
                                        ->required()
                                        ->maxLength(255),
                                    TextInput::make('slug')
                                        ->required()
                                        ->maxLength(255),
                                    TextInput::make('orden')
                                        ->numeric()
                                        ->default(0),
                                    Toggle::make('activa')
                                        ->default(true),
                                ]),
                                Repeater::make('preguntas')
                                    ->relationship()
                                    ->label('Preguntas')
                                    ->live()
                                    ->schema([
                                        Grid::make(7)->schema([
                                            TextInput::make('label')
                                                ->required()
                                                ->maxLength(255)
                                                ->placeholder('portada, titulo1, subtitulo...'),
                                            Select::make('tipo')
                                                ->options(self::tiposPregunta())
                                                ->required()
                                                ->live()
                                                ->default('texto'),
                                            Select::make('estructura')
                                                ->options([
                                                    'objeto' => 'Objeto (Valor único)',
                                                    'array' => 'Array (Múltiple/Repetible)',
                                                ])
                                                ->default('objeto')
                                                ->live()
                                                ->required(),
                                            TextInput::make('max_items')
                                                ->numeric()
                                                ->label('Límite')
                                                ->placeholder('Infinito')
                                                ->visible(fn (Get $get): bool => $get('estructura') === 'array'),
                                            TextInput::make('orden')
                                                ->numeric()
                                                ->default(0)
                                                ->afterStateUpdated(function (TextInput $component): void {
                                                    $repeater = $component->getParentRepeater();

                                                    if (! $repeater instanceof Repeater) {
                                                        return;
                                                    }

                                                    $items = $repeater->getRawState();

                                                    uasort($items, static fn (array $a, array $b): int => ($a['orden'] ?? 0) <=> ($b['orden'] ?? 0));

                                                    $repeater->rawState($items);

                                                    $repeater->callAfterStateUpdated();
                                                }),
                                            Toggle::make('requerida')
                                                ->default(false),
                                            Textarea::make('ayuda')
                                                ->rows(1)
                                                ->columnSpanFull(),
                                        ]),
                                        Repeater::make('children')
                                            ->relationship()
                                            ->label('Campos del Conjunto (Plantilla Base)')
                                            ->visible(fn (Get $get): bool => $get('tipo') === 'grupo')
                                            ->schema([
                                                Grid::make(5)->schema([
                                                    TextInput::make('label')
                                                        ->required()
                                                        ->maxLength(255),
                                                    Select::make('tipo')
                                                        ->options(self::tiposPregunta())
                                                        ->required()
                                                        ->default('texto'),
                                                    Select::make('estructura')
                                                        ->options([
                                                            'objeto' => 'Objeto',
                                                            'array' => 'Array',
                                                        ])
                                                        ->default('objeto')
                                                        ->required(),
                                                    TextInput::make('orden')
                                                        ->numeric()
                                                        ->default(0),
                                                    Toggle::make('requerida')
                                                        ->default(false),
                                                ]),
                                            ])
                                            ->itemLabel(fn (array $state): ?string => $state['label'] ?? null)
                                            ->reorderableWithDragAndDrop()
                                            ->collapsible()
                                            ->columns(1),
                                    ])
                                    ->columns(1),
                            ]),
                    ]),

                Section::make('Contenido')
                    ->icon('heroicon-o-document-text')
                    ->description('Valores por defecto que copiarán los sites creados con esta plantilla. Las preguntas nuevas aparecen aquí después de guardar la plantilla.')
                    ->columnSpanFull()
                    ->visible(fn (Get $get): bool => filled($get('id')))
                    ->schema(fn (Get $get): array => self::respuestasFieldsFromState($get)),
            ]);
    }

    /**
     * @return array<int, Component>
     */
    public static function respuestasFields(Plantilla $plantilla): array
    {
        $components = [];

        foreach ($plantilla->secciones as $seccion) {
            $fields = [];

            foreach ($seccion->preguntas->whereNull('parent_id') as $pregunta) {
                $fields[] = self::campoRespuesta($pregunta);
            }

            if ($fields) {
                $components[] = Section::make($seccion->nombre)
                    ->schema($fields)
                    ->columns(2);
            }
        }

        return $components;
    }

    /**
     * @return array<int, Component>
     */
    private static function respuestasFieldsFromState(Get $get): array
    {
        $components = [];

        foreach ($get('secciones') ?? [] as $seccion) {
            $fields = [];

            foreach ($seccion['preguntas'] ?? [] as $pregunta) {
                $id = $pregunta['id'] ?? null;

                if (! $id || ! empty($pregunta['parent_id'])) {
                    continue;
                }

                $modelo = Pregunta::with('children')->find($id);
                if (! $modelo) {
                    $modelo = new Pregunta;
                    $modelo->forceFill([
                        'id' => $id,
                        'label' => $pregunta['label'] ?? '',
                        'tipo' => $pregunta['tipo'] ?? 'texto',
                        'ayuda' => $pregunta['ayuda'] ?? null,
                        'requerida' => (bool) ($pregunta['requerida'] ?? false),
                        'max_items' => $pregunta['max_items'] ?? null,
                    ]);
                }

                $fields[] = self::campoRespuesta($modelo);
            }

            if ($fields) {
                $components[] = Section::make($seccion['nombre'])
                    ->schema($fields)
                    ->columns(2);
            }
        }

        return $components;
    }

    private static function campoRespuesta(Pregunta $pregunta): Component
    {
        $statePath = "respuestas.{$pregunta->id}.valor";
        $linkPath = "respuestas.{$pregunta->id}.enlace";

        // Construir el campo principal
        $field = match ($pregunta->tipo) {
            'area' => Textarea::make($statePath)
                ->rows(3)
                ->placeholder('Escribe el contenido aquí...'),

            'imagen' => FileUpload::make($statePath)
                ->image()
                ->imageEditor()
                ->directory('sites/contenido')
                ->helperText('Formatos: JPG, PNG, WebP'),

            'galeria' => FileUpload::make($statePath)
                ->image()
                ->multiple()
                ->directory('sites/contenido')
                ->helperText('Puedes subir múltiples imágenes'),

            'color' => ColorPicker::make($statePath)
                ->helperText('Selecciona un color'),

            'enlace' => TextInput::make($statePath)
                ->url()
                ->placeholder('https://ejemplo.com'),

            'grupo' => Repeater::make($statePath)
                ->schema(function () use ($pregunta) {
                    $children = $pregunta->children;
                    if ($children->isEmpty() && isset($pregunta->id)) {
                        $children = Pregunta::where('parent_id', $pregunta->id)->orderBy('orden')->get();
                    }

                    return $children->map(function (Pregunta $child) {
                        $childPath = $child->label;

                        $subField = match ($child->tipo) {
                            'area' => Textarea::make($childPath)->rows(2),
                            'imagen' => FileUpload::make($childPath)->image()->directory('sites/contenido'),
                            'galeria' => FileUpload::make($childPath)->image()->multiple()->directory('sites/contenido'),
                            'color' => ColorPicker::make($childPath),
                            'enlace' => TextInput::make($childPath)->url(),
                            default => TextInput::make($childPath),
                        };

                        return $subField->label($child->label);
                    })->toArray();
                })
                ->itemLabel(fn (array $state): ?string => $state['nombre'] ?? $state['titulo'] ?? $state['label'] ?? null)
                ->maxItems($pregunta->max_items)
                ->reorderableWithDragAndDrop()
                ->collapsible(),

            default => TextInput::make($statePath)
                ->placeholder('Ingresa el valor...'),
        };

        // Aplicar propiedades comunes
        $field = $field
            ->label($pregunta->label)
            ->helperText($pregunta->ayuda)
            ->required($pregunta->requerida);

        // Retornar con disposición vertical (uno debajo del otro)
        return Grid::make(1)
            ->schema([
                // Campo principal (arriba)
                $field,

                // Enlace opcional (abajo)
                TextInput::make($linkPath)
                    ->label('🔗 Enlace (opcional)')
                    ->url()
                    ->placeholder('https://...')
                    ->helperText('Asocia una URL a este contenido'),
            ])
            ->gap(4);
    }

    /**
     * @return array<string, string>
     */
    public static function tiposPregunta(): array
    {
        return [
            'texto' => 'Texto',
            'area' => 'Área',
            'imagen' => 'Imagen',
            'galeria' => 'Galería',
            'color' => 'Color',
            'grupo' => 'Grupo (Conjunto)',
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function fuentes(): array
    {
        return [
            'Inter' => 'Inter',
            'Poppins' => 'Poppins',
            'Roboto' => 'Roboto',
            'Montserrat' => 'Montserrat',
            'Open Sans' => 'Open Sans',
        ];
    }
}
