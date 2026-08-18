import { useInicioData } from './hooks/useInicioData';
import HeroSection from './subcomponents/HeroSection';
import ServiciosSection from './subcomponents/ServiciosSection';
import SomosSection from './subcomponents/SomosSection';
import ProductosDestacadosSection from './subcomponents/ProductosDestacadosSection';

export default function SectionInicio({ dominio, siteSlug, seccion, seccionesData, productosDestacados }) {
    const { inicio, servicios, somos, tortasDestacadas, productosDestacados: productos, loading, error } = useInicioData(
        dominio,
        siteSlug,
        seccion,
        seccionesData,
        productosDestacados
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
            <ServiciosSection seccionData={servicios} dominio={dominio} siteSlug={siteSlug} />
            <SomosSection seccionData={somos} />
            <ProductosDestacadosSection seccionData={tortasDestacadas} productos={productos} />
        </main>
    );
}