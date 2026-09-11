export function mapInicioData(contenidoArray = []) {
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
