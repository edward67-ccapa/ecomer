import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import {
    FaScaleBalanced,
    FaUserShield,
    FaTruckFast,
    FaRotateLeft,
    FaShieldHalved,
    FaAngleRight,
    FaArrowLeft,
    FaHouse
} from 'react-icons/fa6';
import { getPolicyData, parsePoliticas } from './LegalModal';

export default function LegalPage({ site, dominio, siteSlug, legalType = 'terminos', estilos = {} }) {
    const [activeTab, setActiveTab] = useState(legalType);
    const [activeSection, setActiveSection] = useState(null);

    const siteName = site?.nombre || 'Nuestra Tienda';
    const customPoliticas = parsePoliticas(estilos, site);

    const currentConfig = getPolicyData(activeTab, customPoliticas);
    const HeaderIcon = currentConfig.icon;

    const availableTabs = [
        { id: 'terminos', label: 'Términos y Condiciones', icon: FaScaleBalanced, has: getPolicyData('terminos', customPoliticas).hasContent },
        { id: 'privacidad', label: 'Política de Privacidad', icon: FaUserShield, has: getPolicyData('privacidad', customPoliticas).hasContent },
        { id: 'envios', label: 'Envíos', icon: FaTruckFast, has: getPolicyData('envios', customPoliticas).hasContent },
        { id: 'devoluciones', label: 'Devoluciones', icon: FaRotateLeft, has: getPolicyData('devoluciones', customPoliticas).hasContent },
    ].filter(t => t.has);

    const homeUrl = siteSlug ? `/${dominio}/${siteSlug}/Inicio` : `/${dominio}/Inicio`;

    const scrollToSection = (id) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="min-h-screen pt-36 lg:pt-28 bg-neutral-50 text-neutral-900 font-sans antialiased">
            <Head title={`${currentConfig.title} | ${siteName}`} />

            {/* ENCABEZADO SUPERIOR EN MODO CLARO */}
            <div className="bg-white border-b border-neutral-200 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* Breadcrumb / Botón de Retorno */}
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <a href={homeUrl} className="inline-flex items-center gap-1 hover:text-neutral-900 transition">
                            <FaHouse className="h-3 w-3" />
                            <span>Inicio</span>
                        </a>
                        <FaAngleRight className="h-2.5 w-2.5 opacity-40" />
                        <span className="font-bold text-neutral-800">{currentConfig.title}</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-3 max-w-3xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-bold tracking-wider text-amber-800 uppercase w-fit">
                                <HeaderIcon className="h-3.5 w-3.5 text-amber-600" />
                                <span>{currentConfig.badge}</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
                                {currentConfig.title}
                            </h1>

                            <p className="text-sm text-neutral-600 leading-relaxed">
                                {currentConfig.subtitle}
                            </p>
                        </div>

                        <a
                            href={homeUrl}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-xs font-bold text-neutral-800 transition shrink-0"
                        >
                            <FaArrowLeft className="h-3 w-3" />
                            <span>Volver a la Tienda</span>
                        </a>
                    </div>

                    {/* Pestañas disponibles que tienen contenido guardado */}
                    {availableTabs.length > 1 && (
                        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-neutral-100">
                            {availableTabs.map((tab) => {
                                const TabIcon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${activeTab === tab.id
                                            ? 'bg-amber-500 text-black shadow-xs font-bold'
                                            : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                                            }`}
                                    >
                                        <TabIcon className="h-3.5 w-3.5" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                </div>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <main className="max-w-7xl mx-auto py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
                {!currentConfig.hasContent ? (
                    <div className="bg-white p-12 rounded-2xl border border-neutral-200 text-center space-y-3 max-w-xl mx-auto my-8">
                        <div className="h-14 w-14 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto text-2xl">
                            ⚖️
                        </div>
                        <h2 className="font-bold text-neutral-800 text-lg">Contenido no redactado</h2>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                            La tienda aún no ha redactado ni publicado información para la sección de <strong className="text-neutral-700">{currentConfig.title}</strong> en su panel de administración.
                        </p>
                        <div className="pt-2">
                            <a
                                href={homeUrl}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition"
                            >
                                <span>Volver a la tienda</span>
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* ÍNDICE IZQUIERDO */}
                        {currentConfig.sections.length > 0 && (
                            <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-4">
                                <div className="bg-white rounded-2xl p-5 shadow-xs border border-neutral-200 space-y-4">
                                    <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                                        <FaShieldHalved className="h-3.5 w-3.5 text-amber-500" />
                                        <span>ÍNDICE DE CONTENIDO</span>
                                    </div>

                                    <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
                                        {currentConfig.sections.map((sec) => (
                                            <button
                                                key={sec.id}
                                                onClick={() => scrollToSection(sec.id)}
                                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition-all ${activeSection === sec.id
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
                                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border-l-4 border-l-amber-500 border-t border-r border-b border-neutral-200 text-sm text-neutral-700 leading-relaxed whitespace-pre-line font-sans">
                                    {currentConfig.intro}
                                </div>
                            )}

                            {/* CARDS NUMERADAS DE SECCIONES REGISTRADAS */}
                            {currentConfig.sections.map((sec) => {
                                const isContactoSec = sec.title.toLowerCase().includes('contacto');

                                return (
                                    <div
                                        key={sec.id}
                                        id={sec.id}
                                        className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-neutral-200 space-y-4 scroll-mt-10 transition-all hover:border-neutral-300"
                                    >
                                        <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                                            <span className="h-7 w-7 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                                                {sec.num}
                                            </span>
                                            <h2 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
                                                {sec.title}
                                            </h2>
                                        </div>

                                        <div className="text-xs sm:text-sm text-neutral-600 leading-relaxed whitespace-pre-line font-sans pt-1">
                                            {sec.content}
                                        </div>

                                        {isContactoSec && (
                                            <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-neutral-50 p-4 rounded-xl">
                                                <div>
                                                    <span className="block font-bold text-xs text-neutral-800">¿Deseas comunicarte directamente?</span>
                                                    <span className="text-xs text-neutral-500">Utiliza nuestro formulario o canales oficiales en la sección de contacto.</span>
                                                </div>
                                                <a
                                                    href={`${homeUrl}#contacto`}
                                                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs transition shadow-xs flex items-center gap-1.5 shrink-0"
                                                >
                                                    <span>Ir a Sección de Contacto</span>
                                                    <FaAngleRight className="h-3 w-3" />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                        </div>

                    </div>
                )}
            </main>
        </div>
    );
}
