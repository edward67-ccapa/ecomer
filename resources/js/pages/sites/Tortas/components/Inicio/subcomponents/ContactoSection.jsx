import React, { useState, useEffect } from 'react';
import DynamicIcon from '@/components/DynamicIcon';

export default function ContactoSection({ seccionData }) {
    if (!seccionData || !seccionData.contenido) {
        return null;
    }

    const contenido = seccionData.contenido || [];

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

    // Extraer datos de WhatsApp
    const whatsapVal = Array.isArray(whatsapItem?.valor) ? whatsapItem.valor[0] : null;
    const whatsapTexto = whatsapVal?.texto || 'Pedir por WhatsApp';
    const whatsapIcono = whatsapVal?.Icono || 'FaWhatsapp';
    const whatsapEnlace = whatsapItem?.enlace || 'https://wa.me/';

    useEffect(() => {
        console.log('Enviando a número:', whatsapEnlace || 'https://wa.me/');
    }, [whatsapEnlace]);

    // Extraer datos de Dirección
    const direccionVal = Array.isArray(direccionItem?.valor) ? direccionItem.valor[0] : null;
    const direccionTexto = direccionVal?.texto || 'Av. Gran Chimú N°680, San Juan de Lurigancho 15401';
    const direccionIcono = direccionVal?.Icono || 'FaLocationDot';
    const direccionEnlace = direccionItem?.enlace || 'https://maps.google.com';

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

        let mensaje = `¡Hola!\n`;
        if (nombre) mensaje += `*Nombre:* ${nombre}\n`;
        if (numero) mensaje += `*Teléfono / WhatsApp:* ${numero}\n`;
        if (fecha) mensaje += `*Fecha del evento:* ${fecha}\n`;
        if (idea) mensaje += `*Idea / Detalles:* ${idea}\n`;

        let urlBase = whatsapEnlace || 'https://wa.me/';
        if (!urlBase.includes('wa.me') && !urlBase.includes('whatsapp.com')) {
            urlBase = 'https://wa.me/';
        }

        const separator = urlBase.includes('?') ? '&' : '?';
        const finalUrl = `${urlBase}${separator}text=${encodeURIComponent(mensaje)}`;

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
                                    href={direccionEnlace ? (direccionEnlace.startsWith('http') ? direccionEnlace : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccionTexto)}`) : '#'}
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
                    <div className="flex items-center justify-center">
                        {imagenUrl ? (
                            <div
                                className="relative w-full max-w-md h-80 sm:h-96 group"
                                style={{ borderRadius: 'var(--radio-bordes)' }}
                            >
                                <img
                                    src={imagenUrl}
                                    alt={titulo || 'Contacto'}
                                    width={400}
                                    height={384}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0" />
                            </div>
                        ) : (
                            <div
                                className="w-full max-w-md h-80 bg-rose-100/50 border border-dashed border-rose-300 flex items-center justify-center text-rose-400 text-sm"
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
