import React from 'react';
import { useNosotrosData } from './hooks/useNosotrosData';
import PortadaSection from './subcomponents/PortadaSection';
import HistoriaSection from './subcomponents/HistoriaSection';
import MisionVisionSection from './subcomponents/MisionVisionSection';
import ElegirnosSection from './subcomponents/ElegirnosSection';
import AccionSection from './subcomponents/AccionSection';

export default function SectionNosotros({
    seccion,
    seccionesData,
    dominio,
    siteSlug,
    site,
    estilos,
}) {
    const {
        portada,
        historia,
        misionVision,
        elegirnos,
        accion,
        loading,
    } = useNosotrosData(seccion, seccionesData);

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center p-8">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--color-primario)]" />
            </div>
        );
    }

    return (
        <main className="flex-1">
            {/* Seccion 1: Portada (Sobre Nosotros) */}
            <PortadaSection
                seccionData={portada}
                site={site}
                estilos={estilos}
                dominio={dominio}
                siteSlug={siteSlug}
                seccionesData={seccionesData}
            />

            {/* Seccion 2: Historia (Línea de tiempo cronológica) */}
            <HistoriaSection seccionData={historia} />

            {/* Seccion 3: Misión / Visión (Tarjetas oscuras con iconos flotantes) */}
            <MisionVisionSection seccionData={misionVision} />

            {/* Seccion 4: Elegirnos (Cuadrícula de tarjetas blancas con insignia numérica 01, 02...) */}
            <ElegirnosSection seccionData={elegirnos} />

            {/* Seccion 5: Acción (Llamado a la acción de cierre) */}
            <AccionSection
                seccionData={accion}
                site={site}
                estilos={estilos}
                dominio={dominio}
                siteSlug={siteSlug}
                seccionesData={seccionesData}
            />
        </main>
    );
}
