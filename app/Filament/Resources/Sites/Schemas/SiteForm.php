<?php

namespace App\Filament\Resources\Sites\Schemas;

use App\Filament\Forms\Components\IconPicker;
use App\Filament\Resources\Plantillas\Schemas\PlantillaForm;
use App\Models\Categoria;
use App\Models\Dominio;
use App\Models\Plantilla;
use App\Models\Respuesta;
use App\Models\Subcategoria;
use App\Models\User;
use Filament\Forms\Components\CheckboxList;
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
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Database\Eloquent\Model;
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
                                            TextInput::make('estilos.direccion')
                                                ->label('Dirección de la tienda / negocio')
                                                ->placeholder('Ej: Av. Gran Chimú N°680, San Juan de Lurigancho')
                                                ->prefixIcon('heroicon-m-map-pin')
                                                ->helperText('Dirección física visible en pie de página, cabecera y sección de contacto.')
                                                ->columnSpan(2),
                                            TextInput::make('estilos.mapa_url')
                                                ->label('Enlace o Ubicación de Google Maps (Opcional)')
                                                ->placeholder('https://maps.google.com/?q=... o enlace de compartir')
                                                ->prefixIcon('heroicon-m-globe-alt')
                                                ->helperText('Opcional. Si se deja en blanco, el mapa se generará automáticamente a partir de la dirección.')
                                                ->columnSpan(2),
                                            FileUpload::make('imagen')
                                                ->label('Logo / imagen')
                                                ->webp5Mb(fn (Get $get, ?Model $record) => 'sites/'.(Str::slug($get('slug') ?? $record?->slug) ?: 'general'), 'public')
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
                                                    ->itemLabel(fn (array $state): ?string => ($state['Label'] ?? '') ? ($state['Label'].': '.($state['texto'] ?? '')) : null)
                                                    ->columnSpanFull(),
                                            ])
                                            ->columnSpanFull(),

                                        Section::make('Almacenes')
                                            ->icon('heroicon-o-shopping-bag')
                                            ->description('Asocia los almacenes del sitio y personaliza el subtítulo, título e ícono de la sección de Productos / Almacenes.')
                                            ->collapsible()
                                            ->schema([
                                                CheckboxList::make('tiendas')
                                                    ->label('Almacenes asociados')
                                                    ->relationship('tiendas', 'nombre')
                                                    ->columns(3)
                                                    ->searchable()
                                                    ->bulkToggleable(),

                                                Grid::make(4)->schema([
                                                    TextInput::make('estilos.seccion_productos.sub_titulo')
                                                        ->label('Subtítulo de Productos / Almacén')
                                                        ->placeholder('Ej: Catálogo Completo'),
                                                    TextInput::make('estilos.seccion_productos.titulo')
                                                        ->label('Título de Productos / Almacén')
                                                        ->placeholder('Ej: Nuestras Tortas y Creaciones'),
                                                    IconPicker::make('estilos.seccion_productos.icono')
                                                        ->label('Ícono de Productos / Almacén'),
                                                    TextInput::make('estilos.seccion_productos.orden')
                                                        ->label('Orden en el Menú')
                                                        ->numeric()
                                                        ->placeholder('Ej: 2'),
                                                ]),
                                            ])
                                             ->columnSpanFull(),

                                        Section::make('Servicios')
                                            ->icon('heroicon-o-wrench-screwdriver')
                                            ->collapsible()
                                            ->schema([
                                                Grid::make(2)->schema([
                                                    CheckboxList::make('servicios')
                                                        ->label('Servicios asociados')
                                                        ->relationship('servicios', 'nombre')
                                                        ->columns(3)
                                                        ->searchable()
                                                        ->bulkToggleable(),
                                                    TextInput::make('estilos.seccion_servicios.orden')
                                                        ->label('Orden en el Menú')
                                                        ->numeric()
                                                        ->placeholder('Ej: 3'),
                                                ]),
                                            ])
                                            ->columnSpanFull(),

                                        Section::make('Marcas')
                                            ->icon('heroicon-o-tag')
                                            ->collapsible()
                                            ->schema([
                                                Grid::make(2)->schema([
                                                    CheckboxList::make('marcas')
                                                        ->label('Marcas asociadas')
                                                        ->relationship('marcas', 'titulo')
                                                        ->columns(3)
                                                        ->searchable()
                                                        ->bulkToggleable(),
                                                    TextInput::make('estilos.seccion_marcas.orden')
                                                        ->label('Orden en el Menú')
                                                        ->numeric()
                                                        ->placeholder('Ej: 5'),
                                                ]),
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

                                                Grid::make(3)->schema([
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

                                                    TextInput::make('estilos.catalogo.orden')
                                                        ->label('Orden en el Menú')
                                                        ->numeric()
                                                        ->placeholder('Ej: 4')
                                                        ->visible(fn (Get $get) => (bool) $get('estilos.catalogo.activo')),
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
                                                            ->options(fn () => Categoria::pluck('nombre', 'id'))
                                                            ->searchable()
                                                            ->preload()
                                                            ->visible(fn (Get $get) => $get('estilos.catalogo.tipo_filtro') === 'categoria'),

                                                        MultiSelect::make('estilos.catalogo.subcategorias')
                                                            ->label('Subcategorías a incluir')
                                                            ->options(fn () => Subcategoria::with('categoria')->get()->mapWithKeys(fn ($sub) => [$sub->id => ($sub->categoria ? $sub->categoria->nombre.' > ' : '').$sub->nombre]))
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
                                            FileUpload::make('estilos.favicon')
                                                ->label('Favicon / Ícono del Sitio (.ico, .png, .svg)')
                                                ->image()
                                                ->disk('public')
                                                ->directory('sites/favicons')
                                                ->visibility('public')
                                                ->preserveFilenames()
                                                ->formatStateUsing(function ($state) {
                                                    if (is_array($state)) {
                                                        return array_values($state)[0] ?? null;
                                                    }
                                                    if (is_string($state) && str_starts_with(trim($state), '{')) {
                                                        $decoded = json_decode($state, true);
                                                        if (is_array($decoded)) {
                                                            return array_values($decoded)[0] ?? null;
                                                        }
                                                    }
                                                    return $state;
                                                })
                                                ->dehydrateStateUsing(function ($state) {
                                                    if (is_array($state)) {
                                                        return array_values($state)[0] ?? null;
                                                    }
                                                    return $state;
                                                }),
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
                                PlantillaForm::redesSocialesSection(),
                                PlantillaForm::metodosPagoSection(),
                            ]),

                        Tab::make('Respuestas / Contenido')
                            ->icon('heroicon-o-document-text')
                            ->visible(fn (Get $get) => filled($get('plantilla_id')))
                            ->schema(fn (Get $get): array => self::respuestasFields($get)),

                        Tab::make('Políticas y Términos')
                            ->icon('heroicon-o-scale')
                            ->schema(self::politicasFields()),
                    ])
                    ->columnSpanFull(),
            ]);
    }

    /**
     * @return array<int, Component>
     */
    private static function politicasFields(): array
    {
        return [
            Tabs::make('SubTabsPoliticas')
                ->persistTabInQueryString(false)
                ->tabs([
                    Tab::make('Términos y Condiciones')
                        ->icon('heroicon-o-document-text')
                        ->schema([
                            Textarea::make('estilos.politicas.terminos.intro')
                                ->label('Tarjeta Introductoria (Destacada)')
                                ->placeholder('Bienvenido a nuestra plataforma. En el presente documento se establecen las condiciones que regulan el uso de nuestro sitio web y los servicios disponibles.')
                                ->helperText('Texto inicial que aparece en la tarjeta con borde dorado/destacado.')
                                ->rows(4),
                            Section::make('Tarjetas de Contenido (Términos y Condiciones)')
                                ->description('Edita el contenido de cada tarjeta. Los títulos principales son fijos.')
                                ->collapsible()
                                ->schema([
                                    Textarea::make('estilos.politicas.terminos.sec_1')->label('1. Aceptación de los Términos')->rows(3)->placeholder('Al registrarte como usuario o utilizar la plataforma, aceptas los presentes Términos y Condiciones...'),
                                    Textarea::make('estilos.politicas.terminos.sec_2')->label('2. Descripción del Servicio')->rows(3)->placeholder('Nuestra plataforma proporciona servicios de comercio electrónico...'),
                                    Textarea::make('estilos.politicas.terminos.sec_3')->label('3. Registro y Responsabilidad del Usuario')->rows(3)->placeholder('El usuario es responsable de mantener la confidencialidad de sus datos de acceso...'),
                                    Textarea::make('estilos.politicas.terminos.sec_4')->label('4. Contenido de los Anuncios / Productos')->rows(3)->placeholder('Todo contenido o producto publicado debe cumplir con las leyes vigentes...'),
                                    Textarea::make('estilos.politicas.terminos.sec_5')->label('5. Planes y Pagos')->rows(3)->placeholder('Los precios, métodos de pago y condiciones de facturación se rigen bajo los acuerdos informados...'),
                                    Textarea::make('estilos.politicas.terminos.sec_6')->label('6. Propiedad Intelectual')->rows(3)->placeholder('Todos los contenidos, marcas y logotipos de este sitio son propiedad exclusiva...'),
                                    Textarea::make('estilos.politicas.terminos.sec_7')->label('7. Limitación de Responsabilidad')->rows(3)->placeholder('No nos hacemos responsables por fallas de conexión o uso indebido por parte de terceros...'),
                                    Textarea::make('estilos.politicas.terminos.sec_8')->label('8. Cancelación y Suspensión')->rows(3)->placeholder('Nos reservamos el derecho de suspender cuentas que infrinjan los términos...'),
                                    Textarea::make('estilos.politicas.terminos.sec_9')->label('9. Modificaciones de los Términos')->rows(3)->placeholder('Podremos actualizar estos términos periódicamente comunicando los cambios en el sitio...'),
                                    Textarea::make('estilos.politicas.terminos.sec_10')->label('10. Contacto')->rows(3)->placeholder('Si tienes dudas sobre estos Términos y Condiciones, contáctanos a través de nuestros canales oficiales.'),
                                ]),
                        ]),

                    Tab::make('Política de Privacidad')
                        ->icon('heroicon-o-shield-check')
                        ->schema([
                            Textarea::make('estilos.politicas.privacidad.intro')
                                ->label('Tarjeta Introductoria (Destacada)')
                                ->placeholder('Valoramos y respetamos la privacidad de nuestros usuarios. Esta política explica cómo recopilamos, utilizamos y protegemos tu información personal.')
                                ->helperText('Texto inicial que aparece en la tarjeta con borde dorado/destacado.')
                                ->rows(4),
                            Section::make('Tarjetas de Contenido (Política de Privacidad)')
                                ->description('Edita el contenido de cada tarjeta. Los títulos principales son fijos.')
                                ->collapsible()
                                ->schema([
                                    Textarea::make('estilos.politicas.privacidad.sec_1')->label('1. Información que Recopilamos')->rows(3)->placeholder('Recopilamos información proporcionada voluntariamente como nombre, teléfono, dirección y correo...'),
                                    Textarea::make('estilos.politicas.privacidad.sec_2')->label('2. Uso de la Información')->rows(3)->placeholder('Utilizamos la información para procesar pedidos, brindar atención al cliente y mejorar nuestros servicios...'),
                                    Textarea::make('estilos.politicas.privacidad.sec_3')->label('3. Protección de Datos')->rows(3)->placeholder('Implementamos medidas de seguridad administrativas y técnicas para salvaguardar tu información...'),
                                    Textarea::make('estilos.politicas.privacidad.sec_4')->label('4. Compartición de Información')->rows(3)->placeholder('No vendemos ni alquilamos tus datos personales a terceros sin tu previo consentimiento...'),
                                    Textarea::make('estilos.politicas.privacidad.sec_5')->label('5. Cookies')->rows(3)->placeholder('Utilizamos cookies para optimizar tu experiencia de navegación y recordar tus preferencias...'),
                                    Textarea::make('estilos.politicas.privacidad.sec_6')->label('6. Derechos del Usuario')->rows(3)->placeholder('Tienes derecho a acceder, corregir, actualizar o solicitar la eliminación de tus datos personales...'),
                                    Textarea::make('estilos.politicas.privacidad.sec_7')->label('7. Conservación de Datos')->rows(3)->placeholder('Conservamos la información personal durante el tiempo necesario para cumplir las finalidades descritas...'),
                                    Textarea::make('estilos.politicas.privacidad.sec_8')->label('8. Cambios a esta Política')->rows(3)->placeholder('Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento...'),
                                    Textarea::make('estilos.politicas.privacidad.sec_9')->label('9. Contacto')->rows(3)->placeholder('Para ejercer tus derechos de privacidad o realizar consultas, escríbenos a nuestros canales oficiales.'),
                                ]),
                        ]),

                    Tab::make('Política de Envíos')
                        ->icon('heroicon-o-truck')
                        ->schema([
                            Textarea::make('estilos.politicas.envios.intro')
                                ->label('Tarjeta Introductoria (Destacada)')
                                ->placeholder('Nos comprometemos a entregar tus productos de manera rápida, segura y oportuna.')
                                ->rows(3),
                            Section::make('Tarjetas de Contenido (Política de Envíos)')
                                ->collapsible()
                                ->schema([
                                    Textarea::make('estilos.politicas.envios.sec_1')->label('1. Cobertura y Zonas de Envío')->rows(3)->placeholder('Realizamos envíos a todo el territorio nacional y distritos autorizados...'),
                                    Textarea::make('estilos.politicas.envios.sec_2')->label('2. Tiempos y Plazos de Entrega')->rows(3)->placeholder('Los plazos estándar oscilan entre 24 a 72 horas hábiles según la ubicación...'),
                                    Textarea::make('estilos.politicas.envios.sec_3')->label('3. Costos y Métodos de Envío')->rows(3)->placeholder('Los costos de envío se calculan en base al destino y volumen del pedido...'),
                                    Textarea::make('estilos.politicas.envios.sec_4')->label('4. Recepción de Pedidos')->rows(3)->placeholder('Es necesario presentar identificación o número de orden al recibir el paquete...'),
                                ]),
                        ]),

                    Tab::make('Políticas de Devolución')
                        ->icon('heroicon-o-arrow-path')
                        ->schema([
                            Textarea::make('estilos.politicas.devoluciones.intro')
                                ->label('Tarjeta Introductoria (Destacada)')
                                ->placeholder('Tu satisfacción es nuestra prioridad. Contamos con políticas claras para cambios y devoluciones.')
                                ->rows(3),
                            Section::make('Tarjetas de Contenido (Políticas de Devolución)')
                                ->collapsible()
                                ->schema([
                                    Textarea::make('estilos.politicas.devoluciones.sec_1')->label('1. Condiciones para Cambios y Devoluciones')->rows(3)->placeholder('El producto debe encontrarse sin uso, con empaque original y comprobante de compra...'),
                                    Textarea::make('estilos.politicas.devoluciones.sec_2')->label('2. Plazos para Devoluciones')->rows(3)->placeholder('Dispones de un plazo de 7 días calendario tras recibir tu pedido para solicitar un cambio...'),
                                    Textarea::make('estilos.politicas.devoluciones.sec_3')->label('3. Proceso y Reembolsos')->rows(3)->placeholder('Los reembolsos se procesan por el mismo medio de pago utilizado dentro de 5 a 10 días hábiles...'),
                                    Textarea::make('estilos.politicas.devoluciones.sec_4')->label('4. Excepciones')->rows(3)->placeholder('Productos perecibles, personalizados o en remate final no aplican para devolución...'),
                                ]),
                        ]),
                ])
                ->columnSpanFull(),
        ];
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

