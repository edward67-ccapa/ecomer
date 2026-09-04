import { motion } from 'framer-motion';
import DynamicIcon from '@/components/DynamicIcon';

export default function SomosSection({ seccionData }) {
    if (!seccionData) return null;

    const getValor = (label) => seccionData?.contenido?.find((item) => item.label === label)?.valor;

    const subTituloSomos = getValor('sub_titulo') || '';
    const tituloSomos = getValor('titulo') || '';
    const iconoSomos = getValor('icono') || '';
    const descripcionSomos = getValor('descripcion') || '';
    const etiquetasSomos = getValor('etiqueta') || [];
    const imagenSomos = getValor('imagen') || '';

    const renderIcon = (iconName, className = 'h-8 w-8', customStyle = null) => {
        if (!iconName) return null;
        return <DynamicIcon name={iconName} className={className} style={customStyle} />;
    };

    return (
        <section id="nosotros" className="scroll-mt-10 py-16 px-6" style={{ backgroundColor: 'var(--color-secundario)' }}>
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Columna 1 - Texto */}
                    <div>
                        {subTituloSomos && (
                            <motion.p
                                initial={{ opacity: 0, y: -20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="text-center lg:text-left text-sm font-semibold uppercase tracking-wider mb-2"
                                style={{ color: 'var(--color-primario)', fontFamily: 'var(--tipografia-texto)' }}
                            >
                                {subTituloSomos}
                            </motion.p>
                        )}

                        {tituloSomos && (
                            <motion.h2
                                initial={{ opacity: 0, y: -20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-3xl md:text-4xl font-bold text-center lg:text-left mb-2"
                                style={{ fontFamily: 'var(--tipografia-titulos)', color: '#1a1a2e' }}
                            >
                                {tituloSomos}
                            </motion.h2>
                        )}

                        {iconoSomos && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="flex items-center justify-center gap-4 mb-6"
                            >
                                <div
                                    className="flex-1 max-w-20 h-px"
                                    style={{
                                        background: 'linear-gradient(to right, transparent, var(--color-primario))'
                                    }}
                                />
                                {renderIcon(iconoSomos, 'h-5 w-5', {
                                    color: 'var(--color-primario)',
                                })}
                                <div
                                    className="flex-1 max-w-20 h-px"
                                    style={{
                                        background: 'linear-gradient(to left, transparent, var(--color-primario))'
                                    }}
                                />
                            </motion.div>
                        )}

                        {descripcionSomos && (
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="text-base leading-relaxed text-center lg:text-left mb-8"
                                style={{ fontFamily: 'var(--tipografia-texto)', color: '#555555' }}
                            >
                                {descripcionSomos}
                            </motion.p>
                        )}

                        {etiquetasSomos.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="flex flex-wrap justify-center lg:justify-start gap-6 md:gap-10"
                            >
                                {etiquetasSomos.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        {renderIcon(item.icono, 'h-8 w-8', {
                                            color: 'var(--color-primario)',
                                        })}
                                        <div className="flex flex-col">
                                            <span
                                                className="text-xl font-bold leading-tight"
                                                style={{ fontFamily: 'var(--tipografia-titulos)', color: '#1a1a2e' }}
                                            >
                                                {item.span}
                                            </span>
                                            <span
                                                className="text-xs leading-tight"
                                                style={{ fontFamily: 'var(--tipografia-texto)', color: '#666666' }}
                                            >
                                                {item.sub_span}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </div>

                    {/* Columna 2 - Imagen */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="flex justify-center lg:justify-end"
                    >
                        {imagenSomos && (
                            <img
                                src={imagenSomos}
                                alt={tituloSomos || "Sobre nosotros"}
                                width={493}
                                height={329}
                                loading="lazy"
                                decoding="async"
                                className="w-full max-w-md rounded-xl object-cover shadow-lg aspect-[3/2]"
                                style={{ borderRadius: 'var(--radio-bordes)' }}
                            />
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
