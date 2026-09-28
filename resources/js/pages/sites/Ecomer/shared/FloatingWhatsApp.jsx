import React, { useState, useMemo } from 'react';
import DynamicIcon from '@/components/DynamicIcon';

// Helper para parsear líneas de contacto con nombre y número (ej. "edward 916628409")
export function parseWaContactLine(line, defaultItemLabel = 'WhatsApp', lIdx = 0, totalLines = 1) {
    const rawLine = String(line || '').trim();
    if (!rawLine) return null;

    let url = '';
    let cleanNum = '';
    let displayNum = '';
    let extractedName = '';

    const urlMatch = rawLine.match(/(https?:\/\/[^\s]+)/i);
    if (urlMatch) {
        url = urlMatch[0];
        const numFromUrl = url.replace(/\D/g, '');
        cleanNum = numFromUrl ? (numFromUrl.length === 9 ? '51' + numFromUrl : numFromUrl) : '';
        displayNum = numFromUrl ? (numFromUrl.length === 9 ? '+51 ' + numFromUrl : numFromUrl) : url;

        const textWithoutUrl = rawLine.replace(urlMatch[0], '');
        extractedName = textWithoutUrl.replace(/^[\s:\-,\(\)]+|[\s:\-,\(\)]+$/g, '').trim();
    } else {
        const phoneMatch = rawLine.match(/(?:\+?\d[\d\s\-\(\)]{6,}\d|\d{7,})/);
        if (phoneMatch) {
            displayNum = phoneMatch[0].trim();
            const digitsOnly = displayNum.replace(/\D/g, '');
            cleanNum = digitsOnly ? (digitsOnly.length === 9 ? '51' + digitsOnly : digitsOnly) : '';
            url = cleanNum ? `https://wa.me/${cleanNum}` : '';

            const textWithoutPhone = rawLine.replace(phoneMatch[0], '');
            extractedName = textWithoutPhone.replace(/^[\s:\-,\(\)]+|[\s:\-,\(\)]+$/g, '').trim();
        } else {
            const digitsOnly = rawLine.replace(/\D/g, '');
            if (digitsOnly) {
                cleanNum = digitsOnly.length === 9 ? '51' + digitsOnly : digitsOnly;
                url = `https://wa.me/${cleanNum}`;
                displayNum = rawLine;
            } else {
                return null;
            }
        }
    }

    let formattedName = '';
    if (extractedName) {
        formattedName = extractedName.replace(/\b\w/g, (c) => c.toUpperCase());
    }

    const itemLabel = String(defaultItemLabel || 'WhatsApp').trim();
    const isGenericLabel = /^(whatsapp|whatsap|contacto|teléfono|telefono|celular|móvil|movil)$/i.test(itemLabel);

    let finalLabel = '';
    if (formattedName) {
        if (isGenericLabel) {
            finalLabel = formattedName;
        } else {
            const cleanItemLabel = itemLabel.replace(/whatsapp/gi, '').trim();
            if (cleanItemLabel && !formattedName.toLowerCase().includes(cleanItemLabel.toLowerCase())) {
                finalLabel = `${formattedName} (${cleanItemLabel})`;
            } else {
                finalLabel = formattedName;
            }
        }
    } else {
        finalLabel = totalLines > 1 ? `${itemLabel} (${lIdx + 1})` : itemLabel;
    }

    return {
        label: finalLabel,
        name: formattedName,
        numero: displayNum || cleanNum,
        cleanNum,
        url,
    };
}

