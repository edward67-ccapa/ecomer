import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import DynamicIcon from '@/components/DynamicIcon';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';

import { useCartStore } from '@/stores/useCartStore';

export default function ProductosDestacadosSection({
    seccionData,
    productos = [],
    onSeleccionarProducto,
}) {
    const addItem = useCartStore((state) => state.addItem);
    const cartItems = useCartStore((state) => state.items);

    if (!seccionData && (!productos || productos.length === 0)) return null;

    const getItem = (label) => seccionData?.contenido?.find((item) => item.label?.toLowerCase() === label.toLowerCase());
    const getValor = (label) => getItem(label)?.valor;
    const getEnlace = (label) => getItem(label)?.enlace;

    const subTitulo = getValor('sub_titulo') || getValor('subtitulo') || '';
    const titulo = getValor('titulo') || 'Productos Destacados';
    const botonText = getValor('boton') || 'Ver todo el catálogo';
    const botonEnlace = getEnlace('boton') || '#productos';

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

    return (
        <section id="productos" className="scroll-mt-10 py-10 sm:py-14 bg-[#FAFAFA]">
            <div className="mx-auto w-full max-w-[1540px] px-3 sm:px-6 lg:px-8">
                {/* Cabecera con Título */}
                <div className="mb-6 pb-3 border-b border-gray-200">
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
                </div>

                {/* Grid / Carrusel Infinito Automático (Sin hovers ni pausas) */}
                {productos && productos.length > 0 ? (
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={16}
                        slidesPerView={1}
                        loop={productos.length > 2}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: false,
                        }}
                        speed={700}
                        breakpoints={{
                            480: { slidesPerView: 3, spaceBetween: 14 },
                            768: { slidesPerView: 4, spaceBetween: 16 },
                            1024: { slidesPerView: 5, spaceBetween: 18 },
                        }}
                        className="pb-4"
                    >
                        {productos.map((prod, idx) => {
                            const inCart = isInCart(prod);
                            const pSolesReg = prod.precio_soles != null && prod.precio_soles !== '' ? Number(prod.precio_soles) : (prod.precio != null && prod.precio !== '' ? Number(prod.precio) : 0);
                            const pSolesOfe = prod.precio_oferta_soles != null && prod.precio_oferta_soles !== '' ? Number(prod.precio_oferta_soles) : (prod.precio_oferta != null && prod.precio_oferta !== '' ? Number(prod.precio_oferta) : 0);

                            const pDolReg = prod.precio_dolares != null && prod.precio_dolares !== '' ? Number(prod.precio_dolares) : 0;
                            const pDolOfe = prod.precio_oferta_dolares != null && prod.precio_oferta_dolares !== '' ? Number(prod.precio_oferta_dolares) : 0;

                            const tieneOfertaSoles = pSolesOfe > 0 && (pSolesReg === 0 || pSolesOfe < pSolesReg);
                            const precioSolesEfectivo = tieneOfertaSoles ? pSolesOfe : pSolesReg;
                            const descSolesPercent = tieneOfertaSoles && pSolesReg > 0 && pSolesReg > pSolesOfe
                                ? Math.round(((pSolesReg - pSolesOfe) / pSolesReg) * 100)
                                : null;

                            const tieneOfertaDolares = pDolOfe > 0 && (pDolReg === 0 || pDolOfe < pDolReg);
                            const precioDolaresEfectivo = tieneOfertaDolares ? pDolOfe : pDolReg;
                            const descDolaresPercent = tieneOfertaDolares && pDolReg > 0 && pDolReg > pDolOfe
                                ? Math.round(((pDolReg - pDolOfe) / pDolReg) * 100)
                                : null;

                            const tieneOferta = tieneOfertaSoles || tieneOfertaDolares || Boolean(prod.en_oferta || prod.es_oferta);
                            const descOferta = descSolesPercent || descDolaresPercent;

                            const categoriaTexto = prod.categoria || 'REPOSTERÍA';
                            const esProdLiquidacion = Boolean(prod.es_liquidacion || prod.liquidacion);

                            const stockVal = prod.stock !== undefined && prod.stock !== null
                                ? Number(prod.stock)
                                : (prod.cantidad !== undefined && prod.cantidad !== null ? Number(prod.cantidad) : null);

                            let stockTexto = null;
                            let stockColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
                            if (stockVal !== null) {
                                if (stockVal <= 0) {
                                    stockTexto = 'Agotado';
                                    stockColor = 'text-rose-700 bg-rose-50 border-rose-200';
                                } else if (stockVal <= 5) {
                                    stockTexto = `¡Últimas ${stockVal} unids!`;
                                    stockColor = 'text-amber-700 bg-amber-50 border-amber-200';
                                } else {
                                    stockTexto = `Stock: ${stockVal} unids.`;
                                    stockColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
                                }
                            }

                            return (
                                <SwiperSlide key={prod.id || idx} className="h-auto" style={{ width: '20%', flexShrink: 0 }}>
                                    <div
                                        onClick={() => handleCardClick(prod)}
                                        className="bg-white border border-gray-200 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between h-full relative cursor-pointer hover:shadow-lg transition-all duration-300 group"
                                    >
                                        {/* Imagen del Producto */}
                                        <div className="relative aspect-square w-full mb-3 flex items-center justify-center bg-white rounded-lg overflow-hidden" style={{ aspectRatio: '1/1', width: '100%', maxHeight: '280px' }}>
                                            {/* Badge Liquidación o Categoría arriba a la izquierda */}
                                            {esProdLiquidacion ? (
                                                <span
                                                    className="absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-sm"
                                                    style={{ fontFamily: 'var(--tipografia-texto)' }}
                                                >
                                                    <span>🏷️ LIQUIDACIÓN</span>
                                                </span>
                                            ) : (
                                                categoriaTexto && (
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
                                                )
                                            )}

                                            {/* Badge OFERTA arriba a la derecha */}
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
                                                    className="w-full h-full max-w-full max-h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    style={{ maxWidth: '100%', maxHeight: '280px', width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '1/1' }}
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-gray-300 gap-1.5">
                                                    <DynamicIcon name="FaBoxOpen" className="h-12 w-12 text-gray-300" />
                                                    <span className="text-[11px] text-gray-400">Sin imagen</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Nombre del Producto */}
                                        <h3
                                            className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-[var(--color-primario)] transition-colors line-clamp-2 min-h-[2.4rem] leading-snug mb-1.5"
                                            title={prod.nombre}
                                        >
                                            {prod.nombre}
                                        </h3>

                                        {/* Descripción Corta */}
                                        {(prod.descripcion_corta || prod.descripcion) && (
                                            <p
                                                className="text-[11px] text-gray-500 line-clamp-2 min-h-[2rem] leading-relaxed mb-2"
                                                title={prod.descripcion_corta || prod.descripcion}
                                            >
                                                {prod.descripcion_corta || prod.descripcion}
                                            </p>
                                        )}

                                        {/* Stock Pill */}
                                        {stockTexto && (
                                            <div className="mb-2">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${stockColor}`}>
                                                    {stockTexto}
                                                </span>
                                            </div>
                                        )}

                                        {/* Bloque de Precios */}
                                        <div className="mt-auto pt-2 flex flex-col gap-1 mb-2">
                                            {/* 1. Precio en Soles */}
                                            {precioSolesEfectivo > 0 && (
                                                <div className="flex items-baseline gap-1.5 flex-wrap">
                                                    <span className="text-xs font-black text-[#0089CF]">S/</span>
                                                    <span className="text-2xl sm:text-3xl font-black text-[#0089CF] tracking-tight leading-none">
                                                        {precioSolesEfectivo.toFixed(0)}
                                                    </span>
                                                    {tieneOfertaSoles && descSolesPercent && (
                                                        <span className="bg-[#0089CF] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-xs leading-none">
                                                            -{descSolesPercent}%
                                                        </span>
                                                    )}
                                                    {tieneOfertaSoles && pSolesReg > precioSolesEfectivo && (
                                                        <span className="text-xs text-gray-400 line-through font-semibold ml-1">
                                                            S/ {pSolesReg.toFixed(0)}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* 2. Precio en Dólares (sin conversión, con $) */}
                                            {precioDolaresEfectivo > 0 && (
                                                <div className="flex items-baseline gap-1 flex-wrap text-emerald-700 font-black">
                                                    <span className="text-xs font-black text-emerald-600">$</span>
                                                    <span className="text-lg sm:text-xl font-black tracking-tight leading-none text-emerald-700">
                                                        {precioDolaresEfectivo}
                                                    </span>
                                                    <span className="text-[10px] font-extrabold text-emerald-600">USD</span>
                                                    {tieneOfertaDolares && descDolaresPercent && (
                                                        <span className="bg-emerald-600 text-white text-[9px] font-extrabold px-1 py-0.5 rounded-xs leading-none ml-1">
                                                            -{descDolaresPercent}%
                                                        </span>
                                                    )}
                                                    {tieneOfertaDolares && pDolReg > precioDolaresEfectivo && (
                                                        <span className="text-xs text-gray-400 line-through font-normal ml-1">
                                                            $ {pDolReg}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            {/* 3. Liquidación / Sin precio */}
                                            {(!precioSolesEfectivo || precioSolesEfectivo <= 0) && (!precioDolaresEfectivo || precioDolaresEfectivo <= 0) && (
                                                <div>
                                                    <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                                                        Consultar precio / Liquidación
                                                    </span>
                                                </div>
                                            )}

                                            {/* Botón 'Agregar' (sin efectos hover) */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addItem(prod);
                                                }}
                                                className="w-full py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm tracking-wide cursor-pointer active:scale-98 border-2"
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
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                ) : (
                    <div className="text-center bg-white rounded-xl border border-gray-200 p-12">
                        <p className="text-gray-400 text-sm">No hay productos disponibles por el momento.</p>
                    </div>
                )}

                {/* Botón Inferior para Ver Catálogo Completo */}
                {botonText && (
                    <div className="text-center mt-6">
                        <Link
                            href={botonEnlace}
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white shadow-md text-sm active:scale-98"
                            style={{
                                backgroundColor: 'var(--color-primario)',
                                fontFamily: 'var(--tipografia-titulos)',
                            }}
                        >
                            <span>{botonText}</span>
                            <span className="text-xs">→</span>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
