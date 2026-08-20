import { motion } from 'framer-motion';
import DynamicIcon from '@/components/DynamicIcon';

export default function PorQueElegirnosSection({ seccionData }) {
    if (!seccionData) return null;

    const getValor = (label) =>
        seccionData?.contenido?.find(
            (item) => item.label?.toLowerCase() === label.toLowerCase()
        )?.valor;

    const titulo = getValor('Titulo') || getValor('titulo');
    const items = getValor('Por que') || getValor('por que') || [];

    const renderIcon = (iconName, className = 'h-8 w-8', customStyle = null) => {
        if (!iconName) return null;
        return <DynamicIcon name={iconName} className={className} style={customStyle} />;
    };

    return (
        <section
            className="w-full py-10 px-6 md:px-12"
            style={{
                backgroundColor: 'var(--color-primario)',
                fontFamily: 'var(--tipografia-texto)',
            }}
        >
            <div className="max-w-7xl mx-auto">
                {/* Título */}
                {titulo && (
                    <motion.h3
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-2xl md:text-3xl font-bold text-start text-white"
                        style={{ fontFamily: 'var(--tipografia-titulos)' }}
                    >
                        {titulo}
                    </motion.h3>
                )}

                {/* Ítems en flex responsivo */}
                {Array.isArray(items) && items.length > 0 && (
                    <div className="flex flex-col sm:flex-row flex-wrap items-stretch justify-between gap-6 md:gap-8">
                        {items.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="flex-1 flex gap-2 items-start text-start py-6"
                                style={{
                                    fontFamily: 'var(--tipografia-texto)',
                                }}
                            >
                                {/* Ícono */}
                                {item.icono && (
                                    <div className="flex  justify-center">
                                        {renderIcon(item.icono, 'w-7 h-7 text-white')}
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    {/* Título del Ítem */}
                                    {item.titulo && (
                                        <h3
                                            className="text-lg font-semibold text-white"
                                            style={{ fontFamily: 'var(--tipografia-titulos)' }}
                                        >
                                            {item.titulo}
                                        </h3>
                                    )}

                                    {/* Descripción */}
                                    {item.descripcion && (
                                        <p className="text-sm text-white/90 leading-relaxed">
                                            {item.descripcion}
                                        </p>
                                    )}
                                </div>

                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}