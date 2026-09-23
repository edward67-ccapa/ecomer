import { motion } from 'framer-motion';
import DynamicIcon from '@/components/DynamicIcon';

export default function ServiciosGroup({ serviciosBlock }) {
    if (!serviciosBlock || !serviciosBlock.items || serviciosBlock.items.length === 0) {
        return null;
    }

    const { subIcono, sub, titulo, items } = serviciosBlock;

    return (
        <section className="bg-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8 text-gray-900">
            <div className="mx-auto max-w-[1540px]">
                {/* ── Encabezado Estándar de Ecomer (Título y Subtítulo idéntico a las demás secciones) ── */}
                <div className="mb-8 pb-3 border-b border-gray-200">
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

                {/* ── Grid de Tarjetas de Servicios (Rectángulo echado aspect-[4/3] sin espacio abajo) ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {items.map((item, idx) => {
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 35 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="group relative overflow-hidden rounded-[2rem] shadow-xl aspect-[4/3] cursor-pointer"
                            >
                                {/* Imagen de Fondo — ocupa toda la tarjeta en cover */}
                                {item.imagen ? (
                                    <img
                                        src={item.imagen}
                                        alt={item.titulo || 'Servicio'}
                                        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gray-900" />
                                )}

                                {/* Overlay base — siempre visible, sutil */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-0" />

                                {/* Overlay hover — se intensifica al hacer hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                {/* Insignia Superior: "No - 01" */}
                                <div className="absolute top-6 left-6 z-20">
                                    <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold text-white bg-white/20 backdrop-blur-md border border-white/30 shadow-sm">
                                        {item.numero}
                                    </span>
                                </div>

                                {/* Contenido Inferior — aparece desde abajo con hover */}
                                <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-7">
                                    <div className="translate-y-6 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                                        {/* Título */}
                                        {item.titulo && (
                                            <h3
                                                className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug tracking-tight"
                                                style={{ fontFamily: 'var(--tipografia-titulos)' }}
                                            >
                                                {item.titulo}
                                            </h3>
                                        )}

                                        {/* Descripción */}
                                        {item.descripcion && (
                                            <p
                                                className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal mb-5 line-clamp-2"
                                                style={{ fontFamily: 'var(--tipografia-texto)' }}
                                            >
                                                {item.descripcion}
                                            </p>
                                        )}

                                        {/* Botón en Color Primario Global con Ícono en Círculo */}
                                        {item.boton && (
                                            <div className="flex items-center">
                                                <span
                                                    className="inline-flex items-center gap-2.5 rounded-full text-white px-4 py-2 text-xs sm:text-sm font-bold shadow-md transition-all duration-300 hover:scale-105 cursor-pointer"
                                                    style={{ backgroundColor: 'var(--color-primario)', fontFamily: 'var(--tipografia-texto)' }}
                                                >
                                                    <span>{item.boton}</span>
                                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
                                                        <DynamicIcon name={item.botonIcono || 'FaChevronRight'} className="h-3 w-3" />
                                                    </span>
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
