import { motion } from 'framer-motion';
import DynamicIcon from '@/components/DynamicIcon';

export default function ProcesosGroup({ procesosBlock }) {
    if (!procesosBlock || !procesosBlock.items || procesosBlock.items.length === 0) {
        return null;
    }

    const { subIcono, sub, titulo, imagenFondo, items } = procesosBlock;

    return (
        <section className="relative overflow-hidden bg-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 text-gray-900">
            {/* Imagen de Fondo (Rayos / Patrón de fondo si existe) */}
            {imagenFondo && (
                <div className="absolute inset-0 z-0 pointer-events-none opacity-20 flex items-center justify-center">
                    <img
                        src={imagenFondo}
                        alt="Fondo Procesos"
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                    />
                </div>
            )}

            <div className="relative z-10 mx-auto max-w-[1540px]">
                {/* ── Encabezado Estándar de Ecomer ── */}
                <div className="mb-10 pb-3 border-b border-gray-200">
                    {sub && (
                        <p
                            className="text-xs font-bold uppercase tracking-widest mb-1 inline-flex items-center gap-2"
                            style={{ color: 'var(--color-primario)', fontFamily: 'var(--tipografia-texto)' }}
                        >
                            {subIcono && (
                                <DynamicIcon
                                    name={subIcono}
                                    className="h-4 w-4 shrink-0"
                                    style={{ color: 'var(--color-primario)' }}
                                />
                            )}
                            <span>{sub}</span>
                        </p>
                    )}

                    {titulo && (
                        <h2
                            className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight"
                            style={{ fontFamily: 'var(--tipografia-titulos)' }}
                        >
                            {titulo}
                        </h2>
                    )}
                </div>

                {/* ── Grid de Tarjetas de Procesos (3 Columnas) ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {items.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="relative rounded-2xl p-8 sm:p-9 shadow-xs border border-gray-200/70 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1 min-h-[210px]"
                            style={{ backgroundColor: 'color-mix(in srgb, var(--color-primario) 5%, white)' }}
                        >
                            {/* Círculo con Número ("01", "02", "03") en la esquina superior derecha */}
                            <div
                                className="absolute top-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-white border-2 text-lg font-bold shadow-sm"
                                style={{ borderColor: 'color-mix(in srgb, var(--color-primario) 30%, transparent)' }}
                            >
                                <span style={{ fontFamily: 'var(--tipografia-titulos)', color: 'var(--color-primario)' }}>{item.numero}</span>
                            </div>

                            {/* Contenido: Título + Descripción */}
                            <div className="pr-16">
                                {item.titulo && (
                                    <h3
                                        className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-snug tracking-tight"
                                        style={{ fontFamily: 'var(--tipografia-titulos)' }}
                                    >
                                        {item.titulo}
                                    </h3>
                                )}

                                {item.descripcion && (
                                    <p
                                        className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal"
                                        style={{ fontFamily: 'var(--tipografia-texto)' }}
                                    >
                                        {item.descripcion}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
