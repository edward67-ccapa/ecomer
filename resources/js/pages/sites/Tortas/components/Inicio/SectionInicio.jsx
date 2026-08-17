import { useEffect, useState } from 'react';
import { fetchInicioData } from './api';
import { motion } from 'framer-motion';
import DynamicIcon from '@/components/DynamicIcon';

export default function SectionInicio({ site, dominio, siteSlug, styles }) {
    const [seccionData, setSeccionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!dominio || !siteSlug) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        fetchInicioData(dominio, siteSlug)
            .then((response) => {
                setSeccionData(response);
            })
            .catch((err) => {
                setError(err.response?.data?.message || err.message || 'Error al conectar con la API');
                setSeccionData(null);
            })
            .finally(() => setLoading(false));
    }, [dominio, siteSlug]);

    // Estados de carga y error
    if (loading) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div
                        className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
                        style={{
                            borderColor: 'var(--color-primario)',
                            borderTopColor: 'transparent',
                        }}
                    />
                    <p className="font-medium text-gray-500">Cargando contenido...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center">
                <div className="rounded-xl bg-red-50 p-6 text-center shadow-sm">
                    <p className="font-semibold text-red-600">⚠️ {error}</p>
                </div>
            </main>
        );
    }

    if (!seccionData || !seccionData.contenido) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center">
                <p className="text-gray-400">No hay contenido disponible.</p>
            </main>
        );
    }

    // --- EXTRACCIÓN DIRECTA DE CAMPOS ---
    const getValor = (label) => seccionData.contenido.find((item) => item.label === label)?.valor;

    const imgHero = getValor('img_seccion1');
    const tituloHero = getValor('titulo_seccion1');
    const descripcionHero = getValor('descripcion_seccion1');
    const botones = getValor('buton') || [];
    const etiquetas = getValor('etiqueta') || [];

    // --- FUNCIÓN DE ÍCONOS DINÁMICOS ---
    const renderIcon = (iconName, className = 'h-8 w-8', customStyle = null) => {
        if (!iconName) return null;
        return <DynamicIcon name={iconName} className={className} style={customStyle} />;
    };

    // --- FUNCIÓN DE RESALTADO DE TÍTULO (/texto resaltado/) ---
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
                                <span
                                    key={partIdx}
                                    style={{ color: 'var(--color-primario)' }}
                                >
                                    {part}
                                </span>
                            );
                        }
                        return <span key={partIdx} style={{ color: '#1a1a2e' }}>{part}</span>;
                    })}
                </span>
            );
        });
    };

    // --- RENDER PRINCIPAL ---
    return (
        <main className="flex-1">
            {/* HERO SECTION con degradado blanco */}
            <section className="relative min-h-[85vh] overflow-hidden">
                {imgHero && (
                    <>
                        <motion.img
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.8 }}
                            src={imgHero}
                            alt="Hero background"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        {/* Degradado blanco lateral izquierdo */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />
                    </>
                )}

                <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-end px-6 pb-20 pt-32">
                    {/* Contenido principal */}
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.7 }}
                        className="max-w-2xl"
                    >
                        {/* Título principal con resaltado /texto/ en color-primario */}
                        {tituloHero && (
                            <h1
                                className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
                                style={{
                                    fontFamily: 'var(--tipografia-titulos)',
                                    color: '#1a1a2e',
                                }}
                            >
                                {renderFormattedTitle(tituloHero)}
                            </h1>
                        )}

                        {/* Descripción con tipografía dinámica de texto */}
                        {descripcionHero && (
                            <p
                                className="mt-4 text-lg sm:text-xl"
                                style={{
                                    fontFamily: 'var(--tipografia-texto)',
                                    color: '#333333',
                                }}
                            >
                                {descripcionHero}
                            </p>
                        )}

                        {/* Botones de acción */}
                        {botones.length > 0 && (
                            <div
                                className="mt-8 flex flex-wrap"
                                style={{ gap: 'var(--espaciado)' }}
                            >
                                {botones.map((btn, idx) => (
                                    <motion.a
                                        key={idx}
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.96 }}
                                        href="https://wa.me/51999999999"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:brightness-105 hover:shadow-2xl"
                                        style={{
                                            backgroundColor: 'var(--color-primario)',
                                            borderRadius: 'var(--radio-bordes)',
                                            fontFamily: 'var(--tipografia-texto)',
                                        }}
                                    >
                                        {renderIcon(btn.icon, 'h-6 w-6 text-white')}
                                        <span>{btn.texto}</span>
                                    </motion.a>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* ETIQUETAS - Solo íconos + texto, sin fondos */}
                    {etiquetas.length > 0 && (
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="mt-16 w-full"
                        >
                            <div className="flex flex-wrap items-center justify-start gap-6 md:gap-10">
                                {etiquetas.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        {renderIcon(item.icon, 'h-6 w-6', {
                                            color: 'var(--color-primario)',
                                        })}
                                        <div className="flex flex-col items-start">
                                            <span
                                                className="text-sm font-bold leading-tight"
                                                style={{
                                                    fontFamily: 'var(--tipografia-titulos)',
                                                    color: '#1a1a2e',
                                                }}
                                            >
                                                {item.span}
                                            </span>
                                            <span
                                                className="text-xs leading-tight"
                                                style={{
                                                    fontFamily: 'var(--tipografia-texto)',
                                                    color: '#555555',
                                                }}
                                            >
                                                {item.span_sub}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>
        </main>
    );
}