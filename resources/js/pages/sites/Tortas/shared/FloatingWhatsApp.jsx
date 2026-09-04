import React, { useEffect, useState } from 'react';
import DynamicIcon from '@/components/DynamicIcon';

export default function FloatingWhatsApp({ site, dominio, siteSlug, seccionesData }) {
    const [isOpen, setIsOpen] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [whatsappUrl, setWhatsappUrl] = useState('https://wa.me/');

    useEffect(() => {
        const updateUrlFromData = (nav, contactos) => {
            const accionesNav = nav?.contenido?.find((c) => c.label === 'accion_nav')?.valor || [];
            const waNav = accionesNav.find((a) => a.icon?.toLowerCase() === 'fawhatsapp');
            const itemContacto = contactos?.contenido?.find(
                (c) => c.label?.toLowerCase() === 'whatsap' || c.label?.toLowerCase() === 'whatsapp'
            );
            const rawVal = waNav?.texto || itemContacto?.enlace || (Array.isArray(itemContacto?.valor) ? itemContacto.valor[0]?.texto : null);

            if (rawVal) {
                if (rawVal.startsWith('http')) {
                    setWhatsappUrl(rawVal);
                } else {
                    const cleanNum = rawVal.replace(/\D/g, '');
                    if (cleanNum) {
                        setWhatsappUrl(`https://wa.me/${cleanNum.length === 9 ? '51' + cleanNum : cleanNum}`);
                    }
                }
            }
        };

        const initialNav = seccionesData?.nav || seccionesData?.['nav'] || null;
        const initialContacto = seccionesData?.contacto || seccionesData?.['contacto'] || null;
        if (initialNav || initialContacto) {
            updateUrlFromData(initialNav, initialContacto);
        }
    }, [seccionesData]);

    const handleEnviar = (e) => {
        e.preventDefault();
        const textoEnvio = mensaje.trim() || 'Hola';

        let baseUrl = whatsappUrl || 'https://wa.me/';
        if (!baseUrl.includes('wa.me') && !baseUrl.includes('whatsapp.com')) {
            baseUrl = 'https://wa.me/';
        }

        const separator = baseUrl.includes('?') ? '&' : '?';
        const finalUrl = `${baseUrl}${separator}text=${encodeURIComponent(textoEnvio)}`;

        window.open(finalUrl, '_blank', 'noopener,noreferrer');
        setIsOpen(false);
        setMensaje('');
    };

    return (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
            {/* CHAT BOX SIMULADO CON TAILWIND */}
            {isOpen && (
                <div className="mb-3 w-[calc(100vw-2rem)] max-w-[340px] overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-200 transition-all duration-300">
                    {/* Header del Chat */}
                    <div className="bg-[#075E54] p-3.5 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                {site?.imagen ? (
                                    <img
                                        src={site.imagen}
                                        alt={site?.nombre || 'WhatsApp'}
                                        className="h-10 w-10 rounded-full object-cover border-2 border-white/20"
                                    />
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white font-bold text-sm">
                                        <DynamicIcon name="FaStore" className="h-5 w-5" />
                                    </div>
                                )}
                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#075E54]"></span>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm leading-tight text-white">{site?.nombre || 'Atención al Cliente'}</h4>
                                <p className="text-[11px] text-emerald-100">En línea</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="rounded-full p-1 hover:bg-white/10 transition text-white/80 hover:text-white cursor-pointer"
                            title="Cerrar chat"
                        >
                            <DynamicIcon name="FaXmark" className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Cuerpo del Chat / Mensaje de Bienvenida */}
                    <div className="p-4 bg-[#efeae2] min-h-[140px] max-h-[220px] overflow-y-auto space-y-3">
                        <div className="max-w-[85%] rounded-lg bg-white p-3 shadow-xs text-xs text-gray-800 rounded-tl-none relative">
                            <p className="font-semibold text-[11px] text-[#075E54] mb-1">{site?.nombre || 'Soporte'}</p>
                            <p className="leading-relaxed">¡Hola! 👋 ¿En qué podemos ayudarte hoy? Escríbenos tu consulta aquí abajo.</p>
                            <span className="block text-[9px] text-gray-400 text-right mt-1">Ahora</span>
                        </div>
                    </div>

                    {/* Formulario / Campo de Texto */}
                    <form onSubmit={handleEnviar} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                        <input
                            type="text"
                            value={mensaje}
                            onChange={(e) => setMensaje(e.target.value)}
                            placeholder="Escribe tu mensaje..."
                            className="flex-1 rounded-full bg-gray-100 px-4 py-2.5 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-[#128C7E]/40 transition placeholder-gray-400"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#128C7E] text-white shadow-md hover:bg-[#075E54] transition cursor-pointer shrink-0"
                            title="Enviar a WhatsApp"
                        >
                            <DynamicIcon name="FaChevronRight" className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            )}

            {/* BOTÓN FLOTANTE TRIGGER */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center rounded-full bg-[#25D366] p-3.5 text-white shadow-xl transition-all duration-300 hover:bg-[#20ba5a] hover:scale-105 hover:shadow-2xl cursor-pointer"
                title={isOpen ? "Cerrar chat" : "Abrir chat de WhatsApp"}
                aria-label="Chat de WhatsApp"
            >
                <div className="relative flex items-center justify-center">
                    {isOpen ? (
                        <DynamicIcon name="FaXmark" className="h-7 w-7 text-white" />
                    ) : (
                        <>
                            <DynamicIcon name="FaWhatsapp" className="h-7 w-7 text-white" />
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                            </span>
                        </>
                    )}
                </div>
            </button>
        </div>
    );
}
