import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import DynamicIcon from '@/components/DynamicIcon';
import ServiciosSection from '../Inicio/subcomponents/ServiciosSection';

export default function SectionServicios({ dominio, siteSlug, seccion, seccionesData, serviciosSitio = [] }) {
    const findSeccion = (slugKey) => {
        if (!seccionesData) return null;
        if (seccionesData[slugKey]) return seccionesData[slugKey];
        for (const key in seccionesData) {
            if (key.toLowerCase().includes(slugKey.toLowerCase())) {
                return seccionesData[key];
            }
        }
        return null;
    };

    const serviciosData = seccion || findSeccion('servicios');

    const getValor = (label) => serviciosData?.contenido?.find((item) => item.label === label)?.valor;

    const subTitulo = getValor('sub_titulo') || 'SERVICIOS PERSONALIZADOS';
    const titulo = getValor('titulo') || 'Nuestros Servicios Destacados';
    const icono = getValor('icono') || 'FaRegHeart';
    const descripcion = getValor('descripcion') || '';
    const servicioDetalladoRaw = getValor('servicio_detallado') || [];

    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

    const items = Array.isArray(servicioDetalladoRaw) ? servicioDetalladoRaw : [];

    const buildUrl = (nombreServicio) => {
        const cat = encodeURIComponent(nombreServicio || '');
        if (dominio === 'plantillas') return `/plantillas/${siteSlug}/Productos?categoria=${cat}`;
        if (dominio && siteSlug && siteSlug !== dominio) return `/${dominio}/${siteSlug}/Productos?categoria=${cat}`;
        if (dominio) return `/${dominio}/Productos?categoria=${cat}`;
        return `/Productos?categoria=${cat}`;
    };

    return (
        <main className="flex-1 bg-gray-50/50 pb-20 pt-24">
            {/* Header / Hero de la Sección Servicios */}
            <div className="bg-white border-b border-gray-100 py-12 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    {subTitulo && (
                        <span
                            className="text-xs font-extrabold uppercase tracking-widest block mb-2"
                            style={{ color: 'var(--color-primario)', fontFamily: 'var(--tipografia-texto)' }}
                        >
                            {subTitulo}
                        </span>
                    )}
                    <h1
                        className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
                        style={{ fontFamily: 'var(--tipografia-titulos)' }}
                    >
                        {titulo}
                    </h1>
                    {descripcion && (
                        <p
                            className="max-w-3xl mx-auto text-gray-600 text-base md:text-lg leading-relaxed"
                            style={{ fontFamily: 'var(--tipografia-texto)' }}
                        >
                            {descripcion}
                        </p>
                    )}
                </div>
            </div>

            {/* Componente principal de la sección de servicios */}
            <ServiciosSection
                seccionData={serviciosData}
                serviciosSitio={serviciosSitio}
                dominio={dominio}
                siteSlug={siteSlug}
            />

            {/* Detalle extendido de Servicios (Galerías, Listas de características y PDFs) */}
            {items.length > 0 && (
                <section className="max-w-7xl mx-auto px-6 mt-12">
                    <div className="text-center mb-12">
                        <h2
                            className="text-2xl md:text-3xl font-bold text-gray-900"
                            style={{ fontFamily: 'var(--tipografia-titulos)' }}
                        >
                            Detalle de Nuestras Especialidades
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Explora todo lo que incluimos en cada una de nuestras propuestas
                        </p>
                    </div>

                    <div className="space-y-16">
                        {items.map((serv, index) => {
                            const imagenes = Array.isArray(serv.ImagenesServicios)
                                ? serv.ImagenesServicios
                                : [serv.ImagenesServicios].filter(Boolean);
                            const lista = Array.isArray(serv.lista_servicio) ? serv.lista_servicio : [];
                            const isEven = index % 2 === 0;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={`bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                                        isEven ? '' : 'lg:flex-row-reverse'
                                    }`}
                                >
                                    {/* Galería / Imagen Principal */}
                                    <div className={`lg:col-span-6 ${isEven ? 'order-1' : 'order-1 lg:order-2'}`}>
                                        {imagenes.length > 0 ? (
                                            <div className="space-y-4">
                                                <div className="overflow-hidden rounded-xl aspect-[16/10] bg-gray-100 shadow-inner">
                                                    <img
                                                        src={imagenes[0]}
                                                        alt={serv.nombreServicio || serv.Titulo || 'Servicio'}
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                                    />
                                                </div>
                                                {imagenes.length > 1 && (
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {imagenes.map((imgUrl, imgIdx) => (
                                                            <img
                                                                key={imgIdx}
                                                                src={imgUrl}
                                                                alt={`Vista ${imgIdx + 1}`}
                                                                className="rounded-lg aspect-square object-cover cursor-pointer hover:opacity-80 transition"
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="aspect-[16/10] rounded-xl bg-gray-100 flex items-center justify-center">
                                                <DynamicIcon name={icono} className="h-16 w-16 text-gray-300" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Información del Servicio */}
                                    <div className={`lg:col-span-6 space-y-5 ${isEven ? 'order-2' : 'order-2 lg:order-1'}`}>
                                        <div>
                                            <span
                                                className="text-xs font-bold uppercase tracking-wider text-[var(--color-primario)]"
                                                style={{ fontFamily: 'var(--tipografia-texto)' }}
                                            >
                                                {serv.nombreServicio || 'Servicio Especial'}
                                            </span>
                                            <h3
                                                className="text-2xl md:text-3xl font-bold text-gray-900 mt-1"
                                                style={{ fontFamily: 'var(--tipografia-titulos)' }}
                                            >
                                                {serv.Titulo || serv.nombreServicio}
                                            </h3>
                                        </div>

                                        {serv.Descripcion && (
                                            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                                {serv.Descripcion}
                                            </p>
                                        )}

                                        {/* Lista de características */}
                                        {lista.length > 0 && (
                                            <div className="space-y-3 pt-2">
                                                {lista.map((itemSpec, specIdx) => (
                                                    <div key={specIdx} className="flex items-start gap-3 text-sm text-gray-700">
                                                        <DynamicIcon
                                                            name={itemSpec.icono || 'MdOutlineVerified'}
                                                            className="h-5 w-5 shrink-0 text-[var(--color-primario)] mt-0.5"
                                                        />
                                                        <span>{itemSpec.descripcion}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Acciones: Botón Catalogo / PDF */}
                                        <div className="flex flex-wrap items-center gap-4 pt-4">
                                            <Link
                                                href={buildUrl(serv.nombreServicio)}
                                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm shadow-md hover:opacity-90 transition-opacity"
                                                style={{ backgroundColor: 'var(--color-primario)' }}
                                            >
                                                <span>Ver productos de {serv.nombreServicio}</span>
                                                <DynamicIcon name="FaArrowRight" className="h-3.5 w-3.5" />
                                            </Link>

                                            {serv.PDF && (
                                                <a
                                                    href={serv.PDF}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-100 text-gray-800 font-semibold text-sm hover:bg-gray-200 transition-colors"
                                                >
                                                    <DynamicIcon name="FaFilePdf" className="h-4 w-4 text-red-500" />
                                                    <span>Descargar PDF</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>
            )}
        </main>
    );
}
