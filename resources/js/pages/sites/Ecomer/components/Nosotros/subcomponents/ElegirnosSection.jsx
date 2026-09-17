import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import DynamicIcon from '@/components/DynamicIcon';

import 'swiper/css';
import 'swiper/css/pagination';

export default function ElegirnosSection({ seccionData }) {
    if (!seccionData) return null;

    // Normalizar los datos del valor de la sección
    const rawValor = seccionData?.valor;
    const data = Array.isArray(rawValor) ? rawValor[0] : (rawValor || {});

    const titulo = data?.Titulo || '¿Por qué elegirnos?';
    const descripcion = data?.Descripcion || data?.descripcion || '';

    // Arreglo de tarjetas (Cards)
    const cardsList = Array.isArray(data?.Cards) ? data.Cards : (Array.isArray(data?.cards) ? data.cards : []);

    if (cardsList.length === 0) return null;

    // Helper para procesar títulos con la sintaxis /*texto destacado*/
    const renderFormattedTitle = (text) => {
        if (!text) return null;

        const regex = /\/\*(.*?)\*\//g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push({ text: text.slice(lastIndex, match.index), isHighlight: false });
            }
            parts.push({ text: match[1], isHighlight: true });
            lastIndex = regex.lastIndex;
        }
        if (lastIndex < text.length) {
            parts.push({ text: text.slice(lastIndex), isHighlight: false });
        }

        if (parts.length === 0) {
            return <span>{text}</span>;
        }

        return parts.map((part, idx) => (
            <span
                key={idx}
                className={
                    part.isHighlight
                        ? 'text-[var(--color-primario)] font-extrabold'
                        : ''
                }
            >
                {part.text}
            </span>
        ));
    };

    return (
        <section className="relative overflow-hidden bg-white py-16 md:py-24 border-t border-gray-100">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Cabecera Centrada */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mx-auto max-w-3xl text-center mb-12 sm:mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-gray-900 mb-4">
                        {renderFormattedTitle(titulo)}
                    </h2>
                    {descripcion && (
                        <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
                            {descripcion}
                        </p>
                    )}
                </motion.div>

                {/* Carrusel Infinito Automático (Exactamente 3 Tarjetas en Pantalla) */}
                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={32}
                    slidesPerView={1}
                    loop={cardsList.length > 3}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    speed={700}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 24,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 32,
                        },
                    }}
                    className="elegirnos-swiper !pb-16"
                >
                    {cardsList.map((card, idx) => {
                        const rawImagen = card.Imagen || card.imagen || card.Img;
                        const imagenUrl = Array.isArray(rawImagen) ? rawImagen[0] : rawImagen;

                        const cardTitulo = card.Titulo || card.titulo || '';
                        const cardDesc = card.Descripcion || card.descripcion || card.texto || '';

                        // Formatear el número de orden (01, 02, 03...)
                        const numberBadge = String(idx + 1).padStart(2, '0');

                        return (
                            <SwiperSlide key={idx} className="h-auto">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                                    className="group relative flex h-full flex-col rounded-3xl border border-gray-100 bg-white p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:border-gray-200"
                                >
                                    {/* Imagen con bordes redondeados */}
                                    <div className="relative h-56 sm:h-60 md:h-64 w-full shrink-0 overflow-hidden rounded-2xl bg-gray-100 shadow-inner">
                                        {imagenUrl ? (
                                            <img
                                                src={imagenUrl}
                                                alt={cardTitulo || 'Razón para elegirnos'}
                                                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                                                <span>Sin Imagen</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Insignia Numérica Flotante sobre el borde inferior derecho de la imagen */}
                                    <div className="relative -mt-7 mr-4 ml-auto z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-primario)] text-white font-extrabold text-lg shadow-lg ring-4 ring-white transition-transform duration-300 group-hover:scale-110">
                                        <span>{numberBadge}</span>
                                    </div>

                                    {/* Contenido de la Tarjeta */}
                                    <div className="pt-2 px-1 pb-2 flex flex-col flex-grow">
                                        {/* Título con guion decorativo */}
                                        {cardTitulo && (
                                            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2 tracking-tight">
                                                <span className="text-[var(--color-primario)] font-extrabold text-xl sm:text-2xl leading-none">—</span>
                                                <span>{cardTitulo}</span>
                                            </h3>
                                        )}

                                        {/* Descripción */}
                                        {cardDesc && (
                                            <p className="mt-3 text-sm sm:text-base leading-relaxed text-gray-600 font-medium">
                                                {cardDesc}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </section>
    );
}


