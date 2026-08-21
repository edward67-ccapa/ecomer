import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import DynamicIcon from '@/components/DynamicIcon';
import { fetchSectionData } from './apiBase';

export default function Footer({ site, dominio, siteSlug, secciones, seccionActiva, seccionesData }) {
    const [navData, setNavData] = useState(null);
    const [contactoData, setContactoData] = useState(null);

    useEffect(() => {
        if (dominio && siteSlug) {
            fetchSectionData(dominio, siteSlug, 'nav')
                .then((res) => setNavData(res?.seccionActiva || res))
                .catch(() => setNavData(null));

            fetchSectionData(dominio, siteSlug, 'contacto')
                .then((res) => setContactoData(res?.seccionActiva || res))
                .catch(() => setContactoData(null));
        }
    }, [dominio, siteSlug]);

    const activeNav = navData || seccionesData?.nav || seccionesData?.['nav'] || null;
    const activeContacto = contactoData || seccionesData?.contacto || seccionesData?.['contacto'] || null;

    const logoNav = activeNav?.contenido?.find((c) => c.label === 'logo_nav')?.valor;
    const mensajeFooter = activeNav?.contenido?.find((c) => c.label === 'mensaje_footer')?.valor
        || 'Hacemos realidad la torta de tus sueños. Postres artesanales y diseños personalizados preparados con los mejores ingredientes para tus momentos especiales.';

    const accionesNav = activeNav?.contenido?.find((c) => c.label === 'accion_nav')?.valor || [];
    const waNavTexto = accionesNav.find((a) => a.icon?.toLowerCase() === 'fawhatsapp')?.texto;
    const phoneNavTexto = accionesNav.find((a) => a.icon?.toLowerCase() === 'faphone')?.texto;
    const emailNavTexto = accionesNav.find((a) => a.icon?.toLowerCase() === 'faenvelope')?.texto;

    // Extraer redes o datos de contacto si existen en la API
    const redes = activeContacto?.contenido?.find((c) => c.label === 'redes')?.valor || [];

    const direccion = contactoData?.contenido?.find((c) => c.label === 'direccion')?.valor?.[0]?.texto
        || 'Av. Gran Chimú N°680, San Juan de Lurigancho';

    const rawWa = waNavTexto || contactoData?.contenido?.find((c) => c.label === 'whatsap' || c.label === 'whatsapp')?.enlace || '916628409';
    const whatsappNum = rawWa.startsWith('http')
        ? rawWa
        : `https://wa.me/${rawWa.replace(/\D/g, '').length === 9 ? '51' + rawWa.replace(/\D/g, '') : rawWa.replace(/\D/g, '')}`;

    const PAGE_SECTIONS = ['inicio', 'productos'];
    const isInicioPage = !seccionActiva || seccionActiva.slug?.toLowerCase() === 'inicio';
    const mainPageSlug = secciones?.[0]?.slug || 'inicio';

    return (
        <footer
            className="border-t border-gray-200 bg-slate-50 pt-14 pb-8 text-gray-700"
            style={{ fontFamily: 'var(--tipografia-texto)' }}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:gap-12">

                    {/* COLUMNA 1: MARCA Y DESCRIPCIÓN */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            {logoNav || site?.imagen ? (
                                <img
                                    src={logoNav || site?.imagen}
                                    alt={site?.nombre || 'Logo'}
                                    width={180}
                                    height={48}
                                    loading="lazy"
                                    decoding="async"
                                    className="h-12 w-auto max-h-12 object-contain"
                                />
                            ) : (
                                <span
                                    className="text-2xl font-extrabold tracking-tight text-gray-900"
                                    style={{ fontFamily: 'var(--tipografia-titulos)' }}
                                >
                                    {site?.nombre || 'Tortas'}
                                </span>
                            )}
                        </div>
                        {mensajeFooter && (
                            <p className="text-sm text-gray-600 leading-relaxed max-w-sm">
                                {mensajeFooter}
                            </p>
                        )}
                    </div>

                    {/* COLUMNA 2: NAVEGACIÓN RÁPIDA */}
                    <div className="space-y-4">
                        <h4
                            className="text-lg font-bold text-gray-900 uppercase tracking-wider text-xs"
                            style={{ fontFamily: 'var(--tipografia-titulos)', color: 'var(--color-primario)' }}
                        >
                            Navegación
                        </h4>
                        <ul className="space-y-2 text-sm">
                            {secciones && secciones.length > 0 ? (
                                secciones.map((seccion) => {
                                    const slugLower = seccion.slug?.toLowerCase() || '';
                                    const anchorId = slugLower === 'contactos' ? 'contacto' : slugLower;
                                    const hasStandalonePage = PAGE_SECTIONS.includes(slugLower);

                                    if (hasStandalonePage) {
                                        return (
                                            <li key={seccion.slug}>
                                                <Link
                                                    href={dominio === 'plantillas' ? `/plantillas/${siteSlug}/${seccion.slug}` : `/${dominio}/${seccion.slug}`}
                                                    className="transition-colors hover:text-[var(--color-primario)] font-medium text-gray-700 hover:underline"
                                                >
                                                    {seccion.nombre}
                                                </Link>
                                            </li>
                                        );
                                    }

                                    const anchorHref = isInicioPage
                                        ? `#${anchorId}`
                                        : (dominio === 'plantillas' ? `/plantillas/${siteSlug}/${mainPageSlug}#${anchorId}` : `/${dominio}/${mainPageSlug}#${anchorId}`);

                                    return (
                                        <li key={seccion.slug}>
                                            <a
                                                href={anchorHref}
                                                className="transition-colors hover:text-[var(--color-primario)] font-medium text-gray-700 hover:underline"
                                            >
                                                {seccion.nombre}
                                            </a>
                                        </li>
                                    );
                                })
                            ) : (
                                <>
                                    <li>
                                        <a href="#inicio" className="hover:text-[var(--color-primario)]">Inicio</a>
                                    </li>
                                    <li>
                                        <a href="#productos" className="hover:text-[var(--color-primario)]">Productos</a>
                                    </li>
                                    <li>
                                        <a href="#contacto" className="hover:text-[var(--color-primario)]">Contacto</a>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* COLUMNA 3: CONTACTO Y REDES */}
                    <div className="space-y-4">
                        <h4
                            className="text-lg font-bold uppercase tracking-wider text-xs"
                            style={{ fontFamily: 'var(--tipografia-titulos)', color: 'var(--color-primario)' }}
                        >
                            Contacto
                        </h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3 text-gray-600">
                                <DynamicIcon name="FaLocationDot" className="h-5 w-5 shrink-0 text-rose-500 mt-0.5" />
                                <span>{direccion}</span>
                            </div>

                            {phoneNavTexto && (
                                <div className="flex items-center gap-3 text-gray-600">
                                    <DynamicIcon name="FaPhone" className="h-4 w-4 shrink-0 text-gray-400" />
                                    <span>{phoneNavTexto}</span>
                                </div>
                            )}

                            {emailNavTexto && (
                                <div className="flex items-center gap-3 text-gray-600">
                                    <DynamicIcon name="FaEnvelope" className="h-4 w-4 shrink-0 text-gray-400" />
                                    <span>{emailNavTexto}</span>
                                </div>
                            )}

                            <a
                                href={whatsappNum}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 font-semibold text-emerald-600 hover:text-emerald-700 transition"
                            >
                                <DynamicIcon name="FaWhatsapp" className="h-5 w-5" />
                                <span>{waNavTexto ? `WhatsApp: ${waNavTexto}` : 'Atención por WhatsApp'}</span>
                            </a>

                            {/* Redes sociales */}
                            {Array.isArray(redes) && redes.length > 0 && (
                                <div className="pt-2 flex items-center gap-3">
                                    {redes.map((red, idx) => (
                                        <a
                                            key={idx}
                                            href={red.url || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 transition hover:bg-[var(--color-primario)] hover:text-white hover:border-transparent shadow-xs"
                                            title={red.nombre || 'Red social'}
                                        >
                                            <DynamicIcon name={red.icono || 'FaShareNodes'} className="h-4 w-4" />
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* BARRA INFERIOR / COPYRIGHT */}
                <div className="mt-12 border-t border-gray-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} <span className="font-semibold text-gray-700">{site?.nombre}</span>. Todos los derechos reservados.</p>
                    <p className="flex items-center gap-1">
                        <span>Creado con</span>
                        <span className="font-bold text-gray-800">CCapa</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
