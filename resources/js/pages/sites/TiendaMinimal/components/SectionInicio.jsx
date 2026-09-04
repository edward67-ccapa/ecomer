import { useEffect } from 'react';
import { BloqueContenido } from '../shared/components';

export default function SectionInicio({ seccion, styles }) {
    if (!seccion || !seccion.contenido) {
        console.error('seccion o contenido no disponible:', seccion);
        return <main className="flex-1">Cargando...</main>;
    }

    const primeraImagen = seccion.contenido.find(
        (item) => item.tipo === 'imagen' && item.valor,
    )?.valor;

    const bloques = seccion.contenido.filter(
        (item) => !(item.tipo === 'imagen' && item.valor === primeraImagen),
    );

    // Extraer elementos clave por su label
    const elementosClave = ['titulo1', 'descripcion', 'boton'];
    const elementosPrincipales = bloques.filter(item => 
        elementosClave.includes(item.label)
    );
    const otrosBloques = bloques.filter(item => 
        !elementosClave.includes(item.label)
    );

    useEffect(() => {
        console.log(seccion.contenido);
    }, []);

    return (
        <main className="flex-1">
            {primeraImagen ? (
                <section className="relative min-h-[85vh] overflow-hidden">
                    <img
                        src={primeraImagen}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                    
                    <div className="relative z-10 mx-auto flex min-h-[85vh] w-full max-w-6xl items-center px-6">
                        <div className="max-w-2xl space-y-8 text-white">
                            {elementosPrincipales.map((item) => {
                                if (item.label === 'titulo1') {
                                    return (
                                        <h1
                                            key={item.label}
                                            className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
                                            style={{
                                                fontFamily:
                                                    'var(--tipografia-titulos), ui-sans-serif, system-ui, sans-serif',
                                            }}
                                        >
                                            {item.valor}
                                        </h1>
                                    );
                                }
                                
                                if (item.label === 'descripcion') {
                                    return (
                                        <p
                                            key={item.label}
                                            className="text-lg leading-relaxed text-gray-100 md:text-xl"
                                            style={{
                                                fontFamily:
                                                    'var(--tipografia-texto), ui-sans-serif, system-ui, sans-serif',
                                            }}
                                        >
                                            {item.valor}
                                        </p>
                                    );
                                }
                                
                                if (item.label === 'boton') {
                                    return (
                                        <div key={item.label} className="pt-4">
                                            <button
                                                className="rounded-lg px-8 py-4 text-lg font-semibold transition-all hover:scale-105 hover:shadow-xl"
                                                style={{
                                                    backgroundColor: 'var(--color-primario)',
                                                    color: 'white',
                                                    borderRadius: 'var(--radio-bordes)',
                                                }}
                                            >
                                                {item.valor}
                                            </button>
                                        </div>
                                    );
                                }
                                
                                return null;
                            })}
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
                            className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl"
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
        </main>
    );
}