import React from 'react';
import { motion } from 'framer-motion';
import DynamicIcon from '@/components/DynamicIcon';

export default function HistoriaSection({ seccionData }) {
    if (!seccionData) return null;

    // Normalizar los datos del valor de la sección
    const rawValor = seccionData?.valor;
    const data = Array.isArray(rawValor) ? rawValor[0] : (rawValor || {});

    const sub = data?.sub || 'NUESTRA HISTORIA';
    const titulo = data?.Titulo || 'Nacimos para /*impulsar*/ la industria peruana';
    const descripcion = data?.Descripción || data?.descripcion || data?.Parrafo || '';

    // Normalizar arreglo de contactos/info (icono y texto)
    const infoList = Array.isArray(data?.info) ? data.info : (Array.isArray(data?.Info) ? data.Info : []);

    // Normalizar arreglo de la cronología/línea de tiempo (año, Titulo, Descripcion)
    const timelineList = Array.isArray(data?.Historia) ? data.Historia : (Array.isArray(data?.historia) ? data.historia : []);

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
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-start">
                    
                    {/* Columna Izquierda: Encabezado y Datos de Contacto/Ubicación */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-start lg:col-span-6 lg:sticky lg:top-28"
                    >
                        {/* Subtítulo / Badge */}
                        {sub && (
                            <span className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--color-primario)]">
                                {sub}
                            </span>
                        )}

                        {/* Título Principal */}
                        <h2 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                            {renderFormattedTitle(titulo)}
                        </h2>

                        {/* Descripción / Historia General */}
                        {descripcion && (
                            <p className="mb-8 text-base leading-relaxed text-gray-600 sm:text-lg max-w-xl">
                                {descripcion}
                            </p>
                        )}

                        {/* Arreglo de Información (Ubicación, Teléfono, etc.) */}
                        {infoList.length > 0 && (
                            <div className="flex flex-col gap-4 pt-2">
                                {infoList.map((item, idx) => {
                                    const icono = item.icono || item.Icono;
                                    const texto = item.Texto || item.texto || item.descripcion;

                                    return (
                                        <div key={idx} className="flex items-center gap-3 text-gray-700">
                                            {icono && (
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primario)]/10 text-[var(--color-primario)]">
                                                    <DynamicIcon name={icono} className="h-4 w-4" />
                                                </div>
                                            )}
                                            {texto && (
                                                <span className="text-sm font-semibold text-gray-800">
                                                    {texto}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>

                    {/* Columna Derecha: Cronología / Línea de Tiempo Vertical */}
                    <div className="lg:col-span-6 relative pl-2 sm:pl-4">
                        {/* Línea vertical de tiempo */}
                        <div className="absolute left-[13px] sm:left-[21px] top-3 bottom-6 w-0.5 bg-gradient-to-b from-[var(--color-primario)] via-[var(--color-primario)]/40 to-transparent" />

                        <div className="space-y-8">
                            {timelineList.map((item, idx) => {
                                const ano = item.año || item.ano || item.Year || item.year;
                                const itemTitulo = item.Titulo || item.titulo;
                                const itemDesc = item.Descripcion || item.descripcion || item.texto;

                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 25 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                                        className="relative pl-8 sm:pl-12"
                                    >
                                        {/* Punto en la línea de tiempo */}
                                        <div className="absolute left-0 sm:left-2 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-4 ring-white shadow-sm">
                                            <span className="h-3 w-3 rounded-full bg-[var(--color-primario)]" />
                                        </div>

                                        {/* Contenido del hito */}
                                        <div className="flex flex-col">
                                            {ano && (
                                                <span className="mb-1 text-sm font-extrabold uppercase tracking-wider text-[var(--color-primario)]">
                                                    {ano}
                                                </span>
                                            )}
                                            {itemTitulo && (
                                                <h3 className="mb-2 text-xl font-extrabold tracking-tight text-gray-900">
                                                    {itemTitulo}
                                                </h3>
                                            )}
                                            {itemDesc && (
                                                <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                                                    {itemDesc}
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
