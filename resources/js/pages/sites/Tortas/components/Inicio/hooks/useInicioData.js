import { useEffect, useState } from 'react';
import {
    fetchInicioData,
    fetchServiciosData,
    fetchSomosData,
    fetchTortasDestacadasData,
    fetchProductosDestacados,
    fetchPorQueElegirnosData,
} from '../api';

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
    const initialInicio = isInicioSection ? seccionActiva : (findSeccion('inicio') || null);
    const initialServicios = findSeccion('servicios') || null;
    const initialSomos = findSeccion('somos') || null;
    const initialTortasDestacadas = findSeccion('tortas-destacadas') || findSeccion('tortas_destacadas') || null;
    const initialPorQueElegirnos = findSeccion('elegirnos') || findSeccion('por-que-elegirnos') || findSeccion('por_que_elegirnos') || null;

    const hasAllInitialData = Boolean(initialInicio && initialServicios && initialSomos && initialPorQueElegirnos);

    const [data, setData] = useState({
        inicio: initialInicio,
        servicios: initialServicios,
        somos: initialSomos,
        tortasDestacadas: initialTortasDestacadas,
        porQueElegirnos: initialPorQueElegirnos,
        productosDestacados: initialProductosDestacados || [],
    });

    const [loading, setLoading] = useState(!hasAllInitialData);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Si la data fue entregada por Inertia, NO se ejecutan peticiones ni re-renders extras
        if (hasAllInitialData) {
            setLoading(false);
            return;
        }

        let isMounted = true;
        setLoading(true);

        Promise.all([
            initialInicio ? Promise.resolve(initialInicio) : fetchInicioData(dominio, siteSlug).catch(() => null),
            initialServicios ? Promise.resolve(initialServicios) : fetchServiciosData(dominio, siteSlug).catch(() => null),
            initialSomos ? Promise.resolve(initialSomos) : fetchSomosData(dominio, siteSlug).catch(() => null),
            initialTortasDestacadas ? Promise.resolve(initialTortasDestacadas) : fetchTortasDestacadasData(dominio, siteSlug).catch(() => null),
            initialPorQueElegirnos ? Promise.resolve(initialPorQueElegirnos) : fetchPorQueElegirnosData(dominio, siteSlug).catch(() => null),
            initialProductosDestacados?.length > 0
                ? Promise.resolve({ data: initialProductosDestacados })
                : fetchProductosDestacados(dominio, siteSlug).catch(() => null),
        ])
            .then(([inicio, servicios, somos, tortasDestacadas, porQueElegirnos, productosDestacadosRes]) => {
                if (!isMounted) return;

                setData({
                    inicio: inicio || initialInicio,
                    servicios: servicios || initialServicios,
                    somos: somos || initialSomos,
                    tortasDestacadas: tortasDestacadas || initialTortasDestacadas,
                    porQueElegirnos: porQueElegirnos || initialPorQueElegirnos,
                    productosDestacados: productosDestacadosRes?.data || initialProductosDestacados || [],
                });
            })
            .catch((err) => {
                if (!isMounted) return;
                setError(err.message || 'Error al cargar datos');
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [dominio, siteSlug]);

    return { ...data, loading, error };
}
