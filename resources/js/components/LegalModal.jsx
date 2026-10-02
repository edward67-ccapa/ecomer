import React, { useState, useEffect } from 'react';
import {
    FaXmark,
    FaScaleBalanced,
    FaUserShield,
    FaTruckFast,
    FaRotateLeft,
    FaShieldHalved,
    FaAngleRight
} from 'react-icons/fa6';

export function parsePoliticas(estilos, site) {
    let politicas = estilos?.politicas || site?.estilos?.politicas;

    if (!politicas && typeof site?.estilos === 'string') {
        try {
            const parsed = JSON.parse(site.estilos);
            politicas = parsed?.politicas;
        } catch (e) { }
    }

    if (!politicas && typeof estilos === 'string') {
        try {
            const parsed = JSON.parse(estilos);
            politicas = parsed?.politicas;
        } catch (e) { }
    }

    if (typeof politicas === 'string') {
        try {
            politicas = JSON.parse(politicas);
        } catch (e) {
            politicas = {};
        }
    }

    return politicas && typeof politicas === 'object' ? politicas : {};
}

export function getPolicyData(type, customPoliticas = {}) {
    const policyMap = {
        terminos: {
            badge: 'MARCO LEGAL & CONDICIONES DE USO',
            title: 'Términos y Condiciones',
            subtitle: 'Conoce los términos, derechos y obligaciones que rigen la utilización de nuestra plataforma digital.',
            icon: FaScaleBalanced,
            sectionDefs: [
                { key: 'sec_1', num: '1', title: 'Aceptación de los Términos' },
                { key: 'sec_2', num: '2', title: 'Descripción del Servicio' },
                { key: 'sec_3', num: '3', title: 'Registro y Responsabilidad del Usuario' },
                { key: 'sec_4', num: '4', title: 'Contenido de los Anuncios / Productos' },
                { key: 'sec_5', num: '5', title: 'Planes y Pagos' },
                { key: 'sec_6', num: '6', title: 'Propiedad Intelectual' },
                { key: 'sec_7', num: '7', title: 'Limitación de Responsabilidad' },
                { key: 'sec_8', num: '8', title: 'Cancelación y Suspensión' },
                { key: 'sec_9', num: '9', title: 'Modificaciones de los Términos' },
                { key: 'sec_10', num: '10', title: 'Contacto' },
            ]
        },
        privacidad: {
            badge: 'SEGURIDAD & PRIVACIDAD DE DATOS',
            title: 'Política de Privacidad',
            subtitle: 'Conoce nuestras prácticas de protección de datos, recopilación responsable y los derechos sobre tu información personal.',
            icon: FaUserShield,
            sectionDefs: [
                { key: 'sec_1', num: '1', title: 'Información que Recopilamos' },
                { key: 'sec_2', num: '2', title: 'Uso de la Información' },
                { key: 'sec_3', num: '3', title: 'Protección de Datos' },
                { key: 'sec_4', num: '4', title: 'Compartición de Información' },
                { key: 'sec_5', num: '5', title: 'Cookies' },
                { key: 'sec_6', num: '6', title: 'Derechos del Usuario' },
                { key: 'sec_7', num: '7', title: 'Conservación de Datos' },
                { key: 'sec_8', num: '8', title: 'Cambios a esta Política' },
                { key: 'sec_9', num: '9', title: 'Contacto' },
            ]
        },
        envios: {
            badge: 'DESPACHO & COBERTURA NACIONAL',
            title: 'Política de Envíos',
            subtitle: 'Información detallada sobre plazos de entrega, zonas de cobertura y métodos de despacho.',
            icon: FaTruckFast,
            sectionDefs: [
                { key: 'sec_1', num: '1', title: 'Cobertura y Zonas de Envío' },
                { key: 'sec_2', num: '2', title: 'Tiempos y Plazos de Entrega' },
                { key: 'sec_3', num: '3', title: 'Costos y Métodos de Envío' },
                { key: 'sec_4', num: '4', title: 'Recepción de Pedidos' },
            ]
        },
        devoluciones: {
            badge: 'GARANTÍA & CAMBIOS DE PRODUCTO',
            title: 'Políticas de Devolución',
            subtitle: 'Conoce las condiciones y el procedimiento para solicitar un cambio o devolución de producto.',
            icon: FaRotateLeft,
            sectionDefs: [
                { key: 'sec_1', num: '1', title: 'Condiciones para Cambios y Devoluciones' },
                { key: 'sec_2', num: '2', title: 'Plazos para Devoluciones' },
                { key: 'sec_3', num: '3', title: 'Proceso y Reembolsos' },
                { key: 'sec_4', num: '4', title: 'Excepciones' },
            ]
        }
    };

    const config = policyMap[type] || policyMap.terminos;
    const userPolicy = customPoliticas?.[type] || {};

    const intro = typeof userPolicy.intro === 'string' && userPolicy.intro.trim() !== '' ? userPolicy.intro.trim() : null;

    const sections = config.sectionDefs
        .map((def) => {
            const val = userPolicy[def.key];
            if (typeof val === 'string' && val.trim() !== '') {
                return {
                    id: `${type}-${def.key}`,
                    num: def.num,
                    title: def.title,
                    content: val.trim()
                };
            }
            return null;
        })
        .filter(Boolean);

    const hasContent = Boolean(intro || sections.length > 0);

    return {
        ...config,
        type,
        intro,
        sections,
        hasContent
    };
}

