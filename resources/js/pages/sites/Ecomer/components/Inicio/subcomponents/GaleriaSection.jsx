import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GaleriaSection({ seccionData }) {
    if (!seccionData) return null;

    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    // Extraer elementos de contenido si existen
    const getContenidoItem = (label) =>
        seccionData?.contenido?.find(
            (item) => item.label?.toLowerCase() === label.toLowerCase()
        );

    const titulo = getContenidoItem('titulo')?.valor;
    const subtitulo =
        getContenidoItem('subtitulo')?.valor ||
        getContenidoItem('descripcion')?.valor;

    // Obtener las imágenes del grupo "Galeria"
    const galeriaItem =
        getContenidoItem('galeria') ||
        seccionData?.contenido?.find((c) => c.tipo === 'grupo') ||
        seccionData?.contenido?.[0];

    const rawImagenes = galeriaItem?.valor || [];

    // Normalizar y ordenar por Posición
    const imagenes = Array.isArray(rawImagenes)
        ? [...rawImagenes]
            .map((item, idx) => {
                let imgUrl = null;
                if (Array.isArray(item.imagen)) {
                    imgUrl = item.imagen[0];
                } else if (typeof item.imagen === 'string') {
                    imgUrl = item.imagen;
                } else if (typeof item === 'string') {
                    imgUrl = item;
                }

                const pos = parseInt(item.Posicion || item.posicion || idx + 1, 10);
                return {
                    url: imgUrl,
                    posicion: isNaN(pos) ? idx + 1 : pos,
                };
            })
            .filter((item) => Boolean(item.url))
            .sort((a, b) => a.posicion - b.posicion)
        : [];

    if (imagenes.length === 0) return null;

    // Navegación del modal Lightbox
    const handlePrev = (e) => {
        if (e) e.stopPropagation();
        setSelectedImageIndex((prev) =>
            prev === 0 ? imagenes.length - 1 : prev - 1
        );
    };

    const handleNext = (e) => {
        if (e) e.stopPropagation();
        setSelectedImageIndex((prev) =>
            prev === imagenes.length - 1 ? 0 : prev + 1
        );
    };

    // Navegación por teclado cuando el modal está abierto
    useEffect(() => {
        if (selectedImageIndex === null) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setSelectedImageIndex(null);
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImageIndex, imagenes.length]);

    // Segmentación de imágenes según diseño solicitado:
    // 1. Bloque 1: Posiciones 1 a 4 (Banners dobles horizontales)
    const bloque1 = imagenes.filter((img) => img.posicion >= 1 && img.posicion <= 4);
    const itemsBloque1 = bloque1.length > 0 ? bloque1 : imagenes.slice(0, 4);

    // 2. Bloque 2:
    // - Lado izquierdo: Posición 5 (Banner grande)
    const itemPos5 =
        imagenes.find((img) => img.posicion === 5) ||
        (imagenes.length > 4 ? imagenes[4] : null);

    // - Lado derecho: Exactamente 6 productos (2 filas x 3 columnas)
    const bloque2Grid = imagenes.filter(
        (img) => img.posicion >= 6 && img.posicion <= 11
    );
    const itemsBloque2Grid = (
        bloque2Grid.length > 0
            ? bloque2Grid
            : imagenes.filter(
                (img) =>
                    img !== itemPos5 &&
                    !itemsBloque1.some((b1) => b1.url === img.url)
            )
    ).slice(0, 6);

    // 3. Bloque 3: Posición 12 (Banner horizontal a todo el ancho)
    const itemPos12 =
        imagenes.find((img) => img.posicion === 12) ||
        (imagenes.length >= 12 ? imagenes[11] : null);

    return (
        <section id="galeria" className="relative scroll-mt-20 py-8 sm:py-12 bg-white">
            <div className="mx-auto w-full max-w-[1580px] px-3 sm:px-6 lg:px-8">
                {/* Cabecera opcional solo si fue configurada en el panel */}
                {titulo && (
                    <div className="mx-auto max-w-2xl text-center mb-8 sm:mb-12">
                        <h2
                            className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
                            style={{ fontFamily: 'var(--tipografia-titulos)' }}
                        >
                            {titulo}
                        </h2>
                        {subtitulo && (
                            <p
                                className="mt-2 text-sm sm:text-base text-gray-600"
                                style={{ fontFamily: 'var(--tipografia-texto)' }}
                            >
                                {subtitulo}
                            </p>
                        )}
                    </div>
                )}

                {/* BLOQUE 1: Posiciones 1 a 4 (2 banners por fila, imágenes completas sin recorte) */}
                {itemsBloque1.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 mb-3 sm:mb-4 md:mb-5">
                        {itemsBloque1.map((item) => {
                            const globalIdx = imagenes.findIndex((img) => img.url === item.url);
                            return (
                                <div
                                    key={item.posicion}
                                    onClick={() => setSelectedImageIndex(globalIdx >= 0 ? globalIdx : 0)}
                                    className="cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl"
                                >
                                    <img
                                        src={item.url}
                                        alt={`Promoción ${item.posicion}`}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-auto block rounded-xl sm:rounded-2xl"
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* BLOQUE 2: Posición 5 + 6 Productos (Posiciones 6 a 11) */}
                {(itemPos5 || itemsBloque2Grid.length > 0) && (
                    <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-5 items-start">
                        {/* Lado izquierdo: Posición 5 (Contenedor ajustado a 44.5% para igualar la altura de las 2 filas) */}
                        {itemPos5 && (
                            <div
                                onClick={() => {
                                    const globalIdx = imagenes.findIndex((img) => img.url === itemPos5.url);
                                    setSelectedImageIndex(globalIdx >= 0 ? globalIdx : 0);
                                }}
                                className="w-full lg:w-[44.5%] shrink-0 cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl"
                            >
                                <img
                                    src={itemPos5.url}
                                    alt={`Promoción ${itemPos5.posicion}`}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-auto block rounded-xl sm:rounded-2xl"
                                />
                            </div>
                        )}

                        {/* Lado derecho: Exactamente 6 productos (2 filas x 3 columnas) */}
                        {itemsBloque2Grid.length > 0 && (
                            <div className="w-full lg:flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                {itemsBloque2Grid.map((item) => {
                                    const globalIdx = imagenes.findIndex((img) => img.url === item.url);
                                    return (
                                        <div
                                            key={item.posicion}
                                            onClick={() => setSelectedImageIndex(globalIdx >= 0 ? globalIdx : 0)}
                                            className="cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl"
                                        >
                                            <img
                                                src={item.url}
                                                alt={`Producto ${item.posicion}`}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-auto block rounded-xl sm:rounded-2xl"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* BLOQUE 3: Posición 12 (Banner horizontal a todo el ancho) */}
                {itemPos12 && (
                    <div className="mt-3 sm:mt-4 md:mt-5">
                        <div
                            onClick={() => {
                                const globalIdx = imagenes.findIndex((img) => img.url === itemPos12.url);
                                setSelectedImageIndex(globalIdx >= 0 ? globalIdx : 0);
                            }}
                            className="w-full cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl"
                        >
                            <img
                                src={itemPos12.url}
                                alt={`Promoción ${itemPos12.posicion}`}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-auto block rounded-xl sm:rounded-2xl"
                            />
                        </div>
                    </div>
                )}

            </div>

            {/* Modal Lightbox / Visor a pantalla completa */}
            <AnimatePresence>
                {selectedImageIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
                        onClick={() => setSelectedImageIndex(null)}
                    >
                        {/* Botón Cerrar */}
                        <button
                            type="button"
                            onClick={() => setSelectedImageIndex(null)}
                            className="absolute top-5 right-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition cursor-pointer backdrop-blur-sm"
                            title="Cerrar"
                        >
                            <span className="text-xl font-bold">✕</span>
                        </button>

                        {/* Botón Anterior */}
                        {imagenes.length > 1 && (
                            <button
                                type="button"
                                onClick={handlePrev}
                                className="absolute left-4 sm:left-8 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition cursor-pointer backdrop-blur-sm"
                                title="Anterior"
                            >
                                <span className="text-2xl font-bold">‹</span>
                            </button>
                        )}

                        {/* Imagen principal en grande */}
                        <motion.div
                            key={selectedImageIndex}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={imagenes[selectedImageIndex].url}
                                alt={`Vista grande ${imagenes[selectedImageIndex].posicion}`}
                                className="max-h-[85vh] w-auto max-w-full object-contain rounded-2xl"
                            />
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-1 text-xs font-semibold text-white backdrop-blur-xs">
                                {selectedImageIndex + 1} / {imagenes.length}
                            </div>
                        </motion.div>

                        {/* Botón Siguiente */}
                        {imagenes.length > 1 && (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="absolute right-4 sm:right-8 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition cursor-pointer backdrop-blur-sm"
                                title="Siguiente"
                            >
                                <span className="text-2xl font-bold">›</span>
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
