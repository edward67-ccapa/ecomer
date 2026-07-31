import { Link } from '@inertiajs/react';
import { BloqueContenido, EtiquetaBloque } from '../shared/components';

export default function Header({ site, dominio, siteSlug, secciones, seccionActiva }) {
    return (
        <header
            className="sticky top-0 z-50 border-b border-white/10"
            style={{
                backgroundColor: 'var(--color-secundario)',
                color: '#fff',
            }}
        >
            <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
                <Link
                    href={`/${dominio}/${siteSlug}/${secciones[0].slug}`}
                    className="flex items-center gap-3"
                >
                    {site.imagen && (
                        <img
                            src={site.imagen}
                            alt=""
                            className="h-9 w-9 rounded-full object-cover"
                        />
                    )}
                    <span className="text-lg font-bold tracking-tight">
                        {site.nombre}
                    </span>
                </Link>

                <nav className="flex flex-wrap items-center gap-1">
                    {secciones.map((seccion) => {
                        const activa =
                            seccion.slug === seccionActiva.slug;

                        return (
                            <Link
                                key={seccion.slug}
                                href={`/${dominio}/${siteSlug}/${seccion.slug}`}
                                className="rounded-lg px-3 py-1.5 text-sm font-semibold transition"
                                style={
                                    activa
                                        ? {
                                              backgroundColor:
                                                  'var(--color-primario)',
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
