import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import DynamicIcon from '@/components/DynamicIcon';

export default function ServiciosSection({ seccionData, serviciosSitio = [], dominio, siteSlug }) {
    const getValor = (label) =>
        seccionData?.contenido?.find((item) => item.label === label)?.valor;
    console.log(seccionData)
    const subTitulo = getValor('sub_titulo');
    const titulo = getValor('titulo');
    const icono = getValor('icono');
    const descripcion = getValor('descripcion');

    // Cards del panel admin
    const todosLosItems = serviciosSitio
        .filter((grupo) => grupo.activo !== false)
        .flatMap((grupo) => grupo.servicios ?? []);

    const hayTexto = subTitulo || titulo || descripcion;
    const hayCards = todosLosItems.length > 0;

    // Si no hay nada que mostrar, no renderizar la sección
    if (!hayTexto && !hayCards) return null;

    // ── Helpers de cards ──────────────────────────────────────────────────────
    const buildUrl = (item) => {
        if (item.url && item.url.trim() !== '' && item.url.trim() !== '#') {
            return item.url.trim();
        }
        const cat = encodeURIComponent(item.titulo || '');
        if (dominio === 'plantillas') return `/plantillas/${siteSlug}/Productos?categoria=${cat}`;
        if (dominio && siteSlug && siteSlug !== dominio) return `/${dominio}/${siteSlug}/Productos?categoria=${cat}`;
        if (dominio) return `/${dominio}/Productos?categoria=${cat}`;
        return `/Productos?categoria=${cat}`;
    };

    const count = todosLosItems.length;
    const gridCols =
        count === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
            count === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' :
                count === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
                    count === 4 ? 'grid-cols-2 lg:grid-cols-4' :
                        'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';

    const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    };

    return (
        <section className="py-20 px-6 relative overflow-hidden bg-white">
            <div className="relative z-10 max-w-7xl mx-auto">

                {/* ── Bloque de texto descriptivo (plantilla) ── */}
                {hayTexto && (
                    <div className="text-start mb-14 grid-cols-2 grid">
                        <div>
                            {subTitulo && (
                                <motion.p
                                    initial={{ opacity: 0, y: -16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                    className="text-sm font-bold uppercase tracking-widest mb-3"
                                    style={{ color: 'var(--color-primario)', fontFamily: 'var(--tipografia-texto)' }}
                                >
                                    {subTitulo}
                                </motion.p>
                            )}

                            {titulo && (
                                <motion.h2
                                    initial={{ opacity: 0, y: -16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4"
                                    style={{ fontFamily: 'var(--tipografia-titulos)' }}
                                >
                                    {titulo}
                                </motion.h2>
                            )}

                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="flex items-center justify-start gap-3 my-5"
                            >
                                <div
                                    className="h-px flex-1 max-w-24"
                                    style={{ background: 'linear-gradient(to right, transparent, var(--color-primario))' }}
                                />
                                {icono ? (
                                    <DynamicIcon
                                        name={icono}
                                        className="h-6 w-6 shrink-0"
                                        style={{ color: 'var(--color-primario)' }}
                                    />
                                ) : (
                                    <div
                                        className="h-2 w-2 rounded-full shrink-0"
                                        style={{ backgroundColor: 'var(--color-primario)' }}
                                    />
                                )}
                                <div
                                    className="h-px flex-1 max-w-24"
                                    style={{ background: 'linear-gradient(to left, transparent, var(--color-primario))' }}
                                />
                            </motion.div>
                        </div>

                        {descripcion && (
                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="text-base md:text-lg leading-relaxed text-gray-600"
                                style={{ fontFamily: 'var(--tipografia-texto)' }}
                            >
                                {descripcion}
                            </motion.p>
                        )}
                    </div>
                )}

                {/* ── Grid de cards (SOLO IMAGEN + HOVER OSCURO) ── */}
                {hayCards && (
                    <motion.div
                        className={`grid gap-6 ${gridCols}`}
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                    >
                        {todosLosItems.map((item, idx) => {
                            const targetUrl = buildUrl(item);

                            return (
                                <motion.div key={item.id ?? idx} variants={cardVariants}>
                                    <Link
                                        href={targetUrl}
                                        className="group relative block overflow-hidden rounded-xl cursor-pointer shadow-md hover:shadow-2xl transition-shadow duration-300"
                                        style={{ borderRadius: 'var(--radio-bordes)' }}
                                    >
                                        {/* ── Contenedor de la imagen ── */}
                                        <div className="relative aspect-[4/3] w-full overflow-hidden">
                                            {item.imagen ? (
                                                <img
                                                    src={item.imagen}
                                                    alt={item.titulo || 'Servicio'}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            ) : (
                                                <div
                                                    className="w-full h-full flex items-center justify-center"
                                                    style={{
                                                        background: 'linear-gradient(135deg, var(--color-primario) 0%, color-mix(in srgb, var(--color-primario) 70%, #000) 100%)',
                                                    }}
                                                >
                                                    {item.icono ? (
                                                        <DynamicIcon name={item.icono} className="h-16 w-16 text-white/80" />
                                                    ) : (
                                                        <span className="text-white/60 text-6xl font-bold">
                                                            {(item.titulo || 'S').charAt(0).toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* ── Overlay oscuro en hover ── */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col items-center justify-center p-6">
                                            {/* Icono */}
                                            {item.icono && (
                                                <DynamicIcon
                                                    name={item.icono}
                                                    className="h-12 w-12 text-white mb-3 transition-transform duration-300 group-hover:scale-110"
                                                />
                                            )}
                                            {/* Título */}
                                            {item.titulo && (
                                                <h3
                                                    className="text-xl font-bold text-white text-center leading-tight transition-transform duration-300 group-hover:scale-105"
                                                    style={{ fontFamily: 'var(--tipografia-titulos)' }}
                                                >
                                                    {item.titulo}
                                                </h3>
                                            )}
                                            {/* Subtítulo opcional (si existe) */}
                                            {item.subtitulo && (
                                                <p
                                                    className="text-sm text-white/80 mt-1 text-center"
                                                    style={{ fontFamily: 'var(--tipografia-texto)' }}
                                                >
                                                    {item.subtitulo}
                                                </p>
                                            )}
                                        </div>

                                        {/* ── Efecto de borde brillante (opcional) ── */}
                                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 transition-colors duration-300 pointer-events-none"
                                            style={{ borderRadius: 'var(--radio-bordes)' }}
                                        />
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </section>
    );
}