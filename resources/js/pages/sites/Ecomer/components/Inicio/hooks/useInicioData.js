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

        // Normaliza: minúsculas, sin tildes/diacríticos, sin espacios ni guiones
        const normalize = (str) =>
            str
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // quita tildes
                .replace(/[-_ ]/g, ''); // quita espacios, guiones y guiones bajos

        const target = normalize(slugKey);
        for (const key in seccionesData) {
            const normalized = normalize(key);
            if (normalized === target || normalized.includes(target) || target.includes(normalized)) {
                return seccionesData[key];
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

    console.log('Sección TikTok encontrada:', tiktok);
    return {
        inicio,
        hero: inicio,
        galeria,
        ofertas,
        marcas,
        tiktok,
        productosDestacados: initialProductosDestacados || [],
        loading: false,
        error: null,
    };
}
