import React, { useMemo } from 'react';
import { Link } from '@inertiajs/react';
import DynamicIcon from '@/components/DynamicIcon';
import {
    FaTruckFast,
    FaRotateLeft,
    FaShieldHalved,
    FaHeadset,
    FaPhone,
    FaEnvelope,
    FaComments,
    FaGlobe,
    FaArrowRight,
    FaLocationDot,
    FaBook
} from 'react-icons/fa6';

export default function Footer({
    site,
    dominio,
    siteSlug,
    secciones = [],
    seccionActiva,
    seccionesData = {},
    estilos = {},
    productos = []
}) {
    // --- EXTRACCIÓN DE DATOS DE LAS SECCIONES Y CMS ---
    const activeNav = seccionesData?.nav || seccionesData?.['nav'] || seccionesData?.['NAV'] || null;
    const activeContacto = seccionesData?.contacto || seccionesData?.['contacto'] || seccionesData?.['Contacto'] || null;
    const activeMarcas = seccionesData?.marcas || seccionesData?.['marcas'] || seccionesData?.['Marcas'] || null;

    // Logo y mensaje
    const logoNav = activeNav?.contenido?.find((c) => c.label === 'logo_nav')?.valor;

    // Acciones y contactos desde NAV (CMS) y General (estilos.acciones_nav)
    const getNavContent = (labelName) => {
        return activeNav?.contenido?.find(
            (c) => (c.label || '').toLowerCase() === labelName.toLowerCase()
        )?.valor;
    };

    const rawCmsNavActions =
        getNavContent('accion') ||
        getNavContent('acciones') ||
        getNavContent('accion_nav') ||
        getNavContent('acciones_nav');

    let parsedCmsNav = rawCmsNavActions;
    if (typeof parsedCmsNav === 'string') {
        try {
            parsedCmsNav = JSON.parse(parsedCmsNav);
        } catch (e) {
            parsedCmsNav = [];
        }
    }
    const cmsNavActions = Array.isArray(parsedCmsNav)
        ? parsedCmsNav
        : (parsedCmsNav && typeof parsedCmsNav === 'object' ? Object.values(parsedCmsNav) : []);

    const globalActions = Array.isArray(estilos?.acciones_nav)
        ? estilos.acciones_nav
        : (Array.isArray(site?.estilos?.acciones_nav) ? site.estilos.acciones_nav : []);

    const combinedNavActions = [...globalActions, ...cmsNavActions];
    const accionesNav = combinedNavActions.filter((item, index, self) => {
        const itemTxt = item?.texto || item?.Texto || '';
        const itemIco = item?.icono || item?.icon || item?.Icono || '';
        if (!itemTxt && !itemIco) return false;
        return index === self.findIndex((t) =>
            (t?.texto || t?.Texto) === itemTxt && (t?.icono || t?.icon || t?.Icono) === itemIco
        );
    });

    const waAction = accionesNav.find((a) => (a.icon || a.icono)?.toLowerCase() === 'fawhatsapp');
    const waNavTexto = waAction?.texto || waAction?.Texto;

    const phoneAction = accionesNav.find((a) => (a.icon || a.icono)?.toLowerCase() === 'faphone');
    const phoneNavTexto = phoneAction?.texto || phoneAction?.Texto;

    const emailAction = accionesNav.find((a) => (a.icon || a.icono)?.toLowerCase() === 'faenvelope' || (a.icon || a.icono)?.toLowerCase() === 'fabriefcase');
    const emailNavTexto = emailAction?.texto || emailAction?.Texto;

    const clockAction = accionesNav.find((a) => ['faclock', 'facalendardays'].includes((a.icon || a.icono)?.toLowerCase()));
    const horarioTexto = clockAction?.texto || clockAction?.Texto;

    const storeAction = accionesNav.find((a) => ['fastore', 'falocationdot', 'famappin'].includes((a.icon || a.icono)?.toLowerCase()));
    const direccionNav = storeAction?.texto || storeAction?.Texto;

    // Contacto desde sección 'contacto'
    const rawContactoWa = activeContacto?.contenido?.find((c) => c.label === 'whatsap' || c.label === 'whatsapp')?.enlace
        || activeContacto?.contenido?.find((c) => c.label === 'whatsap' || c.label === 'whatsapp')?.valor?.[0]?.texto;

    // Dirección con prioridad absoluta desde estilos configurados en Admin (sin inventar datos)
    const direccion = estilos?.direccion
        || site?.estilos?.direccion
        || direccionNav
        || activeContacto?.contenido?.find((c) => c.label === 'direccion' || c.label === 'Direccion')?.valor?.[0]?.texto
        || null;

    // --- REDES SOCIALES (PRIORIDAD: ADMIN estilos.redes_sociales -> CMS/Acciones) ---
    const redesConfig = estilos?.redes_sociales || {};

    const formatSocialUrl = (val, prefix = '') => {
        if (!val) return null;
        const str = String(val).trim();
        if (!str) return null;
        if (str.startsWith('http://') || str.startsWith('https://')) return str;
        if (str.startsWith('@')) return `${prefix}${str.slice(1)}`;
        return `${prefix}${str}`;
    };

    const igAction = accionesNav.find((a) => (a.icon || a.icono)?.toLowerCase() === 'fainstagram')?.texto;
    const fbAction = accionesNav.find((a) => (a.icon || a.icono)?.toLowerCase() === 'fafacebook')?.texto;
    const ttAction = accionesNav.find((a) => (a.icon || a.icono)?.toLowerCase() === 'fatiktok')?.texto;
    const cmsRedes = activeContacto?.contenido?.find((c) => c.label === 'redes')?.valor || [];

    const fbVal = redesConfig.facebook || fbAction || cmsRedes.find((r) => r.icono?.toLowerCase()?.includes('face'))?.url;
    const igVal = redesConfig.instagram || igAction || cmsRedes.find((r) => r.icono?.toLowerCase()?.includes('insta'))?.url;
    const ttVal = redesConfig.tiktok || ttAction || cmsRedes.find((r) => r.icono?.toLowerCase()?.includes('tiktok'))?.url;
    const ytVal = redesConfig.youtube || cmsRedes.find((r) => r.icono?.toLowerCase()?.includes('youtube'))?.url;
    const twVal = redesConfig.twitter || cmsRedes.find((r) => r.icono?.toLowerCase()?.includes('twitter') || r.icono?.toLowerCase()?.includes('xtwitter'))?.url;
    const waCustom = redesConfig.whatsapp;

    const rawWa = waCustom || waNavTexto || rawContactoWa;
    const whatsappClean = rawWa ? String(rawWa).replace(/\D/g, '') : null;
    const whatsappNum = whatsappClean ? (whatsappClean.length === 9 ? `51${whatsappClean}` : whatsappClean) : null;
    const whatsappLink = whatsappNum ? `https://wa.me/${whatsappNum}?text=${encodeURIComponent('Hola! Quisiera más información sobre sus productos.')}` : null;

    const redesSociales = [
        {
            nombre: 'Facebook',
            icono: 'FaFacebook',
            url: formatSocialUrl(fbVal, 'https://facebook.com/'),
        },
        {
            nombre: 'X (Twitter)',
            icono: 'FaXTwitter',
            url: formatSocialUrl(twVal, 'https://x.com/'),
        },
        {
            nombre: 'Instagram',
            icono: 'FaInstagram',
            url: formatSocialUrl(igVal, 'https://instagram.com/'),
        },
        {
            nombre: 'TikTok',
            icono: 'FaTiktok',
            url: formatSocialUrl(ttVal, 'https://tiktok.com/@'),
        },
        {
            nombre: 'YouTube',
            icono: 'FaYoutube',
            url: formatSocialUrl(ytVal, 'https://youtube.com/'),
        },
    ].filter((r) => r.url !== null);

    const redesFinales = redesSociales;

    // --- MÉTODOS DE PAGO (PRIORIDAD: ADMIN estilos.metodos_pago) ---
    const metodosConfig = estilos?.metodos_pago;
    const metodosPermitidos = Array.isArray(metodosConfig) && metodosConfig.length > 0
        ? metodosConfig
        : ['amazon_pay', 'amex', 'apple_pay', 'diners', 'discover', 'google_pay', 'mastercard', 'paypal', 'shop_pay', 'visa', 'yape', 'plin'];

    const ALL_PAYMENT_BADGES = {
        amazon_pay: (
            <span key="amazon" className="h-5 px-2 bg-white rounded text-[10px] font-bold text-black flex items-center justify-center shadow-xs">
                a
            </span>
        ),
        amex: (
            <span key="amex" className="h-5 px-2 bg-[#006fcf] rounded text-[9px] font-bold text-white flex items-center justify-center shadow-xs">
                AMEX
            </span>
        ),
        apple_pay: (
            <span key="apple_pay" className="h-5 px-2 bg-white rounded text-[9px] font-bold text-black flex items-center justify-center shadow-xs">
                Pay
            </span>
        ),
        diners: (
            <span key="diners" className="h-5 px-2 bg-white rounded text-[9px] font-bold text-[#004a97] flex items-center justify-center shadow-xs">
                Diners
            </span>
        ),
        discover: (
            <span key="discover" className="h-5 px-2 bg-[#ff6000] rounded text-[8px] font-bold text-white flex items-center justify-center shadow-xs">
                DISCOVER
            </span>
        ),
        google_pay: (
            <span key="google_pay" className="h-5 px-2 bg-white rounded text-[9px] font-bold text-neutral-800 flex items-center justify-center shadow-xs">
                G Pay
            </span>
        ),
        mastercard: (
            <span key="mastercard" className="h-5 px-2 bg-[#1a1f2c] rounded text-[9px] font-bold text-white flex items-center gap-0.5 justify-center shadow-xs">
                <span className="h-2.5 w-2.5 rounded-full bg-[#eb001b] inline-block -mr-1"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-[#f79e1b] inline-block opacity-80"></span>
            </span>
        ),
        paypal: (
            <span key="paypal" className="h-5 px-2 bg-[#003087] rounded text-[9px] font-bold text-white flex items-center justify-center shadow-xs">
                PayPal
            </span>
        ),
        shop_pay: (
            <span key="shop_pay" className="h-5 px-2 bg-[#5a31f4] rounded text-[9px] font-bold text-white flex items-center justify-center shadow-xs">
                Shop
            </span>
        ),
        visa: (
            <span key="visa" className="h-5 px-2.5 bg-white rounded text-[10px] font-black italic text-[#1a1f71] flex items-center justify-center shadow-xs">
                VISA
            </span>
        ),
        yape: (
            <span key="yape" className="h-5 px-2 bg-[#742284] rounded text-[9px] font-bold text-white flex items-center justify-center shadow-xs">
                Yape
            </span>
        ),
        plin: (
            <span key="plin" className="h-5 px-2 bg-[#00d2c4] rounded text-[9px] font-bold text-white flex items-center justify-center shadow-xs">
                Plin
            </span>
        ),
        efectivo: (
            <span key="efectivo" className="h-5 px-2 bg-emerald-600 rounded text-[9px] font-bold text-white flex items-center justify-center shadow-xs">
                Contraentrega
            </span>
        ),
        transferencia: (
            <span key="transferencia" className="h-5 px-2 bg-neutral-700 rounded text-[9px] font-bold text-white flex items-center justify-center shadow-xs">
                Transferencia
            </span>
        ),
    };

    const renderedBadges = metodosPermitidos
        .map((key) => ALL_PAYMENT_BADGES[key])
        .filter(Boolean);

    // Marcas de la sección 'Marcas'
    const rawMarcas = activeMarcas?.contenido?.find((c) => c.label === 'Imagenes' || c.label === 'imagenes')?.valor;
    const marcasList = Array.isArray(rawMarcas)
        ? rawMarcas
        : (rawMarcas && typeof rawMarcas === 'object' ? Object.values(rawMarcas) : []);

    // Categorías únicas extraídas de los productos
    const categorias = useMemo(() => {
        if (!productos || !Array.isArray(productos) || productos.length === 0) {
            return ['Infantil', 'Especiales', 'Matrimonio Elegante', 'Eventos y Fiestas', 'Postres Finos'];
        }
        const set = new Set();
        productos.forEach((p) => {
            const catName = p.categoria?.nombre || (typeof p.categoria === 'string' ? p.categoria : null);
            if (catName) set.add(catName);
        });
        const arr = Array.from(set);
        return arr.length > 0 ? arr.slice(0, 7) : ['Infantil', 'Especiales', 'Matrimonio Elegante', 'Eventos y Fiestas', 'Postres Finos'];
    }, [productos]);

    // Configuración Catálogo PDF
    const catalogoConfig = estilos?.catalogo || {};
    const isCatalogoActivo = Boolean(catalogoConfig.activo);
    const catalogoTitulo = catalogoConfig.titulo || 'Catálogo Digital (PDF)';
    const catalogoEnlace = catalogoConfig.enlace ? String(catalogoConfig.enlace).trim() : null;
    const catalogoDownloadUrl = catalogoEnlace
        ? catalogoEnlace
        : (dominio === 'plantillas'
            ? `/plantillas/${siteSlug}/catalogo/descargar-pdf`
            : (siteSlug ? `/${dominio}/${siteSlug}/catalogo/descargar-pdf` : `/${dominio}/catalogo/descargar-pdf`));

    const siteName = site?.nombre || 'Store';
    const currentYear = new Date().getFullYear();

    // Enlaces de navegación con resolución de URL limpia y scroll a anclas
    const getSectionHref = (seccion) => {
        const slugLower = (seccion.slug || '').toLowerCase().trim();
        const anchorId = slugLower === 'contactos' ? 'contacto' : slugLower;
        const standaloneSlugs = ['inicio', 'productos', 'servicios', 'nosotros', 'contacto'];
        const isStandalone = standaloneSlugs.includes(slugLower);

        if (isStandalone) {
            return dominio === 'plantillas'
                ? `/plantillas/${siteSlug}/${seccion.slug}`
                : `/${dominio}/${seccion.slug}`;
        }

        const mainSlug = secciones?.[0]?.slug || 'inicio';
        const isHome = !seccionActiva || seccionActiva.slug?.toLowerCase() === 'inicio';
        if (isHome) {
            return `#${anchorId}`;
        }
        return dominio === 'plantillas'
            ? `/plantillas/${siteSlug}/${mainSlug}#${anchorId}`
            : `/${dominio}/${mainSlug}#${anchorId}`;
    };

    const handleSectionClick = (e, seccion) => {
        const slugLower = (seccion.slug || '').toLowerCase().trim();
        const anchorId = slugLower === 'contactos' ? 'contacto' : slugLower;
        const standaloneSlugs = ['inicio', 'productos', 'servicios', 'nosotros', 'contacto'];
        const isStandalone = standaloneSlugs.includes(slugLower);

        if (!isStandalone) {
            const el = typeof document !== 'undefined' ? document.getElementById(anchorId) : null;
            if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth' });
                window.history.pushState(null, '', `#${anchorId}`);
            }
        }
    };

    // Acciones de contacto para la barra superior junto a "Compra oficial"
    const getActionLink = (item) => {
        if (item.enlace || item.url || item.href) {
            return item.enlace || item.url || item.href;
        }
        const ico = (item.icono || item.icon || item.Icono || '').toLowerCase();
        const rawTxt = String(item.texto || item.Texto || '').trim();
        const firstLine = rawTxt.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)[0] || '';

        if (ico.includes('whatsapp') || firstLine.includes('wa.me')) {
            const cleanDigits = firstLine.replace(/\D/g, '');
            const waNum = cleanDigits.length === 9 ? `51${cleanDigits}` : cleanDigits;
            return waNum ? `https://wa.me/${waNum}?text=${encodeURIComponent('Hola! Quisiera realizar una consulta.')}` : null;
        }

        if (ico.includes('phone') || ico.includes('tel')) {
            const cleanDigits = firstLine.replace(/[^\d+]/g, '');
            return cleanDigits ? `tel:${cleanDigits}` : null;
        }

        if (ico.includes('envelope') || ico.includes('mail') || (firstLine.includes('@') && !firstLine.includes(' '))) {
            return `mailto:${firstLine}`;
        }

        if (ico.includes('location') || ico.includes('map') || ico.includes('store')) {
            return `https://maps.google.com/maps?q=${encodeURIComponent(firstLine)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        }

        return null;
    };

    const getActionInfo = (item) => {
        const iconName = item.icono || item.icon || item.Icono || 'FaComments';
        const label = item.Label || item.label || '';
        const rawText = String(item.texto || item.Texto || '').trim();
        const firstLine = rawText.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)[0] || rawText;

        return {
            icon: iconName,
            label,
            texto: firstLine,
            href: getActionLink(item),
        };
    };

    const displayActions = accionesNav
        .map(getActionInfo)
        .filter(Boolean);

    return (
        <footer className="w-full bg-[#050505] text-[#d4d4d8] font-sans antialiased border-t border-neutral-900 selection:bg-neutral-800 selection:text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

                {/* --- 1. BARRA SUPERIOR: VALOR Y BENEFICIOS BASADOS EN NAV / ACCIONES --- */}
                <div className="pb-10 border-b border-neutral-800/80">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-2 group cursor-pointer shrink-0">
                            <span className="text-lg md:text-xl font-bold tracking-tight text-white group-hover:text-neutral-200 transition-colors">
                                Compra oficial en {siteName}
                            </span>
                            <FaArrowRight className="h-4 w-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                        </div>

                        {displayActions.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center gap-4 sm:gap-6 text-xs text-neutral-300">
                                {displayActions.map((action, idx) => {
                                const itemBody = (
                                    <div className="flex items-center gap-2.5 group/item transition-colors hover:text-white">
                                        <DynamicIcon
                                            name={action.icon}
                                            className="h-4 w-4 text-white shrink-0 transition-transform group-hover/item:scale-110"
                                        />
                                        <div className="flex items-center gap-1.5 leading-tight">
                                            {action.label ? (
                                                <>
                                                    <span className="font-semibold text-white/90 whitespace-nowrap">
                                                        {action.label}:
                                                    </span>
                                                    <span className="font-medium text-neutral-300 group-hover/item:text-white transition-colors truncate max-w-[200px]">
                                                        {action.texto}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="font-medium text-neutral-300 group-hover/item:text-white transition-colors truncate max-w-[220px]">
                                                    {action.texto}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );

                                if (action.href) {
                                    return (
                                        <a
                                            key={idx}
                                            href={action.href}
                                            target={action.href.startsWith('http') ? '_blank' : '_self'}
                                            rel={action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                            className="focus:outline-none"
                                        >
                                            {itemBody}
                                        </a>
                                    );
                                }

                                return <div key={idx}>{itemBody}</div>;
                            })}
                        </div>
                        )}
                    </div>
                </div>

                {/* --- 2. CUERPO PRINCIPAL: 3 COLUMNAS LIMPIAS Y EN ESPAÑOL --- */}
                <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 border-b border-neutral-800/80 text-sm">

                    {/* COLUMNA 1: SOBRE NOSOTROS & UBICACIÓN */}
                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-sm tracking-wide">
                            Sobre {siteName}
                        </h4>
                        <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
                            Tu tienda de confianza con los mejores productos, calidad garantizada y atención directa para brindarte la mejor experiencia de compra.
                        </p>

                        {/* Dirección física configurada en Admin */}
                        {direccion && (
                            <div className="flex items-start gap-2.5 pt-2 text-xs text-neutral-300">
                                <FaLocationDot className="h-4 w-4 mt-0.5 text-neutral-400 shrink-0" />
                                <div>
                                    <span className="block font-semibold text-white">Nuestra Tienda:</span>
                                    <span className="text-neutral-400 leading-tight">{direccion}</span>
                                </div>
                            </div>
                        )}

                        {/* Catálogo PDF si está activo */}
                        {isCatalogoActivo && (
                            <div className="pt-2">
                                <a
                                    href={catalogoDownloadUrl}
                                    target={catalogoEnlace ? '_blank' : '_self'}
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-semibold text-white hover:bg-neutral-800 hover:border-neutral-700 transition"
                                >
                                    <span>{catalogoTitulo}</span>
                                    <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded font-mono">PDF</span>
                                </a>
                            </div>
                        )}
                    </div>

                    {/* COLUMNA 2: EXPLORAR (ENLACES DINÁMICOS Y FUNCIONALES) */}
                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-sm tracking-wide">
                            Explorar
                        </h4>
                        <ul className="space-y-2.5 text-xs text-neutral-400">
                            {secciones && secciones.length > 0 ? (
                                secciones.map((seccion) => {
                                    const href = getSectionHref(seccion);
                                    return (
                                        <li key={seccion.slug}>
                                            <a
                                                href={href}
                                                onClick={(e) => handleSectionClick(e, seccion)}
                                                className="hover:text-white transition-colors duration-150 block capitalize"
                                            >
                                                {seccion.nombre}
                                            </a>
                                        </li>
                                    );
                                })
                            ) : (
                                <>
                                    <li><a href="#inicio" className="hover:text-white transition-colors">Inicio</a></li>
                                    <li><a href="#productos" className="hover:text-white transition-colors">Catálogo de Productos</a></li>
                                    <li><a href="#contacto" className="hover:text-white transition-colors">Contacto</a></li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* COLUMNA 3: CONTACTO, REDES SOCIALES Y PAGOS */}
                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-sm tracking-wide">
                            Atención al Cliente
                        </h4>

                        <div className="space-y-3 text-xs text-neutral-400">
                            {/* Teléfono */}
                            {phoneNavTexto && (
                                <div className="flex items-start gap-2.5">
                                    <FaPhone className="h-3.5 w-3.5 mt-0.5 text-neutral-300 shrink-0" />
                                    <div>
                                        <a
                                            href={`tel:${phoneNavTexto.replace(/[^\d+]/g, '')}`}
                                            className="text-neutral-200 font-medium hover:text-white transition-colors"
                                        >
                                            {phoneNavTexto}
                                        </a>
                                        {horarioTexto && (
                                            <div className="text-neutral-500 text-[11px]">{horarioTexto}</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Email */}
                            {emailNavTexto && (
                                <div className="flex items-start gap-2.5">
                                    <FaEnvelope className="h-3.5 w-3.5 mt-0.5 text-neutral-300 shrink-0" />
                                    <div>
                                        <a
                                            href={`mailto:${emailNavTexto}`}
                                            className="text-neutral-200 hover:text-white transition-colors"
                                        >
                                            {emailNavTexto}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* WhatsApp Directo */}
                            {whatsappLink && (
                                <div className="flex items-start gap-2.5">
                                    <FaComments className="h-3.5 w-3.5 mt-0.5 text-white shrink-0" />
                                    <div>
                                        <a
                                            href={whatsappLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-neutral-200 hover:text-white font-medium transition-colors"
                                        >
                                            Chat directo por WhatsApp
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Redes Sociales en Círculos Oscuros */}
                        {redesFinales.length > 0 && (
                            <div className="pt-2">
                                <span className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                                    Síguenos en Redes
                                </span>
                                <div className="flex items-center gap-2">
                                    {redesFinales.map((red, idx) => (
                                        <a
                                            key={idx}
                                            href={red.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={red.nombre}
                                            className="h-8 w-8 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-white hover:text-black hover:border-white transition-all duration-200 flex items-center justify-center text-xs"
                                        >
                                            <DynamicIcon name={red.icono} className="h-3.5 w-3.5" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Métodos de Pago Dinámicos configurados en Admin */}
                        {renderedBadges.length > 0 && (
                            <div className="pt-2">
                                <span className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                                    Métodos de Pago Aceptados
                                </span>
                                <div className="flex flex-wrap items-center gap-1.5">
                                    {renderedBadges}
                                </div>
                            </div>
                        )}

                    </div>

                </div>

                {/* --- 3. BARRA INFERIOR DE COPYRIGHT Y POLÍTICAS EN ESPAÑOL --- */}
                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
                    <div>
                        © {currentYear} <span className="text-neutral-400 font-medium">{siteName}</span>. Todos los derechos reservados.
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs text-neutral-400">
                        <a href="#contacto" className="hover:text-white transition-colors">Política de Envíos</a>
                        <a href="#contacto" className="hover:text-white transition-colors">Políticas de Devolución</a>
                        <a href="#contacto" className="hover:text-white transition-colors">Política de Privacidad</a>
                        <a href="#contacto" className="hover:text-white transition-colors">Términos del Servicio</a>
                    </div>
                </div>

            </div>
        </footer>
    );
}
