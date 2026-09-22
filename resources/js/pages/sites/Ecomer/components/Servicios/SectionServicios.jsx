import HeroSection from './subcomponents/HeroSection';
import ServiciosGroup from './subcomponents/ServiciosGroup';
import ProcesosGroup from './subcomponents/ProcesosGroup';
import VideoGroup from './subcomponents/VideoGroup';
import ServiciosDetalladosGroup from './subcomponents/ServiciosDetalladosGroup';
import { useServiciosData } from './hooks/useServiciosData';

export default function SectionServicios({ dominio, siteSlug, seccion, seccionesData, serviciosSitio = [] }) {
    const { hero, serviciosBlock, procesosBlock, videoBlock, serviciosDetalladosBlock } = useServiciosData(seccion, seccionesData, serviciosSitio);

    return (
        <main className="flex-1 bg-white pb-20">
            {/* 1. HERO SECTION */}
            <HeroSection hero={hero} dominio={dominio} siteSlug={siteSlug} />

            {/* 2. SERVICIOS GROUP */}
            <ServiciosGroup serviciosBlock={serviciosBlock} />

            {/* 3. PROCESOS GROUP */}
            <ProcesosGroup procesosBlock={procesosBlock} />

            {/* 4. VIDEO GROUP */}
            <VideoGroup videoBlock={videoBlock} />

            {/* 5. SERVICIOS DETALLADOS */}
            <ServiciosDetalladosGroup serviciosDetalladosBlock={serviciosDetalladosBlock} />
        </main>
    );
}
