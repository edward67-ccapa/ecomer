import { useInicioData } from './hooks/useInicioData';
import HeroSection from './subcomponents/HeroSection';
import ServiciosSection from './subcomponents/ServiciosSection';
import SomosSection from './subcomponents/SomosSection';
import ProductosDestacadosSection from './subcomponents/ProductosDestacadosSection';

export default function SectionInicio({ dominio, siteSlug }) {
    const { inicio, servicios, somos, tortasDestacadas, productosDestacados, loading, error } = useInicioData(
        dominio,
        siteSlug
    );

    if (loading) {
        return (
            <div className="flex flex-1 min-h-[60vh] items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--color-primario)]" />
                    <span className="text-sm font-medium text-gray-500">Cargando experiencia...</span>
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
            <ServiciosSection seccionData={servicios} />
            <SomosSection seccionData={somos} />
            <ProductosDestacadosSection seccionData={tortasDestacadas} productos={productosDestacados} />
        </main>
    );
}