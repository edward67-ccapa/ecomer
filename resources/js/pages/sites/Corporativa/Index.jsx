import { Head } from '@inertiajs/react';
import Header from './shared/Header';
import Footer from './shared/Footer';
import SectionNosotros from './components/SectionNosotros';
import { BloqueContenido, EtiquetaBloque } from './shared/components.jsx';

function GenericSection({ seccion, styles }) {
    return (
        <main className="flex-1 bg-gray-50/50 pb-20">
            <section
                className="py-16 text-white"
                style={{ backgroundColor: 'var(--color-secundario)' }}
            >
                <div className="mx-auto max-w-6xl px-6">
                    <h1
                        className="text-4xl font-black md:text-5xl"
                        style={{ fontFamily: 'var(--tipografia-titulos)' }}
                    >
                        {seccion.nombre}
                    </h1>
                </div>
            </section>

            <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-12">
                {(seccion.contenido || []).map((item) => (
                    <div
                        key={item.label}
                        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                    >
                        <EtiquetaBloque item={item} />
                        <BloqueContenido item={item} styles={styles} />
                    </div>
                ))}
            </div>
        </main>
    );
}

export default function Corporativa({
    site,
    dominio,
    siteSlug,
    secciones,
    seccionActiva,
    estilos,
}) {
    const styles = {
        '--color-primario': estilos?.color_primario || '#000000',
        '--color-secundario': estilos?.color_secundario || '#111827',
        '--tipografia-titulos': estilos?.tipografia_titulos || 'Inter',
        '--tipografia-texto': estilos?.tipografia_texto || 'Inter',
        '--radio-bordes': estilos?.radio_bordes || '0.75rem',
        '--espaciado': estilos?.espaciado || '1.5rem',
    };

    const renderSection = () => {
        const sectionMap = {
            'seccion-nosotros': SectionNosotros,
            nosotros: SectionNosotros,
        };

        const Component = sectionMap[seccionActiva?.slug] || GenericSection;
        return <Component seccion={seccionActiva} styles={styles} />;
    };

    return (
        <>
            <Head title={`${site.nombre} — ${seccionActiva?.nombre ?? ''}`} />

            <div
                className="flex min-h-screen flex-col bg-white text-gray-900"
                style={{
                    ...styles,
                    fontFamily: `var(--tipografia-texto), ui-sans-serif, system-ui, sans-serif`,
                }}
            >
                <Header
                    site={site}
                    dominio={dominio}
                    siteSlug={siteSlug}
                    secciones={secciones}
                    seccionActiva={seccionActiva}
                />

                {renderSection()}

                <Footer site={site} dominio={dominio} siteSlug={siteSlug} />
            </div>
        </>
    );
}
