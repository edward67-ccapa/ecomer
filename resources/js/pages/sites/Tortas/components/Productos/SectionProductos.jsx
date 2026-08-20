import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DynamicIcon from '@/components/DynamicIcon';
import { useProductosData } from './hooks/useProductosData';
import { useCartStore } from '@/stores/useCartStore';

export default function SectionProductos({ dominio, siteSlug, seccion, seccionesData, productos: initialProductos }) {
    const addItem = useCartStore((state) => state.addItem);
    const { seccionData, productos, loading, error } = useProductosData(
        dominio,
        siteSlug,
        seccion,
        seccionesData,
        initialProductos
    );

    const [cargandoPantalla, setCargandoPantalla] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setCargandoPantalla(false), 350);
        return () => clearTimeout(timer);
    }, []);

    const [busqueda, setBusqueda] = useState('');
    const [filtrosSeleccionados, setFiltrosSeleccionados] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const cat = params.get('categoria');
            if (cat) {
                return { categoria: [cat] };
            }
        }
        return {};
    });
    const [acordeonesAbiertos, setAcordeonesAbiertos] = useState({
        categoria: true,
        subcategoria: true,
        tags: true,
    });
    const [mostrarFiltrosMovil, setMostrarFiltrosMovil] = useState(false);

    const getValor = (label) => seccionData?.contenido?.find((item) => item.label === label)?.valor;

    const subTitulo = getValor('sub_titulo') || 'Catálogo Completo';
    const titulo = getValor('titulo') || 'Nuestras Tortas y Creaciones';
    const icono = getValor('icono') || 'FaRegHeart';

    // Atributos dinámicos que se pueden usar para filtrar (se escanean automáticamente de los productos)
    const gruposFiltros = useMemo(() => {
        const clavesFiltro = ['categoria', 'subcategoria', 'tags', 'ocasion', 'marca'];
        const grupos = [];

        clavesFiltro.forEach((key) => {
            const opcionesMap = new Map();

            productos.forEach((prod) => {
                const val = prod[key];
                if (!val) return;

                if (Array.isArray(val)) {
                    val.forEach((v) => {
                        if (v) opcionesMap.set(v, (opcionesMap.get(v) || 0) + 1);
                    });
                } else {
                    opcionesMap.set(val, (opcionesMap.get(val) || 0) + 1);
                }
            });

            if (opcionesMap.size > 0) {
                grupos.push({
                    key,
                    titulo: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
                    opciones: Array.from(opcionesMap.entries()).map(([nombre, count]) => ({
                        nombre,
                        count,
                    })),
                });
            }
        });

        return grupos;
    }, [productos]);

    // Manejar selección / deselección de un filtro
    const toggleFiltro = (grupoKey, opcionNombre) => {
        setFiltrosSeleccionados((prev) => {
            const grupoActual = prev[grupoKey] || [];
            const yaExiste = grupoActual.includes(opcionNombre);

            const nuevoGrupo = yaExiste
                ? grupoActual.filter((item) => item !== opcionNombre)
                : [...grupoActual, opcionNombre];

            if (nuevoGrupo.length === 0) {
                const copy = { ...prev };
                delete copy[grupoKey];
                return copy;
            }

            return { ...prev, [grupoKey]: nuevoGrupo };
        });
    };

    const toggleAcordeon = (grupoKey) => {
        setAcordeonesAbiertos((prev) => ({
            ...prev,
            [grupoKey]: !prev[grupoKey],
        }));
    };

    const limpiarFiltros = () => {
        setFiltrosSeleccionados({});
        setBusqueda('');
    };

    const totalFiltrosActivos = Object.values(filtrosSeleccionados).flat().length;

    // Productos filtrados dinámicamente
    const productosFiltrados = useMemo(() => {
        return productos.filter((prod) => {
            // Coincidencia por búsqueda de texto
            const coincideBusqueda =
                !busqueda.trim() ||
                prod.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
                prod.descripcion?.toLowerCase().includes(busqueda.toLowerCase());

            if (!coincideBusqueda) return false;

            // Coincidencia por cada grupo de filtros seleccionado (AND entre grupos, OR dentro del mismo grupo)
            return Object.entries(filtrosSeleccionados).every(([grupoKey, valoresSeleccionados]) => {
                if (!valoresSeleccionados || valoresSeleccionados.length === 0) return true;

                const valProducto = prod[grupoKey];
                if (!valProducto) return false;

                if (Array.isArray(valProducto)) {
                    return valProducto.some((v) => valoresSeleccionados.includes(v));
                }

                return valoresSeleccionados.includes(valProducto);
            });
        });
    }, [productos, busqueda, filtrosSeleccionados]);

    const whatsappUrl = 'https://wa.me/51999999999';

    if (loading || cargandoPantalla) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--color-primario)]" />
                    <span className="text-base font-semibold tracking-wide text-gray-700">Cargando catálogo...</span>
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
        <main className="flex-1 py-16 px-4 sm:px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Cabecera */}
                <div className="text-center max-w-2xl mx-auto mb-10">
                    {subTitulo && (
                        <p
                            className="text-sm font-semibold uppercase tracking-wider mb-2"
                            style={{ color: 'var(--color-primario)', fontFamily: 'var(--tipografia-texto)' }}
                        >
                            {subTitulo}
                        </p>
                    )}

                    {titulo && (
                        <h1
                            className="text-3xl md:text-5xl font-bold mb-3"
                            style={{ fontFamily: 'var(--tipografia-titulos)', color: '#1a1a2e' }}
                        >
                            {titulo}
                        </h1>
                    )}

                    {icono && (
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="flex-1 max-w-20 h-px" style={{ background: 'linear-gradient(to right, transparent, var(--color-primario))' }} />
                            <DynamicIcon name={icono} className="h-5 w-5" style={{ color: 'var(--color-primario)' }} />
                            <div className="flex-1 max-w-20 h-px" style={{ background: 'linear-gradient(to left, transparent, var(--color-primario))' }} />
                        </div>
                    )}
                </div>

                {/* Botón Filtros para Móviles */}
                <div className="lg:hidden mb-6 flex items-center justify-between gap-4">
                    <button
                        onClick={() => setMostrarFiltrosMovil(!mostrarFiltrosMovil)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 shadow-sm"
                    >
                        <span>🎛️ {mostrarFiltrosMovil ? 'Ocultar Filtros' : 'Mostrar Filtros'}</span>
                        {totalFiltrosActivos > 0 && (
                            <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-[var(--color-primario)] text-white">
                                {totalFiltrosActivos}
                            </span>
                        )}
                    </button>

                    <span className="text-xs text-gray-500 font-medium">
                        {productosFiltrados.length} tortas encontradas
                    </span>
                </div>

                {/* Layout Principal de 2 Columnas (Sidebar Izquierdo Acordeón + Grilla Derecha) */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* PANEL IZQUIERDO: Filtros en Acordeón */}
                    <aside
                        className={`w-full lg:w-72 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm lg:sticky lg:top-32 transition-all duration-300 ${mostrarFiltrosMovil ? 'block' : 'hidden lg:block'
                            }`}
                        style={{ borderRadius: 'var(--radio-bordes)' }}
                    >
                        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                            <h2
                                className="text-lg font-bold text-gray-900 flex items-center gap-2"
                                style={{ fontFamily: 'var(--tipografia-titulos)' }}
                            >
                                <span>🎛️ Filtros</span>
                            </h2>

                            {(totalFiltrosActivos > 0 || busqueda) && (
                                <button
                                    onClick={limpiarFiltros}
                                    className="text-xs font-semibold hover:underline transition-colors"
                                    style={{ color: 'var(--color-primario)' }}
                                >
                                    Limpiar todo
                                </button>
                            )}
                        </div>

                        {/* Acordeones Dinámicos de Filtros */}
                        {gruposFiltros.length > 0 ? (
                            <div className="space-y-4">
                                {gruposFiltros.map((grupo) => {
                                    const isOpen = acordeonesAbiertos[grupo.key] ?? true;
                                    const seleccionadosGrupo = filtrosSeleccionados[grupo.key] || [];

                                    return (
                                        <div key={grupo.key} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                            <button
                                                onClick={() => toggleAcordeon(grupo.key)}
                                                className="w-full flex items-center justify-between py-2 text-sm font-bold text-gray-800 hover:text-[var(--color-primario)] transition-colors"
                                                style={{ fontFamily: 'var(--tipografia-titulos)' }}
                                            >
                                                <span>{grupo.titulo}</span>
                                                <span className="text-xs text-gray-400">
                                                    {isOpen ? '▲' : '▼'}
                                                </span>
                                            </button>

                                            <AnimatePresence initial={false}>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden pt-2 space-y-2"
                                                    >
                                                        {grupo.opciones.map((opcion) => {
                                                            const isChecked = seleccionadosGrupo.includes(opcion.nombre);
                                                            return (
                                                                <label
                                                                    key={opcion.nombre}
                                                                    className="flex items-center justify-between text-xs text-gray-600 hover:text-gray-900 cursor-pointer group py-1"
                                                                >
                                                                    <div className="flex items-center gap-2.5">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={isChecked}
                                                                            onChange={() => toggleFiltro(grupo.key, opcion.nombre)}
                                                                            className="rounded border-gray-300 text-[var(--color-primario)] focus:ring-[var(--color-primario)]"
                                                                        />
                                                                        <span className={isChecked ? 'font-bold text-[var(--color-primario)]' : ''}>
                                                                            {opcion.nombre}
                                                                        </span>
                                                                    </div>
                                                                    <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                                                                        {opcion.count}
                                                                    </span>
                                                                </label>
                                                            );
                                                        })}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 py-2">No hay filtros adicionales disponibles.</p>
                        )}
                    </aside>

                    {/* COLUMNA DERECHA: Buscador + Grilla de Productos */}
                    <div className="flex-1 w-full">
                        {/* Barra Superior con Buscador */}
                        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="relative w-full sm:w-96">
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre o ingrediente..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    className="w-full px-4 py-2 pl-10 rounded-full border border-gray-200 focus:border-[var(--color-primario)] focus:ring-2 focus:ring-[var(--color-primario)]/20 outline-none transition-all text-xs sm:text-sm"
                                    style={{ borderRadius: 'var(--radio-bordes)' }}
                                />
                                <span className="absolute left-3.5 top-2.5 text-gray-400 text-xs">🔍</span>
                            </div>

                            <span className="text-xs font-semibold text-gray-500">
                                Mostrando {productosFiltrados.length} de {productos.length} productos
                            </span>
                        </div>

                        {/* Grilla de Productos */}
                        {productosFiltrados.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {productosFiltrados.map((prod, idx) => (
                                    <motion.div
                                        key={prod.id || idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: idx * 0.04 }}
                                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group"
                                        style={{ borderRadius: 'var(--radio-bordes)' }}
                                    >
                                        {/* Imagen del Producto */}
                                        <div className="relative h-60 overflow-hidden bg-gray-50">
                                            {prod.imagen ? (
                                                <img
                                                    src={prod.imagen}
                                                    alt={prod.nombre}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
                                                    🎂
                                                </div>
                                            )}

                                            {prod.categoria && (
                                                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full shadow-sm text-gray-700">
                                                    {prod.categoria}
                                                </span>
                                            )}
                                        </div>

                                        {/* Contenido Card */}
                                        <div className="p-5 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3
                                                    className="text-lg font-bold mb-2 group-hover:text-[var(--color-primario)] transition-colors"
                                                    style={{ fontFamily: 'var(--tipografia-titulos)', color: '#1a1a2e' }}
                                                >
                                                    {prod.nombre}
                                                </h3>

                                                {prod.descripcion && (
                                                    <p
                                                        className="text-xs text-gray-500 line-clamp-3 mb-4 leading-relaxed"
                                                        style={{ fontFamily: 'var(--tipografia-texto)' }}
                                                    >
                                                        {prod.descripcion}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
                                                <div>
                                                    <span className="text-[10px] text-gray-400 block font-medium">Precio</span>
                                                    <span
                                                        className="text-lg font-extrabold"
                                                        style={{ color: 'var(--color-primario)', fontFamily: 'var(--tipografia-titulos)' }}
                                                    >
                                                        {prod.precio_soles ? `S/ ${prod.precio_soles}` : (prod.precio_dolares ? `$ ${prod.precio_dolares}` : `S/ ${prod.precio}`)}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => addItem(prod)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 transition shadow-xs cursor-pointer active:scale-95"
                                                        style={{ borderRadius: 'var(--radio-bordes)', background: 'var(--color-primario)' }}
                                                        title="Agregar al carrito"
                                                    >
                                                        <DynamicIcon name="FaCartShopping" className="h-3.5 w-3.5 text-white" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100 shadow-sm">
                                <p className="text-base font-medium mb-1">No se encontraron tortas</p>
                                <p className="text-xs">Intenta desmarcar algunos filtros del panel izquierdo o cambiar tu búsqueda.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
