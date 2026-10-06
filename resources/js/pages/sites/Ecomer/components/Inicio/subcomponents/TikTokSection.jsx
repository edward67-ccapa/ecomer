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
        let extractedId = v.IdVideo || v.idVideo || v.video_id || null;
        const rawUrl = v.url || v.link || v.urlVideo || null;

        if (!extractedId && rawUrl) {
            const match = String(rawUrl).match(/\/video\/(\d+)/);
            if (match) {
                extractedId = match[1];
            }
        }

        const fallbackUrl = extractedId ? `https://www.tiktok.com/@tiktok/video/${extractedId}` : (rawUrl || 'https://www.tiktok.com');

        return {
            id: v.id || idx,
            titulo: v.Titulo || v.titulo || '',
            usuario: v.Usuario || v.usuario || usuario || '',
            idVideo: extractedId,
            url: rawUrl || fallbackUrl,
            imagenCustom: imgUrl || null,
        };
    });

    // Consultar miniatura y autor mediante nuestro endpoint proxy backend (/api/v1/tiktok-oembed)
    // Esto evita bloqueos de CORS, throttling y 503/504 en el navegador del usuario.
    useEffect(() => {
        videoList.forEach((item) => {
            if (item.idVideo && !item.imagenCustom && !oembedData[item.idVideo]) {
                fetch(`/api/v1/tiktok-oembed?id=${item.idVideo}`)
                    .then((res) => (res.ok ? res.json() : null))
                    .then((data) => {
                        if (data && data.success && data.thumbnail_url) {
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
                        } else {
                            setOembedData((prev) => ({
                                ...prev,
                                [item.idVideo]: { failed: true },
                            }));
                        }
                    })
                    .catch(() => {
                        setOembedData((prev) => ({
                            ...prev,
                            [item.idVideo]: { failed: true },
                        }));
                    });
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
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-300 cursor-pointer active:scale-95 shadow-sm hover:shadow-md hover:brightness-110"
                                style={{ backgroundColor: 'var(--color-primario)' }}
                            >
                                <span className="text-2xl leading-none font-bold">‹</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleScrollRight}
                                aria-label="Siguiente"
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-300 cursor-pointer active:scale-95 shadow-sm hover:shadow-md hover:brightness-110"
                                style={{ backgroundColor: 'var(--color-primario)' }}
                            >
                                <span className="text-2xl leading-none font-bold">›</span>
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
                                const tituloFinal = oembed?.title || item.titulo || `Vídeo TikTok ${idx + 1}`;

                                return (
                                    <div
                                        key={item.id || idx}
                                        className="shrink-0 w-56 sm:w-64 md:w-72 flex flex-col group cursor-pointer"
                                        onClick={() => setSelectedVideo({ ...item, imagen: imagenFinal, usuario: usuarioFinal, titulo: tituloFinal })}
                                    >
                                        {/* Tarjeta de Video Vertical (Aspect Ratio 3/4) */}
                                        <div
                                            className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-950 via-slate-900 to-black border border-gray-800 shadow-xs hover:shadow-xl transition-all duration-300"
                                            style={{ aspectRatio: '3/4', width: '100%', maxHeight: '420px' }}
                                        >
                                            {imagenFinal ? (
                                                <img
                                                    src={imagenFinal}
                                                    alt={tituloFinal}
                                                    width={400}
                                                    height={533}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                                    style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '420px', objectFit: 'cover', aspectRatio: '3/4' }}
                                                />
                                            ) : (
                                                /* Fallback visual cuando no hay imagen ni thumbnail */
                                                <div className="w-full h-full flex flex-col items-center justify-between p-5 text-center bg-gradient-to-b from-slate-900 to-black text-white relative">
                                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00f2fe] via-[#ff0050] to-[#00f2fe]" />
                                                    <div className="mt-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[11px] font-bold tracking-wider text-white">
                                                        <span className="w-2 h-2 rounded-full bg-[#ff0050] animate-pulse" />
                                                        TIKTOK
                                                    </div>
                                                    <div className="my-auto px-2 space-y-2">
                                                        <p className="text-sm font-bold text-gray-100 line-clamp-3 leading-snug">
                                                            {tituloFinal}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Botón Play central con blur flotante */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/50 flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:bg-[#ff0050] group-hover:border-[#ff0050] transition-all duration-300">
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
                                            <div className="mt-3 flex items-center justify-center text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-[var(--color-primario)] transition-colors gap-1.5 px-1 text-center">
                                                <span className="line-clamp-1">{tituloFinal}</span>
                                                <span className="text-xs shrink-0 transition-transform group-hover:translate-x-1" style={{ color: 'var(--color-primario)' }}>→</span>
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
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <div
                            className="relative w-full max-w-lg bg-gray-950 rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Botón Cerrar */}
                            <button
                                type="button"
                                onClick={() => setSelectedVideo(null)}
                                className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-[#ff0050] transition cursor-pointer border border-white/20 shadow-lg"
                                aria-label="Cerrar modal"
                            >
                                ✕
                            </button>

                            {/* Contenido / Reproductor del Video */}
                            <div className="relative aspect-[9/16] w-full max-h-[75vh] flex items-center justify-center bg-black">
                                {selectedVideo.idVideo ? (
                                    <iframe
                                        src={`https://www.tiktok.com/embed/v2/${selectedVideo.idVideo}?lang=es-ES`}
                                        className="w-full h-full rounded-2xl border-0"
                                        allowFullScreen
                                        allow="autoplay; encrypted-media; picture-in-picture"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                ) : selectedVideo.imagen ? (
                                    <img
                                        src={selectedVideo.imagen}
                                        alt={selectedVideo.titulo || 'TikTok'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-8 text-center text-white space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-[#ff0050]/20 flex items-center justify-center text-[#ff0050] text-2xl font-bold">
                                            ♪
                                        </div>
                                        <p className="text-sm font-medium text-gray-300">
                                            {selectedVideo.titulo || 'Ver este vídeo directamente en TikTok'}
                                        </p>
                                    </div>
                                )}

                                {(selectedVideo.titulo || selectedVideo.usuario) && (
                                    <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-3.5 rounded-xl border border-white/15 text-white flex items-center justify-between shadow-xl z-20">
                                        <div className="min-w-0 flex-1 pr-2">
                                            <p className="font-semibold text-sm line-clamp-1">{selectedVideo.titulo}</p>
                                            {selectedVideo.usuario && (
                                                <p className="text-xs text-gray-300 mt-0.5">{selectedVideo.usuario}</p>
                                            )}
                                        </div>
                                        {selectedVideo.url && (
                                            <a
                                                href={selectedVideo.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="shrink-0 px-3.5 py-2 rounded-xl bg-[#ff0050] text-white text-xs font-bold hover:bg-[#e00047] active:scale-95 transition-all flex items-center gap-1.5 shadow-md border border-white/20"
                                            >
                                                Ver en TikTok ↗
                                            </a>
                                        )}
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
