export function useProductosData(
    dominio,
    siteSlug,
    seccionActiva = null,
    seccionesData = null,
    initialProductos = null
) {
    const isProductosSection = seccionActiva?.slug?.toLowerCase() === 'productos';
    const seccionData = isProductosSection ? seccionActiva : (seccionesData?.['productos'] || null);

    return {
        seccionData,
        productos: initialProductos || [],
        loading: false,
        error: null,
    };
}
