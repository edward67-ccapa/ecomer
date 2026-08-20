import { motion } from 'framer-motion';
import DynamicIcon from '@/components/DynamicIcon';

export default function HeroSection({ seccionData }) {
    if (!seccionData) return null;

    const getValor = (label) => seccionData?.contenido?.find((item) => item.label === label)?.valor;

    const tituloHero = getValor('titulo_seccion1') || getValor('titulo');
    const descripcionHero = getValor('descripcion_seccion1') || getValor('descripción') || getValor('descripcion');
    const imgHero = getValor('img_seccion1') || getValor('imagen');
    const botones = getValor('buton') || getValor('boton') || [];
    const etiquetas = getValor('etiqueta') || [];
    const whatsappUrl = getValor('whatsapp_url') || 'https://wa.me/51999999999';

    const renderIcon = (iconName, className = 'h-8 w-8', customStyle = null) => {
        if (!iconName) return null;
        return <DynamicIcon name={iconName} className={className} style={customStyle} />;
    };

    const renderFormattedTitle = (text) => {
        if (!text) return null;
        const lines = text.split('\n');

        return lines.map((line, lineIdx) => {
            const parts = line.split('/');
            return (
                <span key={lineIdx} className="block">
                    {parts.map((part, partIdx) => {
                        if (!part) return null;
                        if (partIdx % 2 === 1) {
                            return (
                                <span key={partIdx} style={{ color: 'var(--color-primario)' }}>
                                    {part}
                                </span>
                            );
                        }
                        return <span key={partIdx} style={{ color: '#1a1a2e' }}>{part}</span>;
                    })}
                </span>
            );
        });
    };

    return (
        <section className="relative min-h-[85vh] overflow-hidden">
            {imgHero && (
                <>
                    <motion.img
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8 }}
                        src={imgHero}
                        alt="Hero background"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />
                </>
            )}

            <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-end px-6 pb-20 pt-32">
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className="max-w-2xl"
                >
                    {tituloHero && (
                        <h1
                            className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
                            style={{
                                fontFamily: 'var(--tipografia-titulos)',
                                color: '#1a1a2e',
                            }}
                        >
                            {renderFormattedTitle(tituloHero)}
                        </h1>
                    )}

                    {descripcionHero && (
                        <p
                            className="mt-4 text-lg sm:text-xl"
                            style={{
                                fontFamily: 'var(--tipografia-texto)',
                                color: '#333333',
                            }}
                        >
                            {descripcionHero}
                        </p>
                    )}

                    {botones.length > 0 && (
                        <div
                            className="mt-8 flex flex-wrap"
                            style={{ gap: 'var(--espaciado)' }}
                        >
                            {botones.map((btn, idx) => {
                                const btnUrl = btn.enlace || btn.texto_enlace || btn.url || whatsappUrl;
                                return (
                                    <motion.a
                                        key={idx}
                                        whileTap={{ scale: 0.96 }}
                                        href={btnUrl}
                                        target={btnUrl.startsWith('http') ? '_blank' : '_self'}
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:brightness-105 hover:shadow-2xl"
                                        style={{
                                            backgroundColor: 'var(--color-primario)',
                                            borderRadius: 'var(--radio-bordes)',
                                            fontFamily: 'var(--tipografia-texto)',
                                        }}
                                    >
                                        {renderIcon(btn.icon, 'h-6 w-6 text-white')}
                                        <span>{btn.texto}</span>
                                    </motion.a>
                                );
                            })}
                        </div>
                    )}
                </motion.div>

                {etiquetas.length > 0 && (
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="mt-16 w-full"
                    >
                        <div className="flex flex-wrap items-center justify-start gap-6 md:gap-10">
                            {etiquetas.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    {renderIcon(item.icon, 'h-6 w-6', {
                                        color: 'var(--color-primario)',
                                    })}
                                    <div className="flex flex-col items-start">
                                        <span
                                            className="text-sm font-bold leading-tight"
                                            style={{
                                                fontFamily: 'var(--tipografia-titulos)',
                                                color: '#1a1a2e',
                                            }}
                                        >
                                            {item.span}
                                        </span>
                                        <span
                                            className="text-xs leading-tight text-black/80"
                                            style={{
                                                fontFamily: 'var(--tipografia-texto)',
                                            }}
                                        >
                                            {item.span_sub || item.sub_span}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
