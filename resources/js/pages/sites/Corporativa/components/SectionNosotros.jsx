import { BloqueContenido, EtiquetaBloque } from '../shared/components.jsx';

export default function SectionNosotros({ seccion, styles }) {
    const contenido = seccion?.contenido ?? [];

    // Extraer preguntas conocidas si existen
    const tituloPrincipal = contenido.find((i) => i.label === 'titulo_principal')?.valor || seccion.nombre;
    const logoEmpresa = contenido.find((i) => i.label === 'logo_empresa')?.valor;
    const galeriaOficina = contenido.find((i) => i.label === 'galeria_oficina');
    const miembrosEquipo = contenido.find((i) => i.label === 'miembros_equipo');

    // Filtrar otros bloques que no sean las secciones destacadas
    const otrosBloques = contenido.filter(
        (i) => !['titulo_principal', 'logo_empresa', 'galeria_oficina', 'miembros_equipo'].includes(i.label)
    );

    return (
        <main className="flex-1 bg-gray-50/50 pb-20">
            {/* Hero Section */}
            <section
                className="relative overflow-hidden py-20 text-white md:py-28"
                style={{
                    backgroundColor: 'var(--color-secundario)',
                    backgroundImage: 'radial-gradient(ellipse at 80% 0%, rgba(255,255,255,0.12), transparent 70%)',
                }}
            >
                <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-8 px-6 text-center md:flex-row md:text-left">
                    <div className="max-w-2xl space-y-4">
                        <div
                            className="inline-block rounded-full px-4 py-1.5 text-xs font-black tracking-widest uppercase"
                            style={{
                                backgroundColor: 'var(--color-primario)',
                                color: '#ffffff',
                            }}
                        >
                            {seccion.nombre}
                        </div>
                        <h1
                            className="text-4xl font-black leading-tight text-white md:text-6xl"
                            style={{ fontFamily: 'var(--tipografia-titulos)' }}
                        >
                            {tituloPrincipal}
                        </h1>
                    </div>

                    {logoEmpresa && (
                        <div className="shrink-0 rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/10 shadow-2xl">
                            <img
                                src={logoEmpresa}
                                alt="Logo Empresa"
                                className="h-28 w-auto max-w-xs object-contain"
                            />
                        </div>
                    )}
                </div>
            </section>

            <div className="mx-auto w-full max-w-6xl space-y-16 px-6 pt-16">
                {/* Sección Miembros del Equipo (Grupo) */}
                {miembrosEquipo && miembrosEquipo.valor && (
                    <section className="space-y-6">
                        <div className="border-l-4 pl-4" style={{ borderColor: 'var(--color-primario)' }}>
                            <EtiquetaBloque item={miembrosEquipo} />
                            <h2
                                className="text-3xl font-bold text-gray-900"
                                style={{ fontFamily: 'var(--tipografia-titulos)' }}
                            >
                                Nuestro Equipo
                            </h2>
                        </div>
                        <BloqueContenido item={miembrosEquipo} styles={styles} />
                    </section>
                )}

                {/* Sección Galería de Oficina */}
                {galeriaOficina && galeriaOficina.valor && (
                    <section className="space-y-6">
                        <div className="border-l-4 pl-4" style={{ borderColor: 'var(--color-primario)' }}>
                            <EtiquetaBloque item={galeriaOficina} />
                            <h2
                                className="text-3xl font-bold text-gray-900"
                                style={{ fontFamily: 'var(--tipografia-titulos)' }}
                            >
                                Instalaciones & Oficinas
                            </h2>
                        </div>
                        <BloqueContenido item={galeriaOficina} styles={styles} />
                    </section>
                )}

                {/* Otros Bloques */}
                {otrosBloques.length > 0 && (
                    <section className="space-y-8 rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
                        {otrosBloques.map((item) => (
                            <div key={item.label} className="space-y-2">
                                <EtiquetaBloque item={item} />
                                <BloqueContenido item={item} styles={styles} />
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </main>
    );
}
