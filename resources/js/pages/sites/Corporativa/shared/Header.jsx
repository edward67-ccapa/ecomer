import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Header({
    site,
    dominio,
    siteSlug,
    secciones,
    seccionActiva,
    estilos,
}) {
    const { url: currentUrl } = usePage();
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

    return (
        <header
            className="sticky top-0 z-50 border-b border-gray-100/10 backdrop-blur-md"
            style={{
                backgroundColor: 'var(--color-secundario)',
                color: '#ffffff',
            }}
        >
            <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
                <Link
                    href={`/${dominio}/${siteSlug}/${secciones[0]?.slug ?? ''}`}
                    className="flex items-center gap-3 transition-opacity hover:opacity-90"
                >
                    {site.imagen && (
                        <img
                            src={site.imagen}
                            alt={site.nombre}
                            className="h-10 w-10 rounded-lg object-cover ring-2 ring-white/20"
                        />
                    )}
                    <span
                        className="text-xl font-black tracking-tight"
                        style={{ fontFamily: 'var(--tipografia-titulos)' }}
                    >
                        {site.nombre}
                    </span>
                </Link>

                <nav className="flex flex-wrap items-center gap-2">
                    {secciones.map((seccion) => {
                        const slugLower = seccion.slug?.toLowerCase() || '';
                        const isProductos = slugLower === 'productos';
                        const activa = seccion.slug === seccionActiva?.slug && !isCatalogoUrlActive;

                        return (
                            <React.Fragment key={seccion.slug}>
                                <Link
                                    href={`/${dominio}/${siteSlug}/${seccion.slug}`}
                                    className="rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200"
                                    style={
                                        activa
                                            ? {
                                                  backgroundColor: 'var(--color-primario)',
                                                  color: '#ffffff',
                                                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                              }
                                            : {
                                                  color: 'rgba(255, 255, 255, 0.8)',
                                              }
                                    }
                                >
                                    {seccion.nombre}
                                </Link>

                                {isProductos && isCatalogoActivo && (
                                    catalogoEnlace ? (
                                        <a
                                            href={catalogoEnlace}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200"
                                            style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                                        >
                                            {catalogoTitulo} ↗
                                        </a>
                                    ) : (
                                        <Link
                                            href={catalogoUrl}
                                            className="rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200"
                                            style={
                                                isCatalogoUrlActive
                                                    ? {
                                                          backgroundColor: 'var(--color-primario)',
                                                          color: '#ffffff',
                                                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                      }
                                                    : {
                                                          color: 'rgba(255, 255, 255, 0.8)',
                                                      }
                                            }
                                        >
                                            {catalogoTitulo}
                                        </Link>
                                    )
                                )}
                            </React.Fragment>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}
