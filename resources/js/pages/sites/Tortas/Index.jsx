import { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Header from './shared/Header';
import Footer from './shared/Footer';
import FloatingWhatsApp from './shared/FloatingWhatsApp';
import SectionInicio from './components/Inicio/SectionInicio';
import SectionProductos from './components/Productos/SectionProductos';

export default function Tortas({
    site,
    dominio,
    siteSlug,
    secciones,
    seccionActiva,
    seccionesData,
    productos,
    productosDestacados,
    estilos,
}) {
    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
        }
    }, []);

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
        productos: SectionProductos,
    };

    const ActiveComponent = sectionMap[seccionActiva?.slug?.toLowerCase()] || SectionInicio;

    return (
        <>
            <Head title={`${site.nombre} — ${seccionActiva?.nombre || 'Inicio'}`}>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {fontQuery && (
                    <link
                        rel="stylesheet"
                        href={`https://fonts.googleapis.com/css2?${fontQuery}&display=swap`}
                    />
                )}
            </Head>

            <div
                suppressHydrationWarning
                className="flex min-h-screen w-full max-w-full flex-col bg-white text-gray-900 relative overflow-x-hidden"
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
                    seccionesData={seccionesData}
                />

                <ActiveComponent
                    site={site}
                    dominio={dominio}
                    siteSlug={siteSlug}
                    seccion={seccionActiva}
                    seccionesData={seccionesData}
                    productos={productos}
                    productosDestacados={productosDestacados}
                    styles={styles}
                />

                <Footer
                    site={site}
                    dominio={dominio}
                    siteSlug={siteSlug}
                    secciones={secciones}
                    seccionActiva={seccionActiva}
                    seccionesData={seccionesData}
                />

                <FloatingWhatsApp site={site} dominio={dominio} siteSlug={siteSlug} seccionesData={seccionesData} />
            </div>
        </>
    );
}
