import React from 'react';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import DynamicIcon from '@/components/DynamicIcon';

export default function PortadaSection({ seccionData, site, estilos, dominio, siteSlug, seccionesData }) {
    if (!seccionData) return null;

    const { props } = usePage();
    const activeDominio = dominio || props?.dominio;
    const activeSiteSlug = siteSlug || props?.siteSlug;
    const activeEstilos = estilos || props?.estilos || props?.site?.estilos || {};
    const activeSite = site || props?.site || {};

    // Normalizar los datos del valor de la sección
    const rawValor = seccionData?.valor;
    const data = Array.isArray(rawValor) ? rawValor[0] : (rawValor || {});

    const sub = data?.sub || 'SOBRE NOSOTROS';
    const titulo = data?.Titulo || 'Mas de 15 años /*equipando al Perú*/';
    const parrafo = data?.Parrafo || '';

    // --- CONFIGURACIÓN EXACTA DE CATÁLOGO (IGUAL AL NAV / HEADER) ---
    const catalogoConfig = activeEstilos?.catalogo || activeSite?.estilos?.catalogo || {};
    const isCatalogoActivo = Boolean(catalogoConfig.activo);
    const catalogoTitulo = catalogoConfig.titulo || 'Catálogo';
    const catalogoEnlace = catalogoConfig.enlace ? String(catalogoConfig.enlace).trim() : null;

    const downloadUrl = catalogoEnlace
        ? catalogoEnlace
        : (activeDominio === 'plantillas'
            ? `/plantillas/${activeSiteSlug}/catalogo/descargar-pdf`
            : (activeSiteSlug ? `/${activeDominio}/${activeSiteSlug}/catalogo/descargar-pdf` : `/${activeDominio}/catalogo/descargar-pdf`));

    const handleDescargarCatalogo = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        window.location.href = downloadUrl;
    };

    const boton1 = data?.Boton1 || data?.boton1 || (isCatalogoActivo ? catalogoTitulo : 'Ver Catálogo');
    const boton2 = data?.Boton2 || data?.boton2 || 'Contactar WhatsApp';

    // 2. WhatsApp con mensaje predeterminado: "Hola, quisiera ...."
    const redesSociales = activeEstilos?.redes_sociales || activeSite?.estilos?.redes_sociales || {};
    const navActions = activeEstilos?.acciones_nav || activeSite?.estilos?.acciones_nav || [];
    const waFromActions = navActions.find(a => (a.icono || a.icon || '').toLowerCase().includes('whatsapp') || (a.texto || a.Texto || '').toLowerCase().includes('wa.me'));
    const rawWaNum = redesSociales.whatsapp || waFromActions?.texto || waFromActions?.Texto || '';
    const cleanWa = String(rawWaNum).replace(/\D/g, '');
    const finalWaNumber = cleanWa ? (cleanWa.length === 9 ? `51${cleanWa}` : cleanWa) : null;
    const whatsappMsg = encodeURIComponent('Hola, quisiera ....');
    const whatsappUrl = finalWaNumber ? `https://wa.me/${finalWaNumber}?text=${whatsappMsg}` : `https://wa.me/?text=${whatsappMsg}`;

    // Normalizar Imagen (string o array)
    const rawImagen = data?.Imagen;
    const imagenUrl = Array.isArray(rawImagen) ? rawImagen[0] : rawImagen;

    // Normalizar Info (Array de métricas/estadísticas)
    const infoStats = Array.isArray(data?.Info) ? data.Info : [];

    // Helper para procesar títulos con la sintaxis /*texto destacado*/
    const renderFormattedTitle = (text) => {
        if (!text) return null;

        const regex = /\/\*(.*?)\*\//g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push({ text: text.slice(lastIndex, match.index), isHighlight: false });
            }
            parts.push({ text: match[1], isHighlight: true });
            lastIndex = regex.lastIndex;
        }
        if (lastIndex < text.length) {
            parts.push({ text: text.slice(lastIndex), isHighlight: false });
        }

        if (parts.length === 0) {
            return <span>{text}</span>;
        }

        return parts.map((part, idx) => (
            <span
                key={idx}
                className={
                    part.isHighlight
                        ? 'relative inline-block text-[var(--color-primario)] font-extrabold drop-shadow-md'
                        : ''
                }
            >
                {part.text}
            </span>
        ));
    };

    return (
        <section className="relative min-h-[100vh] pt-40 md:pt-0 w-full overflow-hidden bg-slate-950 pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-40 lg:pb-28 text-white flex flex-col justify-center">
            {/* Imagen de fondo con zoom sutil y capas de degradado */}
            {imagenUrl && (
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <motion.img
                        initial={{ scale: 1.08 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        src={imagenUrl}
                        alt={titulo ? titulo.replace(/\/\*|\*\//g, '') : 'Fondo Sobre Nosotros'}
                        className="absolute inset-0 h-full w-full min-h-full min-w-full object-cover object-center"
                        fetchPriority="high"
                    />
                    {/* Fondo con degradado y opacidad sobre la imagen para legibilidad óptima en celular y desktop */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/80 sm:bg-gradient-to-r sm:from-black/85 sm:via-black/55 sm:to-black/40" />
                </div>
            )}

            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Bloque Superior: Información y Textos */}
                <div className="max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="flex flex-col items-start"
                    >
                        {/* Subtítulo / Badge estilo Glassmorphism */}
                        {sub && (
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--color-primario)] shadow-lg backdrop-blur-md">
                                <span className="h-2 w-2 rounded-full bg-[var(--color-primario)] animate-pulse" />
                                {sub}
                            </div>
                        )}

                        {/* Título Principal */}
                        <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
                            {renderFormattedTitle(titulo)}
                        </h1>

                        {/* Párrafo Descriptivo */}
                        {parrafo && (
                            <p className="mb-8 max-w-2xl text-base leading-relaxed text-gray-200 sm:text-lg lg:text-xl drop-shadow">
                                {parrafo}
                            </p>
                        )}

                        {/* Botones de Acción */}
                        <div className="flex flex-wrap items-center gap-4">
                            {boton1 && (
                                <a
                                    href={downloadUrl}
                                    onClick={handleDescargarCatalogo}
                                    className="inline-flex items-center justify-center rounded-xl bg-[var(--color-primario)] px-8 py-4 text-base font-bold text-white shadow-xl shadow-[var(--color-primario)]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-[var(--color-primario)]/45 focus:outline-none focus:ring-2 focus:ring-[var(--color-primario)] focus:ring-offset-2 active:translate-y-0 cursor-pointer"
                                >
                                    {boton1}
                                </a>
                            )}
                            {boton2 && (
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 active:translate-y-0"
                                >
                                    {boton2}
                                </a>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Bloque Inferior: Tarjetas de Estadísticas (Info) estilo Glassmorphism */}
                {infoStats.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 35 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-16 sm:mt-20 lg:mt-24"
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {infoStats.map((item, idx) => {
                                const icono = item.Icono || item.icono;
                                const metricTitulo = item.Titulo || item.titulo || item.Texto;
                                const descripcion = item.descripcion || item.Descripcion || item.texto;

                                return (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                        className="group relative flex items-center gap-4  transition-all duration"
                                    >
                                        {/* Icono decorativo */}
                                        {icono && (
                                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primario)]/20 text-[var(--color-primario)] border border-[var(--color-primario)]/30 transition-colors duration-300 group-hover:bg-[var(--color-primario)] group-hover:text-white">
                                                <DynamicIcon name={icono} className="h-7 w-7" />
                                            </div>
                                        )}

                                        {/* Texto estadístico */}
                                        <div className="flex flex-col">
                                            <span className="text-2xl font-extrabold tracking-tight text-white group-hover:text-[var(--color-primario)] transition-colors">
                                                {metricTitulo}
                                            </span>
                                            {descripcion && (
                                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                                                    {descripcion}
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
