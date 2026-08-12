import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

const TIPOS = {
    ecommerce: { label: 'E-commerce', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
    landing_page: { label: 'Landing Page', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
    anuncio: { label: 'Anuncio / Oferta', color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' },
};

export default function Index({ plantillas }) {
    const [filtro, setFiltro] = useState('todas');

    const plantillasFiltradas = plantillas.filter((plantilla) => {
        if (filtro === 'todas') return true;
        return plantilla.tipo === filtro;
    });

    return (
        <>
            <Head title="Plantillas Ecomer" />

            <div className="min-h-screen bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <header className="border-b border-[#e3e3e0] px-6 py-8 dark:border-[#3E3E3A]">
                    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Catálogo de Plantillas
                            </h1>
                            <p className="mt-1 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                Elige entre nuestras 3 ventanas de diseño (E-Commerce, Landing Page o Anuncio) y personalízala.
                            </p>
                        </div>
                        <Link
                            href="/admin"
                            className="w-fit rounded-lg border border-[#e3e3e0] px-4 py-2 text-sm font-semibold transition hover:border-[#1b1b18] dark:border-[#3E3E3A] dark:hover:border-white"
                        >
                            Mis Sitios
                        </Link>
                    </div>
                </header>

                <main className="mx-auto w-full max-w-6xl px-6 py-8">
                    {/* Filter Tabs */}
                    <div className="mb-8 flex flex-wrap gap-2 border-b border-[#e3e3e0] pb-4 dark:border-[#3E3E3A]">
                        {[
                            { key: 'todas', label: 'Todas las plantillas' },
                            { key: 'ecommerce', label: '🛒 E-commerce' },
                            { key: 'landing_page', label: '🚀 Landing Page' },
                            { key: 'anuncio', label: '⚡ Anuncio Promocional' },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setFiltro(tab.key)}
                                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                                    filtro === tab.key
                                        ? 'bg-[#1b1b18] text-white shadow-sm dark:bg-[#EDEDEC] dark:text-[#1b1b18]'
                                        : 'bg-transparent text-[#706f6c] hover:bg-black/5 dark:text-[#A1A09A] dark:hover:bg-white/5'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Template Cards Grid */}
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {plantillasFiltradas.map((plantilla) => {
                            const tipoMeta = TIPOS[plantilla.tipo] || {
                                label: plantilla.tipo,
                                color: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
                            };

                            return (
                                <article
                                    key={plantilla.id}
                                    className="group overflow-hidden rounded-2xl border border-[#e3e3e0] bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:border-[#3E3E3A] dark:bg-[#161615]"
                                >
                                    {plantilla.imagen ? (
                                        <img
                                            src={plantilla.imagen}
                                            alt={plantilla.nombre}
                                            className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div
                                            className="flex aspect-video w-full items-center justify-center text-5xl font-black text-white"
                                            style={{
                                                backgroundColor:
                                                    plantilla.estilos
                                                        ?.color_primario ||
                                                    '#f59e0b',
                                            }}
                                        >
                                            {plantilla.nombre[0]}
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-4 p-6">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h2 className="text-xl font-bold tracking-tight">
                                                    {plantilla.nombre}
                                                </h2>
                                                <p className="mt-1 text-sm leading-relaxed text-[#706f6c] dark:text-[#A1A09A]">
                                                    {plantilla.descripcion}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-2 border-t border-[#e3e3e0] pt-4 dark:border-[#3E3E3A]">
                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${tipoMeta.color}`}
                                            >
                                                {tipoMeta.label}
                                            </span>
                                            <span className="text-xs font-medium text-[#706f6c] dark:text-[#A1A09A]">
                                                {plantilla.secciones} secciones
                                            </span>
                                        </div>

                                        <div className="mt-2 flex gap-2">
                                            <Link
                                                href={`/plantillas/${plantilla.slug}`}
                                                className="flex-1 rounded-xl border border-[#e3e3e0] py-2.5 text-center text-sm font-semibold text-[#1b1b18] transition hover:bg-black/5 dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:bg-white/5"
                                            >
                                                Vista previa
                                            </Link>
                                            <Link
                                                href={`/admin/sites/create?plantilla_id=${plantilla.id}`}
                                                className="flex-1 rounded-xl bg-[#1b1b18] py-2.5 text-center text-sm font-semibold text-white transition hover:opacity-90 dark:bg-[#EDEDEC] dark:text-[#1b1b18]"
                                            >
                                                Usar plantilla
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    {plantillasFiltradas.length === 0 && (
                        <div className="py-16 text-center text-[#706f6c] dark:text-[#A1A09A]">
                            No hay plantillas disponibles en esta categoría.
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
