import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TikTokSection({ seccionData }) {
    if (!seccionData) return null;

    const scrollContainerRef = useRef(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [oembedData, setOembedData] = useState({});

    // Extraer campos dinámicamente desde seccionData
    const getItem = (label) =>
        seccionData?.contenido?.find(
            (item) => item.label?.toLowerCase() === label.toLowerCase()
        );
    const getValor = (label) => getItem(label)?.valor;

    // 1. Extraer 'Comentarios' (array: [0] -> métrica/vistas, [1] -> usuario)
    const comentariosVal = getValor('Comentarios') || getValor('comentarios');
    let seguidores = null;
    let usuario = null;

    if (Array.isArray(comentariosVal)) {
        if (comentariosVal[0]) seguidores = comentariosVal[0];
        if (comentariosVal[1]) usuario = comentariosVal[1];
    } else if (typeof comentariosVal === 'string' && comentariosVal.trim()) {
        usuario = comentariosVal.trim();
    }

    // 2. Extraer 'Titulo'
    const titulo = getValor('Titulo') || getValor('titulo') || seccionData?.nombre || null;

    // 3. Extraer 'Videos' (array de objetos con IdVideo y Titulo)
    const rawVideos = getValor('Videos') || getValor('videos') || getValor('galeria') || getValor('items') || [];

    if (!Array.isArray(rawVideos) || rawVideos.length === 0) return null;

    const videoList = rawVideos.map((v, idx) => {
        const imgUrl = v.imagen || v.foto || v.cover || (Array.isArray(v.imagen) ? v.imagen[0] : null);
        return {
            id: v.id || idx,
            titulo: v.Titulo || v.titulo || '',
            usuario: v.Usuario || v.usuario || usuario || '',
            idVideo: v.IdVideo || v.idVideo || v.video_id || null,
            url: v.url || v.link || null,
            imagenCustom: imgUrl || null,
        };
    });

    // Efecto para consultar automáticamente la miniatura oficial y autor de TikTok mediante su API de oEmbed
    useEffect(() => {
        videoList.forEach((item) => {
            if (item.idVideo && !item.imagenCustom) {
                fetch(`https://www.tiktok.com/oembed?url=https://www.tiktok.com/@tiktok/video/${item.idVideo}`)
                    .then((res) => (res.ok ? res.json() : null))
                    .then((data) => {
                        if (data && data.thumbnail_url) {
                            setOembedData((prev) => ({
                                ...prev,
                                [item.idVideo]: {
                                    thumbnail: data.thumbnail_url,
                                    author: data.author_unique_id
                                        ? `@${data.author_unique_id}`
                                        : (data.author_name ? `@${data.author_name}` : item.usuario),
                                    title: (data.title && data.title.trim() !== '') ? data.title : item.titulo,
                                },
                            }));
                        }
                    })
                    .catch(() => { });
            }
        });
    }, [videoList.map((v) => v.idVideo).join(',')]);

    // Handlers para los botones de navegación horizontal (< y >)
    const handleScrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
        }
    };

    const handleScrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
    };

    return (
        <section id="tik-tok" className="scroll-mt-10 py-12 sm:py-16 bg-white border-t border-gray-100 overflow-hidden relative">
            {/* Anchors de compatibilidad para navegación #tiktok y #tik tok */}
            <div id="tiktok" className="absolute -top-10 left-0" />
            <div id="tik tok" className="absolute -top-10 left-0" />
            <div className="mx-auto w-full max-w-[1540px] px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* ── COLUMNA IZQUIERDA: TEXTO DE CABECERA Y BOTONES DE NAVEGACIÓN ── */}
                    <div className="lg:col-span-4 flex flex-col justify-between items-start space-y-6 lg:pr-4">
                        <div className="space-y-4">
                            {/* Subtítulo / Seguidores & Usuario */}
                            {(seguidores || usuario) && (
                                <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-gray-500 tracking-wide">
                                    {seguidores && <span>{seguidores}</span>}
                                    {usuario && <span className="font-bold text-gray-800">{usuario}</span>}
                                </div>
                            )}

                            {/* Título Principal */}
                            {titulo && (
                                <h2
                                    className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1c2d37] tracking-tight leading-[1.15]"
                                    style={{ fontFamily: 'var(--tipografia-titulos)' }}
                                >
                                    {titulo}
                                </h2>
                            )}
                        </div>

                        {/* Flechas de Navegación (< >) */}
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleScrollLeft}
                                aria-label="Anterior"
                                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-700 hover:text-black transition-colors cursor-pointer active:scale-95 border border-gray-200"
                            >
                                <span className="text-2xl leading-none font-light">‹</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleScrollRight}
                                aria-label="Siguiente"
                                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-700 hover:text-black transition-colors cursor-pointer active:scale-95 border border-gray-200"
                            >
                                <span className="text-2xl leading-none font-light">›</span>
                            </button>
                        </div>
                    </div>

                    {/* ── COLUMNA DERECHA: CARRUSEL HORIZONTAL DE TARJETAS VERTICALES DE TIKTOK ── */}
                    <div className="lg:col-span-8 w-full overflow-hidden">
                        <div
                            ref={scrollContainerRef}
                            className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
                        >
                            {videoList.map((item, idx) => {
                                const oembed = item.idVideo ? oembedData[item.idVideo] : null;
                                const imagenFinal = item.imagenCustom || oembed?.thumbnail || null;
                                const usuarioFinal = oembed?.author || item.usuario;
                                const tituloFinal = oembed?.title || item.titulo;

                                return (
                                    <div
                                        key={item.id || idx}
                                        className="shrink-0 w-56 sm:w-64 md:w-72 flex flex-col group cursor-pointer"
                                        onClick={() => setSelectedVideo({ ...item, imagen: imagenFinal, usuario: usuarioFinal, titulo: tituloFinal })}
                                    >
                                        {/* Tarjeta de Video Vertical (Aspect Ratio 3/4) */}
                                        <div
                                            className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-gray-900 border border-gray-200/80 shadow-xs hover:shadow-lg transition-all duration-300"
                                            style={{ aspectRatio: '3/4', width: '100%', maxHeight: '420px' }}
                                        >
                                            {imagenFinal ? (
                                                <img
                                                    src={imagenFinal}
                                                    alt={tituloFinal || `TikTok ${idx + 1}`}
                                                    width={400}
                                                    height={533}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                                    style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '420px', objectFit: 'cover', aspectRatio: '3/4' }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white/50 text-xs">
                                                    Cargando portada...
                                                </div>
                                            )}

                                            {/* Botón Play central con blur flotante */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/30 backdrop-blur-md border border-white/60 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                    <span className="text-lg sm:text-xl ml-1 leading-none">▶</span>
                                                </div>
                                            </div>

                                            {/* Insignia flotante con usuario TikTok abajo a la izquierda */}
                                            {usuarioFinal && (
                                                <div className="absolute bottom-3 left-3 z-10">
                                                    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold text-gray-800 bg-[#F7F2E4]/90 backdrop-blur-xs border border-[#EBE3D0] shadow-xs">
                                                        {usuarioFinal}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Enlace de Acción bajo la tarjeta */}
                                        {tituloFinal && (
                                            <div className="mt-3 flex items-center justify-center text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-black transition-colors gap-1.5 px-1 text-center">
                                                <span className="line-clamp-1">{tituloFinal}</span>
                                                <span className="text-xs shrink-0">→</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Reproductor de Video */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <div
                            className="relative w-full max-w-lg bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Botón Cerrar */}
                            <button
                                type="button"
                                onClick={() => setSelectedVideo(null)}
                                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition cursor-pointer"
                            >
                                ✕
                            </button>

                            {/* Contenido / Reproductor del Video */}
                            <div className="relative aspect-[9/16] w-full max-h-[80vh] flex items-center justify-center bg-black">
                                {selectedVideo.idVideo ? (
                                    <iframe
                                        src={`https://www.tiktok.com/embed/v2/${selectedVideo.idVideo}`}
                                        className="w-full h-full rounded-2xl border-0"
                                        allowFullScreen
                                        allow="autoplay; encrypted-media"
                                    />
                                ) : selectedVideo.imagen ? (
                                    <img
                                        src={selectedVideo.imagen}
                                        alt={selectedVideo.titulo || 'TikTok'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : null}

                                {(selectedVideo.titulo || selectedVideo.usuario) && (
                                    <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 text-white flex items-center justify-between">
                                        <span className="font-semibold text-sm line-clamp-1">{selectedVideo.titulo}</span>
                                        <span className="text-xs text-gray-300 shrink-0 ml-2">{selectedVideo.usuario}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
