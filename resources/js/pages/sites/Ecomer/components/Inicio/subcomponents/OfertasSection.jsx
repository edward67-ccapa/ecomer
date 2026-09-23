import { motion } from 'framer-motion';
import DynamicIcon from '@/components/DynamicIcon';
import { useCartStore } from '@/stores/useCartStore';

export default function OfertasSection({
    seccionData,
    productos = [],
    onSeleccionarProducto,
}) {
    if (!seccionData) return null;

    const addItem = useCartStore((state) => state.addItem);
    const cartItems = useCartStore((state) => state.items);

    const getItem = (label) =>
        seccionData?.contenido?.find(
            (item) => item.label?.toLowerCase() === label.toLowerCase()
        );
    const getValor = (label) => getItem(label)?.valor;

    // Extraer imagen dinámicamente desde seccionData
    const rawImg = getValor('imagen') || getValor('img') || getValor('imagen_oferta');
    const imagenUrl = Array.isArray(rawImg) ? rawImg[0] : (typeof rawImg === 'string' ? rawImg : null);

    // Extraer categoría dinámicamente desde seccionData
    const categoriaVal = getValor('categoria') || getValor('categoría');
    const categoriaNombre = typeof categoriaVal === 'string' ? categoriaVal.trim() : '';

    // Títulos opcionales desde seccionData
    const subTitulo = getValor('sub_titulo') || getValor('subtitulo') || 'OFERTA DESTACADA';
    const titulo = getValor('titulo') || (categoriaNombre ? `Ofertas en ${categoriaNombre}` : 'Ofertas Especiales');

    // Si no existe la imagen en los datos, no renderiza la sección
    if (!imagenUrl) return null;

    // Filtrar productos dinámicamente por la categoría especificada
    const categoriaTarget = categoriaNombre.toLowerCase();
    const productosFiltrados = (productos || []).filter((prod) => {
        if (!categoriaTarget) return true;
        const catProd =
            typeof prod.categoria === 'string'
                ? prod.categoria
                : prod.categoria?.nombre || prod.categoria?.slug || '';
        const catLower = catProd.toLowerCase();
        return catLower === categoriaTarget || catLower.includes(categoriaTarget) || categoriaTarget.includes(catLower);
    });

    const isInCart = (prod) => {
        const prodId = prod.id || prod.nombre;
        return cartItems.some((item) => (item.id || item.nombre) === prodId);
    };

    const handleCardClick = (prod) => {
        if (onSeleccionarProducto) {
            onSeleccionarProducto(prod);
        } else if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('producto', prod.slug || prod.id);
            window.history.pushState({}, '', url.toString());
            window.dispatchEvent(new PopStateEvent('popstate'));
            window.scrollTo(0, 0);
        }
    };

    return (
        <section id="ofertas" className="scroll-mt-10 py-10 sm:py-14 bg-[#FAFAFA]">
            <div className="mx-auto w-full max-w-[1540px] px-3 sm:px-6 lg:px-8">
                {/* Grid principal: 50% la Imagen de la Oferta / 50% los Productos en 2 columnas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
                    {/* ── LADO IZQUIERDO: IMAGEN DE LA OFERTA (MITAD 50%) ── */}
                    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs min-h-[500px] sm:min-h-[650px] lg:min-h-[760px] max-h-[760px] lg:max-h-[800px] flex w-full">
                        <img
                            src={imagenUrl}
                            alt={categoriaNombre || 'Oferta'}
                            width={600}
                            height={800}
                            className="w-full h-full max-w-full max-h-full object-cover rounded-xl"
                            style={{ maxWidth: '100%', maxHeight: '100%', width: '100%', height: '100%', objectFit: 'cover' }}
                            loading="lazy"
                            decoding="async"
                        />
                    </div>

                    {/* ── LADO DERECHO: PRODUCTOS EN 3 COLUMNAS CON SCROLL VERTICAL INVISIBLE (MITAD 50%) ── */}
                    <div className="flex flex-col justify-start max-h-[760px] lg:max-h-[800px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {productosFiltrados.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4 h-full content-start">
                                {productosFiltrados.map((prod, idx) => {
                                    const inCart = isInCart(prod);
                                    const tieneOferta = Boolean(prod.precio_oferta || prod.precio_oferta_soles);
                                    const precioRegular = Number(prod.precio_soles || prod.precio || 0);
                                    const precioOferta = tieneOferta
                                        ? Number(prod.precio_oferta_soles || prod.precio_oferta)
                                        : null;

                                    // Cálculo de descuentos idéntico a ProductosDestacadosSection
                                    const descOferta = tieneOferta && precioRegular > 0
                                        ? Math.round(((precioRegular - precioOferta) / precioRegular) * 100)
                                        : null;
                                    const descRegular = descOferta ? Math.max(5, Math.round(descOferta * 0.75)) : null;
                                    const precioListaReferencial = Math.round(precioRegular * 1.3);

                                    const categoriaTexto = prod.categoria
                                        ? (typeof prod.categoria === 'string' ? prod.categoria : (prod.categoria?.nombre || ''))
                                        : (categoriaNombre || 'REPOSTERÍA');

                                    return (
                                        <div
                                            key={prod.id || idx}
                                            onClick={() => handleCardClick(prod)}
                                            className="bg-white border border-gray-200 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between h-full relative cursor-pointer shadow-xs hover:shadow-md transition-shadow duration-200"
                                        >
                                            {/* Imagen del Producto (estática idéntica a ProductosDestacados) */}
                                            <div className="relative aspect-square w-full mb-3 flex items-center justify-center bg-white rounded-lg overflow-hidden border border-gray-100">
                                                {/* Badge Categoría Premium arriba a la izquierda */}
                                                {categoriaTexto && (
                                                    <span
                                                        className="absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/95 backdrop-blur-md shadow-xs border border-gray-100 text-gray-800"
                                                        style={{ fontFamily: 'var(--tipografia-texto)' }}
                                                    >
                                                        <span
                                                            className="w-1.5 h-1.5 rounded-full"
                                                            style={{ backgroundColor: 'var(--color-primario)' }}
                                                        />
                                                        <span>{categoriaTexto}</span>
                                                    </span>
                                                )}

                                                {/* Badge OFERTA arriba a la derecha */}
                                                {tieneOferta && (
                                                    <span
                                                        className="absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-md"
                                                        style={{
                                                            backgroundColor: 'var(--color-primario)',
                                                            fontFamily: 'var(--tipografia-titulos)',
                                                        }}
                                                    >
                                                        <DynamicIcon name="FaFire" className="h-2.5 w-2.5" />
                                                        <span>OFERTA</span>
                                                        {descOferta && <span className="ml-0.5 font-bold">-{descOferta}%</span>}
                                                    </span>
                                                )}

                                                {prod.imagen ? (
                                                    <img
                                                        src={prod.imagen}
                                                        alt={prod.nombre}
                                                        width={400}
                                                        height={400}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="w-full h-full max-w-full max-h-full object-cover"
                                                        style={{ maxWidth: '100%', maxHeight: '100%', width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center text-gray-300 gap-1.5">
                                                        <DynamicIcon name="FaBoxOpen" className="h-12 w-12 text-gray-300" />
                                                        <span className="text-[11px] text-gray-400">Sin imagen</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Nombre del Producto */}
                                            <h3
                                                className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 min-h-[2.4rem] leading-snug mb-1.5"
                                                title={prod.nombre}
                                            >
                                                {prod.nombre}
                                            </h3>

                                            {/* Descripción Corta */}
                                            {(prod.descripcion_corta || prod.descripcion) && (
                                                <p
                                                    className="text-[11px] text-gray-500 line-clamp-2 min-h-[2rem] leading-relaxed mb-3"
                                                    title={prod.descripcion_corta || prod.descripcion}
                                                >
                                                    {prod.descripcion_corta || prod.descripcion}
                                                </p>
                                            )}

                                            {/* Bloque de Precios */}
                                            <div className="mt-auto pt-2">
                                                {tieneOferta ? (
                                                    <>
                                                        {/* Precio Principal */}
                                                        <div className="flex items-baseline gap-1.5 mb-1 flex-wrap">
                                                            <span className="text-xs font-black text-[#0089CF]">S/</span>
                                                            <span className="text-2xl sm:text-3xl font-black text-[#0089CF] tracking-tight leading-none">
                                                                {precioOferta.toFixed(0)}
                                                            </span>
                                                            {descOferta && (
                                                                <span className="bg-[#0089CF] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-xs leading-none">
                                                                    -{descOferta}%
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Precio Regular Secundario */}
                                                        <div className="flex items-baseline gap-1.5 mb-0.5">
                                                            <span className="text-xs font-bold text-gray-900">S/</span>
                                                            <span className="text-lg font-extrabold text-gray-900 leading-none">
                                                                {precioRegular.toFixed(0)}
                                                            </span>
                                                            {descRegular && (
                                                                <span
                                                                    className="text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-xs leading-none"
                                                                    style={{ backgroundColor: 'var(--color-primario)' }}
                                                                >
                                                                    -{descRegular}%
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Precio Lista Tachado */}
                                                        <div className="text-[11px] text-gray-400 line-through leading-none mb-2">
                                                            s/ {precioListaReferencial}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="mb-3">
                                                        <div className="flex items-baseline gap-1.5">
                                                            <span className="text-xs font-black text-gray-900">S/</span>
                                                            <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-none">
                                                                {precioRegular.toFixed(0)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Botón 'Agregar' */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addItem(prod);
                                                    }}
                                                    className="w-full py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm tracking-wide cursor-pointer active:scale-98 border-2"
                                                    style={{
                                                        backgroundColor: inCart ? 'var(--color-primario)' : '#ffffff',
                                                        borderColor: 'var(--color-primario)',
                                                        color: inCart ? '#ffffff' : 'var(--color-primario)',
                                                        fontFamily: 'var(--tipografia-titulos)',
                                                    }}
                                                >
                                                    {inCart ? 'Agregado ✓' : 'Agregar'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center bg-white rounded-xl border border-gray-200 p-12">
                                <p className="text-gray-400 text-sm">No hay productos disponibles en esta categoría por el momento.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}