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

        // Normaliza: minúsculas, sin tildes/diacríticos, guiones en lugar de _ o espacio
        const normalize = (str) =>
            str
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // quita tildes
                .replace(/[_ ]/g, '-');

        const target = normalize(slugKey);
        for (const key in seccionesData) {
            const normalized = normalize(key);
            if (normalized === target || normalized.includes(target) || target.includes(normalized)) {
                return seccionesData[key];
            }
        }
        return null;
    };

    const isInicioSection = seccionActiva?.slug?.toLowerCase() === 'inicio';
    const inicio = isInicioSection ? seccionActiva : (findSeccion('inicio') || null);
    const categorias = findSeccion('categorias') || null;
    const servicios = findSeccion('servicios') || null;
    const somos = findSeccion('nosotros') || findSeccion('somos') || null;
    const tortasDestacadas = findSeccion('tortas-destacadas') || findSeccion('tortas_destacadas') || null;
    const porQueElegirnos = findSeccion('elegirnos') || findSeccion('por-que-elegirnos') || findSeccion('por_que_elegirnos') || null;
    const contacto = findSeccion('contacto') || null;

    return {
        inicio,
        categorias,
        somos,
        tortasDestacadas,
        porQueElegirnos,
        contacto,
        servicios,
        productosDestacados: initialProductosDestacados || [],
        loading: false,
        error: null,
    };
}
