import { useEffect } from 'react';

export default function ServiciosDetalladosGroup({ serviciosDetalladosBlock }) {
    useEffect(() => {
        console.log('=== [Ecomer] COMPONENTE SERVICIOS DETALLADOS ===', serviciosDetalladosBlock);
    }, [serviciosDetalladosBlock]);

    if (!serviciosDetalladosBlock || !serviciosDetalladosBlock.raw) {
        return null;
    }

    return (
        <section className="py-12 bg-gray-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <span className="text-sm font-semibold tracking-wider text-amber-600 uppercase">
                        Servicio: {serviciosDetalladosBlock.servicioName || 'Detalle'}
                    </span>
                    <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        {serviciosDetalladosBlock.titulo || 'Servicios Detallados'}
                    </h2>
                </div>
            </div>
        </section>
    );
}
