import { motion } from 'framer-motion';
import DynamicIcon from '@/components/DynamicIcon';

export default function HeroSection({ seccionData }) {
    if (!seccionData) return null;

    const getValor = (label) => seccionData?.contenido?.find((item) => item.label?.toLowerCase() === label.toLowerCase())?.valor;

    const extractUrl = (val) => {
        if (!val) return null;
        if (typeof val === 'string') return val.trim();
        if (Array.isArray(val)) {
            const first = val[0];
            return typeof first === 'string' ? first.trim() : extractUrl(first);
        }
        if (typeof val === 'object' && val !== null) {
            return extractUrl(Object.values(val)[0]);
        }
        return null;
    };

    const rawImgGroup = getValor('imagenes') || getValor('img_seccion1') || getValor('imagen') || getValor('Imagen');
    
    let slides = [];
    if (Array.isArray(rawImgGroup)) {
        slides = rawImgGroup.map((item) => {
            if (typeof item === 'string' && item.trim()) {
                const url = item.trim();
                return { pc: url, tablet: url, cel: url };
            }
            if (typeof item === 'object' && item !== null) {
                const pc = extractUrl(item.Imagen_pc || item.imagen_pc || item.pc || item.imagen);
                const tablet = extractUrl(item.Imagen_tablet || item.imagen_tablet || item.tablet || pc);
                const cel = extractUrl(item.Imagen_cel || item.imagen_cel || item.cel || tablet || pc);
                if (pc || tablet || cel) {
                    return { pc, tablet, cel };
                }
            }
            return null;
        }).filter(Boolean);
    } else if (rawImgGroup && typeof rawImgGroup === 'object') {
        const pc = extractUrl(rawImgGroup.Imagen_pc || rawImgGroup.imagen_pc || rawImgGroup.pc);
        const tablet = extractUrl(rawImgGroup.Imagen_tablet || rawImgGroup.imagen_tablet || rawImgGroup.tablet || pc);
        const cel = extractUrl(rawImgGroup.Imagen_cel || rawImgGroup.imagen_cel || rawImgGroup.cel || tablet || pc);
        if (pc || tablet || cel) {
            slides = [{ pc, tablet, cel }];
        }
    } else if (typeof rawImgGroup === 'string' && rawImgGroup.trim()) {
        const url = rawImgGroup.trim();
        slides = [{ pc: url, tablet: url, cel: url }];
    }

    const tituloHero = getValor('titulo_seccion1') || getValor('titulo');
    const descripcionHero = getValor('descripcion_seccion1') || getValor('descripción') || getValor('descripcion') || getValor('subtitulo');
    const rawBotones = getValor('buton') || getValor('boton') || getValor('botones') || [];
    const etiquetas = getValor('etiqueta') || [];
    const whatsappUrl = getValor('whatsapp_url') || 'https://wa.me/51999999999';

    let botones = [];
    if (Array.isArray(rawBotones)) {
        botones = rawBotones;
    } else if (typeof rawBotones === 'string' && rawBotones.trim()) {
        botones = [{ texto: rawBotones.trim(), enlace: whatsappUrl }];
    }

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

    const renderResponsiveImage = (slide, idx = 0) => {
        const fallbackUrl = slide.cel || slide.tablet || slide.pc;
        if (!fallbackUrl) return null;

        return (
            <picture className="h-full w-full block">
                {slide.pc && <source media="(min-width: 1024px)" srcSet={slide.pc} />}
                {slide.tablet && <source media="(min-width: 640px)" srcSet={slide.tablet} />}
                <img
                    src={fallbackUrl}
                    alt={`Hero slide ${idx + 1}`}
                    fetchPriority={idx === 0 ? "high" : "low"}
                    decoding="async"
                    loading={idx === 0 ? "eager" : "lazy"}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'bottom' }}
                />
            </picture>
        );
    };

    return (
        <section id="inicio" className="scroll-mt-10 relative min-h-[480px] sm:min-h-[580px] lg:min-h-[90vh] overflow-hidden">
            {slides.length > 0 && (
                <>
                    <motion.div
                        initial={{ scale: 1.05 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 h-full w-full"
                    >
                        {renderResponsiveImage(slides[0], 0)}
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />
                </>
            )}

            <div className="relative mx-auto flex min-h-[420px] sm:min-h-[500px] lg:min-h-[80vh] max-w-7xl flex-col justify-end px-6 pb-20 pt-32">
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
