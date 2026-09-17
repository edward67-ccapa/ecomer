import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DynamicIcon from '@/components/DynamicIcon';

export default function ContactoSection({ seccionData }) {
    if (!seccionData) return null;

    // Extract content array or direct valor
    const rawValor = seccionData?.valor || seccionData?.contenido?.find((c) => c.label?.toLowerCase() === 'contacto')?.valor;
    const data = Array.isArray(rawValor) ? rawValor[0] : (rawValor || {});

    const titulo = data?.Titulo || data?.titulo || 'Estacion Bayobar';
    const descripcion = data?.Descripcion || data?.descripcion || 'Ponte en contacto con nosotros. Envíanos tu mensaje o consulta y te responderemos a la brevedad.';
    const mapaDireccion = data?.Mapa || data?.mapa || 'Av. Fernando Wiesse, San Juan de Lurigancho 15438';
    const redes = Array.isArray(data?.Redes) ? data.Redes : (Array.isArray(data?.redes) ? data.redes : []);

    // Form state
    const [nombre, setNombre] = useState('');
    const [contactoInfo, setContactoInfo] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [enviado, setEnviado] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setEnviado(true);

        // Reset form after 4 seconds
        setTimeout(() => {
            setEnviado(false);
            setNombre('');
            setContactoInfo('');
            setMensaje('');
        }, 4000);
    };

    // Build map iframe embed URL based on address
    const googleMapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapaDireccion)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

    // Helper to format social network links
    const getSocialHref = (item) => {
        const text = item.Texto || item.texto || '';
        const icon = item.Icono || item.icono || '';

        if (text.startsWith('http://') || text.startsWith('https://')) return text;
        if (text.includes('.com') || text.includes('.pe')) return `https://${text}`;

        if (icon === 'FaWhatsapp' || icon === 'FaPhone') {
            const cleanDigits = text.replace(/\D/g, '');
            return `https://wa.me/${cleanDigits}`;
        }
        return `https://${text}`;
    };

    return (
        <section id="contacto" className="scroll-mt-10 relative bg-gray-50 py-12 md:py-20 overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Main Card Container replacing purple block with Map in top/left area */}
                <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl border border-gray-200/80">
                    <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">

                        {/* LEFT COLUMN: Map Background + Info Overlay */}
                        <div className="relative lg:col-span-6 min-h-[380px] lg:min-h-[580px] flex flex-col justify-between overflow-hidden bg-black">
                            {/* Google Map Embedded Iframe (replaces purple background) */}
                            <iframe
                                src={googleMapEmbedUrl}
                                title={`Mapa de ${titulo}`}
                                className="absolute inset-0 h-full w-full border-0 filter opacity-80 contrast-125 transition-opacity duration-500 hover:opacity-100"
                                loading="lazy"
                                allowFullScreen
                            />

                            {/* Dark Gradient Overlay for optimal legibility */}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/40" />

                            {/* Top Text Content Overlay */}
                            <div className="relative z-10 p-6 sm:p-8 md:p-10">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/20 mb-3">
                                        <span className="h-2 w-2 rounded-full bg-[var(--color-primario)] animate-pulse" />
                                        Contáctanos
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-3 drop-shadow-md">
                                        {titulo}
                                    </h2>
                                    {descripcion && (
                                        <p className="text-sm sm:text-base text-gray-200 font-medium leading-relaxed max-w-lg drop-shadow">
                                            {descripcion}
                                        </p>
                                    )}
                                </motion.div>
                            </div>

                            {/* Bottom Info Overlay: Address & Social Redes */}
                            <div className="relative z-10 p-6 sm:p-8 md:p-10 space-y-4">
                                {/* Dirección con Icono de Mapa */}
                                {mapaDireccion && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: 0.2 }}
                                        className="flex items-start gap-3.5 rounded-2xl bg-white/10 p-4 border border-white/15 backdrop-blur-md text-white"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primario)] text-white shadow-md">
                                            <DynamicIcon name="FaLocationDot" className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-300">
                                                Dirección / Ubicación
                                            </span>
                                            <span className="block text-sm font-extrabold text-white leading-snug">
                                                {mapaDireccion}
                                            </span>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Lista de Redes Sociales / Contacto */}
                                {redes.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: 0.3 }}
                                        className="flex flex-wrap items-center gap-3 pt-1"
                                    >
                                        {redes.map((item, idx) => {
                                            const iconName = item.Icono || item.icono || 'FaLink';
                                            const textVal = item.Texto || item.texto || '';
                                            const href = getSocialHref(item);

                                            return (
                                                <a
                                                    key={idx}
                                                    href={href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-3.5 py-2 text-xs font-bold text-white border border-white/20 backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-gray-900 hover:scale-105 shadow-md"
                                                >
                                                    <DynamicIcon name={iconName} className="h-4 w-4 text-[var(--color-primario)] group-hover:text-gray-900" />
                                                    <span>{textVal}</span>
                                                </a>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Contact Form Card */}
                        <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="max-w-lg mx-auto w-full"
                            >
                                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">
                                    Envíanos un mensaje
                                </h3>
                                <p className="text-sm text-gray-500 font-medium mb-8">
                                    Déjanos tus datos y nos pondremos en contacto contigo lo antes posible.
                                </p>

                                {enviado ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="rounded-2xl bg-emerald-50 p-6 text-center border border-emerald-200"
                                    >
                                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
                                            <DynamicIcon name="FaCheck" className="h-6 w-6" />
                                        </div>
                                        <h4 className="text-lg font-bold text-emerald-900 mb-1">¡Mensaje Enviado!</h4>
                                        <p className="text-xs font-medium text-emerald-700">
                                            Gracias por escribirnos. Nos comunicaremos contigo muy pronto.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Nombre */}
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                                Nombre completo
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={nombre}
                                                onChange={(e) => setNombre(e.target.value)}
                                                placeholder="Ej: Juan Pérez"
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[var(--color-primario)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primario)]/20"
                                            />
                                        </div>

                                        {/* Email / Teléfono */}
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                                Correo o Teléfono
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={contactoInfo}
                                                onChange={(e) => setContactoInfo(e.target.value)}
                                                placeholder="Ej: juan@gmail.com o 912345678"
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[var(--color-primario)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primario)]/20"
                                            />
                                        </div>

                                        {/* Mensaje */}
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                                Mensaje
                                            </label>
                                            <textarea
                                                required
                                                rows={4}
                                                value={mensaje}
                                                onChange={(e) => setMensaje(e.target.value)}
                                                placeholder="Escribe tu consulta o pedido aquí..."
                                                className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[var(--color-primario)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primario)]/20 resize-none"
                                            />
                                        </div>

                                        {/* Botón Enviar */}
                                        <button
                                            type="submit"
                                            className="w-full rounded-xl py-4 px-6 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer mt-2"
                                            style={{ backgroundColor: 'var(--color-primario)' }}
                                        >
                                            <span>Enviar Mensaje</span>
                                            <DynamicIcon name="FaPaperPlane" className="h-4 w-4" />
                                        </button>
                                    </form>
                                )}
                            </motion.div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
