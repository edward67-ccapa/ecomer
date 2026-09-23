import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DynamicIcon from '@/components/DynamicIcon';

export default function VideoGroup({ videoBlock }) {
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    if (!videoBlock) return null;

    const { titulo, imagen, enlace, porcentajes, info } = videoBlock;

    if (!titulo && !imagen && (!porcentajes || porcentajes.length === 0)) {
        return null;
    }

    // Convert Youtube URL if applicable
    const getEmbedUrl = (url) => {
        if (!url) return '';
        if (url.includes('youtube.com/watch?v=')) {
            const videoId = url.split('v=')[1]?.split('&')[0];
            return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        }
        if (url.includes('youtu.be/')) {
            const videoId = url.split('youtu.be/')[1]?.split('?')[0];
            return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        }
        return url;
    };

    const embedUrl = getEmbedUrl(enlace);

    return (
        <section className="bg-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8 text-gray-900">
            <div className="mx-auto max-w-[1540px]">
                {/* ── Contenedor Full-Width con Imagen de Fondo estilo Banner ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden rounded-[2.5rem] shadow-2xl min-h-[480px] sm:min-h-[560px] md:min-h-[620px] lg:min-h-[660px] flex items-end justify-start bg-gray-900"
                >
                    {/* Imagen de Fondo */}
                    {imagen ? (
                        <img
                            src={imagen}
                            alt={titulo || 'Video'}
                            className="absolute inset-0 h-full w-full object-cover object-center"
                            loading="lazy"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gray-900" />
                    )}

                    {/* Sombra de Degradado Suave sobre la imagen */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

                    {/* ── Tarjeta Flotante en la Esquina Inferior Izquierda (Glassmorphism) ── */}
                    <div className="relative z-10 m-5 sm:m-8 md:m-10 max-w-xl w-[calc(100%-2.5rem)] sm:w-auto p-6 sm:p-8 rounded-[2rem] bg-black/45 backdrop-blur-md border border-white/20 text-white shadow-2xl">
                        {/* Título Principal */}
                        {titulo && (
                            <h2
                                className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4 leading-tight"
                                style={{ fontFamily: 'var(--tipografia-titulos)' }}
                            >
                                {titulo}
                            </h2>
                        )}

                        {/* Íconos / Lista de Verificación (Checkmark inline) */}
                        {info && info.length > 0 && (
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-5">
                                {info.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white/90">
                                        <span
                                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border"
                                            style={{ borderColor: 'var(--color-primario)', color: 'var(--color-primario)' }}
                                        >
                                            <DynamicIcon name={item.icono || 'FaCheck'} className="h-3 w-3" />
                                        </span>
                                        <span style={{ fontFamily: 'var(--tipografia-texto)' }}>{item.titulo}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Línea Divisora Fina */}
                        {porcentajes && porcentajes.length > 0 && (
                            <div className="border-t border-white/25 pt-4 space-y-4">
                                {porcentajes.map((item, idx) => {
                                    const percentVal = parseInt(item.porcentaje || '0', 10);
                                    return (
                                        <div key={idx} className="space-y-1.5">
                                            <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-white/90">
                                                <span style={{ fontFamily: 'var(--tipografia-texto)' }}>{item.titulo}</span>
                                                <span style={{ fontFamily: 'var(--tipografia-titulos)' }}>{percentVal}%</span>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-white/20 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${percentVal}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 1, delay: idx * 0.2 }}
                                                    className="h-full rounded-full"
                                                    style={{ backgroundColor: 'var(--color-primario)' }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* ── Botón Play Flotante en el Lado Derecho (Círculo Traslúcido con texto "Play") ── */}
                    {enlace && (
                        <div className="absolute top-1/2 right-8 sm:right-14 lg:right-20 -translate-y-1/2 z-20">
                            <button
                                onClick={() => setIsVideoOpen(true)}
                                aria-label="Ver video"
                                className="group flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full border border-white/60 bg-white/10 hover:bg-white/25 backdrop-blur-md text-white font-semibold text-base sm:text-lg shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                            >
                                <span style={{ fontFamily: 'var(--tipografia-titulos)' }}>Play</span>
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* ── Modal de Video Youtube ── */}
            <AnimatePresence>
                {isVideoOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
                        onClick={() => setIsVideoOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl aspect-video"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setIsVideoOpen(false)}
                                className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
                            >
                                ✕
                            </button>
                            {embedUrl && (
                                <iframe
                                    src={embedUrl}
                                    title={titulo || 'Video'}
                                    className="h-full w-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
