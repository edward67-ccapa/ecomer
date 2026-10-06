import { useState, useMemo, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import DynamicIcon from '@/components/DynamicIcon';
import { useProductosData } from './hooks/useProductosData';
import { useCartStore } from '@/stores/useCartStore';

export default function SectionProductos({ dominio, siteSlug, seccion, seccionesData, productos: initialProductos, onSeleccionarProducto, estilos }) {
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

    const [busqueda, setBusqueda] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('q') || params.get('busqueda') || '';
        }
        return '';
    });
    const [filtrosSeleccionados, setFiltrosSeleccionados] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const cat = params.get('categoria');
            const sub = params.get('subcategoria');
            const mrc = params.get('marca');
            const init = {};
            if (cat) init.categoria = [cat];
            if (sub) init.subcategoria = [sub];
            if (mrc) init.marca = [mrc];
            return init;
        }
        return {};
    });

    const [soloOfertas, setSoloOfertas] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('oferta') === '1' || params.get('ofertas') === '1' || params.get('solo_ofertas') === '1';
        }
        return false;
    });

    const [soloLiquidacion, setSoloLiquidacion] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('liquidacion') === '1' || params.get('liquidaciones') === '1' || params.get('solo_liquidacion') === '1';
        }
        return false;
    });

    const { url: currentUrl } = usePage();
    const isCatalogoMode = Boolean(currentUrl && currentUrl.includes('catalogo=1'));
    const catalogoConfig = estilos?.catalogo || {};

    // Sincronizar filtrosSeleccionados, soloOfertas y soloLiquidacion cuando cambia la URL
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const cat = params.get('categoria');
            const sub = params.get('subcategoria');
            const mrc = params.get('marca');
            const isOfertaParam = params.get('oferta') === '1' || params.get('ofertas') === '1' || params.get('solo_ofertas') === '1';
            const isLiquidacionParam = params.get('liquidacion') === '1' || params.get('liquidaciones') === '1' || params.get('solo_liquidacion') === '1';

            setSoloOfertas(isOfertaParam);
            setSoloLiquidacion(isLiquidacionParam);

            setFiltrosSeleccionados((prev) => {
                const next = { ...prev };
                if (cat) next.categoria = [cat];
                else delete next.categoria;

                if (sub) next.subcategoria = [sub];
                else delete next.subcategoria;

                if (mrc) next.marca = [mrc];
                else delete next.marca;

                return next;
            });
        }
    }, [currentUrl]);
    const [acordeonesAbiertos, setAcordeonesAbiertos] = useState({
        precio: true,
        categoria: true,
        subcategoria: true,
        tags: true,
    });
    const [subAcordeonesAbiertos, setSubAcordeonesAbiertos] = useState({});
    const [mostrarFiltrosMovil, setMostrarFiltrosMovil] = useState(false);

    // Rango global de precios min y max calculados de la lista de productos
    const { minPrecioAbsoluto, maxPrecioAbsoluto } = useMemo(() => {
        if (!productos || productos.length === 0) {
            return { minPrecioAbsoluto: 0, maxPrecioAbsoluto: 500 };
        }
        let minP = Infinity;
        let maxP = -Infinity;

        productos.forEach((prod) => {
            const tieneOferta = Boolean(prod.precio_oferta || prod.precio_oferta_soles);
            const p = tieneOferta
                ? Number(prod.precio_oferta_soles || prod.precio_oferta)
                : Number(prod.precio_soles || prod.precio || 0);
            if (!isNaN(p) && p >= 0) {
                if (p < minP) minP = p;
                if (p > maxP) maxP = p;
            }
        });

        if (minP === Infinity) minP = 0;
        if (maxP === -Infinity) maxP = 500;

        return {
            minPrecioAbsoluto: Math.floor(minP),
            maxPrecioAbsoluto: Math.ceil(maxP),
        };
    }, [productos]);

    const [rangoPrecio, setRangoPrecio] = useState([minPrecioAbsoluto, maxPrecioAbsoluto]);

    useEffect(() => {
        setRangoPrecio([minPrecioAbsoluto, maxPrecioAbsoluto]);
    }, [minPrecioAbsoluto, maxPrecioAbsoluto]);

    const getValor = (label) =>
        seccionData?.contenido?.find(
            (item) => item.label?.toLowerCase() === label.toLowerCase()
        )?.valor;

    const subTitulo = isCatalogoMode ? 'Catálogo Especial' : (estilos?.seccion_productos?.sub_titulo || getValor('sub_titulo') || getValor('subtitulo') || '');
    const titulo = isCatalogoMode ? (catalogoConfig.titulo || 'Catálogo de Productos') : (estilos?.seccion_productos?.titulo || getValor('titulo') || getValor('title') || '');
    const icono = estilos?.seccion_productos?.icono || getValor('icono') || getValor('icon') || '';

    // Árbol jerárquico de Categorías -> Subcategorías para el desplegable dentro del desplegable
    const categoriasArbol = useMemo(() => {
        const catMap = new Map();

        productos.forEach((prod) => {
            const catNombre = typeof prod.categoria === 'object' ? prod.categoria?.nombre : prod.categoria;
            const subNombre = typeof prod.subcategoria === 'object' ? prod.subcategoria?.nombre : prod.subcategoria;

            if (!catNombre) return;

            const propiaImagenCat = typeof prod.categoria === 'object'
                ? (prod.categoria?.imagen ? (prod.categoria.imagen.startsWith('http') ? prod.categoria.imagen : `/storage/${prod.categoria.imagen.replace(/^\/?storage\//, '')}`) : null)
                : (prod.categoria_imagen || prod.categoria_objeto?.imagen || null);

            const propioIconoCat = typeof prod.categoria === 'object'
                ? (prod.categoria?.icono || null)
                : (prod.categoria_icono || prod.categoria_objeto?.icono || null);

            const fallbackImagen = prod.imagen || (Array.isArray(prod.imagenes) && prod.imagenes[0]) || null;
            const imagenFinal = propiaImagenCat || fallbackImagen;

            if (!catMap.has(catNombre)) {
                catMap.set(catNombre, {
                    nombre: catNombre,
                    count: 0,
                    subcategoriasMap: new Map(),
                    imagen: imagenFinal,
                    tienePropiaImagen: Boolean(propiaImagenCat),
                    icono: propioIconoCat,
                });
            }

            const catData = catMap.get(catNombre);
            catData.count += 1;

            if (!catData.tienePropiaImagen && propiaImagenCat) {
                catData.imagen = propiaImagenCat;
                catData.tienePropiaImagen = true;
            } else if (!catData.imagen && fallbackImagen) {
                catData.imagen = fallbackImagen;
            }

            if (!catData.icono && propioIconoCat) {
                catData.icono = propioIconoCat;
            }

            if (subNombre) {
                catData.subcategoriasMap.set(subNombre, (catData.subcategoriasMap.get(subNombre) || 0) + 1);
            }
        });

        return Array.from(catMap.values()).map((catData) => ({
            nombre: catData.nombre,
            count: catData.count,
            imagen: catData.imagen,
            icono: catData.icono,
            subcategorias: Array.from(catData.subcategoriasMap.entries()).map(([subNombre, subCount]) => ({
                nombre: subNombre,
                count: subCount,
            })),
        }));
    }, [productos]);

    // Árbol de Marcas para tarjetas visuales y filtros
    const marcasArbol = useMemo(() => {
        const map = new Map();

        productos.forEach((prod) => {
            let mName = null;
            let mImg = null;

            if (prod.marca_objeto && (prod.marca_objeto.titulo || prod.marca_objeto.nombre)) {
                mName = prod.marca_objeto.titulo || prod.marca_objeto.nombre;
                mImg = prod.marca_objeto.imagen || prod.marca_objeto.logo || null;
            } else if (prod.marca && typeof prod.marca === 'string' && prod.marca.trim()) {
                mName = prod.marca.trim();
                mImg = prod.marca_imagen || null;
            }

            if (mName) {
                const key = mName.toLowerCase().trim();
                const formattedImg = mImg ? (mImg.startsWith('http') || mImg.startsWith('data:') ? mImg : `/storage/${mImg.replace(/^\/?storage\//, '')}`) : null;

                if (!map.has(key)) {
                    map.set(key, {
                        nombre: mName,
                        imagen: formattedImg,
                        count: 0,
                    });
                }
                const item = map.get(key);
                item.count += 1;
                if (!item.imagen && formattedImg) item.imagen = formattedImg;
            }
        });

        return Array.from(map.values());
    }, [productos]);

    // Grupos adicionales de filtros (tags, ocasión, marca, etc.)
    const otrosGruposFiltros = useMemo(() => {
        const clavesFiltro = ['tags', 'ocasion', 'marca'];
        const grupos = [];

        clavesFiltro.forEach((key) => {
            const opcionesMap = new Map();

            productos.forEach((prod) => {
                let val = prod[key];
                if (key === 'marca' && !val && prod.marca_objeto) {
                    val = prod.marca_objeto.titulo || prod.marca_objeto.nombre;
                }
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

    const isPrecioFiltrado = rangoPrecio[0] > minPrecioAbsoluto || rangoPrecio[1] < maxPrecioAbsoluto;

    const limpiarFiltros = () => {
        setFiltrosSeleccionados({});
        setBusqueda('');
        setRangoPrecio([minPrecioAbsoluto, maxPrecioAbsoluto]);
        setSoloOfertas(false);
        setSoloLiquidacion(false);
    };

    const totalFiltrosActivos =
        Object.values(filtrosSeleccionados).flat().length +
        (isPrecioFiltrado ? 1 : 0) +
        (soloOfertas ? 1 : 0) +
        (soloLiquidacion ? 1 : 0);

    const minPercent = maxPrecioAbsoluto > minPrecioAbsoluto
        ? Math.max(0, Math.min(100, ((rangoPrecio[0] - minPrecioAbsoluto) / (maxPrecioAbsoluto - minPrecioAbsoluto)) * 100))
        : 0;

    const maxPercent = maxPrecioAbsoluto > minPrecioAbsoluto
        ? Math.max(0, Math.min(100, ((rangoPrecio[1] - minPrecioAbsoluto) / (maxPrecioAbsoluto - minPrecioAbsoluto)) * 100))
        : 100;

    // Productos filtrados dinámicamente
    const productosFiltrados = useMemo(() => {
        return productos.filter((prod) => {
            // Coincidencia por rango de precio
            const tieneOferta = Boolean(prod.precio_oferta || prod.precio_oferta_soles);
            const pEfectivo = tieneOferta
                ? Number(prod.precio_oferta_soles || prod.precio_oferta)
                : Number(prod.precio_soles || prod.precio || 0);

            if (pEfectivo < rangoPrecio[0] || pEfectivo > rangoPrecio[1]) {
                return false;
            }

            // Coincidencia por búsqueda de texto
            const busq = busqueda.trim().toLowerCase();
            const coincideBusqueda =
                !busq ||
                prod.nombre?.toLowerCase().includes(busq) ||
                prod.descripcion?.toLowerCase().includes(busq);

            if (!coincideBusqueda) return false;

            // Filtro especial de Catálogo (si se accedió vía enlace /productos?catalogo=1)
            if (isCatalogoMode) {
                const tipoFiltro = catalogoConfig.tipo_filtro || 'todos';
                if (tipoFiltro === 'categoria') {
                    const catIds = Array.isArray(catalogoConfig.categorias)
                        ? catalogoConfig.categorias.map(String)
                        : [];
                    if (catIds.length > 0) {
                        const prodCatId = prod.categoria_id != null ? String(prod.categoria_id) : null;
                        const prodCatNombre = typeof prod.categoria === 'object' ? prod.categoria?.nombre : prod.categoria;
                        if ((!prodCatId || !catIds.includes(prodCatId)) && (!prodCatNombre || !catIds.includes(prodCatNombre))) {
                            return false;
                        }
                    }
                } else if (tipoFiltro === 'subcategoria') {
                    const subCatIds = Array.isArray(catalogoConfig.subcategorias)
                        ? catalogoConfig.subcategorias.map(String)
                        : [];
                    if (subCatIds.length > 0) {
                        const prodSubId = prod.subcategoria_id != null ? String(prod.subcategoria_id) : null;
                        const prodSubNombre = typeof prod.subcategoria === 'object' ? prod.subcategoria?.nombre : prod.subcategoria;
                        if ((!prodSubId || !subCatIds.includes(prodSubId)) && (!prodSubNombre || !subCatIds.includes(prodSubNombre))) {
                            return false;
                        }
                    }
                }
            }

            // Coincidencia por solo ofertas
            const esProductoEnOferta = Boolean(
                (prod.precio_oferta != null && Number(prod.precio_oferta) > 0) ||
                (prod.precio_oferta_soles != null && Number(prod.precio_oferta_soles) > 0) ||
                prod.en_oferta ||
                prod.es_oferta
            );

            if (soloOfertas && !esProductoEnOferta) {
                return false;
            }

            // Coincidencia por solo liquidación
            const esLiquidacion = Boolean(
                prod.es_liquidacion ||
                prod.precio == null ||
                prod.precio_soles == null ||
                (Number(prod.precio || prod.precio_soles || 0) === 0 && !prod.precio_oferta && !prod.precio_oferta_soles)
            );

            if (soloLiquidacion && !esLiquidacion) {
                return false;
            }

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

            // Coincidencia por marca
            const marcaSeleccionadas = filtrosSeleccionados.marca || [];
            if (marcaSeleccionadas.length > 0) {
                const prodMarcaNombre = prod.marca_objeto?.titulo || prod.marca_objeto?.nombre || (typeof prod.marca === 'string' ? prod.marca : null);
                if (!prodMarcaNombre || !marcaSeleccionadas.includes(prodMarcaNombre)) {
                    return false;
                }
            }

            // Coincidencia por cada otro grupo de filtros seleccionado
            return Object.entries(filtrosSeleccionados).every(([grupoKey, valoresSeleccionados]) => {
                if (grupoKey === 'categoria' || grupoKey === 'subcategoria' || grupoKey === 'marca') return true;
                if (!valoresSeleccionados || valoresSeleccionados.length === 0) return true;

                const valProducto = prod[grupoKey];
                if (!valProducto) return false;

                if (Array.isArray(valProducto)) {
                    return valProducto.some((v) => valoresSeleccionados.includes(v));
                }

                return valoresSeleccionados.includes(valProducto);
            });
        });
    }, [productos, busqueda, filtrosSeleccionados, rangoPrecio, soloOfertas, soloLiquidacion, isCatalogoMode, catalogoConfig]);

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
                {(subTitulo || titulo || icono || isCatalogoMode) && (
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

                        {isCatalogoMode && (
                            <>
                                <style>{`
                                    @media print {
                                        header, footer, nav, button, form, .print\\:hidden, [class*="whatsapp"], [class*="offcanvas"] {
                                            display: none !important;
                                        }
                                        body, main {
                                            background: #ffffff !important;
                                            color: #000000 !important;
                                            padding: 0 !important;
                                            margin: 0 !important;
                                        }
                                        main {
                                            padding-top: 20px !important;
                                        }
                                    }
                                `}</style>

                                <div className="mt-4 flex justify-center print:hidden">
                                    <button
                                        type="button"
                                        onClick={() => window.print()}
                                        className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primario)] px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:opacity-90 transition cursor-pointer"
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span>Descargar Catálogo (PDF)</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

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
                                className={`relative h-40 rounded-2xl transition-all duration-300 text-left group cursor-pointer overflow-hidden border ${(!filtrosSeleccionados.categoria || filtrosSeleccionados.categoria.length === 0)
                                    ? 'border-[var(--color-primario)] ring-4 ring-[var(--color-primario)]/30 scale-[1.02] shadow-xl'
                                    : 'border-gray-800 hover:border-gray-600 shadow-md hover:scale-[1.01]'
                                    } bg-gradient-to-br from-gray-950 via-gray-900 to-black p-4 flex flex-col justify-between`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />

                                <div className="relative z-20 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded border border-white/10">
                                        Catálogo
                                    </span>
                                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${(!filtrosSeleccionados.categoria || filtrosSeleccionados.categoria.length === 0)
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

                                return (
                                    <button
                                        key={cat.nombre}
                                        type="button"
                                        onClick={() => toggleFiltro('categoria', cat.nombre)}
                                        className={`relative h-40 rounded-2xl transition-all duration-300 text-left group cursor-pointer overflow-hidden border ${isSelected
                                            ? 'border-[var(--color-primario)] ring-4 ring-[var(--color-primario)]/30 scale-[1.02] shadow-xl'
                                            : 'border-gray-800 hover:border-gray-600 shadow-md hover:scale-[1.01]'
                                            } bg-neutral-950 p-4 flex flex-col justify-between`}
                                    >
                                        {/* Imagen de Fondo de la Categoría */}
                                        {cat.imagen ? (
                                            <img
                                                src={cat.imagen}
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
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-white/90 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs border border-white/10 flex items-center gap-1.5">
                                                {cat.icono && <DynamicIcon name={cat.icono} className="h-3.5 w-3.5 text-[var(--color-primario)]" />}
                                                Categoría
                                            </span>
                                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${isSelected
                                                ? 'bg-[var(--color-primario)] text-white shadow-sm'
                                                : 'bg-white/20 text-white backdrop-blur-md border border-white/20'
                                                }`}>
                                                {cat.count}
                                            </span>
                                        </div>

                                        <div className="relative z-20">
                                            <h3 className={`text-base sm:text-lg font-bold transition-colors tracking-tight ${isSelected ? 'text-[var(--color-primario)]' : 'text-white group-hover:text-[var(--color-primario)]'
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

                {/* SECCIÓN SUPERIOR: EXPLORAR POR MARCA ("Shop by Brand") */}
                {marcasArbol.length > 0 && (
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-4">
                            <h2
                                className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2"
                                style={{ fontFamily: 'var(--tipografia-titulos)' }}
                            >
                                <DynamicIcon name="FaAward" className="h-5 w-5 text-[var(--color-primario)]" />
                                <span>Explorar por Marca</span>
                            </h2>
                            <span className="text-xs font-semibold text-gray-400">
                                {marcasArbol.length} marcas disponibles
                            </span>
                        </div>

                        {/* Tarjetas de Marcas */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {marcasArbol.map((m) => {
                                const isSelected = (filtrosSeleccionados.marca || []).includes(m.nombre);

                                return (
                                    <button
                                        key={m.nombre}
                                        type="button"
                                        onClick={() => toggleFiltro('marca', m.nombre)}
                                        className={`group relative p-3 rounded-2xl border transition-all duration-300 text-left cursor-pointer flex items-center gap-3 ${isSelected
                                                ? 'border-[var(--color-primario)] bg-[var(--color-primario)]/5 ring-2 ring-[var(--color-primario)]/30 shadow-md scale-[1.02]'
                                                : 'border-gray-200/80 bg-gray-50/70 hover:bg-white hover:border-gray-300 hover:shadow-sm'
                                            }`}
                                    >
                                        {m.imagen ? (
                                            <img src={m.imagen} alt={m.nombre} className="h-9 w-9 object-contain rounded-xl p-1 bg-white border border-gray-200/60 shrink-0" />
                                        ) : (
                                            <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-[var(--color-primario)] text-white' : 'bg-gray-200/80 text-gray-500 group-hover:text-[var(--color-primario)]'
                                                }`}>
                                                <DynamicIcon name="FaAward" className="h-4 w-4" />
                                            </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <h3 className={`text-xs font-bold truncate transition-colors ${isSelected ? 'text-[var(--color-primario)]' : 'text-gray-900 group-hover:text-[var(--color-primario)]'
                                                }`}>
                                                {m.nombre}
                                            </h3>
                                            <p className="text-[10px] text-gray-400 font-medium">
                                                {m.count} {m.count === 1 ? 'producto' : 'productos'}
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
                        {productosFiltrados.length} productos encontrados
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

                        {/* Acordeones Dinámicos de Filtros (Ofertas + Liquidación + Rango de Precio + Categorías + Marcas) */}
                        <div className="space-y-4">
                            {/* FILTROS DESTACADOS: OFERTAS Y LIQUIDACIÓN */}
                            <div className="border-b border-gray-100 pb-4 space-y-2.5">
                                {/* Solo Ofertas */}
                                <button
                                    type="button"
                                    onClick={() => setSoloOfertas((prev) => !prev)}
                                    className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 cursor-pointer ${soloOfertas
                                            ? 'bg-[var(--color-primario)]/10 border-[var(--color-primario)] ring-2 ring-[var(--color-primario)]/30 shadow-md'
                                            : 'bg-gray-50/70 border-gray-200/80 hover:bg-white hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-[var(--color-primario)] text-white text-xs font-bold shadow-xs">
                                            🔥
                                        </span>
                                        <div className="text-left">
                                            <span
                                                className={`text-xs font-extrabold block leading-tight ${soloOfertas ? 'text-[var(--color-primario)]' : 'text-gray-900'
                                                    }`}
                                                style={{ fontFamily: 'var(--tipografia-titulos)' }}
                                            >
                                                Solo Ofertas
                                            </span>

                                        </div>
                                    </div>
                                    <div
                                        className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${soloOfertas ? 'bg-[var(--color-primario)]' : 'bg-gray-300'
                                            }`}
                                    >
                                        <div
                                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${soloOfertas ? 'translate-x-4' : 'translate-x-0'
                                                }`}
                                        />
                                    </div>
                                </button>

                                {/* Solo Liquidación */}
                                <button
                                    type="button"
                                    onClick={() => setSoloLiquidacion((prev) => !prev)}
                                    className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 cursor-pointer ${soloLiquidacion
                                            ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30 shadow-md'
                                            : 'bg-gray-50/70 border-gray-200/80 hover:bg-white hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500 text-white text-xs font-bold shadow-xs">
                                            🏷️
                                        </span>
                                        <div className="text-left">
                                            <span
                                                className={`text-xs font-extrabold block leading-tight ${soloLiquidacion ? 'text-amber-600' : 'text-gray-900'
                                                    }`}
                                                style={{ fontFamily: 'var(--tipografia-titulos)' }}
                                            >
                                                Liquidación
                                            </span>

                                        </div>
                                    </div>
                                    <div
                                        className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${soloLiquidacion ? 'bg-amber-500' : 'bg-gray-300'
                                            }`}
                                    >
                                        <div
                                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${soloLiquidacion ? 'translate-x-4' : 'translate-x-0'
                                                }`}
                                        />
                                    </div>
                                </button>
                            </div>

                            {/* 0. RANGO DE PRECIO (SLIDER DOBLE) */}
                            <div className="border-b border-gray-100 pb-4">
                                <button
                                    onClick={() => toggleAcordeon('precio')}
                                    className="w-full flex items-center justify-between py-2 text-sm font-bold text-gray-800 hover:text-[var(--color-primario)] transition-colors cursor-pointer"
                                    style={{ fontFamily: 'var(--tipografia-titulos)' }}
                                >
                                    <span>Rango de Precio</span>
                                    <span className="text-xs text-gray-400">
                                        {acordeonesAbiertos.precio ? '▲' : '▼'}
                                    </span>
                                </button>

                                <AnimatePresence initial={false}>
                                    {acordeonesAbiertos.precio && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden pt-2 space-y-4"
                                        >
                                            {/* Valores Min y Max */}
                                            <div className="flex items-center justify-between gap-2 text-xs font-semibold text-gray-700">
                                                <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg">
                                                    <span className="text-gray-400 font-normal">Min:</span>
                                                    <span>S/ {rangoPrecio[0]}</span>
                                                </div>
                                                <span className="text-gray-400 font-bold">-</span>
                                                <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg">
                                                    <span className="text-gray-400 font-normal">Max:</span>
                                                    <span>S/ {rangoPrecio[1]}</span>
                                                </div>
                                            </div>

                                            {/* Slider de Doble Rango */}
                                            <div className="relative w-full h-6 flex items-center select-none">
                                                {/* Barra de Fondo */}
                                                <div className="absolute inset-x-0 h-2 rounded-full bg-gray-200 pointer-events-none" />

                                                {/* Tramo Seleccionado */}
                                                <div
                                                    className="absolute h-2 rounded-full pointer-events-none transition-all duration-75"
                                                    style={{
                                                        left: `${minPercent}%`,
                                                        right: `${100 - maxPercent}%`,
                                                        backgroundColor: 'var(--color-primario)',
                                                    }}
                                                />

                                                {/* Range Input Min */}
                                                <input
                                                    type="range"
                                                    aria-label="Precio mínimo"
                                                    min={minPrecioAbsoluto}
                                                    max={maxPrecioAbsoluto}
                                                    step={1}
                                                    value={rangoPrecio[0]}
                                                    onChange={(e) => {
                                                        const val = Math.min(Number(e.target.value), rangoPrecio[1] - 1);
                                                        setRangoPrecio([val, rangoPrecio[1]]);
                                                    }}
                                                    className="absolute inset-0 w-full h-2 appearance-none bg-transparent pointer-events-none z-20 cursor-pointer
                                                    [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--color-primario)] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:appearance-none
                                                    [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[var(--color-primario)] [&::-moz-range-thumb]:shadow-md"
                                                />

                                                {/* Range Input Max */}
                                                <input
                                                    type="range"
                                                    aria-label="Precio máximo"
                                                    min={minPrecioAbsoluto}
                                                    max={maxPrecioAbsoluto}
                                                    step={1}
                                                    value={rangoPrecio[1]}
                                                    onChange={(e) => {
                                                        const val = Math.max(Number(e.target.value), rangoPrecio[0] + 1);
                                                        setRangoPrecio([rangoPrecio[0], val]);
                                                    }}
                                                    className="absolute inset-0 w-full h-2 appearance-none bg-transparent pointer-events-none z-30 cursor-pointer
                                                    [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--color-primario)] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:appearance-none
                                                    [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[var(--color-primario)] [&::-moz-range-thumb]:shadow-md"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

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

                        {/* BANNER PRODUCTOS (Debajo del filtro, con el mismo ancho del panel de filtros) */}
                        {(() => {
                            if (!seccionesData) return null;
                            const normalize = (str) =>
                                String(str || '')
                                    .toLowerCase()
                                    .normalize('NFD')
                                    .replace(/[\u0300-\u036f]/g, '')
                                    .replace(/[-_ ]/g, '');

                            const list = Array.isArray(seccionesData) ? seccionesData : Object.values(seccionesData);
                            const banerObj = list.find((s) => {
                                const norm = normalize(s?.slug || s?.nombre || '');
                                return norm === 'banerproducto' || norm === 'banerproductos' || norm.includes('banerproducto');
                            });

                            if (!banerObj || !banerObj.contenido) return null;
                            const itemImg = banerObj.contenido.find(
                                (c) => c.label?.toLowerCase() === 'imagen' || c.tipo === 'imagen' || c.label?.toLowerCase() === 'img'
                            );
                            const val = itemImg?.valor;
                            const imgUrl = Array.isArray(val) ? val[0] : (typeof val === 'string' ? val : null);
                            const enlace = itemImg?.enlace || banerObj.enlace || null;

                            if (!imgUrl) return null;

                            return (
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    {enlace ? (
                                        <a
                                            href={enlace}
                                            target={enlace.startsWith('http') ? '_blank' : '_self'}
                                            rel="noopener noreferrer"
                                            className="block overflow-hidden rounded-2xl shadow-xs hover:shadow-md transition-all group"
                                        >
                                            <img
                                                src={imgUrl}
                                                alt="Banner Producto"
                                                className="w-full h-auto object-cover rounded-2xl group-hover:scale-102 transition-transform duration-300"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </a>
                                    ) : (
                                        <div className="overflow-hidden rounded-2xl shadow-xs">
                                            <img
                                                src={imgUrl}
                                                alt="Banner Producto"
                                                className="w-full h-auto object-cover rounded-2xl"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
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

                                    const pSolesReg = prod.precio_soles != null && prod.precio_soles !== '' ? Number(prod.precio_soles) : (prod.precio != null && prod.precio !== '' ? Number(prod.precio) : 0);
                                    const pSolesOfe = prod.precio_oferta_soles != null && prod.precio_oferta_soles !== '' ? Number(prod.precio_oferta_soles) : (prod.precio_oferta != null && prod.precio_oferta !== '' ? Number(prod.precio_oferta) : 0);

                                    const pDolReg = prod.precio_dolares != null && prod.precio_dolares !== '' ? Number(prod.precio_dolares) : 0;
                                    const pDolOfe = prod.precio_oferta_dolares != null && prod.precio_oferta_dolares !== '' ? Number(prod.precio_oferta_dolares) : 0;

                                    const tieneOfertaSoles = pSolesOfe > 0 && (pSolesReg === 0 || pSolesOfe < pSolesReg);
                                    const precioSolesEfectivo = tieneOfertaSoles ? pSolesOfe : pSolesReg;
                                    const descSolesPercent = tieneOfertaSoles && pSolesReg > 0 && pSolesReg > pSolesOfe
                                        ? Math.round(((pSolesReg - pSolesOfe) / pSolesReg) * 100)
                                        : null;

                                    const tieneOfertaDolares = pDolOfe > 0 && (pDolReg === 0 || pDolOfe < pDolReg);
                                    const precioDolaresEfectivo = tieneOfertaDolares ? pDolOfe : pDolReg;
                                    const descDolaresPercent = tieneOfertaDolares && pDolReg > 0 && pDolReg > pDolOfe
                                        ? Math.round(((pDolReg - pDolOfe) / pDolReg) * 100)
                                        : null;

                                     const tieneOferta = tieneOfertaSoles || tieneOfertaDolares || Boolean(prod.en_oferta || prod.es_oferta);
                                    const descOferta = descSolesPercent || descDolaresPercent;

                                    const esProdLiquidacion = Boolean(
                                        prod.es_liquidacion ||
                                        prod.liquidacion ||
                                        prod.is_liquidacion ||
                                        prod.precio == null ||
                                        prod.precio_soles == null ||
                                        (Number(prod.precio || prod.precio_soles || 0) === 0 && !prod.precio_oferta && !prod.precio_oferta_soles)
                                    );
                                    const stockVal = prod.stock !== null && prod.stock !== undefined ? Number(prod.stock) : null;
                                    const stockTexto = prod.cantidad ? String(prod.cantidad).trim() : null;

                                    const categoriaTexto = typeof prod.categoria === 'object' ? prod.categoria?.nombre : prod.categoria;

                                    return (
                                        <motion.div
                                            key={prod.id || idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: idx * 0.04 }}
                                            onClick={() => {
                                                if (onSeleccionarProducto) {
                                                    onSeleccionarProducto(prod);
                                                } else if (typeof window !== 'undefined') {
                                                    const url = new URL(window.location.href);
                                                    url.searchParams.set('producto', prod.slug || prod.id);
                                                    window.history.pushState({}, '', url.toString());
                                                    window.dispatchEvent(new PopStateEvent('popstate'));
                                                    window.scrollTo(0, 0);
                                                }
                                            }}
                                            className="bg-white border border-gray-200 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between h-full relative cursor-pointer hover:shadow-lg transition-all duration-300 group"
                                        >
                                            {/* Imagen del Producto */}
                                            <div className="relative aspect-square w-full mb-3 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden" style={{ aspectRatio: '1/1', width: '100%', maxHeight: '280px' }}>

                                                {/* Badge LIQUIDACIÓN arriba a la izquierda */}
                                                {esProdLiquidacion && (
                                                    <span className="absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white shadow-md">
                                                        🏷️ Liquidación
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
                                                className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-[var(--color-primario)] transition-colors line-clamp-2 min-h-[2.4rem] leading-snug mb-1"
                                                title={prod.nombre}
                                                style={{ fontFamily: 'var(--tipografia-titulos)' }}
                                            >
                                                {prod.nombre}
                                            </h3>

                                            {/* Indicador de Stock */}
                                            {stockVal !== null ? (
                                                stockVal > 5 ? (
                                                    <div className="text-[10px] font-extrabold text-emerald-600 flex items-center gap-1 mb-1">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        <span>Stock: {stockVal} unids.</span>
                                                    </div>
                                                ) : stockVal > 0 ? (
                                                    <div className="text-[10px] font-black text-amber-600 flex items-center gap-1 mb-1">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                                                        <span>¡Últimas {stockVal} unids!</span>
                                                    </div>
                                                ) : (
                                                    <div className="text-[10px] font-black text-red-600 flex items-center gap-1 mb-1">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                                        <span>Agotado</span>
                                                    </div>
                                                )
                                            ) : stockTexto ? (
                                                <div className="text-[10px] font-semibold text-gray-500 flex items-center gap-1 mb-1">
                                                    <span>📦 {stockTexto}</span>
                                                </div>
                                            ) : null}

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
                                            <div className="mt-auto pt-2 flex flex-col gap-1 mb-2">
                                                {/* 1. Precio en Soles */}
                                                {precioSolesEfectivo > 0 && (
                                                    <div className="flex items-baseline gap-1.5 flex-wrap">
                                                        <span className="text-xs font-black text-[#0089CF]">S/</span>
                                                        <span className="text-2xl sm:text-3xl font-black text-[#0089CF] tracking-tight leading-none">
                                                            {precioSolesEfectivo.toFixed(0)}
                                                        </span>
                                                        {tieneOfertaSoles && descSolesPercent && (
                                                            <span className="bg-[#0089CF] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-xs leading-none">
                                                                -{descSolesPercent}%
                                                            </span>
                                                        )}
                                                        {tieneOfertaSoles && pSolesReg > precioSolesEfectivo && (
                                                            <span className="text-xs text-gray-400 line-through font-semibold ml-1">
                                                                S/ {pSolesReg.toFixed(0)}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* 2. Precio en Dólares (sin conversión, con $) */}
                                                {precioDolaresEfectivo > 0 && (
                                                    <div className="flex items-baseline gap-1 flex-wrap text-emerald-700 font-black">
                                                        <span className="text-xs font-black text-emerald-600">$</span>
                                                        <span className="text-lg sm:text-xl font-black tracking-tight leading-none text-emerald-700">
                                                            {precioDolaresEfectivo}
                                                        </span>
                                                        <span className="text-[10px] font-extrabold text-emerald-600">USD</span>
                                                        {tieneOfertaDolares && descDolaresPercent && (
                                                            <span className="bg-emerald-600 text-white text-[9px] font-extrabold px-1 py-0.5 rounded-xs leading-none ml-1">
                                                                -{descDolaresPercent}%
                                                            </span>
                                                        )}
                                                        {tieneOfertaDolares && pDolReg > precioDolaresEfectivo && (
                                                            <span className="text-xs text-gray-400 line-through font-normal ml-1">
                                                                $ {pDolReg}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                {/* 3. Liquidación / Sin precio */}
                                                {(!precioSolesEfectivo || precioSolesEfectivo <= 0) && (!precioDolaresEfectivo || precioDolaresEfectivo <= 0) && (
                                                    <div>
                                                        <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                                                            Consultar precio / Liquidación
                                                        </span>
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
                                <p className="text-base font-medium mb-1">No se encontraron productos</p>
                                <p className="text-xs">Intenta desmarcar algunos filtros del panel izquierdo o cambiar tu búsqueda.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
