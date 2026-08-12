import { Head } from '@inertiajs/react';

export default function Anuncio({
    site,
    dominio,
    siteSlug,
    secciones,
    seccionActiva,
    estilos,
}) {
    const styles = {
        '--color-primario': estilos?.color_primario || '#dc2626',
        '--color-secundario': estilos?.color_secundario || '#0f172a',
        '--tipografia-titulos': estilos?.tipografia_titulos || 'Inter',
        '--tipografia-texto': estilos?.tipografia_texto || 'Inter',
        '--radio-bordes': estilos?.radio_bordes || '0.75rem',
        '--espaciado': estilos?.espaciado || '1.25rem',
    };

    // Helper para buscar respuestas en la sección activa
    const getValor = (labelKey) => {
        const item = seccionActiva?.contenido?.find(
            (c) => c.label.toLowerCase() === labelKey.toLowerCase()
        );
        return item?.valor || null;
    };

    const getEnlace = (labelKey) => {
        const item = seccionActiva?.contenido?.find(
            (c) => c.label.toLowerCase() === labelKey.toLowerCase()
        );
        return item?.enlace || item?.valor || '#';
    };

    const avisoSuperior = getValor('aviso_superior') || '🔥 ¡OFERTA POR TIEMPO LIMITADO! - HASTA 50% DCTO 🔥';
    const tituloPrincipal = getValor('titulo_principal') || seccionActiva?.nombre || site.nombre;
    const subtitulo = getValor('subtitulo') || 'Aprovecha nuestra promoción exclusiva disponible por tiempo limitado con envío rápido y garantía total.';
    const portada = getValor('portada') || site.imagen;
    const precioOferta = getValor('precio_oferta');
    const precioNormal = getValor('precio_normal');
    const botonCta = getValor('boton_cta') || '¡COMPRAR AHORA CON DESCUENTO!';
    const enlaceCta = getEnlace('boton_cta') || getEnlace('whatsapp') || '#';
    const beneficios = getValor('beneficios');

    return (
        <>
            <Head title={`${site.nombre} — ${seccionActiva.nombre}`} />

            <div
                className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white"
                style={{
                    ...styles,
                    fontFamily: `var(--tipografia-texto), system-ui, sans-serif`,
                }}
            >
                {/* Banner de Urgencia */}
                <div
                    className="py-2.5 px-4 text-center font-bold text-xs sm:text-sm tracking-wide text-white uppercase shadow-md animate-pulse"
                    style={{ backgroundColor: 'var(--color-primario)' }}
                >
                    {avisoSuperior}
                </div>

                {/* Header Minimalista */}
                <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
                    <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {site.imagen && (
                                <img
                                    src={site.imagen}
                                    alt={site.nombre}
                                    className="h-9 w-9 rounded-full object-cover ring-2 ring-white/20"
                                />
                            )}
                            <span className="text-xl font-extrabold tracking-tight text-white">
                                {site.nombre}
                            </span>
                        </div>

                        {secciones?.length > 1 && (
                            <nav className="flex gap-2">
                                {secciones.map((sec) => (
                                    <a
                                        key={sec.slug}
                                        href={`/${dominio}/${siteSlug}/${sec.slug}`}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                            sec.slug === seccionActiva.slug
                                                ? 'bg-slate-800 text-white border border-slate-700'
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        {sec.nombre}
                                    </a>
                                ))}
                            </nav>
                        )}
                    </div>
                </header>

                {/* Main Hero Sales Section */}
                <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full grid lg:grid-cols-12 gap-10 items-center">
                    {/* Media / Image Column */}
                    <div className="lg:col-span-6 flex flex-col gap-4">
                        <div
                            className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl group"
                            style={{ borderRadius: 'var(--radio-bordes)' }}
                        >
                            {portada ? (
                                <img
                                    src={portada}
                                    alt={tituloPrincipal}
                                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div
                                    className="w-full aspect-square flex items-center justify-center p-8 text-center text-slate-500 font-medium"
                                    style={{ backgroundColor: 'var(--color-secundario)' }}
                                >
                                    <span>Imagen de la Promoción</span>
                                </div>
                            )}
                            <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-black uppercase px-3 py-1.5 rounded-full shadow-lg tracking-wider">
                                EDICIÓN LIMITADA
                            </div>
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="lg:col-span-6 flex flex-col justify-center gap-6">
                        <h1
                            className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white tracking-tight"
                            style={{ fontFamily: 'var(--tipografia-titulos), sans-serif' }}
                        >
                            {tituloPrincipal}
                        </h1>

                        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                            {subtitulo}
                        </p>

                        {/* Precios */}
                        {(precioOferta || precioNormal) && (
                            <div className="flex items-baseline gap-4 py-2 border-y border-slate-800">
                                {precioOferta && (
                                    <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400">
                                        {precioOferta}
                                    </span>
                                )}
                                {precioNormal && (
                                    <span className="text-lg text-slate-500 line-through">
                                        {precioNormal}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Botón CTA principal */}
                        <div className="pt-2">
                            <a
                                href={enlaceCta}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center py-4 px-8 rounded-xl font-black text-lg text-white shadow-xl hover:opacity-95 hover:scale-[1.02] active:scale-95 transition-all duration-200 uppercase tracking-wide"
                                style={{
                                    backgroundColor: 'var(--color-primario)',
                                    borderRadius: 'var(--radio-bordes)',
                                }}
                            >
                                {botonCta}
                            </a>
                            <p className="text-center text-xs text-slate-500 mt-2">
                                🔒 Compra rápida y 100% segura. Garantía de satisfacción.
                            </p>
                        </div>

                        {/* Beneficios si existen */}
                        {beneficios && (
                            <div className="mt-4 p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                                    Lo que incluye esta oferta:
                                </h3>
                                <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                                    {beneficios}
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {/* Footer Minimalista */}
                <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-500">
                    <p className="font-semibold text-slate-400">{site.nombre}</p>
                    <p className="mt-1">© {new Date().getFullYear()} — Todos los derechos reservados.</p>
                </footer>
            </div>
        </>
    );
}
