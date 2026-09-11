import { useEffect, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import DynamicIcon from '@/components/DynamicIcon';
import { useCartStore } from '@/stores/useCartStore';
import CartOffcanvas from '@/components/CartOffcanvas';

export default function Header({ site, dominio, siteSlug, secciones, seccionActiva, tieneTienda, productos, seccionesData }) {
    const [isScrolled, setIsScrolled] = useState(false);

    // --- SCROLL DETECTION ---
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsScrolled(scrollY > 30);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const openCart = useCartStore((state) => state.openCart);
    const cartCount = useCartStore((state) => state.getItemCount());
    const hasStore = Boolean(site?.tiene_tienda ?? tieneTienda ?? (productos && productos.length > 0) ?? true);

    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    const handleSearchSubmit = (e) => {
        e?.preventDefault();
        const term = searchQuery.trim();
        if (!term) return;

        const targetUrl = dominio === 'plantillas'
            ? `/plantillas/${siteSlug}/productos?q=${encodeURIComponent(term)}`
            : (siteSlug ? `/${dominio}/${siteSlug}/productos?q=${encodeURIComponent(term)}` : `/${dominio}/productos?q=${encodeURIComponent(term)}`);

        router.visit(targetUrl);
        setMobileSearchOpen(false);
        setMobileMenuOpen(false);
    };

    // --- DATA EXTRACTION ---
    const activeNav =
        seccionesData?.nav ||
        seccionesData?.NAV ||
        seccionesData?.['nav'] ||
        Object.values(seccionesData || {}).find((s) => s?.slug?.toLowerCase() === 'nav');

    const getNavContent = (labelName) => {
        return activeNav?.contenido?.find(
            (c) => c.label?.toLowerCase() === labelName.toLowerCase()
        )?.valor;
    };

    const mensajeNav = getNavContent('mensaje');
    const accionesNav = getNavContent('accion') || getNavContent('acciones') || getNavContent('accion_nav') || [];
    const logoNav = getNavContent('logo') || getNavContent('logo_nav') || site?.imagen;

    // --- STYLES BASED ON SCROLL ---
    const activeSlug = (seccionActiva?.slug || '').toLowerCase();
    const activeNombre = (seccionActiva?.nombre || '').toLowerCase();
    const isHeroPage =
        !seccionActiva ||
        activeSlug === 'inicio' ||
        activeSlug === 'hero' ||
        activeNombre === 'inicio' ||
        activeNombre === 'hero' ||
        activeSlug === '' ||
        Boolean(seccionesData?.hero || seccionesData?.inicio);
    const isTransparentMode = isHeroPage && !isScrolled;

    const headerBg = isTransparentMode
        ? 'bg-transparent border-transparent shadow-none'
        : 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200/60';

    return (
        <>
            <header
                suppressHydrationWarning
                className={`fixed top-0 z-50 w-full max-w-full transition-all duration-300 ${headerBg}`}
            >
                {/* 1. ARRIBA: EL AVISO CON EL FONDO GLOBAL */}
                {mensajeNav && (
                    <div
                        suppressHydrationWarning
                        className={`w-full text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide transition-all duration-300 ${
                            isTransparentMode ? 'bg-[var(--color-primario)]/90 backdrop-blur-xs border-b border-white/10' : ''
                        }`}
                        style={{
                            backgroundColor: isTransparentMode ? undefined : 'var(--color-primario)',
                            fontFamily: 'var(--tipografia-texto)',
                        }}
                    >
                        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-white/20 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-xs">
                                Aviso
                            </span>
                            <span className="text-[11px] sm:text-xs font-semibold">{mensajeNav}</span>
                        </div>
                    </div>
                )}

                {/* 2. ABAJO DEL AVISO: LOS ÍCONOS CON SU TEXTO */}
                {Array.isArray(accionesNav) && accionesNav.length > 0 && (
                    <div
                        suppressHydrationWarning
                        className={`w-full border-b text-xs py-1.5 px-4 transition-all duration-300 ${
                            isTransparentMode
                                ? 'border-white/10 bg-transparent text-white/90'
                                : 'border-gray-200/60 bg-white/95 backdrop-blur-md text-gray-700'
                        }`}
                        style={{
                            fontFamily: 'var(--tipografia-texto)',
                        }}
                    >
                        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center sm:justify-end gap-x-4 sm:gap-x-6 gap-y-1">
                            {accionesNav.map((item, idx) => {
                                const iconName = item.icono || item.icon;
                                const textVal = item.texto || '';
                                const isLink = textVal.includes('.com') || textVal.startsWith('http');
                                const isPhone = iconName === 'FaWhatsapp' || iconName === 'FaPhone';
                                const cleanDigits = textVal.replace(/\D/g, '');
                                const href = isLink
                                    ? (textVal.startsWith('http') ? textVal : `https://${textVal}`)
                                    : (isPhone ? (iconName === 'FaWhatsapp' ? `https://wa.me/${cleanDigits}` : `tel:${cleanDigits}`) : null);

                                const content = (
                                    <div className={`group flex items-center gap-1.5 transition-colors ${
                                        isTransparentMode
                                            ? 'text-white/90 hover:text-white'
                                            : 'text-gray-700 hover:text-gray-900'
                                    }`}>
                                        {iconName && (
                                            <DynamicIcon
                                                name={iconName}
                                                className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:scale-110"
                                                style={{
                                                    color: isTransparentMode ? '#ffffff' : 'var(--color-primario)',
                                                }}
                                            />
                                        )}
                                        <span className="text-[11px] sm:text-xs font-medium group-hover:underline underline-offset-2">
                                            {textVal}
                                        </span>
                                    </div>
                                );

                                return href ? (
                                    <a
                                        key={idx}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="cursor-pointer"
                                    >
                                        {content}
                                    </a>
                                ) : (
                                    <div key={idx}>
                                        {content}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 3. ABAJO: EL MENÚ A LA IZQUIERDA, LOGO AL MEDIO, BUSCADOR Y CARRITO A LA DERECHA */}
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 transition-all duration-300">
                    {/* 3.1. IZQUIERDA: MENÚ DE NAVEGACIÓN */}
                    <div className="flex flex-1 items-center justify-start">
                        {/* Botón Hamburguesa Móvil */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`md:hidden p-2 rounded-xl transition cursor-pointer ${
                                isTransparentMode
                                    ? 'text-white hover:bg-white/20'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                            title={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                        >
                            {mobileMenuOpen ? (
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>

                        {/* Enlaces Desktop */}
                        <nav className="hidden md:flex flex-wrap items-center gap-1">
                            {secciones?.map((seccion) => {
                                const slugLower = seccion.slug?.toLowerCase() || '';
                                const anchorId = slugLower === 'contactos' ? 'contacto' : slugLower;
                                const isInicioPage = !seccionActiva || seccionActiva.slug?.toLowerCase() === 'inicio';

                                const PAGE_SECTIONS = ['inicio', 'productos', 'servicios'];
                                const hasStandalonePage = PAGE_SECTIONS.includes(slugLower);
                                const activa = slugLower === seccionActiva?.slug?.toLowerCase();

                                const linkClasses = `rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-300 ${
                                    activa
                                        ? 'text-white shadow-xs'
                                        : isTransparentMode
                                            ? 'text-white/90 hover:text-white hover:bg-white/20'
                                            : 'text-gray-800 hover:text-white hover:bg-[var(--color-primario)]/60'
                                }`;
                                const activeStyle = activa ? { backgroundColor: 'var(--color-primario)', color: '#fff' } : {};

                                if (hasStandalonePage) {
                                    return (
                                        <Link
                                            key={seccion.slug}
                                            href={dominio === 'plantillas' ? `/plantillas/${siteSlug}/${seccion.slug}` : (siteSlug ? `/${dominio}/${siteSlug}/${seccion.slug}` : `/${dominio}/${seccion.slug}`)}
                                            className={linkClasses}
                                            style={activeStyle}
                                        >
                                            {seccion.nombre}
                                        </Link>
                                    );
                                }

                                const mainPageSlug = secciones?.[0]?.slug || 'inicio';
                                const anchorHref = isInicioPage
                                    ? `#${anchorId}`
                                    : (dominio === 'plantillas' ? `/plantillas/${siteSlug}/${mainPageSlug}#${anchorId}` : (siteSlug ? `/${dominio}/${siteSlug}/${mainPageSlug}#${anchorId}` : `/${dominio}/${mainPageSlug}#${anchorId}`));

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

                    {/* 3.2. AL MEDIO: EL LOGO */}
                    <div className="flex shrink-0 items-center justify-center">
                        <Link
                            href={dominio === 'plantillas' ? `/plantillas/${siteSlug}/${secciones?.[0]?.slug || 'inicio'}` : (siteSlug ? `/${dominio}/${siteSlug}/${secciones?.[0]?.slug || 'inicio'}` : `/${dominio}/${secciones?.[0]?.slug || 'inicio'}`)}
                            className="flex items-center justify-center transition-transform hover:scale-102"
                        >
                            {logoNav || site?.imagen ? (
                                <img
                                    src={logoNav || site?.imagen}
                                    alt={site?.nombre || ''}
                                    width={180}
                                    height={48}
                                    decoding="async"
                                    className="h-10 sm:h-12 w-auto max-h-12 object-contain transition-all duration-300"
                                />
                            ) : (
                                <span className={`text-xl font-extrabold tracking-tight transition-colors duration-300 ${
                                    isTransparentMode ? 'text-white drop-shadow-sm' : 'text-gray-900'
                                }`}>
                                    {site?.nombre}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* 3.3. A LA DERECHA: BUSCADOR Y CARRITO */}
                    <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
                        {/* Buscador Desktop */}
                        <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-36 lg:w-52 rounded-full py-1.5 pl-8 pr-3 text-xs outline-none transition duration-300 ${
                                    isTransparentMode
                                        ? 'border border-white/30 bg-white/20 backdrop-blur-md text-white placeholder-white/70 focus:border-white focus:bg-white/30 focus:ring-2 focus:ring-white/20'
                                        : 'border border-gray-300/80 bg-white/90 text-gray-900 placeholder-gray-400 focus:border-[var(--color-primario)] focus:ring-2 focus:ring-[var(--color-primario)]/20 shadow-2xs'
                                }`}
                            />
                            <button
                                type="submit"
                                className={`absolute left-2.5 top-1/2 -translate-y-1/2 transition cursor-pointer ${
                                    isTransparentMode ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-[var(--color-primario)]'
                                }`}
                                title="Buscar"
                            >
                                <DynamicIcon name="FaMagnifyingGlass" className="h-3.5 w-3.5" />
                            </button>
                        </form>

                        {/* Botón Lupa Móvil */}
                        <button
                            type="button"
                            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                            className={`md:hidden p-2 rounded-xl transition cursor-pointer ${
                                isTransparentMode
                                    ? 'text-white hover:bg-white/20'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                            title="Buscar productos"
                        >
                            <DynamicIcon name="FaMagnifyingGlass" className="h-4 w-4" />
                        </button>

                        {/* Botón Carrito */}
                        {hasStore && (
                            <button
                                type="button"
                                onClick={openCart}
                                className={`relative flex items-center justify-center rounded-xl p-2 transition cursor-pointer ${
                                    isTransparentMode
                                        ? 'border border-white/30 bg-white/20 backdrop-blur-md text-white hover:bg-white/30 shadow-sm'
                                        : 'border border-gray-200/80 bg-white/90 text-gray-800 hover:bg-gray-100 hover:text-black shadow-2xs'
                                }`}
                                title="Ver Carrito de Compras"
                            >
                                <DynamicIcon
                                    name="FaCartShopping"
                                    className={`h-5 w-5 transition-colors ${
                                        isTransparentMode ? 'text-white' : 'text-[var(--color-primario)]'
                                    }`}
                                />
                                {cartCount > 0 && (
                                    <span
                                        className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-md animate-scale"
                                        style={{ backgroundColor: 'var(--color-primario)' }}
                                    >
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* PANEL DESPLEGABLE DE BÚSQUEDA MÓVIL */}
                {mobileSearchOpen && (
                    <div className={`md:hidden border-t px-4 py-2.5 transition-all duration-300 ${
                        isTransparentMode
                            ? 'border-white/10 bg-transparent text-white'
                            : 'border-gray-200/50 bg-white/95 shadow-sm text-gray-900'
                    }`}>
                        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                            <input
                                type="text"
                                autoFocus
                                placeholder="Buscar productos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full rounded-xl py-2 pl-9 pr-10 text-xs outline-none transition ${
                                    isTransparentMode
                                        ? 'border border-white/30 bg-white/20 text-white placeholder-white/70 focus:border-white focus:bg-white/30'
                                        : 'border border-gray-300 bg-gray-50/80 text-gray-900 placeholder-gray-400 focus:border-[var(--color-primario)] focus:bg-white'
                                }`}
                            />
                            <button
                                type="submit"
                                className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                                    isTransparentMode ? 'text-white/80' : 'text-gray-400'
                                }`}
                            >
                                <DynamicIcon name="FaMagnifyingGlass" className="h-4 w-4" />
                            </button>
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${
                                        isTransparentMode ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    ✕
                                </button>
                            )}
                        </form>
                    </div>
                )}

                {/* MENÚ MÓVIL DESPLEGABLE */}
                {mobileMenuOpen && (
                    <nav className={`md:hidden border-t px-6 py-3 space-y-1 transition-all duration-300 ${
                        isTransparentMode
                            ? 'border-white/10 bg-transparent text-white'
                            : 'border-gray-200/60 bg-white/98 shadow-lg text-gray-800'
                    }`}>
                        {secciones?.map((seccion) => {
                            const slugLower = seccion.slug?.toLowerCase() || '';
                            const anchorId = slugLower === 'contactos' ? 'contacto' : slugLower;
                            const isInicioPage = !seccionActiva || seccionActiva.slug?.toLowerCase() === 'inicio';

                            const PAGE_SECTIONS = ['inicio', 'productos', 'servicios'];
                            const hasStandalonePage = PAGE_SECTIONS.includes(slugLower);
                            const activa = slugLower === seccionActiva?.slug?.toLowerCase();

                            const linkClasses = `block rounded-lg px-3 py-2 text-sm font-semibold transition ${
                                activa
                                    ? 'text-white'
                                    : isTransparentMode
                                        ? 'text-white hover:bg-white/20'
                                        : 'text-gray-800 hover:bg-gray-100'
                            }`;
                            const activeStyle = activa ? { backgroundColor: 'var(--color-primario)', color: '#fff' } : {};

                            if (hasStandalonePage) {
                                return (
                                    <Link
                                        key={seccion.slug}
                                        href={dominio === 'plantillas' ? `/plantillas/${siteSlug}/${seccion.slug}` : (siteSlug ? `/${dominio}/${siteSlug}/${seccion.slug}` : `/${dominio}/${seccion.slug}`)}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={linkClasses}
                                        style={activeStyle}
                                    >
                                        {seccion.nombre}
                                    </Link>
                                );
                            }

                            const mainPageSlug = secciones?.[0]?.slug || 'inicio';
                            const anchorHref = isInicioPage
                                ? `#${anchorId}`
                                : (dominio === 'plantillas' ? `/plantillas/${siteSlug}/${mainPageSlug}#${anchorId}` : (siteSlug ? `/${dominio}/${siteSlug}/${mainPageSlug}#${anchorId}` : `/${dominio}/${mainPageSlug}#${anchorId}`));

                            return (
                                <a
                                    key={seccion.slug}
                                    href={anchorHref}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={linkClasses}
                                    style={activeStyle}
                                >
                                    {seccion.nombre}
                                </a>
                            );
                        })}
                    </nav>
                )}
            </header>

            {/* OFFCANVAS DRAWER DEL CARRITO */}
            <CartOffcanvas />
        </>
    );
}