import React, { useState, useEffect } from 'react';
import DynamicIcon from '@/components/DynamicIcon';

export default function ContactoSection({ seccionData, site, estilos }) {
    const contenido = seccionData?.contenido || [];

    // Helper para buscar items por label (insensible a mayúsculas)
    const findItem = (label) => {
        return contenido.find(
            (item) => (item.label || '').toLowerCase() === label.toLowerCase()
        );
    };

    const tituloItem = findItem('titulo');
    const descripcionItem = findItem('descripcion');
    const whatsapItem = findItem('whatsap') || findItem('whatsapp');
    const direccionItem = findItem('direccion');
    const imagenItem = findItem('imagen');

    const titulo = tituloItem ? tituloItem.valor : '¿Tienes una idea en mente?';
    const descripcion = descripcionItem
        ? descripcionItem.valor
        : 'Cuéntanos y haremos realidad la torta de tus sueños';
    const imagenUrl = imagenItem ? imagenItem.valor : null;

    // Redes Sociales y WhatsApp desde General (estilos.redes_sociales)
    const redesConfig = estilos?.redes_sociales || site?.estilos?.redes_sociales || {};
    const globalActions = Array.isArray(estilos?.acciones_nav)
        ? estilos.acciones_nav
        : (Array.isArray(site?.estilos?.acciones_nav) ? site.estilos.acciones_nav : []);

    const waAction = globalActions.find((a) => (a.icono || a.icon || '').toLowerCase().includes('whatsapp'));
    const whatsapVal = Array.isArray(whatsapItem?.valor) ? whatsapItem.valor[0] : null;

    const rawWa = redesConfig.whatsapp || waAction?.texto || whatsapVal?.texto || whatsapItem?.enlace || '';
    const cleanDigits = String(rawWa).replace(/\D/g, '');
    const waNum = cleanDigits ? (cleanDigits.length === 9 ? '51' + cleanDigits : cleanDigits) : null;

    // Dirección desde General (estilos.direccion)
    const direccionVal = Array.isArray(direccionItem?.valor) ? direccionItem.valor[0] : null;
    const direccionTexto = estilos?.direccion
        || site?.estilos?.direccion
        || direccionVal?.texto
        || null;
    const direccionIcono = 'FaLocationDot';
    const direccionEnlace = estilos?.mapa_url
        || site?.estilos?.mapa_url
        || direccionItem?.enlace
        || (direccionTexto ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccionTexto)}` : null);

    // Redes Sociales oficiales
    const formatSocialUrl = (val, prefix = '') => {
        if (!val) return null;
        const str = String(val).trim();
        if (!str) return null;
        if (str.startsWith('http://') || str.startsWith('https://')) return str;
        if (str.startsWith('@')) return `${prefix}${str.slice(1)}`;
        return `${prefix}${str}`;
    };

    const redesSociales = [];
    if (redesConfig.facebook) redesSociales.push({ nombre: 'Facebook', icono: 'FaFacebook', url: formatSocialUrl(redesConfig.facebook, 'https://facebook.com/') });
    if (redesConfig.instagram) redesSociales.push({ nombre: 'Instagram', icono: 'FaInstagram', url: formatSocialUrl(redesConfig.instagram, 'https://instagram.com/') });
    if (redesConfig.tiktok) redesSociales.push({ nombre: 'TikTok', icono: 'FaTiktok', url: formatSocialUrl(redesConfig.tiktok, 'https://tiktok.com/@') });
    if (redesConfig.youtube) redesSociales.push({ nombre: 'YouTube', icono: 'FaYoutube', url: formatSocialUrl(redesConfig.youtube, 'https://youtube.com/@') });
    if (redesConfig.twitter) redesSociales.push({ nombre: 'X (Twitter)', icono: 'FaXTwitter', url: formatSocialUrl(redesConfig.twitter, 'https://x.com/') });

    // Estado del formulario
    const [nombre, setNombre] = useState('');
    const [numero, setNumero] = useState('');
    const [fecha, setFecha] = useState('');
    const [idea, setIdea] = useState('');

    const renderIcon = (name, className = 'w-6 h-6') => {
        if (!name) return null;
        return <DynamicIcon name={name} className={className} />;
    };

    const handleEnviarWhatsApp = (e) => {
        e.preventDefault();

        let mensaje = `¡Hola! Me comunico desde la web.\n\n`;
        if (nombre) mensaje += `👤 *Nombre:* ${nombre}\n`;
        if (numero) mensaje += `📱 *Teléfono / WhatsApp:* ${numero}\n`;
        if (fecha) mensaje += `📅 *Fecha del evento:* ${fecha}\n`;
        if (idea) mensaje += `💬 *Idea / Detalles:* ${idea}\n`;

        const finalUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(mensaje)}`;
        window.open(finalUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <section id="contacto" className="scroll-mt-10 py-16 sm:py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

                    {/* COLUMNA 1: TÍTULO, DESCRIPCIÓN Y DATOS DE CONTACTO */}
                    <div className="space-y-6">
                        {titulo && (
                            <h2
                                className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 leading-tight"
                                style={{ fontFamily: 'var(--tipografia-titulos)' }}
                            >
                                {titulo}
                            </h2>
                        )}

                        {descripcion && (
                            <p
                                className="text-base text-gray-600 mb-4 leading-relaxed"
                                style={{ fontFamily: 'var(--tipografia-texto)' }}
                            >
                                {descripcion}
                            </p>
                        )}

                        {/* Botones / Tarjetas Informativas */}
                        <div className="pt-4 space-y-4">

                            {/* Tarjeta Dirección */}
                            {direccionTexto && (
                                <a
                                    href={direccionEnlace}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-4 bg-white border border-rose-100 shadow-sm hover:shadow-md transition-all duration-200 group"
                                    style={{
                                        borderRadius: 'var(--radio-bordes)',
                                        fontFamily: 'var(--tipografia-texto)',
                                    }}
                                >
                                    <div
                                        className="w-12 h-12 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
                                        style={{
                                            backgroundColor: 'var(--color-primario)',
                                            borderRadius: 'var(--radio-bordes)',
                                        }}
                                    >
                                        {renderIcon(direccionIcono, 'w-6 h-6 text-white')}
                                    </div>
                                    <div className="overflow-hidden">
                                        <span className="block text-xs font-bold uppercase tracking-wider text-rose-600">Dirección</span>
                                        <span className="block text-sm font-semibold text-gray-800 line-clamp-2">{direccionTexto}</span>
                                    </div>
                                </a>
                            )}

                            {/* Tarjeta WhatsApp */}
                            {waNum && (
                                <a
                                    href={`https://wa.me/${waNum}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-4 bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-200 group"
                                    style={{
                                        borderRadius: 'var(--radio-bordes)',
                                        fontFamily: 'var(--tipografia-texto)',
                                    }}
                                >
                                    <div
                                        className="w-12 h-12 text-white flex items-center justify-center shrink-0 bg-emerald-500 group-hover:scale-105 transition-transform"
                                        style={{
                                            borderRadius: 'var(--radio-bordes)',
                                        }}
                                    >
                                        {renderIcon('FaWhatsapp', 'w-6 h-6 text-white')}
                                    </div>
                                    <div className="overflow-hidden">
                                        <span className="block text-xs font-bold uppercase tracking-wider text-emerald-600">WhatsApp Oficial</span>
                                        <span className="block text-sm font-semibold text-gray-800 line-clamp-1">+{waNum}</span>
                                    </div>
                                </a>
                            )}

                            {/* Botones de Redes Sociales Oficiales */}
                            {redesSociales.length > 0 && (
                                <div className="pt-2">
                                    <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                                        Síguenos en Redes
                                    </span>
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        {redesSociales.map((red, idx) => (
                                            <a
                                                key={idx}
                                                href={red.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title={red.nombre}
                                                className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 hover:bg-[var(--color-primario)] hover:text-white transition-all flex items-center justify-center shadow-xs"
                                            >
                                                {renderIcon(red.icono, 'w-4 h-4')}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COLUMNA 2: FORMULARIO ESCRÍBENOS */}
                    <div
                        className="relative"
                        style={{
                            borderRadius: 'var(--radio-bordes)',
                            fontFamily: 'var(--tipografia-texto)',
                        }}
                    >
                        <h3
                            className="text-2xl font-bold mb-6 text-start"
                            style={{ fontFamily: 'var(--tipografia-titulos)', color: 'var(--color-primario)' }}
                        >
                            Escríbenos
                        </h3>

                        <form onSubmit={handleEnviarWhatsApp} className="space-y-4">
                            {/* Nombre completo */}
                            <div>
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder="Nombre completo"
                                    required
                                    className="w-full px-4 py-3.5 border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none text-sm text-gray-800 placeholder-gray-400 transition"
                                    style={{
                                        borderRadius: 'var(--radio-bordes)',
                                        fontFamily: 'var(--tipografia-texto)',
                                    }}
                                />
                            </div>

                            {/* Número */}
                            <div>
                                <input
                                    type="tel"
                                    value={numero}
                                    onChange={(e) => setNumero(e.target.value)}
                                    placeholder="Número de teléfono / WhatsApp"
                                    required
                                    className="w-full px-4 py-3.5 border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none text-sm text-gray-800 placeholder-gray-400 transition"
                                    style={{
                                        borderRadius: 'var(--radio-bordes)',
                                        fontFamily: 'var(--tipografia-texto)',
                                    }}
                                />
                            </div>

                            {/* Fecha */}
                            <div>
                                <input
                                    type="date"
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                    placeholder="Fecha del evento"
                                    className="w-full px-4 py-3.5 border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none text-sm text-gray-800 placeholder-gray-400 transition"
                                    style={{
                                        borderRadius: 'var(--radio-bordes)',
                                        fontFamily: 'var(--tipografia-texto)',
                                    }}
                                />
                            </div>

                            {/* Textarea cuéntanos tu idea */}
                            <div>
                                <textarea
                                    rows={4}
                                    value={idea}
                                    onChange={(e) => setIdea(e.target.value)}
                                    placeholder="Cuéntanos tu idea..."
                                    required
                                    className="w-full px-4 py-3.5 border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none text-sm text-gray-800 placeholder-gray-400 transition resize-none"
                                    style={{
                                        borderRadius: 'var(--radio-bordes)',
                                        fontFamily: 'var(--tipografia-texto)',
                                    }}
                                />
                            </div>

                            {/* Botón Enviar mensaje */}
                            <button
                                type="submit"
                                className="w-full py-4 px-6 text-white font-bold text-sm shadow-md hover:shadow-lg transition duration-200 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                                style={{
                                    backgroundColor: 'var(--color-primario)',
                                    borderRadius: 'var(--radio-bordes)',
                                    fontFamily: 'var(--tipografia-texto)',
                                }}
                            >
                                <span>Enviar mensaje</span>
                                {renderIcon('FaWhatsapp', 'w-5 h-5 text-white')}
                            </button>
                        </form>
                    </div>

                    {/* COLUMNA 3: IMAGEN DE CONTACTO */}
                    <div className="hidden lg:block absolute right-0 top-0 w-1/3 h-full overflow-hidden pointer-events-none">
                        {imagenUrl ? (
                            <div
                                className="w-full h-full"
                                style={{ borderRadius: 'var(--radio-bordes)' }}
                            >
                                <img
                                    src={"https://imgs.search.brave.com/FKzq6vg-FEFi22csfvGovU_wfEIrDbY6bAahcYO-BnA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTE3/ODUxNTI1L2VzL2Zv/dG8vd2VkZGluZy1j/YWtlLWFuZC1ib2tl/aC5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9akVvdVdrcDNF/U2Z2c1FXeGV1MUts/RXNXcktTMVUzTXBL/UmtaODFNTl9aND0"}
                                    alt={titulo || 'Contacto'}
                                    width={600}
                                    height={600}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0" />
                            </div>
                        ) : (
                            <div
                                className="w-full h-full bg-rose-100/50 border border-dashed border-rose-300 flex items-center justify-center text-rose-400 text-sm"
                                style={{ borderRadius: 'var(--radio-bordes)' }}
                            >
                                Imagen no disponible
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}
