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
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;

use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
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
                                                ->webp5Mb(fn (Get $get, ?\Illuminate\Database\Eloquent\Model $record) => 'sites/' . (Str::slug($get('slug') ?? $record?->slug) ?: 'general'), 'public')
                                                ->orientImagesFromExif(false)
                                                ->uploadingMessage('Subiendo imagen...')
                                                ->deletable(true)
                                                ->openable()
                                                ->downloadable()
                                                ->columnSpanFull(),
                                        ]),

                                        Section::make('Datos de Contacto Globales')
                                            ->icon('heroicon-o-phone')
                                            ->description('Define números de WhatsApp, correos electrónicos y horarios globales del sitio.')
                                            ->collapsible()
                                            ->schema([
                                                Repeater::make('estilos.acciones_nav')
                                                    ->label('WhatsApp, Correos y Contacto')
                                                    ->schema([
                                                        Grid::make(3)->schema([
                                                            Select::make('icono')
                                                                ->label('Tipo / Ícono')
                                                                ->options([
                                                                    'FaWhatsapp' => 'WhatsApp',
                                                                    'FaEnvelope' => 'Correo Electrónico',
                                                                    'FaBriefcase' => 'Correo de Trabajo / Maletín',
                                                                    'FaPhone' => 'Teléfono Fijo / Móvil',
                                                                    'FaClock' => 'Horario de Atención',
                                                                    'FaLocationDot' => 'Ubicación / Dirección',
                                                                ])
                                                                ->default('FaWhatsapp')
                                                                ->required(),
                                                            TextInput::make('Label')
                                                                ->label('Etiqueta')
                                                                ->placeholder('Ej. WhatsApp Ventas, Correo, Horario')
                                                                ->required(),
                                                            Textarea::make('texto')
                                                                ->label('Número(s) o Correo(s)')
                                                                ->placeholder("Ej. 987654321 o correo@gmail.com\n(Soporta múltiples líneas)")
                                                                ->rows(2)
                                                                ->required(),
                                                        ]),
                                                    ])
                                                    ->collapsible()
                                                    ->itemLabel(fn (array $state): ?string => ($state['Label'] ?? '') ? ($state['Label'] . ': ' . ($state['texto'] ?? '')) : null)
                                                    ->columnSpanFull(),
                                            ])
                                            ->columnSpanFull(),

                                        Section::make('Tiendas')
                                            ->icon('heroicon-o-shopping-bag')
                                            ->collapsible()
                                            ->schema([
                                                MultiSelect::make('tiendas')
                                                    ->label('Tiendas asociadas')
                                                    ->relationship('tiendas', 'nombre')
                                                    ->searchable()
                                                    ->preload(),
                                            ])
                                            ->columnSpanFull(),

                                        Section::make('Servicios')
                                            ->icon('heroicon-o-wrench-screwdriver')
                                            ->collapsible()
                                            ->schema([
                                                MultiSelect::make('servicios')
                                                    ->label('Servicios asociados')
                                                    ->relationship('servicios', 'nombre')
                                                    ->searchable()
                                                    ->preload(),
                                            ])
                                            ->columnSpanFull(),

                                        Section::make('Catálogo de Productos')
                                            ->icon('heroicon-o-book-open')
                                            ->description('Configura la disponibilidad del catálogo, enlace directo PDF o catálogo dinámico.')
                                            ->collapsible()
                                            ->schema([
                                                Toggle::make('estilos.catalogo.activo')
                                                    ->label('Activar Catálogo en la Navegación')
                                                    ->helperText('Muestra el enlace de Catálogo en el menú superior, menú móvil y footer.')
                                                    ->default(false)
                                                    ->live(),

                                                Grid::make(2)->schema([
                                                    TextInput::make('estilos.catalogo.titulo')
                                                        ->label('Título en el Menú')
                                                        ->placeholder('Ej: Catálogo, Ver Catálogo, Catálogo PDF')
                                                        ->default('Catálogo')
                                                        ->visible(fn (Get $get) => (bool) $get('estilos.catalogo.activo')),

                                                    TextInput::make('estilos.catalogo.enlace')
                                                        ->label('Enlace Externo o PDF (Opcional)')
                                                        ->placeholder('https://ejemplo.com/catalogo.pdf')
                                                        ->helperText('Si ingresas un enlace, el botón abrirá este archivo/URL. Si lo dejas vacío, cargará el catálogo dinámico de productos.')
                                                        ->visible(fn (Get $get) => (bool) $get('estilos.catalogo.activo'))
                                                        ->live(onBlur: true),
                                                ]),

                                                Section::make('Filtro de Productos para el Catálogo')
                                                    ->description('Aplica cuando no se proporciona enlace externo.')
                                                    ->visible(fn (Get $get) => (bool) $get('estilos.catalogo.activo') && blank($get('estilos.catalogo.enlace')))
                                                    ->schema([
                                                        Select::make('estilos.catalogo.tipo_filtro')
                                                            ->label('Incluir en el catálogo')
                                                            ->options([
                                                                'todos' => 'Todos los productos',
                                                                'categoria' => 'Por Categoría',
                                                                'subcategoria' => 'Por Subcategoría',
                                                            ])
                                                            ->default('todos')
                                                            ->live(),

                                                        MultiSelect::make('estilos.catalogo.categorias')
                                                            ->label('Categorías a incluir')
                                                            ->options(fn () => \App\Models\Categoria::pluck('nombre', 'id'))
                                                            ->searchable()
                                                            ->preload()
                                                            ->visible(fn (Get $get) => $get('estilos.catalogo.tipo_filtro') === 'categoria'),

                                                        MultiSelect::make('estilos.catalogo.subcategorias')
                                                            ->label('Subcategorías a incluir')
                                                            ->options(fn () => \App\Models\Subcategoria::with('categoria')->get()->mapWithKeys(fn ($sub) => [$sub->id => ($sub->categoria ? $sub->categoria->nombre . ' > ' : '') . $sub->nombre]))
                                                            ->searchable()
                                                            ->preload()
                                                            ->visible(fn (Get $get) => $get('estilos.catalogo.tipo_filtro') === 'subcategoria'),
                                                    ]),
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
    private static function respuestasFields(Get $get): array
    {
        $plantillaId = $get('plantilla_id');
        if (! $plantillaId) {
            return [];
        }

        $plantilla = Plantilla::with('secciones.preguntas.children')->find($plantillaId);

        if (! $plantilla) {
            return [];
        }

        return PlantillaForm::respuestasFields($plantilla);
    }
}
