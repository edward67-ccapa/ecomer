import { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import DynamicIcon from '@/components/DynamicIcon';
import { useCartStore } from '@/stores/useCartStore';

import 'swiper/css';

export default function MarcasSection({
    seccionData,
    productos = [],
    marcasSitio = [],
    onSeleccionarProducto,
}) {
    const addItem = useCartStore((state) => state.addItem);
    const cartItems = useCartStore((state) => state.items);

    const getItem = (label) =>
        seccionData?.contenido?.find(
            (item) => item.label?.toLowerCase() === label.toLowerCase()
        );
    const getValor = (label) => getItem(label)?.valor;

    // Títulos opcionales desde seccionData
    const subTitulo = getValor('sub_titulo') || getValor('subtitulo') || '';
    const titulo = getValor('titulo') || getValor('title') || 'Nuestras Marcas';
    const descripcion = getValor('descripcion') || getValor('descripción') || '';

    // 1. Extraer Marcas del Backend (sitio / plantilla)
    const marcasFromBackend = useMemo(() => {
        if (!Array.isArray(marcasSitio)) return [];
        return marcasSitio
            .map((m) => {
                if (typeof m === 'string') {
                    return { titulo: m, imagen: null, slug: null };
                }
                return {
                    id: m.id,
                    titulo: m.titulo || m.nombre || '',
                    imagen: m.imagen || m.logo || null,
                    slug: m.slug || null,
                    descripcion: m.descripcion || null,
                };
            })
            .filter((m) => m.titulo || m.imagen);
    }, [marcasSitio]);

    // 2. Extraer Imágenes de la galería de Marcas en CMS (seccionData)
    const imagenesRaw =
        getValor('imagenes') ||
        getValor('imágenes') ||
        getValor('marcas') ||
        getValor('logos') ||
        getValor('galeria');

    const marcasFromCMS = useMemo(() => {
        let list = [];
        if (Array.isArray(imagenesRaw)) {
            list = imagenesRaw.map((item, idx) => {
                if (typeof item === 'string') {
                    return { titulo: `Marca ${idx + 1}`, imagen: item.trim() };
                }
                return {
                    titulo: item?.titulo || item?.nombre || item?.label || `Marca ${idx + 1}`,
                    imagen: item?.imagen || item?.url || item?.src || null,
                };
            });
        } else if (typeof imagenesRaw === 'string' && imagenesRaw.trim()) {
            list = [{ titulo: 'Marca', imagen: imagenesRaw.trim() }];
        }
        return list.filter((m) => m.imagen || m.titulo);
    }, [imagenesRaw]);

    // 3. Extraer Marcas asignadas a los Productos
    const marcasFromProductos = useMemo(() => {
        if (!Array.isArray(productos)) return [];
        const map = new Map();
        productos.forEach((p) => {
            if (p.marca_objeto && (p.marca_objeto.titulo || p.marca_objeto.imagen)) {
                const key = (p.marca_objeto.titulo || p.marca_objeto.id).toString().toLowerCase();
                if (!map.has(key)) {
                    map.set(key, {
                        id: p.marca_objeto.id,
                        titulo: p.marca_objeto.titulo,
                        imagen: p.marca_objeto.imagen,
                        slug: p.marca_objeto.slug,
                    });
                }
            } else if (p.marca && typeof p.marca === 'string') {
                const key = p.marca.toLowerCase().trim();
                if (!map.has(key)) {
                    map.set(key, {
                        titulo: p.marca,
                        imagen: p.marca_imagen || null,
                    });
                }
            }
        });
        return Array.from(map.values());
    }, [productos]);

    // Combinar y deduplicar marcas manteniendo el orden de prioridad: Backend > Productos > CMS
    const marcasList = useMemo(() => {
        const result = [];
        const seenKeys = new Set();

        const addMarca = (m) => {
            const key = (m.titulo || m.imagen || '').toString().toLowerCase().trim();
            if (key && !seenKeys.has(key)) {
                seenKeys.add(key);
                result.push(m);
            }
        };

        marcasFromBackend.forEach(addMarca);
        marcasFromProductos.forEach(addMarca);
        marcasFromCMS.forEach(addMarca);

        return result;
    }, [marcasFromBackend, marcasFromProductos, marcasFromCMS]);

    // Extraer Categorías desde seccionData CMS (si están configuradas)
    const categoriasRaw = getValor('categorias') || getValor('categorías') || getValor('categoria') || getValor('lista_categorias');
    const cmsCatList = useMemo(() => {
        if (Array.isArray(categoriasRaw)) {
            return categoriasRaw
                .map((cat) => (typeof cat === 'string' ? cat.trim() : (cat?.nombre || cat?.label || cat?.titulo || null)))
                .filter(Boolean);
        } else if (typeof categoriasRaw === 'string' && categoriasRaw.trim()) {
            return [categoriasRaw.trim()];
        }
        return [];
    }, [categoriasRaw]);

    // Agrupar productos por categorías configuradas o por marcas asignadas
    const productosPorCategoria = useMemo(() => {
        if (!productos || productos.length === 0) return [];

        const result = [];

        if (cmsCatList.length > 0) {
            cmsCatList.forEach((catName) => {
                const target = catName.toLowerCase().trim();
                const prodsDeCat = productos.filter((p) => {
                    const c = typeof p.categoria === 'string'
                        ? p.categoria
                        : (p.categoria?.nombre || p.categoria?.slug || '');
                    const cLower = c.toLowerCase().trim();
                    return cLower === target || cLower.includes(target) || target.includes(cLower);
                });

                if (prodsDeCat.length > 0) {
                    result.push({
                        nombre: catName,
                        productos: prodsDeCat,
                    });
                }
            });
            if (result.length > 0) return result;
        }

        // Si hay productos con marcas asignadas, agrupar por marca
        const prodsConMarca = productos.filter((p) => p.marca || p.marca_objeto);
        if (prodsConMarca.length > 0) {
            const mapMarca = new Map();
            prodsConMarca.forEach((p) => {
                const marcaNombre = p.marca_objeto?.titulo || (typeof p.marca === 'string' ? p.marca : null) || 'Otras Marcas';
                if (!mapMarca.has(marcaNombre)) {
                    mapMarca.set(marcaNombre, []);
                }
                mapMarca.get(marcaNombre).push(p);
            });

            mapMarca.forEach((prods, marcaNombre) => {
                result.push({
                    nombre: marcaNombre,
                    productos: prods,
                });
            });
        }

        return result;
    }, [cmsCatList, productos]);

    const isInCart = (prod) => {
        const prodId = prod.id || prod.nombre;
        return cartItems.some((item) => (item.id || item.nombre) === prodId);
    };

    const handleCardClick = (prod) => {
        if (onSeleccionarProducto) {
            onSeleccionarProducto(prod);
        } else if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('producto', prod.slug || prod.id);
            window.history.pushState({}, '', url.toString());
            window.dispatchEvent(new PopStateEvent('popstate'));
            window.scrollTo(0, 0);
        }
    };

    if (!seccionData && marcasList.length === 0 && productos.length === 0) return null;

    return (
        <section id="marcas" className="scroll-mt-10 py-10 sm:py-14 bg-white border-t border-gray-100">
            <div className="mx-auto w-full max-w-[1540px] px-3 sm:px-6 lg:px-8">
                {/* Cabecera de la Sección */}
                <div className="mb-6 pb-3 border-b border-gray-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        {subTitulo && (
                            <p
                                className="text-xs font-bold uppercase tracking-widest mb-1"
                                style={{ color: 'var(--color-primario)', fontFamily: 'var(--tipografia-texto)' }}
                            >
                                {subTitulo}
                            </p>
                        )}
                        <h2
                            className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight"
                            style={{ fontFamily: 'var(--tipografia-titulos)' }}
                        >
                            {titulo}
                        </h2>
                        {descripcion && (
                            <p className="mt-1 text-sm text-gray-500 max-w-2xl leading-relaxed">
                                {descripcion}
                            </p>
                        )}
                    </div>
                </div>

                {/* ── CARRUSEL DE LOGOS / MARCAS ── */}
                {marcasList.length > 0 && (
                    <div className="mb-10">
                        <Swiper
                            modules={[Autoplay]}
                            spaceBetween={16}
                            slidesPerView={2}
                            loop={marcasList.length > 3}
                            autoplay={{
                                delay: 2500,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            speed={600}
                            breakpoints={{
                                480: { slidesPerView: 3, spaceBetween: 16 },
                                768: { slidesPerView: 4, spaceBetween: 20 },
                                1024: { slidesPerView: 5, spaceBetween: 24 },
                                1280: { slidesPerView: 6, spaceBetween: 28 },
                            }}
                            className="py-2"
                        >
                            {marcasList.map((m, idx) => (
                                <SwiperSlide key={m.id || m.slug || idx}>
                                    <div className="flex items-center justify-center h-24 sm:h-28 bg-white border border-gray-200/80 rounded-xl p-4 shadow-2xs hover:shadow-md hover:border-gray-300 transition-all duration-300 group cursor-pointer text-center">
                                        {m.imagen ? (
                                            <img
                                                src={m.imagen}
                                                alt={m.titulo || `Marca ${idx + 1}`}
                                                width={300}
                                                height={150}
                                                className="max-h-full max-w-full object-contain opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        ) : (
                                            <span
                                                className="text-sm sm:text-base font-extrabold text-gray-700 tracking-tight group-hover:text-[var(--color-primario)] transition-colors line-clamp-2"
                                                style={{ fontFamily: 'var(--tipografia-titulos)' }}
                                            >
                                                {m.titulo}
                                            </span>
                                        )}
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}

                {/* ── SECCIONES POR CATEGORÍA (ÚNICAMENTE LAS CATEGORÍAS CONFIGURADAS EN MARCAS) ── */}
                {productosPorCategoria.length > 0 ? (
                    <div className="space-y-10">
                        {productosPorCategoria.map((catGroup, catIdx) => (
                            <div key={catIdx} className="space-y-3">
                                {/* Encabezado de la Fila de Categoría */}
                                <div className="flex items-center justify-between pb-2 border-b border-gray-200/80">
                                    <div className="flex items-center gap-2.5">
                                        <span
                                            className="w-3 h-3 rounded-full shrink-0"
                                            style={{ backgroundColor: 'var(--color-primario)' }}
                                        />
                                        <h3
                                            className="text-lg sm:text-xl font-black text-gray-900 tracking-tight"
                                            style={{ fontFamily: 'var(--tipografia-titulos)' }}
                                        >
                                            {catGroup.nombre}
                                        </h3>
                                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                                            {catGroup.productos.length} {catGroup.productos.length === 1 ? 'producto' : 'productos'}
                                        </span>
                                    </div>
                                </div>

                                {/* Fila de Productos de la Categoría con Scroll Horizontal X */}
                                <div className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    {catGroup.productos.map((prod, idx) => {
                                        const inCart = isInCart(prod);
                                        const tieneOferta = Boolean(prod.precio_oferta || prod.precio_oferta_soles);
                                        const precioRegular = Number(prod.precio_soles || prod.precio || 0);
                                        const precioOferta = tieneOferta
                                            ? Number(prod.precio_oferta_soles || prod.precio_oferta)
                                            : null;

                                        const descOferta = tieneOferta && precioRegular > 0
                                            ? Math.round(((precioRegular - precioOferta) / precioRegular) * 100)
                                            : null;
                                        const descRegular = descOferta ? Math.max(5, Math.round(descOferta * 0.75)) : null;
                                        const precioListaReferencial = Math.round(precioRegular * 1.3);

                                        const categoriaTexto = prod.categoria
                                            ? (typeof prod.categoria === 'string' ? prod.categoria : (prod.categoria?.nombre || ''))
                                            : catGroup.nombre;

                                        return (
                                            <div
                                                key={prod.id || idx}
                                                onClick={() => handleCardClick(prod)}
                                                className="shrink-0 w-[240px] sm:w-[280px] bg-white border border-gray-200 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between relative cursor-pointer shadow-xs hover:shadow-md transition-shadow duration-200"
                                            >
                                                <div>
                                                    {/* Imagen del Producto */}
                                                    <div className="relative aspect-square w-full mb-3 flex items-center justify-center bg-white rounded-lg overflow-hidden border border-gray-100">
                                                        {/* Badge Categoría Premium */}
                                                        {categoriaTexto && (
                                                            <span
                                                                className="absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/95 backdrop-blur-md shadow-xs border border-gray-100 text-gray-800"
                                                                style={{ fontFamily: 'var(--tipografia-texto)' }}
                                                            >
                                                                <span
                                                                    className="w-1.5 h-1.5 rounded-full"
                                                                    style={{ backgroundColor: 'var(--color-primario)' }}
                                                                />
                                                                <span>{categoriaTexto}</span>
                                                            </span>
                                                        )}

                                                        {/* Badge OFERTA */}
                                                        {tieneOferta && (
                                                            <span
                                                                className="absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-md"
                                                                style={{
                                                                    backgroundColor: 'var(--color-primario)',
                                                                    fontFamily: 'var(--tipografia-titulos)',
                                                                }}
                                                            >
                                                                <DynamicIcon name="FaFire" className="h-2.5 w-2.5" />
                                                                <span>OFERTA</span>
                                                                {descOferta && <span className="ml-0.5 font-bold">-{descOferta}%</span>}
                                                            </span>
                                                        )}

                                                        {prod.imagen ? (
                                                            <img
                                                                src={prod.imagen}
                                                                alt={prod.nombre}
                                                                width={400}
                                                                height={400}
                                                                loading="lazy"
                                                                decoding="async"
                                                                className="w-full h-full max-w-full max-h-full object-cover"
                                                                style={{ maxWidth: '100%', maxHeight: '100%', width: '100%', height: '100%', objectFit: 'cover' }}
                                                            />
                                                        ) : (
                                                            <div className="flex flex-col items-center justify-center text-gray-300 gap-1.5">
                                                                <DynamicIcon name="FaBoxOpen" className="h-12 w-12 text-gray-300" />
                                                                <span className="text-[11px] text-gray-400">Sin imagen</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Nombre del Producto */}
                                                    <h4
                                                        className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 min-h-[2.4rem] leading-snug mb-1.5"
                                                        title={prod.nombre}
                                                    >
                                                        {prod.nombre}
                                                    </h4>

                                                    {/* Descripción Corta */}
                                                    {(prod.descripcion_corta || prod.descripcion) && (
                                                        <p
                                                            className="text-[11px] text-gray-500 line-clamp-2 min-h-[2rem] leading-relaxed mb-3"
                                                            title={prod.descripcion_corta || prod.descripcion}
                                                        >
                                                            {prod.descripcion_corta || prod.descripcion}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Bloque de Precios y Botón */}
                                                <div className="mt-auto pt-2 border-t border-gray-100">
                                                    {tieneOferta ? (
                                                        <>
                                                            <div className="flex items-baseline gap-1.5 mb-1 flex-wrap">
                                                                <span className="text-xs font-black text-[#0089CF]">S/</span>
                                                                <span className="text-2xl sm:text-3xl font-black text-[#0089CF] tracking-tight leading-none">
                                                                    {precioOferta.toFixed(0)}
                                                                </span>
                                                                {descOferta && (
                                                                    <span className="bg-[#0089CF] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-xs leading-none">
                                                                        -{descOferta}%
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="flex items-baseline gap-1.5 mb-0.5">
                                                                <span className="text-xs font-bold text-gray-900">S/</span>
                                                                <span className="text-lg font-extrabold text-gray-900 leading-none">
                                                                    {precioRegular.toFixed(0)}
                                                                </span>
                                                                {descRegular && (
                                                                    <span
                                                                        className="text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-xs leading-none"
                                                                        style={{ backgroundColor: 'var(--color-primario)' }}
                                                                    >
                                                                        -{descRegular}%
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="text-[11px] text-gray-400 line-through leading-none mb-2">
                                                                s/ {precioListaReferencial}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="mb-3">
                                                            <div className="flex items-baseline gap-1.5">
                                                                <span className="text-xs font-black text-gray-900">S/</span>
                                                                <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-none">
                                                                    {precioRegular.toFixed(0)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            addItem(prod);
                                                        }}
                                                        className="w-full py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm tracking-wide cursor-pointer active:scale-98 border-2 transition-colors"
                                                        style={{
                                                            backgroundColor: inCart ? 'var(--color-primario)' : '#ffffff',
                                                            borderColor: 'var(--color-primario)',
                                                            color: inCart ? '#ffffff' : 'var(--color-primario)',
                                                            fontFamily: 'var(--tipografia-titulos)',
                                                        }}
                                                    >
                                                        {inCart ? 'Agregado ✓' : 'Agregar'}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center bg-gray-50/50 rounded-xl border border-gray-200/80 p-8 my-2">
                        <DynamicIcon name="FaBoxOpen" className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 font-medium text-sm">No hay productos disponibles para las categorías de Marcas por el momento.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
