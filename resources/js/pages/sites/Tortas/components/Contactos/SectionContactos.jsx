import { useEffect, useState } from 'react';
import { fetchContactosData } from './api';
import ContactoSection from '../Inicio/subcomponents/ContactoSection';

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
        return <main className="flex-1 p-12 text-center text-gray-500 font-medium">Cargando datos de contacto...</main>;
    }

    if (error) {
        return (
            <main className="flex-1 p-12 text-center text-red-500 font-semibold">
                Error al cargar la sección de contacto: {error}
            </main>
        );
    }

    if (!seccionData || !seccionData.contenido) {
        return <main className="flex-1 p-12 text-center text-gray-400">Sin contenido en la sección de contacto.</main>;
    }

    return (
        <main className="flex-1">
            <ContactoSection seccionData={seccionData} />
        </main>
    );
}
