import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import DynamicIcon from '@/components/DynamicIcon';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

import { useCartStore } from '@/stores/useCartStore';

export default function ProductosDestacadosSection({ seccionData, productos = [] }) {
    const addItem = useCartStore((state) => state.addItem);

    if (!seccionData && (!productos || productos.length === 0)) return null;

    const getItem = (label) => seccionData?.contenido?.find((item) => item.label?.toLowerCase() === label.toLowerCase());
    const getValor = (label) => getItem(label)?.valor;
    const getEnlace = (label) => getItem(label)?.enlace;

    const subTitulo = getValor('sub_titulo') || getValor('subtitulo') || 'Catálogo';
    const titulo = getValor('titulo') || 'Productos Destacados';
    const icono = getValor('icono') || '';
    const botonText = getValor('boton') || 'Ver todos los productos';
    const botonEnlace = getEnlace('boton') || '#productos';

    const renderIcon = (iconName, className = 'h-8 w-8', customStyle = null) => {
        if (!iconName) return null;
        return <DynamicIcon name={iconName} className={className} style={customStyle} />;
    };

    return (
        <section id="productos" className="scroll-mt-10 py-12 sm:py-16 bg-white">
            <div className="mx-auto w-full max-w-[1580px] px-3 sm:px-6 lg:px-8">
                {/* Cabecera de la Sección */}
                <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
                    {subTitulo && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-xs sm:text-sm font-bold uppercase tracking-widest mb-2"
                            style={{ color: 'var(--color-primario)', fontFamily: 'var(--tipografia-texto)' }}
                        >
                            {subTitulo}
                        </motion.p>
                    )}

                    {titulo && (
                        <motion.h2
                            initial={{ opacity: 0, y: -10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.05 }}
                            className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-3"
                            style={{ fontFamily: 'var(--tipografia-titulos)' }}
                        >
                            {titulo}
                        </motion.h2>
                    )}

                    {icono && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="flex items-center justify-center gap-4 mb-2"
                        >
                            <div className="flex-1 max-w-20 h-px" style={{ background: 'linear-gradient(to right, transparent, var(--color-primario))' }} />
                            {renderIcon(icono, 'h-5 w-5', { color: 'var(--color-primario)' })}
                            <div className="flex-1 max-w-20 h-px" style={{ background: 'linear-gradient(to left, transparent, var(--color-primario))' }} />
                        </motion.div>
                    )}
                </div>

                {/* Carrusel de Productos con Swiper */}
                {productos && productos.length > 0 ? (
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={20}
                        slidesPerView={1}
                        loop={productos.length > 4}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        pagination={{ clickable: true }}
                        breakpoints={{
                            480: { slidesPerView: 2, spaceBetween: 16 },
                            768: { slidesPerView: 3, spaceBetween: 20 },
                            1024: { slidesPerView: 4, spaceBetween: 24 },
                        }}
                        className="!pb-14"
                    >
                        {productos.map((prod, idx) => {
                            const tieneOferta = Boolean(prod.precio_oferta || prod.precio_oferta_soles);
                            const precioRegular = prod.precio_soles || prod.precio;
                            const precioOferta = prod.precio_oferta_soles || prod.precio_oferta;
                            const desc = prod.descripcion_corta || prod.descripcion;

                            return (
                                <SwiperSlide key={prod.id || idx} className="h-auto">
                                    <div
                                        className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group h-full"
                                        style={{ borderRadius: 'var(--radio-bordes)' }}
                                    >
                                        {/* Imagen del Producto */}
                                        <div className="relative aspect-square overflow-hidden bg-gray-50 flex items-center justify-center">
                                            {prod.imagen ? (
                                                <img
                                                    src={prod.imagen}
                                                    alt={prod.nombre}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-gray-300 gap-2">
                                                    <DynamicIcon name="FaBoxOpen" className="h-12 w-12 text-gray-300" />
                                                    <span className="text-xs text-gray-400">Sin imagen</span>
                                                </div>
                                            )}

                                            {/* Badge de Categoría */}
                                            {prod.categoria && (
                                                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs text-gray-700">
                                                    {prod.categoria}
                                                </span>
                                            )}

                                            {/* Badge de Oferta */}
                                            {tieneOferta && (
                                                <span
                                                    className="absolute top-3 right-3 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-xs"
                                                    style={{ backgroundColor: 'var(--color-primario)' }}
                                                >
                                                    Oferta
                                                </span>
                                            )}
                                        </div>

                                        {/* Contenido de la Tarjeta */}
                                        <div className="p-5 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3
                                                    className="text-base font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-[var(--color-primario)] transition-colors leading-snug"
                                                    style={{ fontFamily: 'var(--tipografia-titulos)' }}
                                                    title={prod.nombre}
                                                >
                                                    {prod.nombre}
                                                </h3>

                                                {/* Descripción corta o regular */}
                                                {desc && (
                                                    <p
                                                        className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed"
                                                        style={{ fontFamily: 'var(--tipografia-texto)' }}
                                                    >
                                                        {desc}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Precios y Botón de Carrito */}
                                            <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
                                                <div>
                                                    <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                                                        Precio
                                                    </span>
                                                    <div className="flex items-baseline gap-1.5 flex-wrap">
                                                        {tieneOferta ? (
                                                            <>
                                                                <span
                                                                    className="text-lg font-extrabold"
                                                                    style={{ color: 'var(--color-primario)', fontFamily: 'var(--tipografia-titulos)' }}
                                                                >
                                                                    S/ {Number(precioOferta).toFixed(2)}
                                                                </span>
                                                                <span className="text-xs text-gray-400 line-through">
                                                                    S/ {Number(precioRegular).toFixed(2)}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span
                                                                className="text-lg font-extrabold"
                                                                style={{ color: 'var(--color-primario)', fontFamily: 'var(--tipografia-titulos)' }}
                                                            >
                                                                S/ {Number(precioRegular).toFixed(2)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => addItem(prod)}
                                                    className="inline-flex items-center justify-center h-10 w-10 rounded-xl text-gray-700 bg-gray-100 hover:bg-[var(--color-primario)] hover:text-white transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
                                                    style={{ borderRadius: 'var(--radio-bordes)' }}
                                                    title="Agregar al carrito"
                                                >
                                                    <DynamicIcon name="FaCartShopping" className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                ) : (
                    <p className="text-center text-gray-400 py-12 text-sm">No hay productos disponibles por el momento.</p>
                )}

                {/* Botón Ver Más */}
                {botonText && (
                    <div className="text-center mt-6">
                        <Link
                            href={botonEnlace}
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 text-sm"
                            style={{ backgroundColor: 'var(--color-primario)', borderRadius: 'var(--radio-bordes)' }}
                        >
                            <span>{botonText}</span>
                            <DynamicIcon name="FaArrowRight" className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
