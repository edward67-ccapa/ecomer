import React from 'react';
import { motion } from 'framer-motion';
import DynamicIcon from '@/components/DynamicIcon';

export default function MisionVisionSection({ seccionData }) {
    if (!seccionData) return null;

    // Normalizar los datos (en estructura array viene directamente en `valor`)
    const items = Array.isArray(seccionData?.valor) ? seccionData.valor : [];

    if (items.length === 0) return null;

    // Helper para procesar títulos con sintaxis /*texto destacado*/
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
        <section className="relative overflow-hidden bg-black py-16 md:py-24 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:gap-16">
                    {items.map((item, idx) => {
                        // Normalizar campos del objeto (Imagen, Icono, Titulo, Descripcion)
                        const rawImagen = item.Imagen || item.imagen || item.Img || item.img;
                        const imagenUrl = Array.isArray(rawImagen) ? rawImagen[0] : rawImagen;

                        const icono = item.Icono || item.icono;
                        const titulo = item.Titulo || item.titulo || (idx === 0 ? 'Nuestra /*Misión*/' : 'Nuestra /*Visión*/');
                        const descripcion = item.Descripcion || item.descripcion || item.Parrafo || item.parrafo || '';

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.15 }}
                                className="group relative flex flex-col"
                            >
                                {/* Contenedor de Imagen con bordes redondeados y sombra */}
                                <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
                                    {imagenUrl ? (
                                        <img
                                            src={imagenUrl}
                                            alt={titulo ? titulo.replace(/\/\*|\*\//g, '') : 'Misión y Visión'}
                                            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-slate-900 text-gray-500">
                                            <span>Sin Imagen</span>
                                        </div>
                                    )}
                                    {/* Capa tenue de gradiente sobre la imagen */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                                </div>

                                {/* Icono Circular Flotante superpuesto sobre el borde inferior izquierdo de la imagen */}
                                {icono && (
                                    <div className="relative -mt-9 ml-6 sm:ml-8 z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[var(--color-primario)] text-white shadow-2xl ring-4 ring-slate-950 transition-transform duration-300 group-hover:scale-110">
                                        <DynamicIcon name={icono} className="h-7 w-7" />
                                    </div>
                                )}

                                {/* Contenido: Título y Descripción */}
                                <div className="pt-4 px-2 sm:px-4 flex flex-col">
                                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-white mt-1">
                                        {renderFormattedTitle(titulo)}
                                    </h3>

                                    {descripcion && (
                                        <p className="mt-4 text-sm sm:text-base leading-relaxed text-gray-300 font-normal">
                                            {descripcion}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
