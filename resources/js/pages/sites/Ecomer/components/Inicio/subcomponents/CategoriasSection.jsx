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

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
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
                                targetUrl = `/plantillas/${siteSlug}/Productos?categoria=${categoriaParam}`;
                            } else if (dominio && siteSlug && siteSlug !== dominio) {
                                targetUrl = `/${dominio}/${siteSlug}/Productos?categoria=${categoriaParam}`;
                            } else if (dominio) {
                                targetUrl = `/${dominio}/Productos?categoria=${categoriaParam}`;
                            } else {
                                targetUrl = `/Productos?categoria=${categoriaParam}`;
                            }
                        }

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                            >
                                <Link
                                    href={targetUrl}
                                    className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center group h-full cursor-pointer block"
                                    style={{ borderRadius: 'var(--radio-bordes)' }}
                                >
                                    {categoria.imagen && (
                                        <div className="w-20 h-20 mb-4 flex items-center justify-center">
                                            <img
                                                src={categoria.imagen}
                                                alt={categoria.titulo || 'Categoría'}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="flex-1 flex flex-col justify-center">
                                        {categoria.titulo && (
                                            <h3
                                                className="text-sm font-bold mb-1 group-hover:text-[var(--color-primario)] transition-colors"
                                                style={{ fontFamily: 'var(--tipografia-titulos)', color: '#1a1a2e' }}
                                            >
                                                {categoria.titulo}
                                            </h3>
                                        )}

                                        {categoria.descripción && (
                                            <p
                                                className="text-xs leading-relaxed"
                                                style={{ fontFamily: 'var(--tipografia-texto)', color: '#666666' }}
                                            >
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
