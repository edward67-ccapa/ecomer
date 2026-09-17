import { motion } from 'framer-motion';
import DynamicIcon from '@/components/DynamicIcon';

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
    const rawImg = getValor('img_seccion1') || getValor('imagen');
    const imgHero = Array.isArray(rawImg) ? rawImg[0] : rawImg;

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

    return (
        <section id="inicio" className="scroll-mt-10 relative min-h-[100vh] flex items-center overflow-hidden bg-slate-950">
            {imgHero && (
                <>
                    <motion.img
                        initial={{ scale: 1.08 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.1, ease: 'easeOut' }}
                        src={imgHero}
                        alt="Hero background"
                        fetchPriority="high"
                        decoding="async"
                        loading="eager"
                        className="absolute inset-0 h-full w-full min-h-full min-w-full object-cover object-center"
                    />
                    {/* Fondo con degradado y opacidad sobre la imagen para legibilidad en celular y desktop */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/35 sm:bg-black/45" />
                </>
            )}

            {/* Contenedor centrado verticalmente en el medio a la izquierda */}
            <div className="relative mx-auto flex min-h-[550px] sm:min-h-[85vh] lg:min-h-[90vh] w-full items-center justify-start px-5 sm:px-8 lg:px-12 py-12 sm:py-16 z-10">
                <div className="max-w-xl lg:max-w-2xl text-left">
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
        </section>
    );
}
