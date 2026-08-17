import { useEffect, useState } from 'react';
import { BloqueContenido } from '../../shared/components';
import { fetchContactosData } from './api';

export default function SectionContactos({ site, dominio, siteSlug, styles }) {
    const [seccionData, setSeccionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!dominio || !siteSlug) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        fetchContactosData(dominio, siteSlug)
            .then((response) => {
                setSeccionData(response.seccionActiva);
            })
            .catch((err) => {
                setError(err.response?.data?.message || err.message || 'Error al conectar con la API');
                setSeccionData(null);
            })
            .finally(() => setLoading(false));
    }, [dominio, siteSlug]);

    if (loading) {
        return <main className="flex-1 p-12 text-center text-gray-500 font-medium">Cargando datos desde api.js...</main>;
    }

    if (error) {
        return (
            <main className="flex-1 p-12 text-center text-red-500 font-semibold">
                Error desde api.js: {error}
            </main>
        );
    }

    if (!seccionData || !seccionData.contenido) {
        return <main className="flex-1 p-12 text-center text-gray-400">Sin contenido devuelto por api.js.</main>;
    }

    return (
        <main className="flex-1 py-16">
            <div className="mx-auto max-w-7xl px-6">
                <h1 className="mb-8 text-3xl font-bold">{seccionData.nombre}</h1>
                <div className="grid gap-6 md:grid-cols-2">
                    {seccionData.contenido.map((item) => (
                        <BloqueContenido key={item.label} item={item} styles={styles} />
                    ))}
                </div>
            </div>
        </main>
    );
}
