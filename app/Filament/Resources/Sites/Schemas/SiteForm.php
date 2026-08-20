<?php

namespace App\Filament\Resources\Sites\Schemas;

use App\Filament\Resources\Plantillas\Schemas\PlantillaForm;
use App\Models\Dominio;
use App\Models\Plantilla;
use App\Models\Respuesta;
use App\Models\User;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\MultiSelect;
use Filament\Forms\Components\Select;

use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
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
                Tabs::make('SiteFormTabs')
                    ->persistTabInQueryString(false)
                    ->tabs([
                        Tab::make('Configuración del Sitio')
                            ->icon('heroicon-o-cog')
                            ->schema([
                                Section::make('General')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            Select::make('user_id')
                                                ->label('Usuario')
                                                ->options(fn () => User::pluck('name', 'id'))
                                                ->default(fn () => auth()->id())
                                                ->required()
                                                ->searchable()
                                                ->live(onBlur: true),
                                            Select::make('plantilla_id')
                                                ->label('Plantilla')
                                                ->options(fn () => Plantilla::where('activa', true)->get()->pluck('nombre_con_tipo', 'id'))
                                                ->required()
                                                ->searchable()
                                                ->live()
                                                ->afterStateUpdated(function (Set $set, Get $get, ?string $state): void {
                                                    $plantilla = Plantilla::with('respuestas')->find($state);

                                                    $set('estilos', $plantilla?->estilos ?? []);

                                                    if (blank($get('respuestas'))) {
                                                        $set('respuestas', $plantilla?->respuestas
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
                                                            ->all() ?? []);
                                                    }
                                                }),
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
                                                ->disk('public')
                                                ->directory('sites')
                                                ->orientImagesFromExif(false)
                                                ->uploadingMessage('Subiendo imagen...')
                                                ->deletable(true)
                                                ->openable()
                                                ->downloadable()
                                                ->columnSpanFull(),
                                        ]),

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
                            ]),

                        Tab::make('Respuestas / Contenido')
                            ->icon('heroicon-o-document-text')
                            ->visible(fn (Get $get) => filled($get('plantilla_id')))
                            ->schema(fn (Get $get): array => self::respuestasFields($get)),
                    ])
                    ->columnSpanFull(),
            ]);
    }

    /**
     * @return array<int, Component>
     */
    private static array $respuestasCache = [];

    private static function respuestasFields(Get $get): array
    {
        $plantillaId = $get('plantilla_id');
        if (! $plantillaId) {
            return [];
        }

        if (isset(self::$respuestasCache[$plantillaId])) {
            return self::$respuestasCache[$plantillaId];
        }

        $plantilla = Plantilla::with('secciones.preguntas.children')->find($plantillaId);

        if (! $plantilla) {
            return self::$respuestasCache[$plantillaId] = [];
        }

        return self::$respuestasCache[$plantillaId] = PlantillaForm::respuestasFields($plantilla);
    }
}
