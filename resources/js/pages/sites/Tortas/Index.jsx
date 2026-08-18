import { Head } from '@inertiajs/react';
import Header from './shared/Header';
import Footer from './shared/Footer';
import SectionInicio from './components/Inicio/SectionInicio';
import SectionNosotros from './components/Nosotros/SectionNosotros';
import SectionContactos from './components/Contactos/SectionContactos';

export default function Tortas({
    site,
    dominio,
    siteSlug,
    secciones,
    seccionActiva,
    seccionesData,
    productosDestacados,
    estilos,
}) {
    const titulosFont = estilos?.tipografia_titulos || 'Montserrat';
    const textoFont = estilos?.tipografia_texto || 'Montserrat';

    // Generar consulta para Google Fonts declarativo (elimina CLS/saltos visuales)
    const uniqueFonts = [...new Set([titulosFont, textoFont].filter(Boolean))];
    const fontQuery = uniqueFonts.length > 0
        ? uniqueFonts.map((f) => `family=${f.replace(/ /g, '+')}:wght@400;600;700;800`).join('&')
        : null;

    const styles = {
        '--color-primario': estilos?.color_primario || '#F72F46',
        '--color-secundario': estilos?.color_secundario || '#ffffff',
        '--tipografia-titulos': `'${titulosFont}', sans-serif`,
        '--tipografia-texto': `'${textoFont}', sans-serif`,
        '--radio-bordes': estilos?.radio_bordes || '0.5rem',
        '--espaciado': estilos?.espaciado || '1rem',
    };

    const sectionMap = {
        inicio: SectionInicio,
        nosotros: SectionNosotros,
        contactos: SectionContactos,
    };

    const ActiveComponent = sectionMap[seccionActiva?.slug?.toLowerCase()] || SectionInicio;

    return (
        <>
            <Head title={`${site.nombre} — ${seccionActiva?.nombre || 'Inicio'}`}>
                {fontQuery && (
                    <link
                        rel="stylesheet"
                        href={`https://fonts.googleapis.com/css2?${fontQuery}&display=swap`}
                    />
                )}
            </Head>

            <div
                suppressHydrationWarning
                className="flex min-h-screen flex-col bg-white text-gray-900"
                style={{
                    ...styles,
                    fontFamily: `var(--tipografia-texto)`,
                }}
            >
                <Header
                    site={site}
                    dominio={dominio}
                    siteSlug={siteSlug}
                    secciones={secciones}
                    seccionActiva={seccionActiva}
                />

                <ActiveComponent
                    site={site}
                    dominio={dominio}
                    siteSlug={siteSlug}
                    seccion={seccionActiva}
                    seccionesData={seccionesData}
                    productosDestacados={productosDestacados}
                    styles={styles}
                />

                <Footer site={site} dominio={dominio} siteSlug={siteSlug} />
            </div>
        </>
    );
}
