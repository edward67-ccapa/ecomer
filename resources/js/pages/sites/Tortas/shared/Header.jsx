import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import DynamicIcon from '@/components/DynamicIcon';
import { fetchSectionData } from './apiBase';

export default function Header({ site, dominio, siteSlug, secciones, seccionActiva }) {
    const [navData, setNavData] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);

    // --- FETCH NAV DATA ---
    useEffect(() => {
        if (dominio && siteSlug) {
            fetchSectionData(dominio, siteSlug, 'nav')
                .then((res) => setNavData(res.seccionActiva))
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
        : 'border-white/10';

    const linkHover = isScrolled
        ? 'hover:bg-gray-100'
        : 'hover:bg-white/10';

    // Color de texto según scroll
    const textColor = isScrolled ? 'text-gray-800' : 'text-white';
    const textMuted = isScrolled ? 'text-gray-600' : 'text-white/80';

    return (
        <header
            suppressHydrationWarning
            className={`fixed top-0 z-50 w-screen transition-all duration-300 ${headerBg} border-b ${borderColor}`}
            style={{
                color: textColor,
                backgroundColor: isScrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
            }}
        >
            {/* TOP BAR (acciones) */}
            {accionesNav.length > 0 && (
                <div
                    suppressHydrationWarning
                    className={`border-b ${borderColor} px-6 py-1.5 text-xs transition-all duration-300 ${isScrolled ? 'bg-gray-50/80' : 'bg-black/10'
                        }`}
                >
                    <div className="mx-auto flex max-w-6xl items-center justify-between">
                        <div className="flex items-center gap-4">
                            {accionesNav.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-center gap-1.5 transition-colors ${textMuted}`}
                                >
                                    {item.icon && (
                                        <DynamicIcon
                                            name={item.icon}
                                            className={`h-3.5 w-3.5 ${isScrolled ? 'text-gray-500' : 'text-white/70'
                                                }`}
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
                            className="h-9 w-auto max-h-9 object-contain transition-all duration-300"
                            style={{
                                filter: isScrolled ? 'none' : 'brightness(0) invert(1)',
                            }}
                        />
                    ) : (
                        <span
                            className={`text-lg font-bold tracking-tight transition-colors ${isScrolled ? 'text-gray-800' : 'text-white'
                                }`}
                        >
                            {site?.nombre}
                        </span>
                    )}
                </Link>

                {/* NAV LINKS */}
                <nav className="flex flex-wrap items-center gap-1">
                    {secciones?.map((seccion) => {
                        const activa =
                            seccion.slug?.toLowerCase() === seccionActiva?.slug?.toLowerCase();

                        return (
                            <Link
                                key={seccion.slug}
                                href={`/${dominio}/${siteSlug}/${seccion.slug}`}
                                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-200 ${linkHover} ${activa
                                        ? 'text-white'
                                        : isScrolled
                                            ? 'text-gray-700 hover:text-gray-900'
                                            : 'text-white/85 hover:text-white'
                                    }`}
                                style={
                                    activa
                                        ? {
                                            backgroundColor: 'var(--color-primario)',
                                            color: '#fff',
                                        }
                                        : {}
                                }
                            >
                                {seccion.nombre}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}