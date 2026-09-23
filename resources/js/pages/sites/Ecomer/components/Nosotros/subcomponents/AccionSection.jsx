import React from 'react';
import { motion } from 'framer-motion';
import DynamicIcon from '@/components/DynamicIcon';

export default function AccionSection({ seccionData }) {
    if (!seccionData) return null;

    // Normalizar los datos del valor de la sección
    const rawValor = seccionData?.valor;
    const data = Array.isArray(rawValor) ? rawValor[0] : (rawValor || {});

    const icono = data?.Icono || data?.icono;
    const titulo = data?.Titulo || data?.titulo || '¿Listo para equipar tu empresa?';
    const descripcion = data?.Descripcion || data?.descripcion || '';
    const boton1 = data?.Boton1 || data?.boton1 || 'Ver catálogo completo';
    const boton2 = data?.Boton2 || data?.boton2 || 'Cotizar para empresa';

    return (
        <section className="relative overflow-hidden bg-black py-16 md:py-20 border-t border-zinc-900">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 px-6 py-12 sm:px-12 sm:py-16 lg:px-16 text-center text-white shadow-2xl border border-white/10"
                >
                    {/* Resplandor decorativo de fondo */}
                    <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-[var(--color-primario)]/20 blur-3xl" />
                    <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

                    <div className="relative z-10 mx-auto max-w-3xl flex flex-col items-center">
                        {/* Icono Destacado */}
                        {icono && (
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primario)]/20 text-[var(--color-primario)] border border-[var(--color-primario)]/30 shadow-lg">
                                <DynamicIcon name={icono} className="h-8 w-8" />
                            </div>
                        )}

                        {/* Título Principal */}
                        <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
                            {titulo}
                        </h2>

                        {/* Descripción */}
                        {descripcion && (
                            <p className="mb-8 text-base text-gray-300 sm:text-lg leading-relaxed max-w-2xl">
                                {descripcion}
                            </p>
                        )}

                        {/* Botones de Acción */}
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            {boton1 && (
                                <a
                                    href="#productos"
                                    className="inline-flex items-center justify-center rounded-xl bg-[var(--color-primario)] px-8 py-3.5 text-base font-bold text-white shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] hover:brightness-110"
                                >
                                    {boton1}
                                </a>
                            )}
                            {boton2 && (
                                <a
                                    href="#contacto"
                                    className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] hover:bg-white/20"
                                >
                                    {boton2}
                                </a>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
