import { Head, Link } from '@inertiajs/react';

function etiqueta(label) {
    return label.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function BloqueContenido({ item, styles }) {
    if (
        item.valor == null ||
        item.valor === '' ||
        (Array.isArray(item.valor) && item.valor.length === 0)
    ) {
        return null;
    }

    if (
        item.enlace &&
        item.tipo !== 'imagen' &&
        item.tipo !== 'galeria' &&
        item.tipo !== 'color'
    ) {
        return (
            <a
                href={item.enlace}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: 'var(--color-primario)' }}
            >
                {item.valor}
                <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                </svg>
            </a>
        );
    }

    if (item.tipo === 'imagen') {
        return (
            <div>
                <img
                    src={item.valor}
                    alt={item.label}
                    className="w-full rounded-xl object-cover"
                    style={{ borderRadius: 'var(--radio-bordes)' }}
                />
            </div>
        );
    }

    if (item.tipo === 'galeria') {
        return (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {item.valor.map((src, i) => (
                    <img
                        key={src + i}
                        src={src}
                        alt={`${item.label} ${i + 1}`}
                        className="aspect-square w-full rounded-xl object-cover"
                        style={{ borderRadius: 'var(--radio-bordes)' }}
                    />
                ))}
            </div>
        );
    }

    if (item.tipo === 'color') {
        return (
            <div className="flex items-center gap-3">
                <span
                    className="h-9 w-9 rounded-full ring-1 ring-black/10"
                    style={{ backgroundColor: item.valor }}
                />
                <span className="font-medium text-gray-700">{item.valor}</span>
            </div>
        );
    }

    if (item.tipo === 'enlace') {
        return (
            <a
                href={item.valor}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: 'var(--color-primario)' }}
            >
                {etiqueta(item.label)}
                <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                </svg>
            </a>
        );
    }

    return (
        <div>
            {item.tipo === 'texto' ? (
                <p className="text-lg leading-8 text-gray-800">{item.valor}</p>
            ) : (
                <p className="text-lg leading-8 text-gray-600">{item.valor}</p>
            )}
        </div>
    );
}

function EtiquetaBloque({ item }) {
    return (
        <div
            className="mb-2 text-xs font-bold tracking-widest uppercase"
            style={{ color: 'var(--color-primario)' }}
        >
            {etiqueta(item.label)}
        </div>
    );
}

export default function Index({
    site,
    dominio,
    siteSlug,
    secciones,
    seccionActiva,
    estilos,
}) {
    const styles = {
        '--color-primario': estilos?.color_primario || '#f59e0b',
        '--color-secundario': estilos?.color_secundario || '#1f2937',
        '--tipografia-titulos': estilos?.tipografia_titulos || 'Inter',
        '--tipografia-texto': estilos?.tipografia_texto || 'Inter',
        '--radio-bordes': estilos?.radio_bordes || '1rem',
        '--espaciado': estilos?.espaciado || '1.5rem',
    };

    const primeraImagen = seccionActiva.contenido.find(
        (item) => item.tipo === 'imagen' && item.valor,
    )?.valor;

    const bloques = seccionActiva.contenido.filter(
        (item) => !(item.tipo === 'imagen' && item.valor === primeraImagen),
    );

    return (
        <>
            <Head title={`${site.nombre} — ${seccionActiva.nombre}`} />

            <div
                className="flex min-h-screen flex-col bg-white text-gray-900"
                style={{
                    ...styles,
                    fontFamily: `var(--tipografia-texto), ui-sans-serif, system-ui, sans-serif`,
                }}
            >
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

                <main className="flex-1">
                    {primeraImagen ? (
                        <section className="relative overflow-hidden">
                            <img
                                src={primeraImagen}
                                alt=""
                                className="h-[60vh] w-full object-cover"
                            />
                            <div
                                className="absolute inset-0 flex items-end"
                                style={{
                                    background:
                                        'linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0))',
                                }}
                            >
                                <div className="mx-auto w-full max-w-6xl px-6 pb-12">
                                    <h1
                                        className="max-w-3xl text-4xl leading-tight font-black text-white md:text-6xl"
                                        style={{
                                            fontFamily:
                                                'var(--tipografia-titulos), ui-sans-serif, system-ui, sans-serif',
                                        }}
                                    >
                                        {seccionActiva.nombre}
                                    </h1>
                                </div>
                            </div>
                        </section>
                    ) : (
                        <section
                            className="relative overflow-hidden"
                            style={{
                                backgroundColor: 'var(--color-primario)',
                            }}
                        >
                            <div
                                className="mx-auto w-full max-w-6xl px-6 py-24 text-white md:py-32"
                                style={{
                                    background:
                                        'radial-gradient(80rem 30rem at 80% -10%, rgba(255,255,255,0.25), transparent)',
                                }}
                            >
                                <h1
                                    className="max-w-3xl text-4xl leading-tight font-black md:text-6xl"
                                    style={{
                                        fontFamily:
                                            'var(--tipografia-titulos), ui-sans-serif, system-ui, sans-serif',
                                    }}
                                >
                                    {seccionActiva.nombre}
                                </h1>
                            </div>
                        </section>
                    )}

                    <div className="mx-auto w-full max-w-6xl px-6 py-16">
                        <div
                            className="grid gap-10"
                            style={{ gap: 'var(--espaciado)' }}
                        >
                            {bloques.map((item) => (
                                <div
                                    key={item.label}
                                    className="flex flex-col gap-3"
                                >
                                    {item.tipo === 'enlace' || item.enlace ? (
                                        <BloqueContenido
                                            item={item}
                                            styles={styles}
                                        />
                                    ) : (
                                        <>
                                            <EtiquetaBloque item={item} />
                                            <BloqueContenido
                                                item={item}
                                                styles={styles}
                                            />
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </main>

                <footer
                    className="border-t py-8 text-center text-sm"
                    style={{
                        color: 'var(--color-secundario)',
                        borderColor:
                            'color-mix(in srgb, var(--color-secundario) 15%, transparent)',
                    }}
                >
                    <span className="font-semibold">{site.nombre}</span>
                    <span className="mx-2 opacity-50">·</span>
                    <span className="opacity-60">
                        {dominio}/{siteSlug} — Creado con Ecomer
                    </span>
                </footer>
            </div>
        </>
    );
}
