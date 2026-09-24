import { useInicioData } from './hooks/useInicioData';
import HeroSection from './subcomponents/HeroSection';
import GaleriaSection from './subcomponents/GaleriaSection';
import OfertasSection from './subcomponents/OfertasSection';
import MarcasSection from './subcomponents/MarcasSection';
import CategoriaSection from './subcomponents/CategoriaSection';
import TikTokSection from './subcomponents/TikTokSection';
import ProductosDestacadosSection from './subcomponents/ProductosDestacadosSection';
import BanerPieSection from './subcomponents/BanerPieSection';

export default function SectionInicio({
    dominio,
    siteSlug,
    seccion,
    seccionesData,
    productosDestacados,
    productos: initialProductos = [],
    marcasSitio = [],
    onSeleccionarProducto,
}) {
    const listaProductos =
        productosDestacados && productosDestacados.length > 0
            ? productosDestacados
            : initialProductos;

    const {
        inicio,
        galeria,
        ofertas,
        marcas,
        tiktok,
        banerpie,
        productosDestacados: productos,
        loading,
        error,
    } = useInicioData(
        dominio,
        siteSlug,
        seccion,
        seccionesData,
        listaProductos
    );

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--color-primario)]" />
                    <span className="text-base font-semibold tracking-wide text-gray-700">Cargando experiencia...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-1 items-center justify-center p-8 text-center text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <main className="flex-1">
            <HeroSection seccionData={inicio} />
            <GaleriaSection seccionData={galeria} />
            <ProductosDestacadosSection
                productos={productos}
                onSeleccionarProducto={onSeleccionarProducto}
            />
            <OfertasSection
                seccionData={ofertas}
                productos={productos}
                onSeleccionarProducto={onSeleccionarProducto}
            />
            <MarcasSection
                seccionData={marcas}
                productos={productos}
                marcasSitio={marcasSitio}
                onSeleccionarProducto={onSeleccionarProducto}
            />
            <CategoriaSection
                productos={productos}
                dominio={dominio}
                siteSlug={siteSlug}
                onSeleccionarProducto={onSeleccionarProducto}
            />
            <TikTokSection seccionData={tiktok} />
            <BanerPieSection seccionData={banerpie} />
        </main>
    );
}