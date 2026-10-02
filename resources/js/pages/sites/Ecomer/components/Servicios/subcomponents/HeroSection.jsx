import { motion } from 'framer-motion';

export default function HeroSection({ hero }) {
    if (!hero) return null;

    const { imagen, responsiveImg, titulo, descripcion } = hero;
    const hasBgImage = Boolean(responsiveImg?.pc || responsiveImg?.tablet || responsiveImg?.cel || imagen);

    if (!hasBgImage && !titulo && !descripcion) return null;

    return (
        <section className="relative overflow-hidden bg-black text-white h-[80vh] min-h-[80vh] w-full flex items-center justify-center">
            {hasBgImage && (
                <div className="absolute inset-0 z-0 h-full w-full">
                    <picture className="h-full w-full block">
                        {responsiveImg?.pc && <source media="(min-width: 1024px)" srcSet={responsiveImg.pc} />}
                        {responsiveImg?.tablet && <source media="(min-width: 640px)" srcSet={responsiveImg.tablet} />}
                        <img
                            src={responsiveImg?.cel || responsiveImg?.tablet || responsiveImg?.pc || imagen}
                            alt={titulo || ''}
                            fetchPriority="high"
                            decoding="async"
                            loading="eager"
                            className="h-full w-full object-cover brightness-105"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center bottom',
                            }}
                        />
                    </picture>
                </div>
            )}

            {/* Overlays de Degradado para legibilidad */}
            <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-black via-black/60 to-black/40" />

            {/* Contenido Principal */}
            <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="flex flex-col items-center"
                >
                    {titulo && (
                        <h1
                            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-xl mb-4 leading-tight"
                            style={{ fontFamily: 'var(--tipografia-titulos)' }}
                        >
                            {titulo}
                        </h1>
                    )}

                    {descripcion && (
                        <p
                            className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-gray-200 font-medium leading-relaxed drop-shadow-md"
                            style={{ fontFamily: 'var(--tipografia-texto)' }}
                        >
                            {descripcion}
                        </p>
                    )}
                </motion.div>
            </div>
        </section>
    );
}