export default function LegalModal({ isOpen, onClose, defaultTab = 'terminos', site = {}, estilos = {} }) {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [activeSection, setActiveSection] = useState(null);

    useEffect(() => {
        if (defaultTab) {
            setActiveTab(defaultTab);
        }
    }, [defaultTab, isOpen]);

    if (!isOpen) return null;

    const siteName = site?.nombre || 'Nuestra Tienda';
    const customPoliticas = parsePoliticas(estilos, site);

    // Obtener datos estrictos sin texto inventado
    const currentConfig = getPolicyData(activeTab, customPoliticas);
    const HeaderIcon = currentConfig.icon;

    // Pestañas que realmente tienen contenido ingresado por la tienda
    const availableTabs = [
        { id: 'terminos', label: 'Términos y Condiciones', icon: FaScaleBalanced, has: getPolicyData('terminos', customPoliticas).hasContent },
        { id: 'privacidad', label: 'Política de Privacidad', icon: FaUserShield, has: getPolicyData('privacidad', customPoliticas).hasContent },
        { id: 'envios', label: 'Envíos', icon: FaTruckFast, has: getPolicyData('envios', customPoliticas).hasContent },
        { id: 'devoluciones', label: 'Devoluciones', icon: FaRotateLeft, has: getPolicyData('devoluciones', customPoliticas).hasContent },
    ].filter(t => t.has);

    const scrollToSection = (id) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-neutral-900/40 backdrop-blur-sm p-3 sm:p-6 transition-all duration-300">
            <div
                className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-slate-50 rounded-2xl shadow-2xl overflow-hidden border border-neutral-200"
                onClick={(e) => e.stopPropagation()}
            >

                {/* --- CABECERA --- */}
                <div className="relative bg-white text-neutral-900 p-6 sm:p-8 shrink-0 border-b border-neutral-200">
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 h-9 w-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 flex items-center justify-center transition focus:outline-none"
                        title="Cerrar"
                    >
                        <FaXmark className="h-5 w-5" />
                    </button>

                    <div className="flex flex-col gap-3 max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-bold tracking-wider text-amber-800 uppercase w-fit">
                            <HeaderIcon className="h-3.5 w-3.5 text-amber-600" />
                            <span>{currentConfig.badge}</span>
                        </div>

                        <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
                            {currentConfig.title}
                        </h2>

                        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-2xl">
                            {currentConfig.subtitle}
                        </p>
                    </div>

                    {/* Tabs disponibles con contenido */}
                    {availableTabs.length > 1 && (
                        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-neutral-100">
                            {availableTabs.map((tab) => {
                                const TabIcon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${activeTab === tab.id
                                                ? 'bg-amber-500 text-black shadow-xs font-bold'
                                                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200'
                                            }`}
                                    >
                                        <TabIcon className="h-3 w-3" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* --- CUERPO MODO CLARO --- */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-neutral-50/60">
                    {!currentConfig.hasContent ? (
                        <div className="bg-white p-8 rounded-2xl border border-neutral-200 text-center space-y-3">
                            <div className="h-12 w-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto text-xl">
                                ⚖️
                            </div>
                            <h3 className="font-bold text-neutral-800 text-base">Contenido no disponible</h3>
                            <p className="text-xs text-neutral-500 max-w-md mx-auto">
                                La tienda no ha redactado la información correspondiente a esta sección en su panel de administración.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

                            {/* ÍNDICE IZQUIERDO */}
                            {currentConfig.sections.length > 0 && (
                                <div className="lg:col-span-4 lg:sticky lg:top-0 space-y-4">
                                    <div className="bg-white rounded-2xl p-5 shadow-xs border border-neutral-200 space-y-4">
                                        <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                                            <FaShieldHalved className="h-3.5 w-3.5 text-amber-500" />
                                            <span>ÍNDICE DE CONTENIDO</span>
                                        </div>

                                        <nav className="space-y-1 max-h-[50vh] overflow-y-auto pr-1">
                                            {currentConfig.sections.map((sec) => (
                                                <button
                                                    key={sec.id}
                                                    onClick={() => scrollToSection(sec.id)}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs transition-all ${activeSection === sec.id
                                                            ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                                                            : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 font-medium'
                                                        }`}
                                                >
                                                    <span className="h-5 w-5 rounded-md bg-neutral-100 text-neutral-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                                                        {sec.num}
                                                    </span>
                                                    <span className="truncate flex-1">{sec.title}</span>
                                                    <FaAngleRight className="h-2.5 w-2.5 opacity-40 shrink-0" />
                                                </button>
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            )}

                            {/* COLUMNA DERECHA DE CARDS */}
                            <div className={currentConfig.sections.length > 0 ? "lg:col-span-8 space-y-6" : "lg:col-span-12 space-y-6"}>

                                {/* TARJETA INTRODUCTORIA (SOLO SI TIENE CONTENIDO REGISTRADO) */}
                                {currentConfig.intro && (
                                    <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-xs border-l-4 border-l-amber-500 border-t border-r border-b border-neutral-200 text-sm text-neutral-700 leading-relaxed whitespace-pre-line font-sans">
                                        {currentConfig.intro}
                                    </div>
                                )}

                                {/* CARDS NUMERADAS DE SECCIONES REGISTRADAS */}
                                {currentConfig.sections.map((sec) => {
                                    const isContactoSec = sec.title.toLowerCase().includes('contacto');

                                    const handleGoToContacto = (e) => {
                                        e.preventDefault();
                                        onClose();
                                        setTimeout(() => {
                                            const contactoEl = document.getElementById('contacto');
                                            if (contactoEl) {
                                                contactoEl.scrollIntoView({ behavior: 'smooth' });
                                            }
                                        }, 200);
                                    };

                                    return (
                                        <div
                                            key={sec.id}
                                            id={sec.id}
                                            className="bg-white p-6 sm:p-7 rounded-2xl shadow-xs border border-neutral-200 space-y-3.5 scroll-mt-6 transition-all hover:border-neutral-300"
                                        >
                                            <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                                                <span className="h-7 w-7 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                                                    {sec.num}
                                                </span>
                                                <h3 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
                                                    {sec.title}
                                                </h3>
                                            </div>

                                            <div className="text-xs sm:text-sm text-neutral-600 leading-relaxed whitespace-pre-line font-sans pt-1">
                                                {sec.content}
                                            </div>

                                            {isContactoSec && (
                                                <div className="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-neutral-50 p-4 rounded-xl">
                                                    <div>
                                                        <span className="block font-bold text-xs text-neutral-800">¿Deseas comunicarte directamente?</span>
                                                        <span className="text-xs text-neutral-500">Utiliza nuestro formulario o canales oficiales en la sección de contacto.</span>
                                                    </div>
                                                    <button
                                                        onClick={handleGoToContacto}
                                                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs transition shadow-xs flex items-center gap-1.5 shrink-0"
                                                    >
                                                        <span>Ir a Sección de Contacto</span>
                                                        <FaAngleRight className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                            </div>

                        </div>
                    )}
                </div>

                {/* --- PIE DEL MODAL --- */}
                <div className="bg-white border-t border-neutral-200 px-6 py-4 flex items-center justify-between shrink-0 text-xs text-neutral-500">
                    <div>
                        © {new Date().getFullYear()} <span className="font-semibold text-neutral-700">{siteName}</span>. Todos los derechos reservados.
                    </div>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl bg-neutral-900 text-white font-semibold hover:bg-neutral-800 transition shadow-xs"
                    >
                        Entendido / Cerrar
                    </button>
                </div>

            </div>
        </div>
    );
}
