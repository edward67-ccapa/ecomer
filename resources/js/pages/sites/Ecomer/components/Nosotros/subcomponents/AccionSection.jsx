import React from 'react';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import DynamicIcon from '@/components/DynamicIcon';

export default function AccionSection({ seccionData, site, estilos, dominio, siteSlug, seccionesData }) {
    if (!seccionData) return null;

    const { props } = usePage();
    const activeDominio = dominio || props?.dominio;
    const activeSiteSlug = siteSlug || props?.siteSlug;
    const activeEstilos = estilos || props?.estilos || props?.site?.estilos || {};
    const activeSite = site || props?.site || {};

    // Normalizar los datos del valor de la sección
    const rawValor = seccionData?.valor;
    const data = Array.isArray(rawValor) ? rawValor[0] : (rawValor || {});

    const icono = data?.Icono || data?.icono;
    const titulo = data?.Titulo || data?.titulo || '¿Listo para equipar tu empresa?';
    const descripcion = data?.Descripcion || data?.descripcion || '';

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

    const boton1 = data?.Boton1 || data?.boton1 || (isCatalogoActivo ? catalogoTitulo : 'Descargar catálogo');
    const boton2 = data?.Boton2 || data?.boton2 || 'Contactar por WhatsApp';

    // 2. WhatsApp con mensaje predeterminado: "Hola, quisiera ...."
    const redesSociales = activeEstilos?.redes_sociales || activeSite?.estilos?.redes_sociales || {};
    const navActions = activeEstilos?.acciones_nav || activeSite?.estilos?.acciones_nav || [];
    const waFromActions = navActions.find(a => (a.icono || a.icon || '').toLowerCase().includes('whatsapp') || (a.texto || a.Texto || '').toLowerCase().includes('wa.me'));
    const rawWaNum = redesSociales.whatsapp || waFromActions?.texto || waFromActions?.Texto || '';
    const cleanWa = String(rawWaNum).replace(/\D/g, '');
    const finalWaNumber = cleanWa ? (cleanWa.length === 9 ? `51${cleanWa}` : cleanWa) : null;
    const whatsappMsg = encodeURIComponent('Hola, quisiera ....');
    const whatsappUrl = finalWaNumber ? `https://wa.me/${finalWaNumber}?text=${whatsappMsg}` : `https://wa.me/?text=${whatsappMsg}`;

    return (
        <section className="relative overflow-hidden bg-black py-16 md:py-20 border-t border-zinc-900">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 px-6 py-12 sm:px-12 sm:py-16 lg:px-16 text-center text-white shadow-2xl border border-white/10"
                >
                    {/* Resplandor decorativo de fondo */}
                    <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-[var(--color-primario)]/20 blur-3xl" />
                    <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

                    <div className="relative z-10 mx-auto max-w-3xl flex flex-col items-center">
                        {/* Icono Destacado */}
                        {icono && (
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primario)]/20 text-[var(--color-primario)] border border-[var(--color-primario)]/30 shadow-lg">
                                <DynamicIcon name={icono} className="h-8 w-8" />
                            </div>
                        )}

                        {/* Título Principal */}
                        <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
                            {titulo}
                        </h2>

                        {/* Descripción */}
                        {descripcion && (
                            <p className="mb-8 text-base text-gray-300 sm:text-lg leading-relaxed max-w-2xl">
                                {descripcion}
                            </p>
                        )}

                        {/* Botones de Acción */}
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            {boton1 && (
                                <a
                                    href={downloadUrl}
                                    onClick={handleDescargarCatalogo}
                                    className="inline-flex items-center justify-center rounded-xl bg-[var(--color-primario)] px-8 py-3.5 text-base font-bold text-white shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] hover:brightness-110 cursor-pointer"
                                >
                                    {boton1}
                                </a>
                            )}
                            {boton2 && (
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] hover:bg-white/20"
                                >
                                    {boton2}
                                </a>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
