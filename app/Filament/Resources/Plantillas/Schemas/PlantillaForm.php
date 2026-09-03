<?php

namespace App\Filament\Resources\Plantillas\Schemas;

use App\Models\Plantilla;
use App\Models\Pregunta;
use App\Filament\Forms\Components\IconPicker;
use App\Filament\Forms\Components\LinkPicker;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\MultiSelect;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;

use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Component;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Illuminate\Support\HtmlString;

class PlantillaForm
{
    public static function configure(Schema $schema): Schema
    {
        $record = $schema->getRecord();
        $respuestasSchema = ($record instanceof Plantilla && $record->exists)
            ? self::respuestasFields($record)
            : [];

        return $schema
            ->components([
                Tabs::make('PlantillaTabs')
                    ->persistTabInQueryString(false)
                    ->tabs([
                        Tab::make('Estructura & Preguntas')
                            ->icon('heroicon-o-squares-2x2')
                            ->schema([
                                Tabs::make('SubTabsEstructura')
                                    ->persistTabInQueryString(false)
                                    ->tabs([
                                        Tab::make('General & Estilos')
                                            ->icon('heroicon-o-cog')
                                            ->schema([
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
                                                                    ->webp5Mb('plantillas', 'public')
                                                                    ->orientImagesFromExif(false)
                                                                    ->uploadingMessage('Subiendo imagen...')
                                                                    ->deletable(true)
                                                                    ->openable()
                                                                    ->downloadable(),
                                                            ])
                                                            ->columnSpan(1),

                                                        Section::make('Estilos globales')
                                                            ->icon('heroicon-o-paint-brush')
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
                                                            ->searchable(),
                                                    ])
                                                    ->columnSpanFull(),
                                            ]),

                                        Tab::make('Secciones & Preguntas')
                                            ->icon('heroicon-o-squares-2x2')
                                            ->schema([
                                                Repeater::make('secciones')
                                                    ->relationship()
                                                    ->label('Secciones de la plantilla')
                                                    ->reorderableWithDragAndDrop()
                                                    ->collapsible()
                                                    ->collapsed()
                                                    ->itemLabel(fn (array $state): ?string => isset($state['nombre']) && filled($state['nombre']) ? "Sección: {$state['nombre']} (" . ($state['slug'] ?? 'sin-slug') . ")" : 'Nueva Sección')
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
                                                            ->reorderableWithDragAndDrop()
                                                            ->collapsible()
                                                            ->collapsed()
                                                            ->itemLabel(fn (array $state): ?string => isset($state['label']) && filled($state['label']) ? "Pregunta: {$state['label']} [" . ($state['tipo'] ?? 'texto') . "]" : 'Nueva Pregunta')
                                                            ->schema([
                                                                Grid::make(7)->schema([
                                                                    TextInput::make('label')
                                                                        ->required()
                                                                        ->maxLength(255)
                                                                        ->placeholder('portada, titulo1, subtitulo...'),
                                                                    Select::make('tipo')
                                                                        ->options(self::tiposPregunta())
                                                                        ->required()
                                                                        ->live(onBlur: true)
                                                                        ->default('texto'),
                                                                    Select::make('estructura')
                                                                        ->options([
                                                                            'objeto' => 'Objeto (Valor único)',
                                                                            'array' => 'Array (Múltiple/Repetible)',
                                                                        ])
                                                                        ->default('objeto')
                                                                        ->live(onBlur: true)
                                                                        ->required(),
                                                                    TextInput::make('max_items')
                                                                        ->numeric()
                                                                        ->label('Límite')
                                                                        ->placeholder('Infinito')
                                                                        ->visible(fn (Get $get): bool => $get('estructura') === 'array'),
                                                                    TextInput::make('orden')
                                                                        ->numeric()
                                                                        ->default(0),
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
                                                                        Grid::make(6)->schema([
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
                                                                            TextInput::make('ayuda')
                                                                                ->placeholder('Texto de ayuda')
                                                                                ->columnSpan(1),
                                                                        ]),
                                                                    ])
                                                                    ->itemLabel(fn (array $state): ?string => isset($state['label']) ? "Campo: {$state['label']}" : null)
                                                                    ->reorderableWithDragAndDrop()
                                                                    ->collapsible()
                                                                    ->collapsed()
                                                                    ->columns(1),
                                                            ])
                                                            ->columns(1),
                                                    ]),
                                             ]),
                                     ]),
                             ]),

                        Tab::make('Respuestas por Defecto')
                            ->icon('heroicon-o-document-text')
                            ->visible(fn (?Plantilla $record): bool => filled($record?->id))
                            ->schema($respuestasSchema),
                    ])
                    ->columnSpanFull(),
            ]);
    }

    private static array $respuestasSchemaCache = [];

    /**
     * @return array<int, Component>
     */
    public static function respuestasFields(Plantilla $plantilla): array
    {
        if (isset(self::$respuestasSchemaCache[$plantilla->id])) {
            return self::$respuestasSchemaCache[$plantilla->id];
        }

        $plantilla->unsetRelation('secciones');
        $plantilla->load(['secciones.preguntas' => fn ($q) => $q->orderBy('orden')->with('children')]);
        $subTabs = [];

        foreach ($plantilla->secciones as $seccion) {
            $fields = [];

            foreach ($seccion->preguntas->whereNull('parent_id') as $pregunta) {
                $campo = self::campoRespuesta($pregunta);
                if (is_array($campo)) {
                    array_push($fields, ...$campo);
                } else {
                    $fields[] = $campo;
                }
            }

            if (! empty($fields)) {
                $subTabs[] = Tab::make($seccion->nombre)
                    ->icon('heroicon-o-document-text')
                    ->schema($fields)
                    ->columns(2);
            }
        }

        if (empty($subTabs)) {
            return self::$respuestasSchemaCache[$plantilla->id] = [];
        }

        return self::$respuestasSchemaCache[$plantilla->id] = [
            Tabs::make('SubTabsSeccionesRespuestas')
                ->persistTabInQueryString(false)
                ->tabs($subTabs)
                ->columnSpanFull(),
        ];
    }

    /**
     * @return Component|array<int, Component>
     */
    private static function campoRespuesta(Pregunta $pregunta): Component|array
    {
        $statePath = "respuestas.{$pregunta->id}.valor";
        $linkPath = "respuestas.{$pregunta->id}.enlace";

        // Construir el campo principal
        $field = match ($pregunta->tipo) {
            'area' => Textarea::make($statePath)
                ->rows(3)
                ->placeholder('Escribe el contenido aquí...'),

            'imagen' => FileUpload::make($statePath)
                ->webp5Mb('sites/contenido', 'public')
                ->orientImagesFromExif(false)
                ->uploadingMessage('Subiendo imagen...')
                ->deletable(true)
                ->openable()
                ->downloadable()
                ->helperText('Máximo 5MB. Se convertirá automáticamente a WebP.'),

            'galeria' => FileUpload::make($statePath)
                ->multiple()
                ->webp5Mb('sites/contenido', 'public')
                ->orientImagesFromExif(false)
                ->uploadingMessage('Subiendo imágenes...')
                ->deletable(true)
                ->openable()
                ->downloadable()
                ->helperText('Puedes subir múltiples imágenes (Máximo 5MB cada una, formato WebP)'),

            'color' => ColorPicker::make($statePath)
                ->helperText('Selecciona un color'),

            'icono' => IconPicker::make($statePath),

            'enlace' => TextInput::make($statePath)
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
                            'imagen' => FileUpload::make($childPath)->webp5Mb('sites/contenido', 'public')->orientImagesFromExif(false)->uploadingMessage('Subiendo imagen...')->deletable(true)->openable()->downloadable(),
                            'galeria' => FileUpload::make($childPath)->multiple()->webp5Mb('sites/contenido', 'public')->orientImagesFromExif(false)->uploadingMessage('Subiendo imágenes...')->deletable(true)->openable()->downloadable(),
                            'color' => ColorPicker::make($childPath),
                            'icono' => IconPicker::make($childPath),
                            'enlace' => TextInput::make($childPath)->placeholder('https://ejemplo.com'),
                            default => TextInput::make($childPath),
                        };

                        return $subField->label($child->label);
                    })->all();
                })
                ->itemLabel(fn (array $state): ?string => $state['nombre'] ?? $state['titulo'] ?? $state['label'] ?? null)
                ->defaultItems($pregunta->estructura === 'objeto' ? 1 : 0)
                ->minItems($pregunta->estructura === 'objeto' ? 1 : 0)
                ->maxItems($pregunta->estructura === 'objeto' ? 1 : $pregunta->max_items)
                ->deletable($pregunta->estructura === 'array')
                ->reorderable($pregunta->estructura === 'array')
                ->collapsible(),

            default => TextInput::make($statePath)
                ->placeholder('Ingresa el valor...'),
        };

        // Aplicar propiedades comunes
        $field = $field
            ->label($pregunta->label)
            ->helperText($pregunta->ayuda)
            ->required($pregunta->requerida);

        if ($pregunta->tipo === 'enlace' || ($pregunta->tipo === 'grupo' && $pregunta->estructura === 'array')) {
            return $field;
        }

        return [
            $field,
            LinkPicker::make($linkPath),
        ];
    }

    public static function tiposPregunta(): array
    {
        return [
            'texto' => 'Texto corto',
            'area' => 'Texto largo (Área)',
            'imagen' => 'Imagen',
            'galeria' => 'Galería de imágenes',
            'color' => 'Selector de color',
            'icono' => 'Ícono (react-icons)',
            'enlace' => 'Enlace (URL)',
            'grupo' => 'Grupo (Conjunto de campos)',
        ];
    }

    public static function fuentes(): array
    {
        return [
            'Inter' => 'Inter',
            'Roboto' => 'Roboto',
            'Montserrat' => 'Montserrat',
            'Poppins' => 'Poppins',
            'Playfair Display' => 'Playfair Display',
            'Lora' => 'Lora',
            'Merriweather' => 'Merriweather',
            'Outfit' => 'Outfit',
            'Plus Jakarta Sans' => 'Plus Jakarta Sans',
        ];
    }

    public static function getIconOptions(): array
    {
        return [
            'Redes Sociales y Contacto' => [
                'FaWhatsapp' => 'FaWhatsapp (WhatsApp)',
                'FaInstagram' => 'FaInstagram (Instagram)',
                'FaFacebook' => 'FaFacebook (Facebook)',
                'FaTiktok' => 'FaTiktok (TikTok)',
                'FaYoutube' => 'FaYoutube (YouTube)',
                'FaXTwitter' => 'FaXTwitter (Twitter / X)',
                'FaEnvelope' => 'FaEnvelope (Correo / Email)',
                'FaPhone' => 'FaPhone (Teléfono)',
                'FaLocationDot' => 'FaLocationDot (Ubicación / Mapa)',
                'FaGlobe' => 'FaGlobe (Sitio Web / Global)',
                'FaHouseFlag' => 'FaHouseFlag (Tienda / Sede)',
                'FaStore' => 'FaStore (Local / Tienda)',
                'TbBrandWhatsapp' => 'TbBrandWhatsapp (WhatsApp Tabler)',
                'HiOutlineEnvelope' => 'HiOutlineEnvelope (Correo Heroicons)',
                'HiOutlinePhone' => 'HiOutlinePhone (Teléfono Heroicons)',
            ],
            'Comida, Pastelería y Repostería' => [
                'HiOutlineCake' => 'HiOutlineCake (Pastel / Torta)',
                'PiCakeBold' => 'PiCakeBold (Torta Phosphor)',
                'TbCake' => 'TbCake (Torta Cumpleaños)',
                'FaCookieBite' => 'FaCookieBite (Galleta)',
                'FaCookie' => 'FaCookie (Galleta Entera)',
                'FaIceCream' => 'FaIceCream (Helado)',
                'FaBreadSlice' => 'FaBreadSlice (Pan)',
                'FaCoffee' => 'FaCoffee (Café)',
                'FaMugHot' => 'FaMugHot (Taza Caliente)',
                'FaUtensils' => 'FaUtensils (Cubiertos / Menú)',
                'FaBurger' => 'FaBurger (Hamburguesa)',
                'FaPizzaSlice' => 'FaPizzaSlice (Pizza)',
                'FaBowlFood' => 'FaBowlFood (Plato de Comida)',
                'FaAppleWhole' => 'FaAppleWhole (Manzana / Saludable)',
                'FaWineGlass' => 'FaWineGlass (Copa / Vino)',
                'TbChefHat' => 'TbChefHat (Gorro de Chef)',
                'MdOutlineCake' => 'MdOutlineCake (Torta Material)',
                'MdOutlineFastfood' => 'MdOutlineFastfood (Comida Rápida)',
            ],
            'E-commerce, Compras y Ofertas' => [
                'FaShoppingCart' => 'FaShoppingCart (Carrito de Compras)',
                'FaShoppingBag' => 'FaShoppingBag (Bolsa de Compras)',
                'HiOutlineShoppingBag' => 'HiOutlineShoppingBag (Bolsa Heroicons)',
                'TbShoppingBag' => 'TbShoppingBag (Bolsa Tabler)',
                'FaTag' => 'FaTag (Etiqueta / Precio)',
                'FaTags' => 'FaTags (Etiquetas)',
                'FaCreditCard' => 'FaCreditCard (Tarjeta de Crédito)',
                'FaMoneyBillWave' => 'FaMoneyBillWave (Dinero / Efectivo)',
                'FaGift' => 'FaGift (Regalo / Promoción)',
                'FaReceipt' => 'FaReceipt (Recibo / Factura)',
                'FaPercent' => 'FaPercent (Descuento %)',
                'TbDiscount' => 'TbDiscount (Descuento Tabler)',
                'FaBoxOpen' => 'FaBoxOpen (Caja Abierta)',
                'FaCoins' => 'FaCoins (Monedas / Puntos)',
                'PiStorefrontBold' => 'PiStorefrontBold (Fachada Tienda)',
                'MdOutlinePayments' => 'MdOutlinePayments (Pagos)',
                'MdOutlineDiscount' => 'MdOutlineDiscount (Descuento Material)',
                'HiOutlineTag' => 'HiOutlineTag (Etiqueta Heroicons)',
                'HiOutlineGift' => 'HiOutlineGift (Regalo Heroicons)',
                'PiHandbagBold' => 'PiHandbagBold (Bolso / Compra)',
            ],
            'Envíos, Logística y Horarios' => [
                'TbTruckDelivery' => 'TbTruckDelivery (Delivery / Envío)',
                'FaTruck' => 'FaTruck (Camión de Envío)',
                'FaTruckFast' => 'FaTruckFast (Envío Rápido Express)',
                'MdOutlineLocalShipping' => 'MdOutlineLocalShipping (Envío Local)',
                'FaClock' => 'FaClock (Tiempo / Horario)',
                'FaCalendarDays' => 'FaCalendarDays (Calendario / Fechas)',
                'FaShieldHalved' => 'FaShieldHalved (Seguridad / Garantía)',
                'MdOutlineVerified' => 'MdOutlineVerified (Verificado)',
                'TbRosetteDiscountCheck' => 'TbRosetteDiscountCheck (Garantía Calidad)',
                'FaBox' => 'FaBox (Paquete)',
                'TbPackage' => 'TbPackage (Paquete Tabler)',
                'FaRoute' => 'FaRoute (Ruta / En Tránsito)',
                'FaMapPin' => 'FaMapPin (Punto Mapa)',
                'HiOutlineShieldCheck' => 'HiOutlineShieldCheck (Escudo Seguro)',
                'HiOutlineClock' => 'HiOutlineClock (Horario Heroicons)',
            ],
            'Calidad, Badges y Reacciones' => [
                'PiPaintBrushHouseholdBold' => 'PiPaintBrushHouseholdBold (Diseño / Personalizado)',
                'FaStar' => 'FaStar (Estrella Rellena)',
                'FaRegStar' => 'FaRegStar (Estrella Borde)',
                'FaHeart' => 'FaHeart (Corazón Relleno)',
                'FaRegHeart' => 'FaRegHeart (Corazón Borde)',
                'FaAward' => 'FaAward (Premio / Reconocimiento)',
                'FaMedal' => 'FaMedal (Medalla)',
                'FaCircleCheck' => 'FaCircleCheck (Check / Correcto)',
                'FaThumbsUp' => 'FaThumbsUp (Me Gusta / Recomendado)',
                'FaCrown' => 'FaCrown (Premium / VIP)',
                'TbSparkles' => 'TbSparkles (Especial / Brillo)',
                'HiOutlineSparkles' => 'HiOutlineSparkles (Brillo Heroicons)',
                'FaGem' => 'FaGem (Joya / Calidad)',
                'FaCertificate' => 'FaCertificate (Certificado)',
                'FaWrench' => 'FaWrench (Servicio / Soporte)',
                'FaFire' => 'FaFire (Popular / En Tendencia)',
            ],
            'Interfaz y Navegación' => [
                'FaMagnifyingGlass' => 'FaMagnifyingGlass (Buscar / Lupa)',
                'FaUser' => 'FaUser (Usuario / Cuenta)',
                'FaRegUser' => 'FaRegUser (Usuario Borde)',
                'FaBars' => 'FaBars (Menú Hamburguesa)',
                'FaXmark' => 'FaXmark (Cerrar / X)',
                'FaChevronDown' => 'FaChevronDown (Flecha Abajo)',
                'FaChevronRight' => 'FaChevronRight (Flecha Derecha)',
                'FaChevronLeft' => 'FaChevronLeft (Flecha Izquierda)',
                'FaChevronUp' => 'FaChevronUp (Flecha Arriba)',
                'FaArrowRight' => 'FaArrowRight (Flecha Continuar)',
                'FaPlus' => 'FaPlus (Agregar / Más)',
                'FaMinus' => 'FaMinus (Quitar / Menos)',
                'FaTrash' => 'FaTrash (Eliminar / Basura)',
                'FaPenToSquare' => 'FaPenToSquare (Editar)',
                'FaFilter' => 'FaFilter (Filtrar)',
                'FaShareNodes' => 'FaShareNodes (Compartir)',
                'FaCircleInfo' => 'FaCircleInfo (Información)',
                'FaCircleQuestion' => 'FaCircleQuestion (Pregunta / Ayuda)',
                'FaEye' => 'FaEye (Ver / Previsualizar)',
                'FaLock' => 'FaLock (Bloqueado / Candado)',
            ],
            'Negocios y Soporte' => [
                'FaChartLine' => 'FaChartLine (Crecimiento / Ventas)',
                'FaBriefcase' => 'FaBriefcase (Portafolio / Negocios)',
                'FaBuilding' => 'FaBuilding (Empresa / Edificio)',
                'FaHandshake' => 'FaHandshake (Trato / Alianza)',
                'FaUsers' => 'FaUsers (Equipo / Clientes)',
                'FaBullhorn' => 'FaBullhorn (Anuncios / Novedades)',
                'FaHeadphones' => 'FaHeadphones (Audífonos / Soporte)',
                'MdOutlineSupportAgent' => 'MdOutlineSupportAgent (Agente de Soporte)',
            ]
        ];
    }
}

