import { motion } from 'framer-motion';

export default function HeroSection({ hero }) {
    if (!hero) return null;

    const { imagen, titulo, descripcion } = hero;

    if (!imagen && !titulo && !descripcion) return null;

    return (
        <section className="relative overflow-hidden bg-black text-white min-h-[360px] sm:min-h-[420px] lg:min-h-[460px] flex items-center justify-center pt-32 pb-16">
            {/* Imagen de Fondo */}
            {imagen && (
                <div className="absolute inset-0 z-0">
                    <img
                        src={imagen}
                        alt={titulo || ''}
                        className="h-full w-full object-cover object-center filter brightness-75 contrast-105"
                    />
                </div>
            )}

            {/* Overlays de Degradado para legibilidad */}
            <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-black via-black/60 to-black/40" />

            {/* Contenido Principal (solo datos del Hero) */}
            <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="flex flex-col items-center"
                >
                    {/* Título Principal */}
                    {titulo && (
                        <h1
                            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-xl mb-4 leading-tight"
                            style={{ fontFamily: 'var(--tipografia-titulos)' }}
                        >
                            {titulo}
                        </h1>
                    )}

                    {/* Descripción */}
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
