import { useEffect, useState } from 'react';
import { fetchInicioData, fetchServiciosData, fetchSomosData } from './api';
import { motion } from 'framer-motion';
import DynamicIcon from '@/components/DynamicIcon';

export default function SectionInicio({ site, dominio, siteSlug, styles }) {
    const [seccionDataInicio, setSeccionDataInicio] = useState(null);
    const [seccionDataServicios, setSeccionDataServicios] = useState(null);
    const [seccionDataSomos, setSeccionDataSomos] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!dominio || !siteSlug) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        Promise.all([
            fetchInicioData(dominio, siteSlug),
            fetchServiciosData(dominio, siteSlug),
            fetchSomosData(dominio, siteSlug)
        ])
            .then(([inicioData, serviciosData, somosData]) => {
                setSeccionDataInicio(inicioData);
                setSeccionDataServicios(serviciosData);
                setSeccionDataSomos(somosData);
            })
            .catch((err) => {
                setError(err.response?.data?.message || err.message || 'Error al conectar con la API');
                setSeccionDataInicio(null);
                setSeccionDataServicios(null);
                setSeccionDataSomos(null);
            })
            .finally(() => setLoading(false));
    }, [dominio, siteSlug]);

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

    if (!seccionDataInicio || !seccionDataInicio.contenido) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center">
                <p className="text-gray-400">No hay contenido disponible.</p>
            </main>
        );
    }

    const getValorInicio = (label) => seccionDataInicio.contenido.find((item) => item.label === label)?.valor;

    const imgHero = getValorInicio('img_seccion1');
    const tituloHero = getValorInicio('titulo_seccion1');
    const descripcionHero = getValorInicio('descripcion_seccion1');
    const botones = getValorInicio('buton') || [];
    const etiquetas = getValorInicio('etiqueta') || [];
    const whatsappUrl = getValorInicio('whatsapp_url') || 'https://wa.me/51999999999';

    const getValorServicios = (label) => seccionDataServicios?.contenido?.find((item) => item.label === label)?.valor;

    const subTituloServicios = getValorServicios('sub_titulo');
    const tituloServicios = getValorServicios('titulo');
    const iconoServicios = getValorServicios('icono');
    const servicios = getValorServicios('servicios') || [];

    const getValorSomos = (label) => seccionDataSomos?.contenido?.find((item) => item.label === label)?.valor;

    const subTituloSomos = getValorSomos('sub_titulo') || [];
    const tituloSomos = getValorSomos('titulo') || [];
    const iconoSomos = getValorSomos('icono') || [];
    const descripcionSomos = getValorSomos('descripcion') || [];
    const etiquetasSomos = getValorSomos('etiqueta') || [];
    const imagenSomos = getValorSomos('imagen') || [];

    const renderIcon = (iconName, className = 'h-8 w-8', customStyle = null) => {
        if (!iconName) return null;
        return <DynamicIcon name={iconName} className={className} style={customStyle} />;
    };

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

    return (
        <main className="flex-1">
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
                        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />
                    </>
                )}

                <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-end px-6 pb-20 pt-32">
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.7 }}
                        className="max-w-2xl"
                    >
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
                                        href={whatsappUrl}
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

                    {etiquetas.length > 0 && (
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true, amount: 0.2 }}
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

            <section className="py-16 px-6" style={{ backgroundColor: 'var(--color-secundario)' }}>
                <div className="max-w-7xl mx-auto">
                    {subTituloServicios && (
                        <motion.p
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="text-center text-sm font-semibold uppercase tracking-wider mb-2"
                            style={{ color: 'var(--color-primario)', fontFamily: 'var(--tipografia-texto)' }}
                        >
                            {subTituloServicios}
                        </motion.p>
                    )}

                    {tituloServicios && (
                        <motion.h2
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-3xl md:text-4xl font-bold text-center mb-4"
                            style={{ fontFamily: 'var(--tipografia-titulos)', color: '#1a1a2e' }}
                        >
                            {tituloServicios}
                        </motion.h2>
                    )}

                    {iconoServicios && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="flex items-center justify-center gap-4 mb-12"
                        >
                            <div
                                className="flex-1 max-w-20 h-px"
                                style={{
                                    background: 'linear-gradient(to right, transparent, var(--color-primario))'
                                }}
                            />
                            {renderIcon(iconoServicios, 'h-5 w-5', {
                                color: 'var(--color-primario)',
                            })}
                            <div
                                className="flex-1 max-w-20 h-px"
                                style={{
                                    background: 'linear-gradient(to left, transparent, var(--color-primario))'
                                }}
                            />
                        </motion.div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                        {servicios.map((servicio, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                                style={{ borderRadius: 'var(--radio-bordes)' }}
                            >
                                {servicio.imagen && (
                                    <div className="h-25 overflow-hidden">
                                        <img
                                            src={servicio.imagen}
                                            alt={servicio.titulo}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                )}
                                <div className="px-2 py-4 text-center">
                                    {servicio.titulo && (
                                        <h3 className="text-base font-bold mb-2"
                                            style={{ fontFamily: 'var(--tipografia-titulos)', color: '#1a1a2e' }}>
                                            {servicio.titulo}
                                        </h3>
                                    )}
                                    {servicio.descripción && (
                                        <p className="text-xs leading-relaxed"
                                            style={{ fontFamily: 'var(--tipografia-texto)', color: '#666666' }}>
                                            {servicio.descripción}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-16 px-6" style={{ backgroundColor: 'var(--color-secundario)' }}>
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Columna 1 - Texto */}
                        <div>
                            {subTituloSomos && (
                                <motion.p
                                    initial={{ opacity: 0, y: -20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                    className="text-center lg:text-left text-sm font-semibold uppercase tracking-wider mb-2"
                                    style={{ color: 'var(--color-primario)', fontFamily: 'var(--tipografia-texto)' }}
                                >
                                    {subTituloSomos}
                                </motion.p>
                            )}

                            {tituloSomos && (
                                <motion.h2
                                    initial={{ opacity: 0, y: -20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    className="text-3xl md:text-4xl font-bold text-center lg:text-left mb-2"
                                    style={{ fontFamily: 'var(--tipografia-titulos)', color: '#1a1a2e' }}
                                >
                                    {tituloSomos}
                                </motion.h2>
                            )}

                            {iconoSomos && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="flex items-center justify-center gap-4 mb-6"
                                >
                                    <div
                                        className="flex-1 max-w-20 h-px"
                                        style={{
                                            background: 'linear-gradient(to right, transparent, var(--color-primario))'
                                        }}
                                    />
                                    {renderIcon(iconoSomos, 'h-5 w-5', {
                                        color: 'var(--color-primario)',
                                    })}
                                    <div
                                        className="flex-1 max-w-20 h-px"
                                        style={{
                                            background: 'linear-gradient(to left, transparent, var(--color-primario))'
                                        }}
                                    />
                                </motion.div>
                            )}

                            {descripcionSomos && (
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="text-base leading-relaxed text-center lg:text-left mb-8"
                                    style={{ fontFamily: 'var(--tipografia-texto)', color: '#555555' }}
                                >
                                    {descripcionSomos}
                                </motion.p>
                            )}

                            {etiquetasSomos.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className="flex flex-wrap justify-center lg:justify-start gap-6 md:gap-10"
                                >
                                    {etiquetasSomos.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            {renderIcon(item.icono, 'h-8 w-8', {
                                                color: 'var(--color-primario)',
                                            })}
                                            <div className="flex flex-col">
                                                <span
                                                    className="text-xl font-bold leading-tight"
                                                    style={{ fontFamily: 'var(--tipografia-titulos)', color: '#1a1a2e' }}
                                                >
                                                    {item.span}
                                                </span>
                                                <span
                                                    className="text-xs leading-tight"
                                                    style={{ fontFamily: 'var(--tipografia-texto)', color: '#666666' }}
                                                >
                                                    {item.sub_span}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </div>

                        {/* Columna 2 - Imagen */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="flex justify-center lg:justify-end"
                        >
                            {imagenSomos && (
                                <img
                                    src={imagenSomos}
                                    alt={tituloSomos || "Sobre nosotros"}
                                    className="w-full max-w-md rounded-xl object-cover shadow-lg"
                                    style={{ borderRadius: 'var(--radio-bordes)' }}
                                />
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    );
}