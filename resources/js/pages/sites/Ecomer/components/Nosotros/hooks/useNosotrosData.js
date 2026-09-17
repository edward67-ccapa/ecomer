import { useMemo } from 'react';

export function useNosotrosData(seccion, seccionesData) {
    const findSeccion = (name) => {
        if (!seccionesData) return null;
        if (Array.isArray(seccionesData)) {
            return (
                seccionesData.find(
                    (s) =>
                        s.slug?.toLowerCase() === name.toLowerCase() ||
                        s.nombre?.toLowerCase() === name.toLowerCase()
                ) || null
            );
        }
        if (typeof seccionesData === 'object') {
            for (const key in seccionesData) {
                const sec = seccionesData[key];
                if (
                    sec?.slug?.toLowerCase() === name.toLowerCase() ||
                    sec?.nombre?.toLowerCase() === name.toLowerCase()
                ) {
                    return sec;
                }
            }
        }
        return null;
    };

    const nosotros = seccion || findSeccion('nosotros') || findSeccion('sobre-nosotros') || null;
    console.log(nosotros)
    const getItem = (label) => {
        if (!nosotros?.contenido) return null;
        return nosotros.contenido.find(
            (item) => item.label?.toLowerCase() === label.toLowerCase()
        );
    };

    const portada = useMemo(() => getItem('portada'), [nosotros]);
    const historia = useMemo(() => getItem('historia'), [nosotros]);
    const misionVision = useMemo(() => getItem('mision/vision') || getItem('misionvision') || getItem('mision_vision'), [nosotros]);
    const elegirnos = useMemo(() => getItem('elegirnos'), [nosotros]);
    const accion = useMemo(() => getItem('accion'), [nosotros]);

    return {
        nosotros,
        portada,
        historia,
        misionVision,
        elegirnos,
        accion,
        loading: false,
    };
}
