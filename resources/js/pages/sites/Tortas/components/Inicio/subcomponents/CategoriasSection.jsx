import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import DynamicIcon from '@/components/DynamicIcon';

export default function CategoriasSection({ seccionData, dominio, siteSlug }) {
    if (!seccionData) return null;

    const getValor = (label) => seccionData?.contenido?.find((item) => item.label === label)?.valor;

    const subTitulo = getValor('sub_titulo');
    const titulo    = getValor('titulo');
    const icono     = getValor('icono');
    const categorias = getValor('servicios') || getValor('categorias') || [];

    const renderIcon = (iconName, className = 'h-8 w-8', customStyle = null) => {
        if (!iconName) return null;
        return <DynamicIcon name={iconName} className={className} style={customStyle} />;
    };

    return (
        <section className="py-16 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    {subTitulo && (
                        <motion.p
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="text-sm font-semibold uppercase tracking-wider mb-2"
                            style={{ color: 'var(--color-primario)', fontFamily: 'var(--tipografia-texto)' }}
                        >
                            {subTitulo}
                        </motion.p>
                    )}

                    {titulo && (
                        <motion.h2
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-3xl md:text-4xl font-bold text-center mb-2"
                            style={{ fontFamily: 'var(--tipografia-titulos)', color: '#1a1a2e' }}
                        >
                            {titulo}
                        </motion.h2>
                    )}

                    {icono && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex items-center justify-center gap-4"
                        >
                            <div
                                className="flex-1 max-w-20 h-px"
                                style={{ background: 'linear-gradient(to right, transparent, var(--color-primario))' }}
                            />
                            {renderIcon(icono, 'h-5 w-5', { color: 'var(--color-primario)' })}
                            <div
                                className="flex-1 max-w-20 h-px"
                                style={{ background: 'linear-gradient(to left, transparent, var(--color-primario))' }}
                            />
                        </motion.div>
                    )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                    {categorias.map((categoria, idx) => {
                        const getValidLink = (url) => {
                            if (!url || typeof url !== 'string') return null;
                            const trimmed = url.trim();
                            if (trimmed === '' || trimmed === '#') return null;
                            return trimmed;
                        };

                        const customEnlace = getValidLink(categoria.enlace) || getValidLink(categoria.titulo_enlace) || getValidLink(categoria.url);
                        const categoriaParam = encodeURIComponent(categoria.titulo || '');

                        let targetUrl = customEnlace;
                        if (!targetUrl) {
                            if (dominio === 'plantillas') {
                                targetUrl = `/plantillas/${siteSlug}/productos?categoria=${categoriaParam}`;
                            } else if (dominio && siteSlug && siteSlug !== dominio) {
                                targetUrl = `/${dominio}/${siteSlug}/productos?categoria=${categoriaParam}`;
                            } else if (dominio) {
                                targetUrl = `/${dominio}/productos?categoria=${categoriaParam}`;
                            } else {
                                targetUrl = `/productos?categoria=${categoriaParam}`;
                            }
                        }

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.08 }}
                            >
                                <Link
                                    href={targetUrl}
                                    className="relative h-44 rounded-2xl transition-all duration-300 text-left group cursor-pointer overflow-hidden border border-gray-800 hover:border-gray-600 shadow-md hover:scale-[1.02] bg-neutral-950 p-5 flex flex-col justify-between block"
                                >
                                    {/* Imagen de Fondo Real de la Categoría */}
                                    {categoria.imagen ? (
                                        <img
                                            src={categoria.imagen}
                                            alt={categoria.titulo || 'Categoría'}
                                            width={400}
                                            height={400}
                                            loading="lazy"
                                            decoding="async"
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
                                    )}

                                    {/* Superposición Oscura Elegante */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 group-hover:via-black/40 transition-colors z-10" />

                                    {/* Contenido Superior */}
                                    <div className="relative z-20 flex items-center justify-between">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/90 bg-black/40 px-2.5 py-0.5 rounded-md backdrop-blur-xs border border-white/10">
                                            Categoría
                                        </span>
                                    </div>

                                    {/* Contenido Inferior */}
                                    <div className="relative z-20">
                                        {categoria.titulo && (
                                            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[var(--color-primario)] transition-colors tracking-tight line-clamp-1">
                                                {categoria.titulo}
                                            </h3>
                                        )}

                                        {categoria.descripción && (
                                            <p className="text-[11px] text-gray-300 font-medium line-clamp-1">
                                                {categoria.descripción}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
