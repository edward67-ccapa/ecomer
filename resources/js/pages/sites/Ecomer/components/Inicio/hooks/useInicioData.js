export function useInicioData(
    dominio,
    siteSlug,
    seccionActiva = null,
    seccionesData = null,
    initialProductosDestacados = null
) {
    const findSeccion = (slugKey) => {
        if (!seccionesData) return null;

        const normalize = (str) =>
            String(str || '')
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[-_ ]/g, '');

        const target = normalize(slugKey);

        const list = Array.isArray(seccionesData)
            ? seccionesData
            : Object.values(seccionesData);

        for (const item of list) {
            if (!item) continue;
            const slugNorm = normalize(item.slug || item.nombre || '');
            if (slugNorm === target || (slugNorm && target && (slugNorm.includes(target) || target.includes(slugNorm)))) {
                return item;
            }
        }

        if (typeof seccionesData === 'object' && !Array.isArray(seccionesData)) {
            for (const key in seccionesData) {
                const keyNorm = normalize(key);
                if (keyNorm === target || (keyNorm && target && (keyNorm.includes(target) || target.includes(keyNorm)))) {
                    return seccionesData[key];
                }
            }
        }

        return null;
    };

    // Identifica las secciones del sitio
    const isInicioSection = seccionActiva?.slug?.toLowerCase() === 'inicio' || seccionActiva?.slug?.toLowerCase() === 'hero';
    const inicio = isInicioSection ? seccionActiva : (findSeccion('inicio') || findSeccion('hero') || null);
    const galeria = findSeccion('galeria') || null;
    const ofertas = findSeccion('ofertas') || null;
    const marcas = findSeccion('marcas') || null;
    const tiktok = findSeccion('tik tok') || null;
    const banerpie = findSeccion('banerpie') || findSeccion('baner_pie') || findSeccion('banerPie') || null;
    const banerproductos = findSeccion('banerproductos') || findSeccion('baner_productos') || findSeccion('banerProductos') || findSeccion('banerproducto') || findSeccion('banerProducto') || null;
    const contancto = findSeccion('contacto') || null;
    console.log(tiktok)
    return {
        inicio,
        hero: inicio,
        galeria,
        ofertas,
        marcas,
        tiktok,
        banerpie,
        banerproductos,
        contacto: contancto,
        productosDestacados: initialProductosDestacados || [],
        loading: false,
        error: null,
    };
}
