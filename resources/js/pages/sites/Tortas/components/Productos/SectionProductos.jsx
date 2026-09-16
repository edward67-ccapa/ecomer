import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DynamicIcon from '@/components/DynamicIcon';
import { useProductosData } from './hooks/useProductosData';
import { useCartStore } from '@/stores/useCartStore';

export default function SectionProductos({ dominio, siteSlug, seccion, seccionesData, productos: initialProductos }) {
    const addItem = useCartStore((state) => state.addItem);
    const cartItems = useCartStore((state) => state.items);

    const isInCart = (prod) => {
        const prodId = prod.id || prod.nombre;
        return (cartItems || []).some((item) => (item.id || item.nombre) === prodId);
    };

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
    const [subAcordeonesAbiertos, setSubAcordeonesAbiertos] = useState({});
    const [mostrarFiltrosMovil, setMostrarFiltrosMovil] = useState(false);

    const getValor = (label) => seccionData?.contenido?.find((item) => item.label === label)?.valor;

    const subTitulo = getValor('sub_titulo') || 'Catálogo Completo';
    const titulo = getValor('titulo') || 'Nuestras Tortas y Creaciones';
    const icono = getValor('icono') || 'FaRegHeart';

    // Árbol jerárquico de Categorías -> Subcategorías para el desplegable dentro del desplegable
    const categoriasArbol = useMemo(() => {
        const catMap = new Map();

        productos.forEach((prod) => {
            const cat = typeof prod.categoria === 'object' ? prod.categoria?.nombre : prod.categoria;
            const sub = typeof prod.subcategoria === 'object' ? prod.subcategoria?.nombre : prod.subcategoria;

            if (!cat) return;

            if (!catMap.has(cat)) {
                catMap.set(cat, {
                    nombre: cat,
                    count: 0,
                    subcategoriasMap: new Map(),
                });
            }

            const catData = catMap.get(cat);
            catData.count += 1;

            if (sub) {
                catData.subcategoriasMap.set(sub, (catData.subcategoriasMap.get(sub) || 0) + 1);
            }
        });

        return Array.from(catMap.values()).map((catData) => ({
            nombre: catData.nombre,
            count: catData.count,
            subcategorias: Array.from(catData.subcategoriasMap.entries()).map(([subNombre, subCount]) => ({
                nombre: subNombre,
                count: subCount,
            })),
        }));
    }, [productos]);

    // Grupos adicionales de filtros (tags, ocasión, marca, etc.)
    const otrosGruposFiltros = useMemo(() => {
        const clavesFiltro = ['tags', 'ocasion', 'marca'];
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

    const toggleSubAcordeon = (catNombre) => {
        setSubAcordeonesAbiertos((prev) => ({
            ...prev,
            [catNombre]: !prev[catNombre],
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
            const busq = busqueda.trim().toLowerCase();
            const coincideBusqueda =
                !busq ||
                prod.nombre?.toLowerCase().includes(busq) ||
                prod.descripcion?.toLowerCase().includes(busq);

            if (!coincideBusqueda) return false;

            // Coincidencia por categoría
            const prodCat = typeof prod.categoria === 'object' ? prod.categoria?.nombre : prod.categoria;
            const catSeleccionadas = filtrosSeleccionados.categoria || [];
            if (catSeleccionadas.length > 0 && (!prodCat || !catSeleccionadas.includes(prodCat))) {
                return false;
            }

            // Coincidencia por subcategoría
            const prodSub = typeof prod.subcategoria === 'object' ? prod.subcategoria?.nombre : prod.subcategoria;
            const subSeleccionadas = filtrosSeleccionados.subcategoria || [];
            if (subSeleccionadas.length > 0 && (!prodSub || !subSeleccionadas.includes(prodSub))) {
                return false;
            }

            // Coincidencia por cada otro grupo de filtros seleccionado
            return Object.entries(filtrosSeleccionados).every(([grupoKey, valoresSeleccionados]) => {
                if (grupoKey === 'categoria' || grupoKey === 'subcategoria') return true;
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
        <main className="flex-1 pb-16 pt-40 px-4 sm:px-6 bg-white">
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

                {/* SECCIÓN SUPERIOR: EXPLORAR POR CATEGORÍA ("Shop by Category") */}
                {categoriasArbol.length > 0 && (
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-4">
                            <h2
                                className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight"
                                style={{ fontFamily: 'var(--tipografia-titulos)' }}
                            >
                                Explorar por Categoría
                            </h2>
                            <span className="text-xs font-semibold text-gray-400">
                                {categoriasArbol.length} categorías disponibles
                            </span>
                        </div>

                        {/* Tarjetas Visuales Negras / Dark Cards de Categorías */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {/* Opción 'Todas' */}
                            <button
                                type="button"
                                onClick={() => {
                                    setFiltrosSeleccionados((prev) => {
                                        const copy = { ...prev };
                                        delete copy.categoria;
                                        delete copy.subcategoria;
                                        return copy;
                                    });
                                }}
                                className={`relative h-40 rounded-2xl transition-all duration-300 text-left group cursor-pointer overflow-hidden border ${
                                    (!filtrosSeleccionados.categoria || filtrosSeleccionados.categoria.length === 0)
                                        ? 'border-[var(--color-primario)] ring-4 ring-[var(--color-primario)]/30 scale-[1.02] shadow-xl'
                                        : 'border-gray-800 hover:border-gray-600 shadow-md hover:scale-[1.01]'
                                } bg-gradient-to-br from-gray-950 via-gray-900 to-black p-4 flex flex-col justify-between`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />

                                <div className="relative z-20 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded border border-white/10">
                                        Catálogo
                                    </span>
                                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                                        (!filtrosSeleccionados.categoria || filtrosSeleccionados.categoria.length === 0)
                                            ? 'bg-[var(--color-primario)] text-white shadow-sm'
                                            : 'bg-white/20 text-white backdrop-blur-md border border-white/10'
                                    }`}>
                                        {productos.length} items
                                    </span>
                                </div>

                                <div className="relative z-20">
                                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[var(--color-primario)] transition-colors tracking-tight">
                                        Todas
                                    </h3>
                                    <p className="text-[11px] text-gray-300 font-medium">Ver todo el catálogo</p>
                                </div>
                            </button>

                            {/* Tarjetas por Categoría */}
                            {categoriasArbol.map((cat) => {
                                const isSelected = (filtrosSeleccionados.categoria || []).includes(cat.nombre);
                                const prodConImagen = productos.find((p) => {
                                    const c = typeof p.categoria === 'object' ? p.categoria?.nombre : p.categoria;
                                    return c === cat.nombre && p.imagen;
                                });

                                return (
                                    <button
                                        key={cat.nombre}
                                        type="button"
                                        onClick={() => toggleFiltro('categoria', cat.nombre)}
                                        className={`relative h-40 rounded-2xl transition-all duration-300 text-left group cursor-pointer overflow-hidden border ${
                                            isSelected
                                                ? 'border-[var(--color-primario)] ring-4 ring-[var(--color-primario)]/30 scale-[1.02] shadow-xl'
                                                : 'border-gray-800 hover:border-gray-600 shadow-md hover:scale-[1.01]'
                                        } bg-neutral-950 p-4 flex flex-col justify-between`}
                                    >
                                        {/* Imagen de Fondo Real del Producto con Nitidez */}
                                        {prodConImagen?.imagen ? (
                                            <img
                                                src={prodConImagen.imagen}
                                                alt={cat.nombre}
                                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
                                        )}

                                        {/* Superposición Oscura Elegante */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 group-hover:via-black/40 transition-colors z-10" />

                                        {/* Contenido en la Tarjeta */}
                                        <div className="relative z-20 flex items-center justify-between">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-white/90 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs border border-white/10">
                                                Categoría
                                            </span>
                                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                                                isSelected
                                                    ? 'bg-[var(--color-primario)] text-white shadow-sm'
                                                    : 'bg-white/20 text-white backdrop-blur-md border border-white/20'
                                            }`}>
                                                {cat.count}
                                            </span>
                                        </div>

                                        <div className="relative z-20">
                                            <h3 className={`text-base sm:text-lg font-bold transition-colors tracking-tight ${
                                                isSelected ? 'text-[var(--color-primario)]' : 'text-white group-hover:text-[var(--color-primario)]'
                                            }`}>
                                                {cat.nombre}
                                            </h3>
                                            <p className="text-[11px] text-gray-300 font-medium">
                                                {cat.subcategorias.length > 0
                                                    ? `${cat.subcategorias.length} subcategorías`
                                                    : `${cat.count} ${cat.count === 1 ? 'producto' : 'productos'}`}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

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

                        {/* Acordeones Dinámicos de Filtros (Categorías anidadas con subcategorías + otros grupos) */}
                        <div className="space-y-4">
                            {/* 1. GRUPO CATEGORÍAS CON DESPLEGABLES ANIDADOS */}
                            {categoriasArbol.length > 0 && (
                                <div className="border-b border-gray-100 pb-4">
                                    <button
                                        onClick={() => toggleAcordeon('categoria')}
                                        className="w-full flex items-center justify-between py-2 text-sm font-bold text-gray-800 hover:text-[var(--color-primario)] transition-colors cursor-pointer"
                                        style={{ fontFamily: 'var(--tipografia-titulos)' }}
                                    >
                                        <span>Categorías</span>
                                        <span className="text-xs text-gray-400">
                                            {acordeonesAbiertos.categoria ? '▲' : '▼'}
                                        </span>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {acordeonesAbiertos.categoria && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden pt-2 space-y-2"
                                            >
                                                {categoriasArbol.map((cat) => {
                                                    const hasSubcats = cat.subcategorias.length > 0;
                                                    const isCatChecked = (filtrosSeleccionados.categoria || []).includes(cat.nombre);
                                                    const autoOpenSub = isCatChecked || cat.subcategorias.some((sub) => (filtrosSeleccionados.subcategoria || []).includes(sub.nombre));
                                                    const isSubOpen = subAcordeonesAbiertos[cat.nombre] ?? autoOpenSub;

                                                    return (
                                                        <div key={cat.nombre} className="space-y-1">
                                                            {/* Fila Principal de la Categoría */}
                                                            <div className="flex items-center justify-between text-xs text-gray-700 hover:text-gray-900 group py-1">
                                                                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                                                    {hasSubcats ? (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => toggleSubAcordeon(cat.nombre)}
                                                                            className="p-1 text-[10px] font-bold text-gray-500 hover:text-[var(--color-primario)] transition-colors rounded hover:bg-gray-100 cursor-pointer"
                                                                            title={isSubOpen ? 'Ocultar subcategorías' : 'Ver subcategorías'}
                                                                        >
                                                                            {isSubOpen ? '▼' : '▶'}
                                                                        </button>
                                                                    ) : (
                                                                        <span className="w-4 inline-block shrink-0" />
                                                                    )}

                                                                    <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={isCatChecked}
                                                                            onChange={() => toggleFiltro('categoria', cat.nombre)}
                                                                            className="rounded border-gray-300 text-[var(--color-primario)] focus:ring-[var(--color-primario)]"
                                                                        />
                                                                        <span className={`truncate ${isCatChecked ? 'font-bold text-[var(--color-primario)]' : ''}`}>
                                                                            {cat.nombre}
                                                                        </span>
                                                                    </label>
                                                                </div>

                                                                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium ml-2 shrink-0">
                                                                    {cat.count}
                                                                </span>
                                                            </div>

                                                            {/* Desplegable Anidado de Subcategorías */}
                                                            {hasSubcats && (
                                                                <AnimatePresence initial={false}>
                                                                    {isSubOpen && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, height: 0 }}
                                                                            animate={{ opacity: 1, height: 'auto' }}
                                                                            exit={{ opacity: 0, height: 0 }}
                                                                            transition={{ duration: 0.15 }}
                                                                            className="overflow-hidden border-l-2 border-gray-200 ml-4 pl-3 space-y-1 py-1"
                                                                        >
                                                                            {cat.subcategorias.map((sub) => {
                                                                                const isSubChecked = (filtrosSeleccionados.subcategoria || []).includes(sub.nombre);
                                                                                return (
                                                                                    <label
                                                                                        key={sub.nombre}
                                                                                        className="flex items-center justify-between text-xs text-gray-600 hover:text-gray-900 cursor-pointer group py-0.5"
                                                                                    >
                                                                                        <div className="flex items-center gap-2 min-w-0">
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                checked={isSubChecked}
                                                                                                onChange={() => toggleFiltro('subcategoria', sub.nombre)}
                                                                                                className="rounded border-gray-300 text-[var(--color-primario)] focus:ring-[var(--color-primario)]"
                                                                                            />
                                                                                            <span className={`truncate ${isSubChecked ? 'font-bold text-[var(--color-primario)]' : ''}`}>
                                                                                                {sub.nombre}
                                                                                            </span>
                                                                                        </div>
                                                                                        <span className="text-[9px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded font-medium ml-2 shrink-0">
                                                                                            {sub.count}
                                                                                        </span>
                                                                                    </label>
                                                                                );
                                                                            })}
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* 2. OTROS GRUPOS DE FILTROS (TAGS, OCASIóN, MARCA) */}
                            {otrosGruposFiltros.map((grupo) => {
                                const isOpen = acordeonesAbiertos[grupo.key] ?? true;
                                const seleccionadosGrupo = filtrosSeleccionados[grupo.key] || [];

                                return (
                                    <div key={grupo.key} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                        <button
                                            onClick={() => toggleAcordeon(grupo.key)}
                                            className="w-full flex items-center justify-between py-2 text-sm font-bold text-gray-800 hover:text-[var(--color-primario)] transition-colors cursor-pointer"
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
                                                                <div className="flex items-center gap-2.5 min-w-0">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isChecked}
                                                                        onChange={() => toggleFiltro(grupo.key, opcion.nombre)}
                                                                        className="rounded border-gray-300 text-[var(--color-primario)] focus:ring-[var(--color-primario)]"
                                                                    />
                                                                    <span className={`truncate ${isChecked ? 'font-bold text-[var(--color-primario)]' : ''}`}>
                                                                        {opcion.nombre}
                                                                    </span>
                                                                </div>
                                                                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium ml-2 shrink-0">
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                                {productosFiltrados.map((prod, idx) => {
                                    const inCart = isInCart(prod);
                                    const tieneOferta = Boolean(prod.precio_oferta || prod.precio_oferta_soles);
                                    const precioRegular = Number(prod.precio_soles || prod.precio || 0);
                                    const precioOferta = tieneOferta
                                        ? Number(prod.precio_oferta_soles || prod.precio_oferta)
                                        : null;

                                    // Cálculo de descuentos
                                    const descOferta = tieneOferta && precioRegular > 0
                                        ? Math.round(((precioRegular - precioOferta) / precioRegular) * 100)
                                        : null;
                                    const descRegular = descOferta ? Math.max(5, Math.round(descOferta * 0.75)) : null;
                                    const precioListaReferencial = Math.round(precioRegular * 1.3);

                                    const categoriaTexto = typeof prod.categoria === 'object' ? prod.categoria?.nombre : prod.categoria;

                                    return (
                                        <motion.div
                                            key={prod.id || idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: idx * 0.04 }}
                                            className="bg-white border border-gray-200 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between h-full relative cursor-pointer hover:shadow-lg transition-all duration-300 group"
                                        >
                                            {/* Imagen del Producto */}
                                            <div className="relative aspect-square w-full mb-3 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden" style={{ aspectRatio: '1/1', width: '100%', maxHeight: '280px' }}>
                                                {/* Badge Categoría Premium arriba a la izquierda */}
                                                {categoriaTexto && (
                                                    <span
                                                        className="absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/95 backdrop-blur-md shadow-xs border border-gray-100 text-gray-800"
                                                        style={{ fontFamily: 'var(--tipografia-texto)' }}
                                                    >
                                                        <span
                                                            className="w-1.5 h-1.5 rounded-full"
                                                            style={{ backgroundColor: 'var(--color-primario)' }}
                                                        />
                                                        <span>{categoriaTexto}</span>
                                                    </span>
                                                )}

                                                {/* Badge OFERTA arriba a la derecha */}
                                                {tieneOferta && (
                                                    <span
                                                        className="absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-md"
                                                        style={{
                                                            backgroundColor: 'var(--color-primario)',
                                                            fontFamily: 'var(--tipografia-titulos)',
                                                        }}
                                                    >
                                                        <DynamicIcon name="FaFire" className="h-2.5 w-2.5" />
                                                        <span>OFERTA</span>
                                                        {descOferta && <span className="ml-0.5 font-bold">-{descOferta}%</span>}
                                                    </span>
                                                )}

                                                {prod.imagen ? (
                                                    <img
                                                        src={prod.imagen}
                                                        alt={prod.nombre}
                                                        width={400}
                                                        height={400}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="w-full h-full max-w-full max-h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        style={{ maxWidth: '100%', maxHeight: '280px', width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '1/1' }}
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center text-gray-300 gap-1.5">
                                                        <DynamicIcon name="FaBoxOpen" className="h-12 w-12 text-gray-300" />
                                                        <span className="text-[11px] text-gray-400">Sin imagen</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Nombre del Producto */}
                                            <h3
                                                className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-[var(--color-primario)] transition-colors line-clamp-2 min-h-[2.4rem] leading-snug mb-1.5"
                                                title={prod.nombre}
                                                style={{ fontFamily: 'var(--tipografia-titulos)' }}
                                            >
                                                {prod.nombre}
                                            </h3>

                                            {/* Descripción Corta */}
                                            {(prod.descripcion_corta || prod.descripcion) && (
                                                <p
                                                    className="text-[11px] text-gray-500 line-clamp-2 min-h-[2rem] leading-relaxed mb-3"
                                                    title={prod.descripcion_corta || prod.descripcion}
                                                    style={{ fontFamily: 'var(--tipografia-texto)' }}
                                                >
                                                    {prod.descripcion_corta || prod.descripcion}
                                                </p>
                                            )}

                                            {/* Bloque de Precios */}
                                            <div className="mt-auto pt-2">
                                                {tieneOferta ? (
                                                    <>
                                                        {/* Precio Principal */}
                                                        <div className="flex items-baseline gap-1.5 mb-1 flex-wrap">
                                                            <span className="text-xs font-black text-[#0089CF]">S/</span>
                                                            <span className="text-2xl sm:text-3xl font-black text-[#0089CF] tracking-tight leading-none">
                                                                {precioOferta.toFixed(0)}
                                                            </span>
                                                            {descOferta && (
                                                                <span className="bg-[#0089CF] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-xs leading-none">
                                                                    -{descOferta}%
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Precio Regular Secundario */}
                                                        <div className="flex items-baseline gap-1.5 mb-0.5">
                                                            <span className="text-xs font-bold text-gray-900">S/</span>
                                                            <span className="text-lg font-extrabold text-gray-900 leading-none">
                                                                {precioRegular.toFixed(0)}
                                                            </span>
                                                            {descRegular && (
                                                                <span
                                                                    className="text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-xs leading-none"
                                                                    style={{ backgroundColor: 'var(--color-primario)' }}
                                                                >
                                                                    -{descRegular}%
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Precio Lista Tachado */}
                                                        <div className="text-[11px] text-gray-400 line-through leading-none mb-2">
                                                            s/ {precioListaReferencial}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="mb-3">
                                                        <div className="flex items-baseline gap-1.5">
                                                            <span className="text-xs font-black text-gray-900">S/</span>
                                                            <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-none">
                                                                {precioRegular.toFixed(0)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Botón 'Agregar' */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addItem(prod);
                                                    }}
                                                    className="w-full py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm tracking-wide cursor-pointer active:scale-98 border-2 transition-all"
                                                    style={{
                                                        backgroundColor: inCart ? 'var(--color-primario)' : '#ffffff',
                                                        borderColor: 'var(--color-primario)',
                                                        color: inCart ? '#ffffff' : 'var(--color-primario)',
                                                        fontFamily: 'var(--tipografia-titulos)',
                                                    }}
                                                >
                                                    {inCart ? 'Agregado ✓' : 'Agregar'}
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
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
