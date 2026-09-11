import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import Header from './shared/Header';
import Footer from './shared/Footer';
import FloatingWhatsApp from './shared/FloatingWhatsApp';
import SectionInicio from './components/Inicio/SectionInicio';
import SectionProductos from './components/Productos/SectionProductos';
import SectionServicios from './components/Servicios/SectionServicios';
import SectionProductoDetalle from './components/Productos/SectionProductoDetalle';

export default function Ecomer({
    site,
    dominio,
    siteSlug,
    secciones,
    seccionActiva,
    seccionesData,
    productos = [],
    productosDestacados = [],
    estilos,
    serviciosSitio = [],
}) {
    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
        }
    }, []);

    // Estado del producto seleccionado para vista detalle estilo Falabella/retail
    const [productoSeleccionado, setProductoSeleccionado] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const paramProd = params.get('producto');
            if (paramProd && productos) {
                return (
                    productos.find(
                        (p) =>
                            String(p.id) === paramProd ||
                            String(p.slug) === paramProd ||
                            p.nombre?.toLowerCase() === paramProd.toLowerCase()
                    ) || null
                );
            }
        }
        return null;
    });

    // Sincronizar navegación atrás/adelante con popstate
    useEffect(() => {
        const handlePopState = () => {
            const params = new URLSearchParams(window.location.search);
            const paramProd = params.get('producto');
            if (paramProd && productos) {
                const encontrado = productos.find(
                    (p) =>
                        String(p.id) === paramProd ||
                        String(p.slug) === paramProd ||
                        p.nombre?.toLowerCase() === paramProd.toLowerCase()
                );
                setProductoSeleccionado(encontrado || null);
            } else {
                setProductoSeleccionado(null);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [productos]);

    const handleSeleccionarProducto = (prod) => {
        setProductoSeleccionado(prod);
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            if (prod) {
                url.searchParams.set('producto', prod.slug || prod.id);
                window.history.pushState({}, '', url.toString());
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                url.searchParams.delete('producto');
                window.history.pushState({}, '', url.toString());
            }
        }
    };

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

    const pageTitle = productoSeleccionado
        ? `${productoSeleccionado.nombre} — ${site.nombre}`
        : `${site.nombre} — ${seccionActiva?.nombre || 'Inicio'}`;

    return (
        <>
            <Head title={pageTitle}>
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

                {productoSeleccionado ? (
                    <SectionProductoDetalle
                        producto={productoSeleccionado}
                        onVolver={() => handleSeleccionarProducto(null)}
                        onSeleccionarProducto={handleSeleccionarProducto}
                        productosRelacionados={productos}
                        site={site}
                        seccionesData={seccionesData}
                    />
                ) : (
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
                        onSeleccionarProducto={handleSeleccionarProducto}
                    />
                )}

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