export default function FloatingWhatsApp({ site, dominio, siteSlug, seccionesData, estilos }) {
    const [viewState, setViewState] = useState('closed'); // 'closed' | 'selector' | 'chat'
    const [mensaje, setMensaje] = useState('');
    const [selectedWa, setSelectedWa] = useState(null);

    // Extraer lista completa de contactos de WhatsApp (Datos de Contacto Globales + CMS)
    const whatsappList = useMemo(() => {
        const initialNav = seccionesData?.nav || seccionesData?.['nav'] || null;
        const initialContacto = seccionesData?.contacto || seccionesData?.['contacto'] || null;

        const rawCmsNavActions = initialNav?.contenido?.find((c) => c.label === 'accion_nav')?.valor;
        const cmsNavActions = Array.isArray(rawCmsNavActions) ? rawCmsNavActions : [];
        const globalActions = Array.isArray(estilos?.acciones_nav) ? estilos.acciones_nav : [];
        const combinedNavActions = [...globalActions, ...cmsNavActions];

        const accionesNav = combinedNavActions.filter((item, index, self) =>
            index === self.findIndex((t) => (t.texto || t.Texto) === (item.texto || item.Texto) && (t.icono || t.icon) === (item.icono || item.icon))
        );

        const waItems = accionesNav.filter((a) => {
            const ico = (a.icon || a.icono || '').toLowerCase();
            const txt = (a.texto || a.Texto || '').toLowerCase();
            return ico.includes('whatsapp') || ico.includes('phone') || txt.includes('wa.me');
        });

        const list = [];
        const seenCleanNums = new Set();

        waItems.forEach((item) => {
            const rawText = item.texto || item.Texto || '';
            const lines = String(rawText).split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
            const itemLabel = item.Label || item.label || 'WhatsApp';

            lines.forEach((line, lIdx) => {
                const parsed = parseWaContactLine(line, itemLabel, lIdx, lines.length);
                if (parsed && parsed.cleanNum) {
                    if (!seenCleanNums.has(parsed.cleanNum)) {
                        seenCleanNums.add(parsed.cleanNum);
                        list.push(parsed);
                    }
                }
            });
        });

        const redesWa = estilos?.redes_sociales?.whatsapp || site?.estilos?.redes_sociales?.whatsapp;
        if (redesWa) {
            const lines = String(redesWa).split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
            lines.forEach((line, lIdx) => {
                const parsed = parseWaContactLine(line, 'WhatsApp Oficial', lIdx, lines.length);
                if (parsed && parsed.cleanNum) {
                    if (!seenCleanNums.has(parsed.cleanNum)) {
                        seenCleanNums.add(parsed.cleanNum);
                        list.unshift(parsed);
                    }
                }
            });
        }

        if (list.length === 0 && initialContacto) {
            const itemContacto = initialContacto?.contenido?.find(
                (c) => c.label?.toLowerCase() === 'whatsap' || c.label?.toLowerCase() === 'whatsapp'
            );
            const rawVal = itemContacto?.enlace || (Array.isArray(itemContacto?.valor) ? itemContacto.valor[0]?.texto : null);
            if (rawVal) {
                const lines = String(rawVal).split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
                lines.forEach((line, lIdx) => {
                    const parsed = parseWaContactLine(line, 'WhatsApp', lIdx, lines.length);
                    if (parsed && parsed.cleanNum && !seenCleanNums.has(parsed.cleanNum)) {
                        seenCleanNums.add(parsed.cleanNum);
                        list.push(parsed);
                    }
                });
            }
        }

        return list;
    }, [seccionesData, estilos, site]);

    const handleMainButtonClick = () => {
        if (viewState === 'chat' || viewState === 'selector') {
            setViewState('closed');
        } else {
            if (whatsappList.length >= 2) {
                setViewState('selector');
            } else if (whatsappList.length === 1) {
                setSelectedWa(whatsappList[0]);
                setViewState('chat');
            } else {
                setViewState('chat');
            }
        }
    };

    const handleSelectWa = (wa) => {
        setSelectedWa(wa);
        setViewState('chat');
    };

    const handleEnviar = (e) => {
        e.preventDefault();
        const textoEnvio = mensaje.trim() || 'Hola';

        let baseUrl = selectedWa?.url || whatsappList[0]?.url || 'https://wa.me/';
        if (!baseUrl.includes('wa.me') && !baseUrl.includes('whatsapp.com')) {
            baseUrl = 'https://wa.me/';
        }

        const separator = baseUrl.includes('?') ? '&' : '?';
        const finalUrl = `${baseUrl}${separator}text=${encodeURIComponent(textoEnvio)}`;

        window.open(finalUrl, '_blank', 'noopener,noreferrer');
        setViewState('closed');
        setMensaje('');
    };

    const currentWa = selectedWa || whatsappList[0];

    return (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
            {/* 1. CARD SELECTOR: Cuando hay 2 o más números de WhatsApp */}
            {viewState === 'selector' && (
                <div className="mb-3 w-[calc(100vw-2rem)] max-w-[340px] overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-200 transition-all duration-300">
                    <div className="bg-[#075E54] p-4 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white shrink-0">
                                <DynamicIcon name="FaWhatsapp" className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm leading-tight text-white">Elige un contacto</h4>
                                <p className="text-[11px] text-emerald-100">Selecciona con quién deseas hablar</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setViewState('closed')}
                            className="rounded-full p-1 hover:bg-white/10 transition text-white/80 hover:text-white cursor-pointer"
                        >
                            <DynamicIcon name="FaXmark" className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="p-3.5 bg-gray-50/80 space-y-2.5 max-h-[320px] overflow-y-auto">
                        {whatsappList.map((wa, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleSelectWa(wa)}
                                className="w-full text-left bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-xs hover:border-[#25D366] hover:shadow-md hover:scale-[1.01] transition-all flex items-center justify-between group cursor-pointer"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="h-10 w-10 rounded-full bg-emerald-50 text-[#075E54] flex items-center justify-center font-bold border border-emerald-100 group-hover:bg-[#25D366] group-hover:text-white transition-colors shrink-0">
                                        <DynamicIcon name="FaWhatsapp" className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h5 className="font-bold text-xs text-gray-900 group-hover:text-[#075E54] transition-colors truncate">{wa.label}</h5>
                                        <p className="text-xs text-gray-500 font-medium truncate">{wa.numero}</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-400 group-hover:text-[#25D366] transition-colors shrink-0 pl-2">
                                    <DynamicIcon name="FaChevronRight" className="h-4 w-4" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 2. CHAT FLOTANTE: Cuando el usuario selecciona una Card o solo hay 1 número */}
            {viewState === 'chat' && (
                <div className="mb-3 w-[calc(100vw-2rem)] max-w-[340px] overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-200 transition-all duration-300">
                    {/* Header del Chat */}
                    <div className="bg-[#075E54] p-3.5 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                            {whatsappList.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => setViewState('selector')}
                                    className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer shrink-0"
                                    title="Volver a contactos"
                                >
                                    <DynamicIcon name="FaArrowLeft" className="h-4 w-4" />
                                </button>
                            )}
                            <div className="relative shrink-0">
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
                            <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-sm leading-tight text-white truncate">{currentWa?.label || site?.nombre || 'Atención al Cliente'}</h4>
                                <p className="text-[11px] text-emerald-100 truncate">{currentWa?.numero || 'En línea'}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setViewState('closed')}
                            className="rounded-full p-1 hover:bg-white/10 transition text-white/80 hover:text-white cursor-pointer shrink-0"
                            title="Cerrar chat"
                        >
                            <DynamicIcon name="FaXmark" className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Cuerpo del Chat / Mensaje de Bienvenida */}
                    <div className="p-4 bg-[#efeae2] min-h-[140px] max-h-[220px] overflow-y-auto space-y-3">
                        <div className="max-w-[85%] rounded-lg bg-white p-3 shadow-xs text-xs text-gray-800 rounded-tl-none relative">
                            <p className="font-semibold text-[11px] text-[#075E54] mb-1">{currentWa?.label || 'Soporte'}</p>
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



            {/* ESTILOS DE ANIMACIÓN DE PULSO Y VIBRACIÓN / MENSAJE EN VIVO */}
            <style>{`
                @keyframes waPulseGlow {
                    0% {
                        box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.8), 0 10px 25px -5px rgba(0, 0, 0, 0.3);
                    }
                    70% {
                        box-shadow: 0 0 0 20px rgba(37, 211, 102, 0), 0 10px 25px -5px rgba(0, 0, 0, 0.3);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(37, 211, 102, 0), 0 10px 25px -5px rgba(0, 0, 0, 0.3);
                    }
                }

                @keyframes waVibrateShake {
                    0%, 100% { transform: rotate(0deg) scale(1); }
                    3% { transform: rotate(-14deg) scale(1.12); }
                    6% { transform: rotate(14deg) scale(1.12); }
                    9% { transform: rotate(-12deg) scale(1.08); }
                    12% { transform: rotate(12deg) scale(1.08); }
                    15% { transform: rotate(-6deg) scale(1.04); }
                    18% { transform: rotate(6deg) scale(1.04); }
                    21% { transform: rotate(0deg) scale(1); }
                }

                .wa-pulse-active {
                    animation: waPulseGlow 2s infinite, waVibrateShake 4.2s infinite ease-in-out;
                }
            `}</style>

            {/* BOTÓN FLOTANTE TRIGGER */}
            <button
                type="button"
                onClick={handleMainButtonClick}
                className={`relative flex items-center justify-center rounded-full bg-[#25D366] p-3.5 text-white shadow-xl transition-all duration-300 hover:bg-[#20ba5a] hover:scale-110 cursor-pointer ${viewState === 'closed' ? 'wa-pulse-active' : ''
                    }`}
                title={viewState !== 'closed' ? "Cerrar" : "Abrir chat de WhatsApp"}
                aria-label="Chat de WhatsApp"
            >
                <div className="relative flex items-center justify-center">
                    {viewState !== 'closed' ? (
                        <DynamicIcon name="FaXmark" className="h-7 w-7 text-white" />
                    ) : (
                        <>
                            <DynamicIcon name="FaWhatsapp" className="h-7 w-7 text-white" />
                            {/* BADGE DE NOTIFICACIÓN DE MENSAJE NO LEÍDO */}
                            <span className="absolute -top-3 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-extrabold text-white shadow-md border-2 border-white animate-bounce">
                                1
                            </span>
                        </>
                    )}
                </div>
            </button>
        </div>
    );
}
