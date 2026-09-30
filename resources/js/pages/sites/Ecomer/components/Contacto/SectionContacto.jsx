import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import DynamicIcon from '@/components/DynamicIcon';
import { useContactoData } from './hooks/useContactoData';

function CuentaPagoCard({ item }) {
    const [copiado, setCopiado] = useState(false);
    const label = item.label || item.Label || 'Cuenta:';
    const metodo = item.metodo_pago || item.Metodo_pago || item.metodo || 'Banco';
    const info = item.info || item.Info || item.numero || '';

    const handleCopy = () => {
        if (info && typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(info);
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2000);
        }
    };

    return (
        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/70 hover:border-gray-300 transition-colors shadow-2xs space-y-1">
            <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider truncate">
                    {label}
                </span>
                <span className="text-xs font-extrabold text-[var(--color-primario)] shrink-0">
                    {metodo}
                </span>
            </div>
            <div className="flex items-center justify-between gap-2 pt-0.5">
                <span className="text-sm font-bold text-gray-900 font-mono select-all truncate">
                    {info}
                </span>
                {info && (
                    <button
                        type="button"
                        onClick={handleCopy}
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md border transition cursor-pointer shrink-0 ${
                            copiado
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-white text-gray-600 hover:text-gray-900 border-gray-200 hover:bg-gray-100 shadow-2xs'
                        }`}
                        title="Copiar número de cuenta"
                    >
                        {copiado ? '¡Copiado!' : 'Copiar'}
                    </button>
                )}
            </div>
        </div>
    );
}

export default function SectionContacto({ site, seccion, seccionesData, estilos }) {
    const { contacto } = useContactoData(seccion, seccionesData);

    const memoData = useMemo(() => {
        const rawValor = contacto?.valor || contacto?.contenido?.find((c) => (c.label || '').toLowerCase() === 'contacto')?.valor;
        const data = Array.isArray(rawValor) ? rawValor[0] : (rawValor || {});

        const directTitulo = contacto?.contenido?.find((c) => (c.label || '').toLowerCase() === 'titulo')?.valor;
        const directDesc = contacto?.contenido?.find((c) => {
            const l = (c.label || '').toLowerCase();
            return l === 'descripcion' || l === 'descripción' || l === 'subtitulo';
        })?.valor;

        const titulo = data?.Titulo || data?.titulo || (typeof directTitulo === 'string' ? directTitulo : null) || 'Contacto';
        const descripcion = data?.Descripcion || data?.descripcion || (typeof directDesc === 'string' ? directDesc : null) || 'Ponte en contacto con nosotros. Envíanos tu mensaje o consulta y te responderemos a la brevedad.';

        const directImgItem = contacto?.contenido?.find((c) => {
            const l = (c.label || '').toLowerCase();
            return l === 'imagen' || l === 'foto' || l === 'portada' || l === 'banner' || c.tipo === 'imagen';
        });
        const directImgVal = directImgItem?.valor;
        const imagenDirecta = Array.isArray(directImgVal) ? directImgVal[0] : (typeof directImgVal === 'string' ? directImgVal : null);

        const direccion = estilos?.direccion
            || site?.estilos?.direccion
            || data?.Mapa
            || data?.mapa
            || null;
        const mapaUrlConfig = estilos?.mapa_url || site?.estilos?.mapa_url;

        const redesConfig = estilos?.redes_sociales || site?.estilos?.redes_sociales || {};

        const formatSocialUrl = (val, prefix = '') => {
            if (!val) return null;
            const str = String(val).trim();
            if (!str) return null;
            if (str.startsWith('http://') || str.startsWith('https://')) return str;
            if (str.startsWith('@')) return `${prefix}${str.slice(1)}`;
            return `${prefix}${str}`;
        };

        const redesList = [];
        if (redesConfig.facebook) redesList.push({ nombre: 'Facebook', icono: 'FaFacebook', url: formatSocialUrl(redesConfig.facebook, 'https://facebook.com/') });
        if (redesConfig.instagram) redesList.push({ nombre: 'Instagram', icono: 'FaInstagram', url: formatSocialUrl(redesConfig.instagram, 'https://instagram.com/') });
        if (redesConfig.tiktok) redesList.push({ nombre: 'TikTok', icono: 'FaTiktok', url: formatSocialUrl(redesConfig.tiktok, 'https://tiktok.com/@') });
        if (redesConfig.youtube) redesList.push({ nombre: 'YouTube', icono: 'FaYoutube', url: formatSocialUrl(redesConfig.youtube, 'https://youtube.com/@') });
        if (redesConfig.twitter) redesList.push({ nombre: 'X (Twitter)', icono: 'FaXTwitter', url: formatSocialUrl(redesConfig.twitter, 'https://x.com/') });

        const cmsRedes = Array.isArray(data?.Redes) ? data.Redes : (Array.isArray(data?.redes) ? data.redes : []);
        const redesFinales = redesList.length > 0 ? redesList : cmsRedes.map(r => ({
            nombre: r.nombre || 'Red Social',
            icono: r.Icono || r.icono || 'FaShareNodes',
            url: r.Texto || r.texto || '#'
        }));

        const imagenHero = data?.Imagen
            || data?.imagen
            || data?.Foto
            || data?.foto
            || imagenDirecta
            || seccion?.imagen
            || site?.imagen
            || 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=1600&auto=format&fit=crop';

        const globalActions = Array.isArray(estilos?.acciones_nav)
            ? estilos.acciones_nav
            : (Array.isArray(site?.estilos?.acciones_nav) ? site.estilos.acciones_nav : []);

        const waFromActions = globalActions.find((a) => {
            const ico = (a.icono || a.icon || '').toLowerCase();
            const txt = (a.texto || a.Texto || '').toLowerCase();
            return ico.includes('whatsapp') || txt.includes('wa.me');
        });

        const rawWa = redesConfig.whatsapp || waFromActions?.texto || waFromActions?.Texto || '';
        const firstSegment = String(rawWa).split(/[\r\n/;,|]+/).map((s) => s.trim()).filter(Boolean)[0] || String(rawWa);
        const cleanDigits = firstSegment.replace(/\D/g, '');
        const waNum = cleanDigits ? (cleanDigits.length === 9 ? '51' + cleanDigits : cleanDigits) : null;

        const rawCuentas = estilos?.cuentas_pago || site?.estilos?.cuentas_pago || [];
        const cuentasPago = Array.isArray(rawCuentas)
            ? rawCuentas
            : (rawCuentas && typeof rawCuentas === 'object' ? Object.values(rawCuentas) : []);

        const googleMapEmbedUrl = mapaUrlConfig && (mapaUrlConfig.includes('google.com/maps/embed') || mapaUrlConfig.includes('output=embed'))
            ? mapaUrlConfig
            : (direccion ? `https://maps.google.com/maps?q=${encodeURIComponent(direccion)}&t=&z=15&ie=UTF8&iwloc=&output=embed` : null);

        return {
            titulo,
            descripcion,
            direccion,
            mapaUrlConfig,
            redesFinales,
            imagenHero,
            globalActions,
            waNum,
            cuentasPago,
            googleMapEmbedUrl
        };
    }, [contacto, seccion, site, estilos]);

    const {
        titulo,
        descripcion,
        direccion,
        mapaUrlConfig,
        redesFinales,
        imagenHero,
        globalActions,
        waNum,
    } = memoData;

    // Form state
    const [enviado, setEnviado] = useState(false);
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (enviando || enviado) return;

        const form = e.currentTarget;
        const formData = new FormData(form);

        const nombre = formData.get('nombre') || '';
        const email = formData.get('email') || '';
        const telefono = formData.get('telefono') || '';
        const fecha = formData.get('fecha') || '';
        const mensaje = formData.get('mensaje') || '';

        setEnviando(true);

        try {
            const res = await fetch('/api/contacto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ nombre, email, telefono, fecha, mensaje })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setEnviado(true);
                form.reset();

                setTimeout(() => {
                    setEnviado(false);
                }, 4000);
            } else {
                alert('No se pudo enviar el correo: ' + (data.error || 'Error desconocido'));
            }
        } catch (err) {
            console.error('Error enviando correo de contacto:', err);
            alert('Error de red al intentar enviar el correo.');
        } finally {
            setEnviando(false);
        }
    };

    // Cuentas de pago desde Admin General (estilos.cuentas_pago)
    const rawCuentas = estilos?.cuentas_pago || site?.estilos?.cuentas_pago || [];
    const cuentasPago = Array.isArray(rawCuentas)
        ? rawCuentas
        : (rawCuentas && typeof rawCuentas === 'object' ? Object.values(rawCuentas) : []);

    // Google Map URL
    const googleMapEmbedUrl = mapaUrlConfig && (mapaUrlConfig.includes('google.com/maps/embed') || mapaUrlConfig.includes('output=embed'))
        ? mapaUrlConfig
        : (direccion ? `https://maps.google.com/maps?q=${encodeURIComponent(direccion)}&t=&z=15&ie=UTF8&iwloc=&output=embed` : null);

    return (
        <main className="flex-1 bg-white">
            {/* 1. SECCIÓN SUPERIOR: HERO CON IMAGEN DE FONDO */}
            <section className="relative h-[80vh] min-h-[500px] w-full overflow-hidden bg-slate-950 flex items-center">
                {imagenHero && (
                    <div className="absolute inset-0 z-0 h-full w-full">
                        <img
                            src={imagenHero}
                            alt={titulo}
                            fetchPriority="high"
                            decoding="async"
                            loading="eager"
                            className="h-full w-full object-cover brightness-90"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center bottom',
                            }}
                        />
                    </div>
                )}

                {/* Dark Gradient Overlay for legibility */}
                <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-black/55 to-black/75" />

                {/* Top Header Content Overlaid on Image */}
                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-xl text-white">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/20 mb-2 sm:mb-3">
                                <span className="h-2 w-2 rounded-full bg-[var(--color-primario)] animate-pulse" />
                                Ubicación & Contacto
                            </span>
                            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-md mb-2 sm:mb-3">
                                {titulo}
                            </h1>
                            {descripcion && (
                                <p className="text-xs sm:text-base text-gray-200 font-medium leading-relaxed max-w-lg drop-shadow">
                                    {descripcion}
                                </p>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. SECCIÓN INTERMEDIA: INFORMACIÓN DE CONTACTO Y FORMULARIO */}
            <section className="relative z-20 bg-white pb-16 pt-12 sm:pt-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                        {/* COLUMNA IZQUIERDA: DIRECCIÓN, DATOS DE CONTACTO Y REDES SOCIALES */}
                        <div className="lg:col-span-6 pt-8 sm:pt-12 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="space-y-6"
                            >
                                {/* Tarjeta Dirección Física (Desde General) */}
                                {direccion && (
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-gray-800 shadow-xs border border-gray-200/60 mt-0.5">
                                            <DynamicIcon name="FaLocationDot" className="h-5 w-5 text-gray-700" />
                                        </div>
                                        <div>
                                            <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">Dirección</span>
                                            <a
                                                href={mapaUrlConfig || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block text-base font-bold text-gray-900 hover:text-[var(--color-primario)] transition-colors max-w-md whitespace-pre-line"
                                            >
                                                {direccion}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Dynamic Contact Actions from Admin General (globalActions) */}
                                {Array.isArray(globalActions) && globalActions.length > 0 && (
                                    globalActions.map((item, idx) => {
                                        const iconName = item.icono || item.icon || 'FaInfoCircle';
                                        const textVal = item.texto || item.Texto || '';
                                        if (!textVal) return null;

                                        const iconLower = iconName.toLowerCase();
                                        const textLower = textVal.toLowerCase();

                                        const label = item.label || item.Label || (
                                            iconLower.includes('envelope') || textLower.includes('@') ? 'Correo Electrónico' :
                                                iconLower.includes('phone') || iconLower.includes('whatsapp') || iconLower.includes('mobile') ? 'Teléfono / WhatsApp' :
                                                    iconLower.includes('location') || iconLower.includes('map') || iconLower.includes('marker') || iconLower.includes('pin') ? 'Dirección' :
                                                        'Contacto'
                                        );

                                        const lines = textVal.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

                                        const getLineHref = (lineStr) => {
                                            const lineLower = lineStr.toLowerCase();
                                            const isEmail = lineLower.includes('@');
                                            const clean = lineStr.replace(/\D/g, '');
                                            const isPhone = (iconLower.includes('whatsapp') || iconLower.includes('phone') || iconLower.includes('mobile')) && clean.length >= 7;
                                            const isLink = lineLower.includes('.com') || lineLower.includes('.pe') || lineLower.startsWith('http');

                                            if (isEmail) return `mailto:${lineStr}`;
                                            if (isPhone && clean.length >= 7) {
                                                return iconLower.includes('whatsapp')
                                                    ? `https://wa.me/${clean.length === 9 ? '51' + clean : clean}`
                                                    : `tel:${clean}`;
                                            }
                                            if (isLink) return lineStr.startsWith('http') ? lineStr : `https://${lineStr}`;
                                            return null;
                                        };

                                        return (
                                            <div key={idx} className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-gray-800 shadow-xs border border-gray-200/60">
                                                    <DynamicIcon name={iconName} className="h-5 w-5 text-gray-700" />
                                                </div>
                                                <div>
                                                    <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">{label}</span>
                                                    {lines.map((lineStr, lineIdx) => {
                                                        const lineHref = getLineHref(lineStr);
                                                        return lineHref ? (
                                                            <a
                                                                key={lineIdx}
                                                                href={lineHref}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block text-base font-bold text-gray-900 hover:text-[var(--color-primario)] transition-colors"
                                                            >
                                                                {lineStr}
                                                            </a>
                                                        ) : (
                                                            <span key={lineIdx} className="block text-base font-bold text-gray-900">
                                                                {lineStr}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}

                                {/* Tarjeta WhatsApp si no estaba en globalActions */}
                                {(!globalActions.some(a => (a.icono || a.icon || '').toLowerCase().includes('whatsapp'))) && waNum && (
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-gray-800 shadow-xs border border-gray-200/60">
                                            <DynamicIcon name="FaWhatsapp" className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">WhatsApp Oficial</span>
                                            <a
                                                href={`https://wa.me/${waNum}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block text-base font-bold text-gray-900 hover:text-emerald-600 transition-colors"
                                            >
                                                +{waNum}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* REDES SOCIALES DESDE GENERAL */}
                                {redesFinales.length > 0 && (
                                    <div className="pt-4 border-t border-gray-100">
                                        <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                                            Síguenos en nuestras redes
                                        </span>
                                        <div className="flex flex-wrap items-center gap-3">
                                            {redesFinales.map((item, idx) => (
                                                <a
                                                    key={idx}
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title={item.nombre}
                                                    className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-700 shadow-sm border border-gray-200/80 transition-all duration-300 hover:bg-[var(--color-primario)] hover:text-white hover:border-transparent hover:scale-110"
                                                >
                                                    <DynamicIcon name={item.icono} className="h-5 w-5" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* INFORMACIÓN DE PAGO Y CUENTAS BANCARIAS */}
                                {cuentasPago.length > 0 && (
                                    <div className="pt-4 border-t border-gray-100 space-y-3">
                                        <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                                            Métodos de Pago / Cuentas Bancarias
                                        </span>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {cuentasPago.map((item, idx) => (
                                                <CuentaPagoCard key={idx} item={item} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* COLUMNA DERECHA: FORMULARIO "Envíanos un mensaje" (Flotante sobre la imagen superior) */}
                        <div className="lg:col-span-6">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.1 }}
                                className="relative lg:-mt-48 z-30 rounded-[2rem] bg-white p-8 sm:p-10 shadow-2xl border border-gray-100"
                            >
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-6">
                                    Envíanos un mensaje
                                </h2>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Name */}
                                        <div>
                                            <input
                                                type="text"
                                                name="nombre"
                                                required
                                                placeholder="Nombre completo"
                                                className="w-full rounded-2xl border border-gray-200/80 bg-gray-50/50 px-5 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[var(--color-primario)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primario)]/20"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                placeholder="Correo electrónico"
                                                className="w-full rounded-2xl border border-gray-200/80 bg-gray-50/50 px-5 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[var(--color-primario)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primario)]/20"
                                            />
                                        </div>

                                        {/* Fecha del evento / entrega */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 px-1">
                                                Fecha del evento / entrega
                                            </label>
                                            <input
                                                type="date"
                                                name="fecha"
                                                required
                                                className="w-full rounded-2xl border border-gray-200/80 bg-gray-50/50 px-5 py-3 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-[var(--color-primario)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primario)]/20"
                                            />
                                        </div>

                                        {/* Phone / Text */}
                                        <div>
                                            <input
                                                type="tel"
                                                name="telefono"
                                                placeholder="Teléfono / Celular"
                                                className="w-full rounded-2xl border border-gray-200/80 bg-gray-50/50 px-5 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[var(--color-primario)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primario)]/20"
                                            />
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <textarea
                                                name="mensaje"
                                                required
                                                rows={4}
                                                placeholder="Escribe tu mensaje..."
                                                className="w-full rounded-2xl border border-gray-200/80 bg-gray-50/50 px-5 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[var(--color-primario)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primario)]/20 resize-none"
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={enviando || enviado}
                                            className={`w-full rounded-2xl py-4 px-6 text-sm font-bold text-white shadow-xl transition-all duration-300 cursor-pointer mt-2 flex items-center justify-center gap-2 ${
                                                enviado
                                                    ? 'bg-emerald-600 border border-emerald-500'
                                                    : 'hover:scale-[1.01] active:scale-[0.98] hover:brightness-110'
                                            }`}
                                            style={{ backgroundColor: enviado ? '#059669' : 'var(--color-primario)' }}
                                        >
                                            {enviando ? (
                                                <>
                                                    <DynamicIcon name="FaSpinner" className="h-4 w-4 animate-spin text-white" />
                                                    <span>Enviando mensaje...</span>
                                                </>
                                            ) : enviado ? (
                                                <>
                                                    <DynamicIcon name="FaCheck" className="h-4 w-4 text-white" />
                                                    <span>¡Mensaje Enviado con Éxito!</span>
                                                </>
                                            ) : (
                                                <span>Enviar mensaje</span>
                                            )}
                                        </button>
                                    </form>
                            </motion.div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 3. SECCIÓN INFERIOR: MAPA ABAJO DE TODOS ("el mapa abajo de todos") */}
            {googleMapEmbedUrl && (
                <section className="relative w-full bg-gray-50 border-t border-gray-200/80 py-12 sm:py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-8 text-center max-w-2xl mx-auto">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#075E54] border border-emerald-200/80 mb-2">
                                <DynamicIcon name="FaLocationDot" className="h-3.5 w-3.5 text-[var(--color-primario)]" />
                                Ubicación
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                                Encuéntranos en el mapa
                            </h2>
                            {direccion && (
                                <p className="text-sm text-gray-600 font-medium mt-1">
                                    {direccion}
                                </p>
                            )}
                        </div>

                        <div className="h-[400px] sm:h-[480px] w-full overflow-hidden rounded-3xl shadow-xl border border-gray-200 relative bg-gray-200">
                            <iframe
                                src={googleMapEmbedUrl}
                                title={`Mapa de ${titulo}`}
                                className="h-full w-full border-0"
                                loading="lazy"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}