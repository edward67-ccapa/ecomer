import { BloqueContenido } from '../shared/components';

export default function SectionNosotros({ seccion, styles }) {
    const primeraImagen = seccion.contenido.find(
        (item) => item.tipo === 'imagen' && item.valor,
    )?.valor;

    const bloques = seccion.contenido.filter(
        (item) => !(item.tipo === 'imagen' && item.valor === primeraImagen),
    );

    return (
        <main className="flex-1">
            {primeraImagen ? (
                <section className="relative overflow-hidden">
                    <img
                        src={primeraImagen}
                        alt=""
                        className="h-[60vh] w-full object-cover"
                    />
                    <div
                        className="absolute inset-0 flex items-end"
                        style={{
                            background:
                                'linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0))',
                        }}
                    >
                        <div className="mx-auto w-full max-w-6xl px-6 pb-12">
                            <h1
                                className="max-w-3xl text-4xl leading-tight font-black text-white md:text-6xl"
                                style={{
                                    fontFamily:
                                        'var(--tipografia-titulos), ui-sans-serif, system-ui, sans-serif',
                                }}
                            >
                                {seccion.nombre}
                            </h1>
                        </div>
                    </div>
                </section>
            ) : (
                <section
                    className="relative overflow-hidden"
                    style={{
                        backgroundColor: 'var(--color-primario)',
                    }}
                >
                    <div
                        className="mx-auto w-full max-w-6xl px-6 py-24 text-white md:py-32"
                        style={{
                            background:
                                'radial-gradient(80rem 30rem at 80% -10%, rgba(255,255,255,0.25), transparent)',
                        }}
                    >
                        <h1
                            className="max-w-3xl text-4xl leading-tight font-black md:text-6xl"
                            style={{
                                fontFamily:
                                    'var(--tipografia-titulos), ui-sans-serif, system-ui, sans-serif',
                            }}
                        >
                            {seccion.nombre}
                        </h1>
                    </div>
                </section>
            )}

            <div className="mx-auto w-full max-w-6xl px-6 py-16">
                <div
                    className="grid gap-10"
                    style={{ gap: 'var(--espaciado)' }}
                >
                    {bloques.map((item) => (
                        <div
                            key={item.label}
                            className="flex flex-col gap-3"
                        >
                            <BloqueContenido
                                item={item}
                                styles={styles}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
