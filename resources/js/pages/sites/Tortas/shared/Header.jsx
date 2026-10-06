import React, { Fragment, useEffect, useState, useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import DynamicIcon from '@/components/DynamicIcon';
import { useCartStore } from '@/stores/useCartStore';
import CartOffcanvas from '@/components/CartOffcanvas';

export default function Header({ site, dominio, siteSlug, secciones, seccionActiva, tieneTienda, productos, seccionesData, estilos }) {
    const { url: currentUrl } = usePage();
    const [isScrolled, setIsScrolled] = useState(false);

    // --- SCROLL DETECTION ---
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsScrolled(scrollY > 80);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const openCart = useCartStore((state) => state.openCart);
    const cartCount = useCartStore((state) => state.getItemCount());
    const hasStore = Boolean(site?.tiene_tienda ?? tieneTienda ?? (productos && productos.length > 0) ?? true);

    const catalogoConfig = estilos?.catalogo || {};
    const isCatalogoActivo = Boolean(catalogoConfig.activo);
    const catalogoTitulo = catalogoConfig.titulo || 'Catálogo';
    const catalogoEnlace = catalogoConfig.enlace ? String(catalogoConfig.enlace).trim() : null;
    const isCatalogoUrlActive = Boolean(currentUrl && currentUrl.includes('catalogo=1'));
    const catalogoUrl = catalogoEnlace
        ? catalogoEnlace
        : (dominio === 'plantillas'
            ? `/plantillas/${siteSlug}/productos?catalogo=1`
            : (siteSlug ? `/${dominio}/${siteSlug}/productos?catalogo=1` : `/${dominio}/productos?catalogo=1`));

    const navSecciones = useMemo(() => {
        let list = Array.isArray(secciones) ? [...secciones] : [];

        const prodOrden = estilos?.seccion_productos?.orden !== undefined && estilos?.seccion_productos?.orden !== ''
            ? Number(estilos.seccion_productos.orden)
            : 2;

        const hasProductosOrTienda = list.some((s) => {
            const slug = (s.slug || '').toLowerCase();
            return slug === 'productos' || slug === 'tienda' || slug === 'tiendas';
        });

        if (hasStore && !hasProductosOrTienda) {
            list.push({ slug: 'productos', nombre: 'Productos', orden: prodOrden });
        }

        const catOrden = estilos?.catalogo?.orden !== undefined && estilos?.catalogo?.orden !== ''
            ? Number(estilos.catalogo.orden)
            : 4;

        const hasCatalogoInList = list.some((s) => (s.slug || '').toLowerCase() === 'catalogo');

        if (isCatalogoActivo && !hasCatalogoInList) {
            list.push({ slug: 'catalogo', nombre: catalogoTitulo, isCatalogo: true, orden: catOrden });
        }

        list = list.map((s) => {
            const slug = (s.slug || '').toLowerCase();
            if (slug === 'productos' || slug === 'tienda' || slug === 'tiendas') {
                return { ...s, orden: estilos?.seccion_productos?.orden !== undefined && estilos?.seccion_productos?.orden !== '' ? Number(estilos.seccion_productos.orden) : (s.orden ?? 2) };
            }
            if (slug === 'servicios' || slug === 'servicio') {
                return { ...s, orden: estilos?.seccion_servicios?.orden !== undefined && estilos?.seccion_servicios?.orden !== '' ? Number(estilos.seccion_servicios.orden) : (s.orden ?? 3) };
            }
            if (slug === 'catalogo') {
                return { ...s, isCatalogo: true, orden: estilos?.catalogo?.orden !== undefined && estilos?.catalogo?.orden !== '' ? Number(estilos.catalogo.orden) : (s.orden ?? 4) };
            }
            return { ...s, orden: s.orden ?? 99 };
        });

        list.sort((a, b) => Number(a.orden ?? 99) - Number(b.orden ?? 99));

        return list;
    }, [secciones, hasStore, estilos, isCatalogoActivo, catalogoTitulo]);

    // --- DATA EXTRACTION ---
    const activeNav = seccionesData?.nav || seccionesData?.['nav'] || null;
    const rawCmsNavActions = activeNav?.contenido?.find((c) => c.label === 'accion_nav')?.valor || [];
    const cmsNavActions = Array.isArray(rawCmsNavActions) ? rawCmsNavActions : [];
    const globalActions = Array.isArray(estilos?.acciones_nav)
        ? estilos.acciones_nav
        : (Array.isArray(site?.estilos?.acciones_nav) ? site.estilos.acciones_nav : []);
    const combined = [...globalActions, ...cmsNavActions];
    const accionesNav = combined.filter((item, index, self) =>
        index === self.findIndex((t) => (t.texto || t.Texto) === (item.texto || item.Texto) && (t.icono || t.icon) === (item.icono || item.icon))
    );

    // --- STYLES BASED ON SCROLL ---
    const headerBg = isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg'
        : 'bg-transparent';

    const borderColor = isScrolled
        ? 'border-gray-200/50'
        : 'border-gray-200/30';

    const linkHover = 'hover:bg-[var(--color-primario)]/60 hover:text-[var(--color-primario)]';

    // Color de texto según scroll (siempre oscuro/negro)
    const textColor = 'text-gray-900';

    return (
        <>
            <header
                suppressHydrationWarning
                className={`fixed top-0 z-50 w-full max-w-full transition-all duration-300 ${headerBg} border-b ${borderColor}`}
                style={{
                    color: textColor,
                    backgroundColor: isScrolled ? 'rgba(255,255,255,0.65)' : 'transparent',
                }}
            >
                {/* TOP BAR (acciones) */}
                {accionesNav.length > 0 && (
                    <div
                        suppressHydrationWarning
                        className={`border-b ${borderColor} px-6 py-1.5 text-xs transition-all duration-300 bg-[var(--color-primario)]
                            }`}
                    >
                        <div className="mx-auto flex max-w-6xl items-center justify-between">
                            <div className="flex items-center gap-4">
                                {accionesNav.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-center font-semibold gap-1.5 transition-colors text-white`}
                                    >
                                        {item.icon && (
                                            <DynamicIcon
                                                name={item.icon}
                                                className="h-3.5 w-3.5"
                                            />
                                        )}
                                        <span>{item.texto}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* MAIN NAV */}
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-3 transition-all duration-300">
                    {/* IZQUIERDA: LOGO */}
                    <div className="flex flex-1 items-center justify-start">
                        <Link
                            href={dominio === 'plantillas' ? `/plantillas/${siteSlug}/${secciones?.[0]?.slug || 'inicio'}` : `/${dominio}/${secciones?.[0]?.slug || 'inicio'}`}
                            className="flex items-center gap-3"
                        >
                            {site?.imagen ? (
                                <img
                                    src={site?.imagen}
                                    alt={site?.nombre || ''}
                                    width={320}
                                    height={96}
                                    decoding="async"
                                    className="h-16 sm:h-24 md:h-28 lg:h-32 w-auto max-h-36 object-contain transition-all duration-300"
                                />
                            ) : (
                                <span className="text-lg font-bold tracking-tight text-gray-900">
                                    {site?.nombre}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* CENTRO: NAVEGACIÓN DESKTOP */}
                    <div className="flex shrink-0 items-center justify-center">
                        <nav className="flex flex-wrap items-center gap-1">
                            {navSecciones?.map((seccion) => {
                                const slugLower = seccion.slug?.toLowerCase() || '';
                                const anchorId = slugLower === 'contactos' ? 'contacto' : slugLower;
                                const isInicioPage = !seccionActiva || seccionActiva.slug?.toLowerCase() === 'inicio';

                                if (slugLower === 'catalogo' || seccion.isCatalogo) {
                                    if (!isCatalogoActivo) return null;
                                    return catalogoEnlace ? (
                                        <a
                                            key="catalogo"
                                            href={catalogoEnlace}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-300 text-gray-800 hover:text-white hover:bg-[var(--color-primario)]/60"
                                        >
                                            {catalogoTitulo} ↗
                                        </a>
                                    ) : (
                                        <Link
                                            key="catalogo"
                                            href={catalogoUrl}
                                            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-300 ${isCatalogoUrlActive ? 'text-white' : 'text-gray-800 hover:text-white'}`}
                                            style={isCatalogoUrlActive ? { backgroundColor: 'var(--color-primario)', color: '#fff' } : {}}
                                        >
                                            {catalogoTitulo}
                                        </Link>
                                    );
                                }

                                // Páginas que tienen componente/archivo propio independiente
                                const PAGE_SECTIONS = ['inicio', 'productos', 'servicios'];
                                const hasStandalonePage = PAGE_SECTIONS.includes(slugLower);
                                const activa = slugLower === seccionActiva?.slug?.toLowerCase();

                                const linkClasses = `rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-300 ${linkHover} ${activa ? 'text-white' : 'text-gray-800 hover:text-white'}`;
                                const activeStyle = activa ? { backgroundColor: 'var(--color-primario)', color: '#fff' } : {};

                                if (hasStandalonePage) {
                                    return (
                                        <Link
                                            key={seccion.slug}
                                            href={dominio === 'plantillas' ? `/plantillas/${siteSlug}/${seccion.slug}` : `/${dominio}/${seccion.slug}`}
                                            className={linkClasses}
                                            style={activeStyle}
                                        >
                                            {seccion.nombre}
                                        </Link>
                                    );
                                }

                                // Si es una sección sin archivo propio (ej: Contacto), usa el ancla #contacto y scroll suave CSS
                                const mainPageSlug = secciones?.[0]?.slug || 'inicio';
                                const anchorHref = isInicioPage
                                    ? `#${anchorId}`
                                    : (dominio === 'plantillas' ? `/plantillas/${siteSlug}/${mainPageSlug}#${anchorId}` : `/${dominio}/${mainPageSlug}#${anchorId}`);

                                return (
                                    <a
                                        key={seccion.slug}
                                        href={anchorHref}
                                        className={linkClasses}
                                        style={activeStyle}
                                    >
                                        {seccion.nombre}
                                    </a>
                                );
                            })}
                        </nav>
                    </div>

                    {/* DERECHA: BOTÓN CARRITO */}
                    <div className="flex flex-1 items-center justify-end">
                        {hasStore && (
                            <button
                                type="button"
                                onClick={openCart}
                                className="relative flex items-center justify-center rounded-xl border border-gray-200 bg-white/80 p-2 text-gray-800 shadow-xs hover:bg-gray-100 hover:text-black transition cursor-pointer"
                                title="Ver Carrito de Compras"
                            >
                                <DynamicIcon name="FaCartShopping" className="h-5 w-5 text-[var(--color-primario)]" />
                                {cartCount > 0 && (
                                    <span
                                        className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-md"
                                        style={{ backgroundColor: 'var(--color-primario)' }}
                                    >
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* OFFCANVAS DRAWER DEL CARRITO */}
            <CartOffcanvas site={site} estilos={estilos} seccionesData={seccionesData} />
        </>
    );
}