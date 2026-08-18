import { useEffect, useState } from 'react';
import {
    fetchInicioData,
    fetchServiciosData,
    fetchSomosData,
    fetchTortasDestacadasData,
    fetchProductosDestacados,
} from '../api';

export function useInicioData(dominio, siteSlug) {
    const [data, setData] = useState({
        inicio: null,
        servicios: null,
        somos: null,
        tortasDestacadas: null,
        productosDestacados: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);

        Promise.all([
            fetchInicioData(dominio, siteSlug).catch(() => null),
            fetchServiciosData(dominio, siteSlug).catch(() => null),
            fetchSomosData(dominio, siteSlug).catch(() => null),
            fetchTortasDestacadasData(dominio, siteSlug).catch(() => null),
            fetchProductosDestacados(dominio, siteSlug).catch(() => null),
        ])
            .then(([inicio, servicios, somos, tortasDestacadas, productosDestacadosRes]) => {
                if (!isMounted) return;

                setData({
                    inicio,
                    servicios,
                    somos,
                    tortasDestacadas,
                    productosDestacados: productosDestacadosRes?.data || [],
                });
            })
            .catch((err) => {
                if (!isMounted) return;
                setError(err.response?.data?.message || err.message || 'Error al conectar con la API');
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
