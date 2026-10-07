import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import DynamicIcon from '@/components/DynamicIcon';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function HeroSection({ seccionData }) {
    if (!seccionData) return null;

    const getItem = (label) =>
        seccionData?.contenido?.find(
            (item) => item.label?.toLowerCase() === label.toLowerCase()
        );
    const getValor = (label) => getItem(label)?.valor;

    const tituloHero = getValor('titulo_seccion1') || getValor('titulo');
    const descripcionHero =
        getValor('descripcion_seccion1') ||
        getValor('descripción') ||
        getValor('descripcion') ||
        getValor('subtitulo') ||
        getValor('sub_titulo');
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

    const botonItem = getItem('buton') || getItem('boton') || getItem('botones');
    const rawBotones = botonItem?.valor ?? [];
    const botonEnlace = botonItem?.enlace;
    const whatsappUrl = getValor('whatsapp_url') || 'https://wa.me/51999999999';
    const defaultEnlace = botonEnlace || whatsappUrl || '#productos';

    // Normalizar botones a un Array de objetos siempre
    let parsedBotones = [];
    if (Array.isArray(rawBotones)) {
        parsedBotones = rawBotones;
    } else if (rawBotones && typeof rawBotones === 'object') {
        parsedBotones = [rawBotones];
    } else if (typeof rawBotones === 'string' && rawBotones.trim()) {
        parsedBotones = [{ texto: rawBotones.trim(), enlace: defaultEnlace }];
    }

    const botones = parsedBotones.map((btn) => {
        if (typeof btn === 'string') {
            return { texto: btn, enlace: defaultEnlace, icon: null };
        }
        return {
            texto: btn.texto || btn.label || btn.titulo || 'Ver más',
            enlace: btn.enlace || btn.url || btn.texto_enlace || defaultEnlace,
            icon: btn.icon || btn.icono || null,
        };
    });

    // Normalizar etiquetas a un Array de objetos siempre
    const rawEtiquetas = getValor('etiqueta') || getValor('etiquetas') || [];
    let parsedEtiquetas = [];
    if (Array.isArray(rawEtiquetas)) {
        parsedEtiquetas = rawEtiquetas;
    } else if (rawEtiquetas && typeof rawEtiquetas === 'object') {
        parsedEtiquetas = [rawEtiquetas];
    } else if (typeof rawEtiquetas === 'string' && rawEtiquetas.trim()) {
        parsedEtiquetas = [{ span: rawEtiquetas.trim() }];
    }

    const etiquetas = parsedEtiquetas.map((item) => {
        if (typeof item === 'string') {
            return { span: item, span_sub: '', icon: null };
        }
        return {
            span: item.span || item.texto || item.titulo || '',
            span_sub: item.span_sub || item.sub_span || item.subtitulo || item.descripcion || '',
            icon: item.icon || item.icono || null,
        };
    });

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
                        return <span key={partIdx} className="text-white drop-shadow-sm">{part}</span>;
                    })}
                </span>
            );
        });
    };

    const renderResponsiveImage = (slide, idx = 0) => {
        const fallbackUrl = slide.cel || slide.tablet || slide.pc;
        if (!fallbackUrl) return null;

        return (
            <picture className="w-full h-auto block">
                {slide.pc && <source media="(min-width: 1024px)" srcSet={slide.pc} />}
                {slide.tablet && <source media="(min-width: 640px)" srcSet={slide.tablet} />}
                <img
                    src={fallbackUrl}
                    alt={`Hero slide ${idx + 1}`}
                    fetchPriority={idx === 0 ? "high" : "low"}
                    decoding="async"
                    loading={idx === 0 ? "eager" : "lazy"}
                    className="w-full h-auto block object-cover brightness-105"
                    style={{ width: '100%', height: 'auto' }}
                />
            </picture>
        );
    };

    const hasTextContent = Boolean(tituloHero || descripcionHero || (botones && botones.length > 0) || (etiquetas && etiquetas.length > 0));

    return (
        <section id="inicio" className="scroll-mt-10 relative w-full overflow-hidden bg-slate-950">
            {/* Contenedor de imágenes / carrusel */}
            <div className={`w-full ${hasTextContent ? 'relative' : 'relative h-auto'}`}>
                {slides.length > 1 ? (
                    <Swiper
                        modules={[Autoplay, Pagination, EffectFade]}
                        effect="fade"
                        fadeEffect={{ crossFade: true }}
                        loop={true}
                        autoplay={{ delay: 4500, disableOnInteraction: false }}
                        pagination={{ clickable: true }}
                        className="hero-swiper w-full h-auto"
                    >
                        {slides.map((slide, idx) => (
                            <SwiperSlide key={idx} className="relative w-full h-auto overflow-hidden bg-slate-950">
                                {renderResponsiveImage(slide, idx)}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : slides.length === 1 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="w-full h-auto"
                    >
                        {renderResponsiveImage(slides[0], 0)}
                    </motion.div>
                ) : null}

                <style>{`
                    .hero-swiper, .hero-swiper .swiper-wrapper, .hero-swiper .swiper-slide {
                        width: 100% !important;
                        height: auto !important;
                    }
                    .hero-swiper img {
                        width: 100% !important;
                        height: auto !important;
                        display: block !important;
                    }
                    .hero-swiper .swiper-pagination {
                        bottom: 1rem !important;
                        z-index: 20;
                    }
                    .hero-swiper .swiper-pagination-bullet {
                        background: #ffffff !important;
                        opacity: 0.4;
                        width: 10px;
                        height: 10px;
                        margin: 0 4px !important;
                        transition: all 0.3s ease;
                    }
                    .hero-swiper .swiper-pagination-bullet-active {
                        opacity: 1;
                        width: 26px;
                        border-radius: 9999px;
                        background: var(--color-primario, #F72F46) !important;
                    }
                `}</style>
            </div>

            {/* Contenedor de texto si existen datos */}
            {hasTextContent && (
                <div className="absolute inset-0 z-20 mx-auto flex w-full max-w-7xl items-center justify-start px-5 sm:px-8 lg:px-12 py-6 sm:py-12 pointer-events-none">
                    <div className="max-w-xl lg:max-w-2xl text-left pointer-events-auto">
                    {tituloHero && (
                        <h1
                            className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-white drop-shadow-sm"
                            style={{
                                fontFamily: 'var(--tipografia-titulos)',
                            }}
                        >
                            {renderFormattedTitle(tituloHero)}
                        </h1>
                    )}

                    {descripcionHero && (
                        <p
                            className="mt-5 text-base sm:text-lg md:text-xl text-gray-100/90 leading-relaxed drop-shadow-sm"
                            style={{
                                fontFamily: 'var(--tipografia-texto)',
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
                                const btnUrl = btn.enlace || defaultEnlace;
                                return (
                                    <a
                                        key={idx}
                                        href={btnUrl}
                                        target={btnUrl.startsWith('http') ? '_blank' : '_self'}
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-3 px-8 py-4 text-base sm:text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] hover:brightness-110 hover:shadow-2xl"
                                        style={{
                                            backgroundColor: 'var(--color-primario)',
                                            borderRadius: 'var(--radio-bordes)',
                                            fontFamily: 'var(--tipografia-texto)',
                                        }}
                                    >
                                        {renderIcon(btn.icon, 'h-6 w-6 text-white')}
                                        <span>{btn.texto}</span>
                                    </a>
                                );
                            })}
                        </div>
                    )}

                    {etiquetas.length > 0 && (
                        <div className="mt-8 w-full border-t border-white/15 pt-6">
                            <div className="flex flex-wrap items-center justify-start gap-6 md:gap-8">
                                {etiquetas.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        {renderIcon(item.icon, 'h-6 w-6', {
                                            color: 'var(--color-primario)',
                                        })}
                                        <div className="flex flex-col items-start">
                                            <span
                                                className="text-sm font-bold leading-tight text-white"
                                                style={{
                                                    fontFamily: 'var(--tipografia-titulos)',
                                                }}
                                            >
                                                {item.span}
                                            </span>
                                            <span
                                                className="text-xs leading-tight text-gray-300"
                                                style={{
                                                    fontFamily: 'var(--tipografia-texto)',
                                                }}
                                            >
                                                {item.span_sub}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            )}
        </section>
    );
}
