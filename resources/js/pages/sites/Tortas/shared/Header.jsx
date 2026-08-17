import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import DynamicIcon from '@/components/DynamicIcon';
import { fetchSectionData } from './apiBase';

export default function Header({ site, dominio, siteSlug, secciones, seccionActiva }) {
    const [navData, setNavData] = useState(null);

    useEffect(() => {
        if (dominio && siteSlug) {
            fetchSectionData(dominio, siteSlug, 'nav')
                .then((res) => setNavData(res.seccionActiva))
                .catch(() => setNavData(null));
        }
    }, [dominio, siteSlug]);

    const logoNav = navData?.contenido?.find((c) => c.label === 'logo_nav')?.valor;
    const accionesNav = navData?.contenido?.find((c) => c.label === 'accion_nav')?.valor || [];

    return (
        <header
            suppressHydrationWarning
            className="sticky top-0 z-50 border-b border-white/10"
            style={{
                backgroundColor: 'var(--color-secundario)',
                color: '#fff',
            }}
        >
            {accionesNav.length > 0 && (
                <div suppressHydrationWarning className="border-b border-white/10 bg-black/20 px-6 py-1.5 text-xs">
                    <div suppressHydrationWarning className="mx-auto flex max-w-6xl items-center justify-between">
                        <div suppressHydrationWarning className="flex items-center gap-4">
                            {accionesNav.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-1.5">
                                    {item.icon && <DynamicIcon name={item.icon} className="h-3.5 w-3.5" />}
                                    <span>{item.texto}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div suppressHydrationWarning className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
                <Link
                    href={`/${dominio}/${siteSlug}/${secciones?.[0]?.slug || 'inicio'}`}
                    className="flex items-center gap-3"
                >
                    {logoNav || site?.imagen ? (
                        <img
                            src={logoNav || site?.imagen}
                            alt={site?.nombre || ''}
                            className="h-9 w-auto max-h-9 object-contain"
                        />
                    ) : (
                        <span className="text-lg font-bold tracking-tight">{site?.nombre}</span>
                    )}
                </Link>

                <nav className="flex flex-wrap items-center gap-1">
                    {secciones?.map((seccion) => {
                        const activa = seccion.slug?.toLowerCase() === seccionActiva?.slug?.toLowerCase();

                        return (
                            <Link
                                key={seccion.slug}
                                href={`/${dominio}/${siteSlug}/${seccion.slug}`}
                                className="rounded-lg px-3 py-1.5 text-sm font-semibold transition"
                                style={
                                    activa
                                        ? {
                                              backgroundColor: 'var(--color-primario)',
                                              color: '#fff',
                                          }
                                        : {
                                              color: 'rgba(255,255,255,0.85)',
                                          }
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
