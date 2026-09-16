import { useMemo } from 'react';
import { Link } from '@inertiajs/react';

export default function CategoriaSection({
    productos = [],
    dominio,
    siteSlug,
    onSeleccionarCategoria,
}) {
    // Árbol jerárquico de Categorías -> Subcategorías para las tarjetas
    const categoriasArbol = useMemo(() => {
        const catMap = new Map();

        (productos || []).forEach((prod) => {
            const cat = typeof prod.categoria === 'object' ? prod.categoria?.nombre : prod.categoria;
            const sub = typeof prod.subcategoria === 'object' ? prod.subcategoria?.nombre : prod.subcategoria;

            if (!cat) return;

            if (!catMap.has(cat)) {
                catMap.set(cat, {
                    nombre: cat,
                    count: 0,
                    subcategoriasMap: new Map(),
                    imagen: prod.imagen || (Array.isArray(prod.imagenes) && prod.imagenes[0]) || null,
                });
            }

            const catData = catMap.get(cat);
            catData.count += 1;
            if (!catData.imagen && prod.imagen) {
                catData.imagen = prod.imagen;
            }

            if (sub) {
                catData.subcategoriasMap.set(sub, (catData.subcategoriasMap.get(sub) || 0) + 1);
            }
        });

        return Array.from(catMap.values()).map((catData) => ({
            nombre: catData.nombre,
            count: catData.count,
            imagen: catData.imagen,
            subcategorias: Array.from(catData.subcategoriasMap.entries()).map(([subNombre, subCount]) => ({
                nombre: subNombre,
                count: subCount,
            })),
        }));
    }, [productos]);

    if (categoriasArbol.length === 0) return null;

    const buildUrl = (nombreCat) => {
        const categoriaParam = encodeURIComponent(nombreCat);
        if (dominio === 'plantillas') {
            return `/plantillas/${siteSlug}/productos?categoria=${categoriaParam}`;
        } else if (dominio && siteSlug && siteSlug !== dominio) {
            return `/${dominio}/${siteSlug}/productos?categoria=${categoriaParam}`;
        } else if (dominio) {
            return `/${dominio}/productos?categoria=${categoriaParam}`;
        }
        return `/productos?categoria=${categoriaParam}`;
    };

    return (
        <section id="categorias" className="scroll-mt-10 py-12 sm:py-16 bg-white border-t border-gray-100">
            <div className="mx-auto w-full max-w-[1540px] px-4 sm:px-6 lg:px-8">
                {/* Cabecera de la Sección */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-[var(--color-primario)]">
                            Categorías Destacadas
                        </p>
                        <h2
                            className="text-2xl sm:text-3xl font-extrabold text-[#1c2d37] tracking-tight"
                            style={{ fontFamily: 'var(--tipografia-titulos)' }}
                        >
                            Explorar por Categoría
                        </h2>
                    </div>
                    <span className="text-xs font-semibold text-gray-400 hidden sm:inline-block">
                        {categoriasArbol.length} categorías disponibles
                    </span>
                </div>

                {/* Tarjetas Visuales Negras / Dark Cards de Categorías */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                    {categoriasArbol.map((cat) => {
                        const targetUrl = buildUrl(cat.nombre);

                        return (
                            <Link
                                key={cat.nombre}
                                href={targetUrl}
                                onClick={(e) => {
                                    if (onSeleccionarCategoria) {
                                        e.preventDefault();
                                        onSeleccionarCategoria(cat.nombre);
                                    }
                                }}
                                className="relative h-44 rounded-2xl transition-all duration-300 text-left group cursor-pointer overflow-hidden border border-gray-800 hover:border-gray-600 shadow-md hover:scale-[1.02] bg-neutral-950 p-5 flex flex-col justify-between block"
                            >
                                {/* Imagen de Fondo Real del Producto */}
                                {cat.imagen ? (
                                    <img
                                        src={cat.imagen}
                                        alt={cat.nombre}
                                        width={400}
                                        height={400}
                                        loading="lazy"
                                        decoding="async"
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
                                )}

                                {/* Superposición Oscura Elegante */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 group-hover:via-black/40 transition-colors z-10" />

                                {/* Contenido Superior en la Tarjeta */}
                                <div className="relative z-20 flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/90 bg-black/40 px-2.5 py-0.5 rounded-md backdrop-blur-xs border border-white/10">
                                        Categoría
                                    </span>
                                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/20">
                                        {cat.count}
                                    </span>
                                </div>

                                {/* Contenido Inferior en la Tarjeta */}
                                <div className="relative z-20">
                                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[var(--color-primario)] transition-colors tracking-tight line-clamp-1">
                                        {cat.nombre}
                                    </h3>
                                    <p className="text-[11px] text-gray-300 font-medium">
                                        {cat.subcategorias.length > 0
                                            ? `${cat.subcategorias.length} subcategorías`
                                            : `${cat.count} ${cat.count === 1 ? 'producto' : 'productos'}`}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
