import { useEffect, useState } from 'react';
import { BloqueContenido } from '../../shared/components';
import { fetchInicioData } from './api';

export default function SectionInicio({ site, dominio, siteSlug, styles }) {
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

        fetchInicioData(dominio, siteSlug)
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
        return <main className="flex-1 p-12 text-center text-gray-500 font-medium">Cargando ...</main>;
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

    const primeraImagen = seccionData.contenido.find(
        (item) => item.tipo === 'imagen' && item.valor,
    )?.valor;

    const bloques = seccionData.contenido.filter(
        (item) => !(item.tipo === 'imagen' && item.valor === primeraImagen),
    );

    const elementosClave = ['titulo1', 'descripcion', 'boton'];
    const elementosPrincipales = bloques.filter((item) =>
        elementosClave.includes(item.label),
    );
    const otrosBloques = bloques.filter(
        (item) => !elementosClave.includes(item.label),
    );
    console.log(seccionData)
    return (
        <main className="flex-1">
            {primeraImagen ? (
                <section className="relative min-h-[85vh] overflow-hidden">
                    <img
                        src={primeraImagen}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-end px-6 pb-20 pt-32 text-white">
                        <div className="max-w-2xl">
                            {elementosPrincipales.map((item) => (
                                <div key={item.label} className="mb-4">
                                    <BloqueContenido item={item} styles={styles} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}

            {otrosBloques.length > 0 && (
                <section className="mx-auto max-w-7xl px-6 py-16">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {otrosBloques.map((item) => (
                            <BloqueContenido key={item.label} item={item} styles={styles} />
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}
