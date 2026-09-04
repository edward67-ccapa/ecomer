export function useInicioData(
    dominio,
    siteSlug,
    seccionActiva = null,
    seccionesData = null,
    initialProductosDestacados = null
) {
    const findSeccion = (slugKey) => {
        if (!seccionesData) return null;
        if (seccionesData[slugKey]) return seccionesData[slugKey];
        const target = slugKey.toLowerCase().replace(/[_ ]/g, '-');
        for (const key in seccionesData) {
            const normalized = key.toLowerCase().replace(/[_ ]/g, '-');
            if (normalized === target || normalized.includes(target) || target.includes(normalized)) {
                return seccionesData[key];
            }
        }
        return null;
    };

    const isInicioSection = seccionActiva?.slug?.toLowerCase() === 'inicio';
    const inicio = isInicioSection ? seccionActiva : (findSeccion('inicio') || null);
    const servicios = findSeccion('servicios') || null;
    const somos = findSeccion('nosotros') || findSeccion('somos') || null;
    const tortasDestacadas = findSeccion('tortas-destacadas') || findSeccion('tortas_destacadas') || null;
    const porQueElegirnos = findSeccion('elegirnos') || findSeccion('por-que-elegirnos') || findSeccion('por_que_elegirnos') || null;
    const contacto = findSeccion('contacto') || null;

    return {
        inicio,
        servicios,
        somos,
        tortasDestacadas,
        porQueElegirnos,
        contacto,
        productosDestacados: initialProductosDestacados || [],
        loading: false,
        error: null,
    };
}
