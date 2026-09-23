
export function useContactoData(seccion, seccionesData) {
    const findSeccion = (name) => {
        if (!seccionesData) return null;
        const target = String(name || '').toLowerCase().trim();

        if (Array.isArray(seccionesData)) {
            return (
                seccionesData.find(
                    (s) =>
                        String(s.slug || '').toLowerCase() === target ||
                        String(s.nombre || '').toLowerCase() === target
                ) || null
            );
        }
        if (typeof seccionesData === 'object') {
            for (const key in seccionesData) {
                const sec = seccionesData[key];
                if (
                    String(sec?.slug || '').toLowerCase() === target ||
                    String(sec?.nombre || '').toLowerCase() === target ||
                    String(key).toLowerCase() === target
                ) {
                    return sec;
                }
            }
        }
        return null;
    };

    const contacto = seccion || findSeccion('contacto') || findSeccion('contactos') || null;
    console.log(contacto)
    return {
        contacto,
        loading: false,
    };
}
