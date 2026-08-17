/**
 * Normaliza el contenido de respuestas recibidas de la REST API
 * convirtiendo arreglos de preguntas en un objeto fácil de consultar por label.
 */
export function mapSectionContent(contenidoArray = []) {
    const mapped = {};

    if (!Array.isArray(contenidoArray)) return mapped;

    contenidoArray.forEach((item) => {
        if (!item || !item.label) return;

        mapped[item.label] = {
            tipo: item.tipo,
            valor: item.valor,
            enlace: item.enlace,
            estructura: item.estructura,
        };
    });

    return mapped;
}

/**
 * Mapea los estilos globales a un objeto de variables CSS
 */
export function mapSiteStyles(estilos = {}) {
    return {
        '--color-primario': estilos?.color_primario || '#dc2626',
        '--color-secundario': estilos?.color_secundario || '#0f172a',
        '--tipografia-titulos': estilos?.tipografia_titulos || 'Inter',
        '--tipografia-texto': estilos?.tipografia_texto || 'Inter',
        '--radio-bordes': estilos?.radio_bordes || '0.75rem',
        '--espaciado': estilos?.espaciado || '1.25rem',
    };
}
