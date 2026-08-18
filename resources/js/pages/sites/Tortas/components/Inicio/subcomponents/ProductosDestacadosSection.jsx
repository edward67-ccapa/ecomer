import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import DynamicIcon from '@/components/DynamicIcon';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

export default function ProductosDestacadosSection({ seccionData, productos }) {
    if (!seccionData && (!productos || productos.length === 0)) return null;

    const getItem = (label) => seccionData?.contenido?.find((item) => item.label === label);
    const getValor = (label) => getItem(label)?.valor;
    const getEnlace = (label) => getItem(label)?.enlace;

    const subTitulo = getValor('sub_titulo') || '';
    const titulo = getValor('titulo') || '';
    const icono = getValor('icono') || '';
    const botonText = getValor('boton') || '';
    const botonEnlace = getEnlace('boton') || '#productos';

    const renderIcon = (iconName, className = 'h-8 w-8', customStyle = null) => {
        if (!iconName) return null;
        return <DynamicIcon name={iconName} className={className} style={customStyle} />;
    };

    const whatsappUrl = 'https://wa.me/51999999999';

    return (
        <section className="py-16 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Cabecera de la Sección */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    {subTitulo && (
                        <motion.p
                            initial={{ opacity: 0, y: -15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-sm font-semibold uppercase tracking-wider mb-2"
                            style={{ color: 'var(--color-primario)', fontFamily: 'var(--tipografia-texto)' }}
                        >
                            {subTitulo}
                        </motion.p>
                    )}

                    {titulo && (
                        <motion.h2
                            initial={{ opacity: 0, y: -15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-4xl font-bold mb-3"
                            style={{ fontFamily: 'var(--tipografia-titulos)', color: '#1a1a2e' }}
                        >
                            {titulo}
                        </motion.h2>
                    )}

                    {icono && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center justify-center gap-4 mb-4"
                        >
                            <div className="flex-1 max-w-20 h-px" style={{ background: 'linear-gradient(to right, transparent, var(--color-primario))' }} />
                            {renderIcon(icono, 'h-5 w-5', { color: 'var(--color-primario)' })}
                            <div className="flex-1 max-w-20 h-px" style={{ background: 'linear-gradient(to left, transparent, var(--color-primario))' }} />
                        </motion.div>
                    )}
                </div>

                {/* Carrusel de Productos Destacados con Swiper */}
                {productos && productos.length > 0 ? (
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={24}
                        slidesPerView={1}
                        loop={productos.length > 1}
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        pagination={{ clickable: true }}
                        breakpoints={{
                            640: { slidesPerView: 2, spaceBetween: 24 },
                            1024: { slidesPerView: 3, spaceBetween: 32 },
                        }}
                        className="!pb-14"
                    >
                        {productos.map((prod, idx) => (
                            <SwiperSlide key={prod.id || idx} className="h-auto">
                                <div
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group h-full"
                                    style={{ borderRadius: 'var(--radio-bordes)' }}
                                >
                                    {/* Imagen del Producto */}
                                    <div className="relative h-64 overflow-hidden bg-gray-50">
                                        {prod.imagen ? (
                                            <img
                                                src={prod.imagen}
                                                alt={prod.nombre}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
                                                🎂
                                            </div>
                                        )}

                                        {prod.categoria && (
                                            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full shadow-sm text-gray-700">
                                                {prod.categoria}
                                            </span>
                                        )}
                                    </div>

                                    {/* Contenido Card */}
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3
                                                className="text-xl font-bold mb-2 group-hover:text-[var(--color-primario)] transition-colors"
                                                style={{ fontFamily: 'var(--tipografia-titulos)', color: '#1a1a2e' }}
                                            >
                                                {prod.nombre}
                                            </h3>

                                            {prod.descripcion && (
                                                <p
                                                    className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed"
                                                    style={{ fontFamily: 'var(--tipografia-texto)' }}
                                                >
                                                    {prod.descripcion}
                                                </p>
                                            )}
                                        </div>

                                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                                            <div>
                                                <span className="text-xs text-gray-400 block font-medium">Precio</span>
                                                <span
                                                    className="text-xl font-extrabold"
                                                    style={{ color: 'var(--color-primario)', fontFamily: 'var(--tipografia-titulos)' }}
                                                >
                                                    {prod.precio_soles ? `S/ ${prod.precio_soles}` : (prod.precio_dolares ? `$ ${prod.precio_dolares}` : `S/ ${prod.precio}`)}
                                                </span>
                                            </div>

                                            <a
                                                href={`${whatsappUrl}?text=${encodeURIComponent(`Hola, quisiera consultar por la torta ${prod.nombre}`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all transform active:scale-95"
                                                style={{ backgroundColor: 'var(--color-primario)', borderRadius: 'var(--radio-bordes)' }}
                                            >
                                                Pedir 📲
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <p className="text-center text-gray-400 py-8">No hay tortas destacadas disponibles por el momento.</p>
                )}

                {/* Botón Ver Más */}
                {botonText && (
                    <div className="text-center mt-12">
                        <Link
                            href={botonEnlace}
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                            style={{ backgroundColor: 'var(--color-primario)', borderRadius: 'var(--radio-bordes)' }}
                        >
                            {botonText}
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
