import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

const TIPOS = {
    ecommerce: 'Ecommerce',
    landing_page: 'Landing Page',
};

export default function Index({ plantillas }) {
    return (
        <>
            <Head title="Plantillas" />

            <div className="min-h-screen bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <header className="border-b border-[#e3e3e0] px-6 py-6 dark:border-[#3E3E3A]">
                    <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold">
                                Plantillas
                            </h1>
                            <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                Elige una plantilla y personalízala con tu
                                contenido.
                            </p>
                        </div>
                        <Link
                            href="/admin"
                            className="rounded-md border border-[#e3e3e0] px-4 py-2 text-sm font-medium transition hover:border-[#1b1b18] dark:border-[#3E3E3A] dark:hover:border-white"
                        >
                            Mis sitios
                        </Link>
                    </div>
                </header>

                <main className="mx-auto w-full max-w-6xl px-6 py-10">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {plantillas.map((plantilla) => (
                            <article
                                key={plantilla.id}
                                className="group overflow-hidden rounded-xl border border-[#e3e3e0] bg-white transition hover:shadow-lg dark:border-[#3E3E3A] dark:bg-[#161615]"
                            >
                                {plantilla.imagen ? (
                                    <img
                                        src={plantilla.imagen}
                                        alt={plantilla.nombre}
                                        className="aspect-video w-full object-cover"
                                    />
                                ) : (
                                    <div
                                        className="flex aspect-video w-full items-center justify-center text-5xl font-bold text-white"
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

                                <div className="flex flex-col gap-4 p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h2 className="text-lg font-semibold">
                                                {plantilla.nombre}
                                            </h2>
                                            <p className="mt-1 text-sm leading-5 text-[#706f6c] dark:text-[#A1A09A]">
                                                {plantilla.descripcion}
                                            </p>
                                        </div>
                                        <span className="shrink-0 rounded-full bg-[#FDFDFC] px-3 py-1 text-xs font-medium text-[#706f6c] ring-1 ring-[#e3e3e0] dark:bg-[#0a0a0a] dark:text-[#A1A09A] dark:ring-[#3E3E3A]">
                                            {TIPOS[plantilla.tipo] ||
                                                plantilla.tipo}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                            {plantilla.secciones} secciones
                                        </span>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/plantillas/${plantilla.slug}`}
                                                className="rounded-md border border-[#e3e3e0] px-4 py-2 text-sm font-medium text-[#1b1b18] transition hover:border-[#1b1b18] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-white"
                                            >
                                                Vista previa
                                            </Link>
                                            <Link
                                                href={`/admin/sites/create?plantilla_id=${plantilla.id}`}
                                                className="rounded-md bg-[#1b1b18] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 dark:bg-[#EDEDEC] dark:text-[#1b1b18]"
                                            >
                                                Usar plantilla
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
}
