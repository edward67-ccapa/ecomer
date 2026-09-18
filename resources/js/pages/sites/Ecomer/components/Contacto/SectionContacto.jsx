import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DynamicIcon from '@/components/DynamicIcon';
import { useContactoData } from './hooks/useContactoData';

export default function SectionContacto({ seccion, seccionesData }) {
    const { contacto } = useContactoData(seccion, seccionesData);

    // Extract raw data from CMS structure
    const rawValor = contacto?.valor || contacto?.contenido?.find((c) => (c.label || '').toLowerCase() === 'contacto')?.valor;
    const data = Array.isArray(rawValor) ? rawValor[0] : (rawValor || {});

    const titulo = data?.Titulo || data?.titulo;
    const descripcion = data?.Descripcion || data?.descripcion || 'Ponte en contacto con nosotros. Envíanos tu mensaje o consulta y te responderemos a la brevedad.';
    const mapaDireccion = data?.Mapa || data?.mapa;
    const redes = Array.isArray(data?.Redes) ? data.Redes : (Array.isArray(data?.redes) ? data.redes : []);

    // Extract nav actions (accionesNav from nav)
    const activeNav =
        seccionesData?.nav ||
        seccionesData?.NAV ||
        seccionesData?.['nav'] ||
        Object.values(seccionesData || {}).find((s) => s?.slug?.toLowerCase() === 'nav');

    const getNavContent = (labelName) => {
        return activeNav?.contenido?.find(
            (c) => c.label?.toLowerCase() === labelName.toLowerCase()
        )?.valor;
    };

    const accionesNav = getNavContent('accion') || getNavContent('acciones') || getNavContent('accion_nav') || [];

    // Form state
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [enviado, setEnviado] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setEnviado(true);

        setTimeout(() => {
            setEnviado(false);
            setNombre('');
            setCorreo('');
            setTelefono('');
            setMensaje('');
        }, 4000);
    };

    // Build map iframe embed URL based on address
    const googleMapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapaDireccion)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

    // Helper to get network icons & urls
    const getSocialIconAndUrl = (item) => {
        const iconName = item.Icono || item.icono || 'FaShareNodes';
        const textVal = item.Texto || item.texto || '';

        let href = textVal;
        if (href.startsWith('http://') || href.startsWith('https://')) {
            // direct link
        } else if (href.includes('.com') || href.includes('.pe')) {
            href = `https://${href}`;
        } else if (iconName === 'FaWhatsapp' || iconName === 'FaPhone') {
            const cleanDigits = href.replace(/\D/g, '');
            href = `https://wa.me/${cleanDigits}`;
        } else {
            href = `https://${href}`;
        }

        return { iconName, textVal, href };
    };

    // Extract phone/whatsapp and email from redes list if available
    const phoneRed = redes.find((r) => (r.Icono || r.icono) === 'FaWhatsapp' || (r.Icono || r.icono) === 'FaPhone');
    const phoneText = phoneRed ? (phoneRed.Texto || phoneRed.texto) : null;

    return (
        <main className="flex-1 bg-white">
            {/* 1. SECCIÓN SUPERIOR: EL MAPA EN EL FONDO ("Arriba el mapa") */}
            <section className="relative h-[460px] sm:h-[500px] lg:h-[560px] w-full overflow-hidden bg-black pt-32 sm:pt-36">
                {/* Google Map Embedded Iframe background */}
                <iframe
                    src={googleMapEmbedUrl}
                    title={`Mapa de ${titulo}`}
                    className="absolute inset-0 h-full w-full border-0 filter opacity-80 contrast-125 transition-opacity duration-500 hover:opacity-95"
                    loading="lazy"
                    allowFullScreen
                />

                {/* Dark Gradient Overlay for optimal legibility */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/35" />

                {/* Top-Left Header Content Overlaid on Map */}
                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
                    <div className="max-w-xl text-white">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/20 mb-3">
                                <span className="h-2 w-2 rounded-full bg-[var(--color-primario)] animate-pulse" />
                                Ubicación & Contacto
                            </span>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-md mb-3">
                                {titulo}
                            </h1>
                            {descripcion && (
                                <p className="text-sm sm:text-base text-gray-200 font-medium leading-relaxed max-w-lg drop-shadow">
                                    {descripcion}
                                </p>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. SECCIÓN INFERIOR CON EL FORMULARIO FLOTANTE Y REDES LADO A LADO */}
            <section className="relative z-20 bg-white pb-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                        {/* COLUMNA IZQUIERDA (Debajo del mapa, al lado del formulario): DIRECCIÓN Y REDES SOCIALES */}
                        <div className="lg:col-span-6 pt-8 sm:pt-12 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="space-y-6"
                            >
                                {/* Dynamic Contact Actions from Nav (accionesNav) */}
                                {Array.isArray(accionesNav) && accionesNav.length > 0 ? (
                                    accionesNav.map((item, idx) => {
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

                                        const isEmail = textLower.includes('@') || iconLower.includes('envelope');
                                        const isPhone = iconLower.includes('whatsapp') || iconLower.includes('phone');
                                        const isLink = textVal.includes('.com') || textVal.includes('.pe') || textVal.startsWith('http');
                                        const cleanDigits = textVal.replace(/\D/g, '');

                                        let href = null;
                                        if (isEmail) {
                                            href = `mailto:${textVal}`;
                                        } else if (isPhone) {
                                            href = iconLower.includes('whatsapp')
                                                ? `https://wa.me/${cleanDigits.length === 9 ? '51' + cleanDigits : cleanDigits}`
                                                : `tel:${cleanDigits}`;
                                        } else if (isLink) {
                                            href = textVal.startsWith('http') ? textVal : `https://${textVal}`;
                                        }

                                        return (
                                            <div key={idx} className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-gray-800 shadow-xs border border-gray-200/60">
                                                    <DynamicIcon name={iconName} className="h-5 w-5 text-gray-700" />
                                                </div>
                                                <div>
                                                    <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">{label}</span>
                                                    {href ? (
                                                        <a
                                                            href={href}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="block text-base font-bold text-gray-900 hover:text-[var(--color-primario)] transition-colors"
                                                        >
                                                            {textVal}
                                                        </a>
                                                    ) : (
                                                        <span className="block text-base font-bold text-gray-900">{textVal}</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <>
                                        {phoneText && (
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-gray-800 shadow-xs border border-gray-200/60">
                                                    <DynamicIcon name="FaPhone" className="h-5 w-5 text-gray-700" />
                                                </div>
                                                <div>
                                                    <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">Teléfono / WhatsApp</span>
                                                    <span className="block text-base font-bold text-gray-900">{phoneText}</span>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Dirección del Mapa */}
                                {mapaDireccion && (
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-gray-800 shadow-xs border border-gray-200/60 mt-0.5">
                                            <DynamicIcon name="FaLocationDot" className="h-5 w-5 text-gray-700" />
                                        </div>
                                        <div>
                                            <span className="block text-xs font-bold uppercase tracking-wider text-gray-400">Dirección</span>
                                            <span className="block text-base font-bold text-gray-900 max-w-md">{mapaDireccion}</span>
                                        </div>
                                    </div>
                                )}

                                {/* REDES SOCIALES A SU LADO (Fila de íconos en colores destacados) */}
                                {redes.length > 0 && (
                                    <div className="pt-4 border-t border-gray-100">
                                        <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                                            Síguenos en nuestras redes
                                        </span>
                                        <div className="flex flex-wrap items-center gap-3">
                                            {redes.map((item, idx) => {
                                                const { iconName, textVal, href } = getSocialIconAndUrl(item);

                                                return (
                                                    <a
                                                        key={idx}
                                                        href={href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title={textVal}
                                                        className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-700 shadow-sm border border-gray-200/80 transition-all duration-300 hover:bg-[var(--color-primario)] hover:text-white hover:border-transparent hover:scale-110"
                                                    >
                                                        <DynamicIcon name={iconName} className="h-5 w-5" />
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* COLUMNA DERECHA (Flotante encima del mapa y del fondo blanco): FORMULARIO "Send Us Message" */}
                        <div className="lg:col-span-6">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.1 }}
                                className="relative lg:-mt-48 z-30 rounded-[2rem] bg-white p-8 sm:p-10 shadow-2xl border border-gray-100"
                            >
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-6">
                                    Send Us Message
                                </h2>

                                {enviado ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="rounded-2xl bg-emerald-50 p-6 text-center border border-emerald-200"
                                    >
                                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
                                            <DynamicIcon name="FaCheck" className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-emerald-900 mb-1">¡Mensaje enviado con éxito!</h3>
                                        <p className="text-xs font-medium text-emerald-700">
                                            Gracias por comunicarte. Nos pondremos en contacto contigo lo antes posible.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Name */}
                                        <div>
                                            <input
                                                type="text"
                                                required
                                                value={nombre}
                                                onChange={(e) => setNombre(e.target.value)}
                                                placeholder="Name"
                                                className="w-full rounded-2xl border border-gray-200/80 bg-gray-50/50 px-5 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[var(--color-primario)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primario)]/20"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <input
                                                type="email"
                                                required
                                                value={correo}
                                                onChange={(e) => setCorreo(e.target.value)}
                                                placeholder="Email"
                                                className="w-full rounded-2xl border border-gray-200/80 bg-gray-50/50 px-5 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[var(--color-primario)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primario)]/20"
                                            />
                                        </div>

                                        {/* Phone / Text */}
                                        <div>
                                            <input
                                                type="tel"
                                                value={telefono}
                                                onChange={(e) => setTelefono(e.target.value)}
                                                placeholder="Phone"
                                                className="w-full rounded-2xl border border-gray-200/80 bg-gray-50/50 px-5 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[var(--color-primario)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primario)]/20"
                                            />
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <textarea
                                                required
                                                rows={4}
                                                value={mensaje}
                                                onChange={(e) => setMensaje(e.target.value)}
                                                placeholder="Message"
                                                className="w-full rounded-2xl border border-gray-200/80 bg-gray-50/50 px-5 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[var(--color-primario)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primario)]/20 resize-none"
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            className="w-full rounded-2xl py-4 px-6 text-sm font-bold text-white shadow-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] hover:brightness-110 cursor-pointer mt-2"
                                            style={{ backgroundColor: 'var(--color-primario)' }}
                                        >
                                            Submit
                                        </button>
                                    </form>
                                )}
                            </motion.div>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}
