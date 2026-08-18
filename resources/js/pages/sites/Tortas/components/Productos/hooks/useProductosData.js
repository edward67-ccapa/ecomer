import { useEffect, useState } from 'react';
import { fetchProductosData, fetchProductosList } from '../api';

export function useProductosData(
    dominio,
    siteSlug,
    seccionActiva = null,
    seccionesData = null,
    initialProductos = null
) {
    const isProductosSection = seccionActiva?.slug?.toLowerCase() === 'productos';
    const initialSeccion = isProductosSection ? seccionActiva : (seccionesData?.['productos'] || null);

    const [seccionData, setSeccionData] = useState(initialSeccion);
    const [productos, setProductos] = useState(initialProductos || []);
    const [loading, setLoading] = useState(!initialSeccion && (!initialProductos || initialProductos.length === 0));
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        if (initialSeccion && Array.isArray(initialProductos)) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        Promise.all([
            initialSeccion ? Promise.resolve(initialSeccion) : fetchProductosData(dominio, siteSlug).catch(() => null),
            initialProductos && initialProductos.length > 0
                ? Promise.resolve({ data: initialProductos })
                : fetchProductosList(dominio, siteSlug).catch(() => null),
        ])
            .then(([secRes, prodRes]) => {
                if (!isMounted) return;
                setSeccionData(secRes || initialSeccion);
                setProductos(prodRes?.data || initialProductos || []);
            })
            .catch((err) => {
                if (!isMounted) return;
                setError(err.message || 'Error al cargar el catálogo de productos');
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [dominio, siteSlug]);

    return { seccionData, productos, loading, error };
}
