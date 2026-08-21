import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import DynamicIcon from '@/components/DynamicIcon';
import { fetchSectionData } from './apiBase';
import { useCartStore } from '@/stores/useCartStore';
import CartOffcanvas from '@/components/CartOffcanvas';

export default function Header({ site, dominio, siteSlug, secciones, seccionActiva, tieneTienda, productos }) {
    const [navData, setNavData] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);

    const openCart = useCartStore((state) => state.openCart);
    const cartCount = useCartStore((state) => state.getItemCount());

    const hasStore = Boolean(site?.tiene_tienda ?? tieneTienda ?? (productos && productos.length > 0) ?? true);

    // --- FETCH NAV DATA ---
    useEffect(() => {
        if (dominio && siteSlug) {
            fetchSectionData(dominio, siteSlug, 'nav')
                .then((res) => setNavData(res?.seccionActiva || res))
                .catch(() => setNavData(null));
        }
    }, [dominio, siteSlug]);

    // --- SCROLL DETECTION ---
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsScrolled(scrollY > 80);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // --- DATA EXTRACTION ---
    const logoNav = navData?.contenido?.find((c) => c.label === 'logo_nav')?.valor;
    const accionesNav = navData?.contenido?.find((c) => c.label === 'accion_nav')?.valor || [];

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
                <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-3 transition-all duration-300">
                    {/* LOGO */}
                    <Link
                        href={`/${dominio}/${siteSlug}/${secciones?.[0]?.slug || 'inicio'}`}
                        className="flex items-center gap-3"
                    >
                        {logoNav || site?.imagen ? (
                            <img
                                src={logoNav || site?.imagen}
                                alt={site?.nombre || ''}
                                width={180}
                                height={48}
                                decoding="async"
                                className="h-12 w-auto max-h-12 object-contain transition-all duration-300"
                            />
                        ) : (
                            <span className="text-lg font-bold tracking-tight text-gray-900">
                                {site?.nombre}
                            </span>
                        )}
                    </Link>

                    {/* NAV LINKS & CART */}
                    <div suppressHydrationWarning className="flex items-center gap-3">
                        <nav className="flex flex-wrap items-center gap-1">
                            {secciones?.map((seccion) => {
                                const slugLower = seccion.slug?.toLowerCase() || '';
                                const anchorId = slugLower === 'contactos' ? 'contacto' : slugLower;
                                const isInicioPage = !seccionActiva || seccionActiva.slug?.toLowerCase() === 'inicio';

                                // Páginas que tienen componente/archivo propio independiente
                                const PAGE_SECTIONS = ['inicio', 'productos'];
                                const hasStandalonePage = PAGE_SECTIONS.includes(slugLower);
                                const activa = slugLower === seccionActiva?.slug?.toLowerCase();

                                const linkClasses = `rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-300 ${linkHover} ${activa ? 'text-white' : 'text-gray-800 hover:text-white'}`;
                                const activeStyle = activa ? { backgroundColor: 'var(--color-primario)', color: '#fff' } : {};

                                if (hasStandalonePage) {
                                    return (
                                        <Link
                                            key={seccion.slug}
                                            href={`/${dominio}/${siteSlug}/${seccion.slug}`}
                                            className={linkClasses}
                                            style={activeStyle}
                                        >
                                            {seccion.nombre}
                                        </Link>
                                    );
                                }

                                // Si es una sección sin archivo propio (ej: Contacto), usa el ancla #contacto y scroll suave CSS
                                const mainPageSlug = secciones?.[0]?.slug || 'inicio';
                                const anchorHref = isInicioPage ? `#${anchorId}` : `/${dominio}/${siteSlug}/${mainPageSlug}#${anchorId}`;

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

                        {/* BOTÓN CARRITO SI TIENE TIENDA */}
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
            <CartOffcanvas />
        </>
    );
}