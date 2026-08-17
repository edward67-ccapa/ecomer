import { useEffect } from 'react';
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
    estilos,
}) {
    const titulosFont = estilos?.tipografia_titulos || 'Montserrat';
    const textoFont = estilos?.tipografia_texto || 'Montserrat';

    // Carga dinámica de fuentes de Google Fonts
    useEffect(() => {
        const fonts = [titulosFont, textoFont].filter(Boolean);
        if (fonts.length > 0) {
            const uniqueFonts = [...new Set(fonts)];
            const fontQuery = uniqueFonts
                .map((f) => `family=${f.replace(/ /g, '+')}:wght@400;600;700;800`)
                .join('&');
            const linkId = 'dynamic-google-fonts';

            let link = document.getElementById(linkId);
            if (!link) {
                link = document.createElement('link');
                link.id = linkId;
                link.rel = 'stylesheet';
                document.head.appendChild(link);
            }
            link.href = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;
        }
    }, [titulosFont, textoFont]);

    const styles = {
        '--color-primario': estilos?.color_primario || '#F72F46',
        '--color-secundario': estilos?.color_secundario || '#ffffff',
        '--tipografia-titulos': `'${titulosFont}', sans-serif`,
        '--tipografia-texto': `'${textoFont}', sans-serif`,
        '--radio-bordes': estilos?.radio_bordes || '0.5rem',
        '--espaciado': estilos?.espaciado || '1rem',
    };

    const renderSection = () => {
        const sectionMap = {
            inicio: SectionInicio,
            nosotros: SectionNosotros,
            contactos: SectionContactos,
        };

        const Component = sectionMap[seccionActiva?.slug?.toLowerCase()] || SectionInicio;
        return (
            <Component
                site={site}
                dominio={dominio}
                siteSlug={siteSlug}
                seccion={seccionActiva}
                styles={styles}
            />
        );
    };

    return (
        <>
            <Head title={`${site.nombre} — ${seccionActiva?.nombre || 'Inicio'}`} />

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

                {renderSection()}

                <Footer site={site} dominio={dominio} siteSlug={siteSlug} />
            </div>
        </>
    );
}
