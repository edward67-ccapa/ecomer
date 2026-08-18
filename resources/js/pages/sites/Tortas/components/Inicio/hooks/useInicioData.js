import { useEffect, useState } from 'react';
import {
    fetchInicioData,
    fetchServiciosData,
    fetchSomosData,
    fetchTortasDestacadasData,
    fetchProductosDestacados,
} from '../api';

export function useInicioData(
    dominio,
    siteSlug,
    seccionActiva = null,
    seccionesData = null,
    initialProductosDestacados = null
) {
    const isInicioSection = seccionActiva?.slug?.toLowerCase() === 'inicio';
    const initialInicio = isInicioSection ? seccionActiva : (seccionesData?.['inicio'] || null);
    const initialServicios = seccionesData?.['servicios'] || null;
    const initialSomos = seccionesData?.['somos'] || null;
    const initialTortasDestacadas = seccionesData?.['tortas-destacadas'] || seccionesData?.['tortas_destacadas'] || null;

    const hasAllInitialData = Boolean(initialInicio && initialServicios && initialSomos);

    const [data, setData] = useState({
        inicio: initialInicio,
        servicios: initialServicios,
        somos: initialSomos,
        tortasDestacadas: initialTortasDestacadas,
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
            initialProductosDestacados?.length > 0
                ? Promise.resolve({ data: initialProductosDestacados })
                : fetchProductosDestacados(dominio, siteSlug).catch(() => null),
        ])
            .then(([inicio, servicios, somos, tortasDestacadas, productosDestacadosRes]) => {
                if (!isMounted) return;

                setData({
                    inicio: inicio || initialInicio,
                    servicios: servicios || initialServicios,
                    somos: somos || initialSomos,
                    tortasDestacadas: tortasDestacadas || initialTortasDestacadas,
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
