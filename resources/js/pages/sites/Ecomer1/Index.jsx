import { Head } from '@inertiajs/react';
import Header from './shared/Header';
import Footer from './shared/Footer';
import SectionInicio from './components/SectionInicio';
import SectionNosotros from './components/SectionNosotros';
import SectionContactos from './components/SectionContactos';

export default function Ecomer1({
    site,
    dominio,
    siteSlug,
    secciones,
    seccionActiva,
    estilos,
}) {
    const styles = {
        '--color-primario': estilos?.color_primario || '#f59e0b',
        '--color-secundario': estilos?.color_secundario || '#1f2937',
        '--tipografia-titulos': estilos?.tipografia_titulos || 'Inter',
        '--tipografia-texto': estilos?.tipografia_texto || 'Inter',
        '--radio-bordes': estilos?.radio_bordes || '1rem',
        '--espaciado': estilos?.espaciado || '1.5rem',
    };

    const renderSection = () => {
        const sectionMap = {
            inicio: SectionInicio,
            nosotros: SectionNosotros,
            contactos: SectionContactos,
        };

        const Component = sectionMap[seccionActiva.slug] || SectionInicio;
        return <Component seccion={seccionActiva} styles={styles} />;
    };

    return (
        <>
            <Head title={`${site.nombre} — ${seccionActiva.nombre}`} />

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
