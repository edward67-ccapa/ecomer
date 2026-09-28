import { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Header from './shared/Header';
import Footer from './shared/Footer';
import FloatingWhatsApp from './shared/FloatingWhatsApp';
import SectionInicio from './components/Inicio/SectionInicio';
import SectionProductos from './components/Productos/SectionProductos';
import SectionServicios from './components/Servicios/SectionServicios';

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
    serviciosSitio = [],
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
        servicios: SectionServicios,
    };

    const slugLower = seccionActiva?.slug?.toLowerCase() || '';
    const ActiveComponent = sectionMap[slugLower] 
        || (slugLower.includes('producto') ? SectionProductos : SectionInicio);

    const getFaviconUrl = (val) => {
        if (!val) return null;
        let str = val;
        if (Array.isArray(val)) {
            str = val[0];
        } else if (typeof val === 'object' && val !== null) {
            str = Object.values(val)[0] || val.url || null;
        }
        if (typeof str !== 'string' || !str || str.trim() === '') return null;
        str = str.trim();
        if (str.startsWith('http://') || str.startsWith('https://') || str.startsWith('data:')) {
            return str;
        }
        return `/storage/${str.replace(/^\/?storage\//, '')}`;
    };

    const getFaviconType = (url) => {
        if (!url) return undefined;
        const cleanUrl = url.split('?')[0].toLowerCase();
        if (cleanUrl.endsWith('.png')) return 'image/png';
        if (cleanUrl.endsWith('.svg')) return 'image/svg+xml';
        if (cleanUrl.endsWith('.ico')) return 'image/x-icon';
        if (cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg')) return 'image/jpeg';
        if (cleanUrl.endsWith('.webp')) return 'image/webp';
        return undefined;
    };

    const faviconUrl = getFaviconUrl(estilos?.favicon) || getFaviconUrl(site?.imagen) || '/favicon.svg';
    const faviconType = getFaviconType(faviconUrl) || 'image/svg+xml';

    return (
        <>
            <Head title={`${site.nombre} — ${seccionActiva?.nombre || 'Inicio'}`}>
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" key="favicon-svg-default" />
                {faviconUrl && <link rel="icon" href={faviconUrl} type={faviconType} key="favicon" />}
                {faviconUrl && <link rel="shortcut icon" href={faviconUrl} type={faviconType} key="shortcut-icon" />}
                {faviconUrl && <link rel="apple-touch-icon" href={faviconUrl} key="apple-touch-icon" />}
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
                    estilos={estilos}
                />

                <ActiveComponent
                    site={site}
                    dominio={dominio}
                    siteSlug={siteSlug}
                    seccion={seccionActiva}
                    seccionesData={seccionesData}
                    productos={productos}
                    productosDestacados={productosDestacados}
                    serviciosSitio={serviciosSitio}
                    styles={styles}
                    estilos={estilos}
                />

                <Footer
                    site={site}
                    dominio={dominio}
                    siteSlug={siteSlug}
                    secciones={secciones}
                    seccionActiva={seccionActiva}
                    seccionesData={seccionesData}
                    estilos={estilos}
                    productos={productos}
                />

                <FloatingWhatsApp site={site} dominio={dominio} siteSlug={siteSlug} seccionesData={seccionesData} estilos={estilos} />
            </div>
        </>
    );
}
