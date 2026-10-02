import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DynamicIcon from '@/components/DynamicIcon';
import { useCartStore } from '@/stores/useCartStore';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

export default function SectionProductoDetalle({
    producto,
    onVolver,
    onSeleccionarProducto,
    productosRelacionados = [],
    site = {},
    seccionesData = {},
    estilos = {},
}) {
    const addItem = useCartStore((state) => state.addItem);
    const cartItems = useCartStore((state) => state.items);

    const resolveImage = (img) => {
        if (!img) return null;
        if (img.startsWith('http://') || img.startsWith('https://')) return img;
        if (img.startsWith('/storage/')) return img;
        return `/storage/${img.replace(/^\//, '')}`;
    };

    const tieneVariantes = Boolean(producto?.variantes && producto.variantes.length > 0);

    const [cantidad, setCantidad] = useState(1);
    const [varianteSeleccionada, setVarianteSeleccionada] = useState(() => {
        if (tieneVariantes) {
            return producto.variantes.find((v) => v.activa !== false) || producto.variantes[0];
        }
        return null;
    });

    const [imagenActivaIdx, setImagenActivaIdx] = useState(0);
    const [esFavorito, setEsFavorito] = useState(false);
    const [acordeonAbierto, setAcordeonAbierto] = useState({
        descripcion: true,
        especificaciones: false,
        garantia: false,
    });
    const [agregadoAnim, setAgregadoAnim] = useState(false);

    const visorRef = useRef(null);
    const [zoomInlineScale, setZoomInlineScale] = useState(1);
    const [inlinePan, setInlinePan] = useState({ x: 50, y: 50 });

    useEffect(() => {
        setZoomInlineScale(1);
        setInlinePan({ x: 50, y: 50 });
    }, [imagenActivaIdx]);

    useEffect(() => {
        const el = visorRef.current;
        if (!el) return;

        const handleWheelNative = (e) => {
            e.preventDefault();
            e.stopPropagation();

            const rect = el.getBoundingClientRect();
            const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
            const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
            setInlinePan({ x: +x.toFixed(2), y: +y.toFixed(2) });

            if (e.deltaY < 0) {
                setZoomInlineScale((prev) => Math.min(4, +(prev + 0.25).toFixed(2)));
            } else {
                setZoomInlineScale((prev) => Math.max(1, +(prev - 0.25).toFixed(2)));
            }
        };

        el.addEventListener('wheel', handleWheelNative, { passive: false });
        return () => {
            el.removeEventListener('wheel', handleWheelNative);
        };
    }, [producto?.id, imagenActivaIdx]);

    const handleZoomIn = (e) => {
        e?.stopPropagation();
        setZoomInlineScale((prev) => Math.min(4, +(prev + 0.5).toFixed(2)));
    };

    const handleZoomOut = (e) => {
        e?.stopPropagation();
        setZoomInlineScale((prev) => Math.max(1, +(prev - 0.5).toFixed(2)));
    };

    const handleZoomReset = (e) => {
        e?.stopPropagation();
        setZoomInlineScale(1);
        setInlinePan({ x: 50, y: 50 });
    };

    const handleInlineMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
        const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
        setInlinePan({ x: +x.toFixed(2), y: +y.toFixed(2) });
    };

    const handleInlineClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
        const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
        setInlinePan({ x: +x.toFixed(2), y: +y.toFixed(2) });

        setZoomInlineScale((prev) => (prev > 1 ? 1 : 2.5));
    };

    // Resetear al cambiar de producto y posicionar arriba
    useEffect(() => {
        if (producto?.variantes && producto.variantes.length > 0) {
            const defaultVar = producto.variantes.find((v) => v.activa !== false) || producto.variantes[0];
            setVarianteSeleccionada(defaultVar);
        } else {
            setVarianteSeleccionada(null);
        }
        setCantidad(1);
        setImagenActivaIdx(0);
        window.scrollTo(0, 0);
        const timer = setTimeout(() => {
            window.scrollTo(0, 0);
        }, 50);
        return () => clearTimeout(timer);
    }, [producto?.id]);

    if (!producto) return null;

    const pSolesReg = varianteSeleccionada?.precio
        ? Number(varianteSeleccionada.precio)
        : (producto.precio_soles != null && producto.precio_soles !== '' ? Number(producto.precio_soles) : (producto.precio != null && producto.precio !== '' ? Number(producto.precio) : 0));

    const pSolesOfe = varianteSeleccionada?.precio_oferta
        ? Number(varianteSeleccionada.precio_oferta)
        : (producto.precio_oferta_soles != null && producto.precio_oferta_soles !== '' ? Number(producto.precio_oferta_soles) : (producto.precio_oferta != null && producto.precio_oferta !== '' ? Number(producto.precio_oferta) : 0));

    const pDolReg = producto.precio_dolares != null && producto.precio_dolares !== '' ? Number(producto.precio_dolares) : 0;
    const pDolOfe = producto.precio_oferta_dolares != null && producto.precio_oferta_dolares !== '' ? Number(producto.precio_oferta_dolares) : 0;

    const tieneOfertaSoles = pSolesOfe > 0 && (pSolesReg === 0 || pSolesOfe < pSolesReg);
    const precioSolesEfectivo = tieneOfertaSoles ? pSolesOfe : pSolesReg;
    const descOfertaSoles = tieneOfertaSoles && pSolesReg > 0 && pSolesReg > pSolesOfe
        ? Math.round(((pSolesReg - pSolesOfe) / pSolesReg) * 100)
        : null;

    const tieneOfertaDolares = pDolOfe > 0 && (pDolReg === 0 || pDolOfe < pDolReg);
    const precioDolaresEfectivo = tieneOfertaDolares ? pDolOfe : pDolReg;
    const descOfertaDolares = tieneOfertaDolares && pDolReg > 0 && pDolReg > pDolOfe
        ? Math.round(((pDolReg - pDolOfe) / pDolReg) * 100)
        : null;

    const tieneOferta = tieneOfertaSoles || tieneOfertaDolares;
    const descOferta = descOfertaSoles || descOfertaDolares;

    const simboloMoneda = precioSolesEfectivo > 0 ? 'S/' : (precioDolaresEfectivo > 0 ? '$' : 'S/');
    const precioActual = precioSolesEfectivo > 0 ? precioSolesEfectivo : (precioDolaresEfectivo > 0 ? precioDolaresEfectivo : 0);
    const precioBaseRegular = pSolesReg > 0 ? pSolesReg : pDolReg;
    const precioBaseOferta = pSolesOfe > 0 ? pSolesOfe : pDolOfe;

    const esLiquidacion = Boolean(
        producto.es_liquidacion ||
        producto.liquidacion ||
        producto.is_liquidacion ||
        producto.precio == null ||
        producto.precio_soles == null ||
        (Number(producto.precio || producto.precio_soles || 0) === 0 && !producto.precio_oferta && !producto.precio_oferta_soles)
    );

    const stockVal = producto.stock !== null && producto.stock !== undefined ? Number(producto.stock) : null;
    const stockTexto = producto.cantidad ? String(producto.cantidad).trim() : null;

    const almacenesTexto = producto.almacen
        || (Array.isArray(producto.almacenes) && producto.almacenes.length > 0 ? producto.almacenes.map(a => a.nombre).join(', ') : null)
        || (Array.isArray(producto.tiendas) && producto.tiendas.length > 0 ? producto.tiendas.map(t => t.nombre || t.titulo).join(', ') : null);

    // Galería combinada (imagen principal, adicionales y variantes)
    const imagenesGaleria = [
        producto.imagen,
        ...(producto.imagenes || []),
        ...(producto.variantes || []).map((v) => resolveImage(v.imagen)),
    ].filter(Boolean);
    const imagenesUnicas = [...new Set(imagenesGaleria)];

    const imagenPrincipal = imagenesUnicas[imagenActivaIdx] || producto.imagen;

    const cartId = varianteSeleccionada
        ? `${producto.id}-var-${varianteSeleccionada.id}`
        : (producto.id || producto.nombre);

    const inCart = cartItems.some((item) => (item.id || item.nombre) === cartId);

    const handleAgregar = () => {
        addItem({
            ...producto,
            id: cartId,
            producto_id: producto.id,
            variante_id: varianteSeleccionada?.id || null,
            variante_nombre: varianteSeleccionada?.nombre || null,
            nombre: varianteSeleccionada
                ? `${producto.nombre} (${varianteSeleccionada.nombre})`
                : producto.nombre,
            precio: precioActual,
            precio_regular: precioBaseRegular,
            precio_oferta: precioBaseOferta,
            imagen: varianteSeleccionada?.imagen ? resolveImage(varianteSeleccionada.imagen) : producto.imagen,
            cantidad,
        });
        setAgregadoAnim(true);
        setTimeout(() => setAgregadoAnim(false), 2000);
    };

    const getWhatsAppNumber = () => {
        const redesWa = estilos?.redes_sociales?.whatsapp
            || site?.estilos?.redes_sociales?.whatsapp
            || estilos?.telefono
            || site?.telefono;

        const parseDigits = (raw) => {
            if (!raw) return '';
            const str = String(raw).trim();
            if (!str) return '';
            const segments = str.split(/[\r\n/;,|]+/).map((s) => s.trim()).filter(Boolean);
            const firstSegment = segments[0] || str;
            const digits = firstSegment.replace(/\D/g, '');
            if (!digits) return '';
            return digits.length === 9 ? '51' + digits : digits;
        };

        if (redesWa) {
            const parsed = parseDigits(redesWa);
            if (parsed) return parsed;
        }

        const rawCmsNavActions = seccionesData?.nav?.contenido?.find((c) => c.label === 'accion_nav')?.valor;
        const cmsNavActions = Array.isArray(rawCmsNavActions) ? rawCmsNavActions : [];
        const globalActions = Array.isArray(estilos?.acciones_nav) ? estilos.acciones_nav : [];
        const combinedNavActions = [...globalActions, ...cmsNavActions];
        const accionesNav = combinedNavActions.filter((item, index, self) =>
            index === self.findIndex((t) => (t.texto || t.Texto) === (item.texto || item.Texto) && (t.icono || t.icon) === (item.icono || item.icon))
        );

        const waItem = accionesNav.find((a) => {
            const ico = (a.icono || a.icon || '').toLowerCase();
            const txt = (a.texto || a.Texto || '').toLowerCase();
            return ico.includes('whatsapp') || ico.includes('phone') || txt.includes('wa.me');
        });

        return parseDigits(waItem?.texto || waItem?.Texto || '');
    };

    const handleWhatsApp = () => {
        const tel = getWhatsAppNumber();
        if (!tel) return;
        const varTexto = varianteSeleccionada ? ` - Variante: ${varianteSeleccionada.nombre}` : '';
        const msg = `¡Hola! Me interesa comprar *${producto.nombre}${varTexto}* (Cantidad: ${cantidad}) por ${simboloMoneda} ${(precioActual * cantidad).toFixed(2)}. ¿Tienen disponibilidad?`;
        window.open(`https://wa.me/${tel}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    const toggleAcordeon = (key) => {
        setAcordeonAbierto((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const relacionados = (productosRelacionados || [])
        .filter((p) => p.id !== producto.id)
        .slice(0, 8);

    return (
        <main className="min-h-screen bg-[#F8F9FA] pt-40 pb-16">
            <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
                {/* 1. Breadcrumbs y Botón Volver */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-gray-200 text-xs sm:text-sm">
                    <nav className="flex items-center gap-2 text-gray-500 flex-wrap">
                        <button
                            type="button"
                            onClick={onVolver}
                            className="hover:text-gray-900 transition-colors cursor-pointer"
                        >
                            Inicio
                        </button>
                        <span>/</span>
                        <button
                            type="button"
                            onClick={onVolver}
                            className="hover:text-gray-900 transition-colors cursor-pointer"
                        >
                            Productos
                        </button>
                        {producto.categoria && (
                            <>
                                <span>/</span>
                                <span className="hover:text-gray-900 transition-colors">
                                    {producto.categoria}
                                </span>
                            </>
                        )}
                        <span>/</span>
                        <span className="font-semibold text-gray-900 line-clamp-1 max-w-[240px]">
                            {producto.nombre}
                        </span>
                    </nav>

                    <button
                        type="button"
                        onClick={onVolver}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-white hover:border-gray-400 hover:shadow-xs transition cursor-pointer"
                    >
                        <span>←</span>
                        <span>Volver al catálogo</span>
                    </button>
                </div>

                {/* 2. Grid Principal: Galería izquierda + Datos de Compra derecha */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-200 shadow-sm mb-12">
                    {/* COLUMNA IZQUIERDA: Galería de Fotos */}
                    <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
                        {/* Miniaturas Verticales */}
                        {imagenesUnicas.length > 1 && (
                            <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-[500px] scrollbar-thin py-1">
                                {imagenesUnicas.map((img, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setImagenActivaIdx(idx)}
                                        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${imagenActivaIdx === idx
                                            ? 'border-[var(--color-primario)] shadow-md ring-2 ring-[var(--color-primario)]/20'
                                            : 'border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-300'
                                            }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${producto.nombre} vista ${idx + 1}`}
                                            width={100}
                                            height={100}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full max-w-full max-h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        <div
                            ref={visorRef}
                            className="flex-1 relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center group select-none"
                            onMouseMove={handleInlineMouseMove}
                        >
                            {/* Badges Flotantes sobre la foto */}
                            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
                                {producto.categoria && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md shadow-sm border border-gray-100 text-gray-800">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-primario)' }} />
                                        <span>{producto.categoria}</span>
                                    </span>
                                )}
                            </div>

                            {tieneOferta && (
                                <span
                                    className="absolute top-4 right-4 z-10 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-lg pointer-events-none"
                                    style={{
                                        backgroundColor: 'var(--color-primario)',
                                        fontFamily: 'var(--tipografia-titulos)',
                                    }}
                                >
                                    <DynamicIcon name="FaFire" className="h-3.5 w-3.5" />
                                    <span>OFERTA</span>
                                    {descOferta && <span className="ml-0.5 font-bold">-{descOferta}%</span>}
                                </span>
                            )}



                            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1 bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-gray-200 opacity-90 group-hover:opacity-100 transition-opacity">
                                <button
                                    type="button"
                                    onClick={handleZoomOut}
                                    disabled={zoomInlineScale <= 1}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                                    title="Alejar (-)"
                                >
                                    <DynamicIcon name="FaSearchMinus" className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-[11px] font-mono font-bold text-gray-700 px-1.5 min-w-[42px] text-center select-none">
                                    {Math.round(zoomInlineScale * 100)}%
                                </span>
                                <button
                                    type="button"
                                    onClick={handleZoomIn}
                                    disabled={zoomInlineScale >= 4}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                                    title="Acercar (+)"
                                >
                                    <DynamicIcon name="FaSearchPlus" className="w-3.5 h-3.5" />
                                </button>
                                {zoomInlineScale > 1 && (
                                    <button
                                        type="button"
                                        onClick={handleZoomReset}
                                        className="px-2 py-1 text-[10px] font-bold text-gray-700 hover:bg-gray-200 bg-gray-100 rounded-full transition cursor-pointer ml-1"
                                        title="Restablecer (100%)"
                                    >
                                        ↺ 100%
                                    </button>
                                )}
                            </div>

                            {/* Imagen Visor */}
                            {imagenPrincipal ? (
                                <div
                                    className={`w-full h-full overflow-hidden flex items-center justify-center relative ${zoomInlineScale > 1 ? 'cursor-zoom-out' : 'cursor-zoom-in'
                                        }`}
                                    onClick={handleInlineClick}
                                >
                                    <img
                                        src={imagenPrincipal}
                                        alt={producto.nombre}
                                        width={600}
                                        height={600}
                                        loading="lazy"
                                        decoding="async"
                                        style={{
                                            transform: `scale(${zoomInlineScale})`,
                                            transformOrigin: `${inlinePan.x}% ${inlinePan.y}%`,
                                            transition: zoomInlineScale === 1 ? 'transform 0.25s ease' : 'transform 0.05s ease-out',
                                        }}
                                        className="w-full h-full object-cover max-w-full max-h-full"
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-gray-300 gap-2">
                                    <DynamicIcon name="FaBoxOpen" className="h-16 w-16" />
                                    <span className="text-xs text-gray-400">Sin imagen disponible</span>
                                </div>
                            )}

                            {/* Flechas de navegación para galería */}
                            {imagenesUnicas.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setImagenActivaIdx((prev) => (prev > 0 ? prev - 1 : imagenesUnicas.length - 1));
                                        }}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-black transition cursor-pointer opacity-0 group-hover:opacity-100 z-10"
                                        aria-label="Foto anterior"
                                    >
                                        ‹
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setImagenActivaIdx((prev) => (prev < imagenesUnicas.length - 1 ? prev + 1 : 0));
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-black transition cursor-pointer opacity-0 group-hover:opacity-100 z-10"
                                        aria-label="Siguiente foto"
                                    >
                                        ›
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: Datos del Producto y Compra */}
                    <div className="lg:col-span-5 flex flex-col justify-between">
                        <div>
                            {/* Marca / Tienda, Liquidación y Calificación */}
                            <div className="flex items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                        {site.nombre || 'Tienda Oficial'}
                                    </span>
                                    {almacenesTexto && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs">
                                            <DynamicIcon name="FaStore" className="h-3 w-3 text-[var(--color-primario)]" />
                                            <span>Almacén: {almacenesTexto}</span>
                                        </span>
                                    )}
                                    {esLiquidacion && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-white shadow-2xs">
                                            🏷️ Liquidación
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                                    <span>★ ★ ★ ★ ★</span>
                                    <span className="text-gray-400 text-[11px]">(4.9)</span>
                                </div>
                            </div>

                            {/* Nombre del Producto */}
                            <h1
                                className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug mb-3"
                                style={{ fontFamily: 'var(--tipografia-titulos)' }}
                            >
                                {producto.nombre}
                            </h1>

                            {/* Descripción Corta */}
                            {(producto.descripcion_corta || producto.descripcion) && (
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-5">
                                    {producto.descripcion_corta || producto.descripcion}
                                </p>
                            )}

                            {/* Bloque de Precios Destacado */}
                            <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-100 mb-6">
                                <div className="flex flex-col gap-2.5">
                                    {/* 1. Precio en Soles */}
                                    {precioSolesEfectivo > 0 && (
                                        <div>
                                            <div className="flex items-baseline gap-2 flex-wrap">
                                                <span className="text-sm font-black text-[#0089CF]">S/</span>
                                                <span className="text-3xl sm:text-4xl font-black text-[#0089CF] tracking-tight leading-none">
                                                    {precioSolesEfectivo.toFixed(2)}
                                                </span>
                                                {tieneOfertaSoles && descOfertaSoles && (
                                                    <span className="bg-[#0089CF] text-white text-xs font-black px-2 py-0.5 rounded-md leading-none">
                                                        -{descOfertaSoles}%
                                                    </span>
                                                )}
                                            </div>
                                            {tieneOfertaSoles && pSolesReg > precioSolesEfectivo && (
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                    <span>Precio regular:</span>
                                                    <span className="line-through font-semibold text-gray-400">
                                                        S/ {pSolesReg.toFixed(2)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* 2. Precio en Dólares (sin conversión) */}
                                    {precioDolaresEfectivo > 0 && (
                                        <div>
                                            <div className="flex items-baseline gap-1.5 flex-wrap text-emerald-700 font-black">
                                                <span className="text-sm font-black text-emerald-600">$</span>
                                                <span className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-emerald-700">
                                                    {precioDolaresEfectivo}
                                                </span>
                                                <span className="text-xs font-extrabold text-emerald-600">USD</span>
                                                {tieneOfertaDolares && descOfertaDolares && (
                                                    <span className="bg-emerald-600 text-white text-xs font-black px-2 py-0.5 rounded-md leading-none">
                                                        -{descOfertaDolares}%
                                                    </span>
                                                )}
                                            </div>
                                            {tieneOfertaDolares && pDolReg > precioDolaresEfectivo && (
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                                    <span>Precio regular:</span>
                                                    <span className="line-through font-semibold text-gray-400">
                                                        $ {pDolReg}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* 3. Liquidación / Sin precio */}
                                    {(!precioSolesEfectivo || precioSolesEfectivo <= 0) && (!precioDolaresEfectivo || precioDolaresEfectivo <= 0) && (
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">
                                                Consultar precio / Liquidación
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Disponibilidad de Stock */}
                                <div className="mt-3 pt-3 border-t border-gray-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                                    <span className="font-bold text-gray-700">Stock / Disponibilidad:</span>
                                    {stockVal !== null ? (
                                        stockVal > 5 ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold">
                                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                                Stock disponible ({stockVal} unids.)
                                            </span>
                                        ) : stockVal > 0 ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-extrabold animate-pulse">
                                                <span className="h-2 w-2 rounded-full bg-amber-500" />
                                                ¡Últimas {stockVal} unidades en stock!
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 font-extrabold">
                                                <span className="h-2 w-2 rounded-full bg-red-500" />
                                                Agotado (Sin stock)
                                            </span>
                                        )
                                    ) : stockTexto ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-extrabold">
                                            📦 {stockTexto}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                            En Stock (Disponible)
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Selector de Variantes (Reemplaza a 'Elige el tamaño/porciones') */}
                            {tieneVariantes && (
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2.5">
                                        <label className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                                            Variantes:
                                        </label>
                                        {varianteSeleccionada && (
                                            <span className="text-xs font-medium text-gray-500">
                                                Seleccionado: <strong className="text-gray-900">{varianteSeleccionada.nombre}</strong>
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2.5">
                                        {producto.variantes.map((v) => {
                                            const activo = varianteSeleccionada?.id === v.id;
                                            const vTieneOferta = Boolean(v.precio_oferta && Number(v.precio_oferta) < Number(v.precio));
                                            const vPrecio = vTieneOferta ? Number(v.precio_oferta) : Number(v.precio);
                                            const varImg = resolveImage(v.imagen);

                                            return (
                                                <button
                                                    key={v.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setVarianteSeleccionada(v);
                                                        if (varImg) {
                                                            const idx = imagenesUnicas.indexOf(varImg);
                                                            if (idx !== -1) setImagenActivaIdx(idx);
                                                        }
                                                    }}
                                                    className={`flex items-center gap-2.5 py-2 px-3.5 rounded-xl border-2 transition-all cursor-pointer ${activo
                                                        ? 'border-[var(--color-primario)] bg-[var(--color-primario)]/5 shadow-xs ring-2 ring-[var(--color-primario)]/20'
                                                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {varImg && (
                                                        <img
                                                            src={varImg}
                                                            alt={v.nombre}
                                                            className="w-7 h-7 rounded-lg object-cover border border-gray-200 shrink-0"
                                                        />
                                                    )}
                                                    <div className="text-left">
                                                        <span className={`block text-xs font-bold ${activo ? 'text-[var(--color-primario)]' : 'text-gray-800'}`}>
                                                            {v.nombre}
                                                        </span>
                                                        {v.precio && (
                                                            <span className="block text-[11px] font-semibold text-gray-500">
                                                                {simboloMoneda} {vPrecio.toFixed(2)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Selector de Cantidad + Botón Agregar al Carrito */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3">
                                    {/* Control - 1 + */}
                                    <div className="flex items-center border border-gray-300 rounded-full bg-white p-1">
                                        <button
                                            type="button"
                                            onClick={() => setCantidad((prev) => Math.max(1, prev - 1))}
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold transition cursor-pointer"
                                            aria-label="Disminuir cantidad"
                                        >
                                            -
                                        </button>
                                        <span className="w-10 text-center font-bold text-sm text-gray-900">
                                            {cantidad}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setCantidad((prev) => prev + 1)}
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold transition cursor-pointer"
                                            aria-label="Aumentar cantidad"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Botón Principal: Agregar al Carrito */}
                                    <button
                                        type="button"
                                        onClick={handleAgregar}
                                        className="flex-1 py-3.5 px-6 rounded-full font-extrabold text-white text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-98 flex items-center justify-center gap-2"
                                        style={{
                                            backgroundColor: 'var(--color-primario)',
                                            fontFamily: 'var(--tipografia-titulos)',
                                        }}
                                    >
                                        <DynamicIcon name="FaCartPlus" className="h-4 w-4" />
                                        <span>{agregadoAnim ? '¡Agregado con éxito! ✓' : (inCart ? 'Agregar otra unidad' : 'Agregar al carrito')}</span>
                                    </button>

                                    {/* Botón Favorito / Wishlist */}
                                    <button
                                        type="button"
                                        onClick={() => setEsFavorito(!esFavorito)}
                                        className={`w-12 h-12 rounded-full border flex items-center justify-center transition cursor-pointer ${esFavorito
                                            ? 'border-red-400 bg-red-50 text-red-500'
                                            : 'border-gray-200 text-gray-400 hover:text-red-500 hover:border-gray-300 bg-white'
                                            }`}
                                        aria-label="Guardar en favoritos"
                                    >
                                        <DynamicIcon name={esFavorito ? 'FaHeart' : 'FaRegHeart'} className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Botón Secundario: Pedir por WhatsApp */}
                                <button
                                    type="button"
                                    onClick={handleWhatsApp}
                                    className="w-full py-3 px-6 rounded-full font-bold text-white text-sm bg-[#25D366] hover:bg-[#20bd5a] shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <DynamicIcon name="FaWhatsapp" className="h-4 w-4" />
                                    <span>Consultar o pedir por WhatsApp</span>
                                </button>
                            </div>

                            {/* Beneficios de Despacho y Entrega */}
                            <div className="border-t border-gray-100 pt-4 space-y-2.5 text-xs text-gray-600">
                                {almacenesTexto && (
                                    <div className="flex items-center gap-3">
                                        <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-sm shrink-0 border border-slate-200">
                                            🏭
                                        </span>
                                        <div>
                                            <p className="font-semibold text-gray-800">Almacén / Tienda de Origen</p>
                                            <p className="text-[11px] font-bold text-gray-900">{almacenesTexto}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm shrink-0">
                                        🚚
                                    </span>
                                    <div>
                                        <p className="font-semibold text-gray-800">Despacho a domicilio</p>
                                        <p className="text-[11px] text-gray-500">Coordinamos la entrega a tu puerta en fecha y hora puntual.</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm shrink-0">
                                        🏪
                                    </span>
                                    <div>
                                        <p className="font-semibold text-gray-800">Retiro gratis en local</p>
                                        <p className="text-[11px] text-gray-500">Puedes recoger tu pedido directamente sin costo de envío.</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="w-7 h-7 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-sm shrink-0">
                                        🛡️
                                    </span>
                                    <div>
                                        <p className="font-semibold text-gray-800">Garantía de calidad</p>
                                        <p className="text-[11px] text-gray-500">Productos 100% garantizados bajo altos estándares de calidad.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Acordeones de Información Adicional */}
                <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-200 shadow-sm mb-12 space-y-4">
                    {/* Acordeón 1: Descripción Completa */}
                    <div className="border-b border-gray-100 pb-4">
                        <button
                            type="button"
                            onClick={() => toggleAcordeon('descripcion')}
                            className="w-full flex items-center justify-between text-left py-2 font-bold text-gray-900 hover:text-[var(--color-primario)] transition cursor-pointer"
                            style={{ fontFamily: 'var(--tipografia-titulos)' }}
                        >
                            <span className="text-base sm:text-lg">Información y Descripción Detallada</span>
                            <span className="text-xl text-gray-400">
                                {acordeonAbierto.descripcion ? '−' : '+'}
                            </span>
                        </button>
                        <AnimatePresence>
                            {acordeonAbierto.descripcion && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="pt-3 text-sm text-gray-600 leading-relaxed space-y-3"
                                >
                                    <p>{producto.descripcion || producto.descripcion_corta || 'Sin descripción disponible.'}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Acordeón 2: Especificaciones */}
                    <div className="border-b border-gray-100 pb-4">
                        <button
                            type="button"
                            onClick={() => toggleAcordeon('especificaciones')}
                            className="w-full flex items-center justify-between text-left py-2 font-bold text-gray-900 hover:text-[var(--color-primario)] transition cursor-pointer"
                            style={{ fontFamily: 'var(--tipografia-titulos)' }}
                        >
                            <span className="text-base sm:text-lg">Especificaciones del Producto</span>
                            <span className="text-xl text-gray-400">
                                {acordeonAbierto.especificaciones ? '−' : '+'}
                            </span>
                        </button>
                        <AnimatePresence>
                            {acordeonAbierto.especificaciones && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="pt-3"
                                >
                                    <table className="w-full text-xs sm:text-sm border-collapse">
                                        <tbody>
                                            {producto.categoria && (
                                                <tr className="border-b border-gray-100">
                                                    <td className="py-2.5 font-semibold text-gray-500 w-1/3">Categoría</td>
                                                    <td className="py-2.5 text-gray-800">{producto.categoria}</td>
                                                </tr>
                                            )}
                                            {producto.subcategoria && (
                                                <tr className="border-b border-gray-100">
                                                    <td className="py-2.5 font-semibold text-gray-500 w-1/3">Subcategoría</td>
                                                    <td className="py-2.5 text-gray-800">{producto.subcategoria}</td>
                                                </tr>
                                            )}
                                            {producto.marca && (
                                                <tr className="border-b border-gray-100">
                                                    <td className="py-2.5 font-semibold text-gray-500 w-1/3">Marca</td>
                                                    <td className="py-2.5 text-gray-800">{producto.marca}</td>
                                                </tr>
                                            )}
                                            {varianteSeleccionada && (
                                                <tr className="border-b border-gray-100">
                                                    <td className="py-2.5 font-semibold text-gray-500">Variante seleccionada</td>
                                                    <td className="py-2.5 text-gray-800 font-bold">{varianteSeleccionada.nombre}</td>
                                                </tr>
                                            )}
                                            <tr className="border-b border-gray-100">
                                                <td className="py-2.5 font-semibold text-gray-500">Código de Referencia</td>
                                                <td className="py-2.5 text-gray-800">PROD-{producto.id.toString().padStart(5, '0')}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Acordeón 3: Satisfacción y Garantía */}
                    <div>
                        <button
                            type="button"
                            onClick={() => toggleAcordeon('garantia')}
                            className="w-full flex items-center justify-between text-left py-2 font-bold text-gray-900 hover:text-[var(--color-primario)] transition cursor-pointer"
                            style={{ fontFamily: 'var(--tipografia-titulos)' }}
                        >
                            <span className="text-base sm:text-lg">Satisfacción Garantizada y Políticas</span>
                            <span className="text-xl text-gray-400">
                                {acordeonAbierto.garantia ? '−' : '+'}
                            </span>
                        </button>
                        <AnimatePresence>
                            {acordeonAbierto.garantia && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="pt-3 text-sm text-gray-600 leading-relaxed"
                                >
                                    <p>Tu satisfacción es nuestra máxima prioridad. Si tienes cualquier observación sobre el estado o presentación de tu pedido, comunícate inmediatamente con nuestro equipo de atención y resolveremos cualquier inconveniente.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* 4. Productos Relacionados / Recomendados */}
                {relacionados.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
                            <div>
                                <p
                                    className="text-xs font-bold uppercase tracking-widest mb-1"
                                    style={{ color: 'var(--color-primario)', fontFamily: 'var(--tipografia-texto)' }}
                                >
                                    Recomendados
                                </p>
                                <h2
                                    className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight"
                                    style={{ fontFamily: 'var(--tipografia-titulos)' }}
                                >
                                    También te puede interesar
                                </h2>
                            </div>
                        </div>

                        <Swiper
                            modules={[Autoplay]}
                            spaceBetween={16}
                            slidesPerView={1}
                            loop={relacionados.length > 3}
                            autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                            breakpoints={{
                                480: { slidesPerView: 2, spaceBetween: 14 },
                                768: { slidesPerView: 3, spaceBetween: 16 },
                                1024: { slidesPerView: 4, spaceBetween: 18 },
                            }}
                            className="pb-4"
                        >
                            {relacionados.map((relProd, idx) => {
                                const relInCart = cartItems.some((item) => (item.id || item.nombre) === (relProd.id || relProd.nombre));
                                const relTieneOferta = Boolean(relProd.precio_oferta || relProd.precio_oferta_soles);
                                const relPrecioRegular = Number(relProd.precio_soles || relProd.precio || 0);
                                const relPrecioOferta = relTieneOferta
                                    ? Number(relProd.precio_oferta_soles || relProd.precio_oferta)
                                    : null;

                                const descOferta = relTieneOferta && relPrecioRegular > 0
                                    ? Math.round(((relPrecioRegular - relPrecioOferta) / relPrecioRegular) * 100)
                                    : null;
                                const descRegular = descOferta ? Math.max(5, Math.round(descOferta * 0.75)) : null;
                                const precioListaReferencial = Math.round(relPrecioRegular * 1.3);

                                const categoriaTexto = typeof relProd.categoria === 'object' ? relProd.categoria?.nombre : relProd.categoria;

                                return (
                                    <SwiperSlide key={relProd.id || idx} className="h-auto">
                                        <div
                                            onClick={() => onSeleccionarProducto && onSeleccionarProducto(relProd)}
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
                                                {relTieneOferta && (
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

                                                {relProd.imagen ? (
                                                    <img
                                                        src={relProd.imagen}
                                                        alt={relProd.nombre}
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
                                                title={relProd.nombre}
                                                style={{ fontFamily: 'var(--tipografia-titulos)' }}
                                            >
                                                {relProd.nombre}
                                            </h3>

                                            {/* Descripción Corta */}
                                            {(relProd.descripcion_corta || relProd.descripcion) && (
                                                <p
                                                    className="text-[11px] text-gray-500 line-clamp-2 min-h-[2rem] leading-relaxed mb-3"
                                                    title={relProd.descripcion_corta || relProd.descripcion}
                                                    style={{ fontFamily: 'var(--tipografia-texto)' }}
                                                >
                                                    {relProd.descripcion_corta || relProd.descripcion}
                                                </p>
                                            )}

                                            {/* Bloque de Precios */}
                                            <div className="mt-auto pt-2">
                                                {relTieneOferta ? (
                                                    <>
                                                        {/* Precio Principal */}
                                                        <div className="flex items-baseline gap-1.5 mb-1 flex-wrap">
                                                            <span className="text-xs font-black text-[#0089CF]">S/</span>
                                                            <span className="text-2xl sm:text-3xl font-black text-[#0089CF] tracking-tight leading-none">
                                                                {relPrecioOferta.toFixed(0)}
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
                                                                {relPrecioRegular.toFixed(0)}
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
                                                                {relPrecioRegular.toFixed(0)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Botón 'Agregar' */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addItem(relProd);
                                                    }}
                                                    className="w-full py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm tracking-wide cursor-pointer active:scale-98 border-2 transition-all"
                                                    style={{
                                                        backgroundColor: relInCart ? 'var(--color-primario)' : '#ffffff',
                                                        borderColor: 'var(--color-primario)',
                                                        color: relInCart ? '#ffffff' : 'var(--color-primario)',
                                                        fontFamily: 'var(--tipografia-titulos)',
                                                    }}
                                                >
                                                    {relInCart ? 'Agregado ✓' : 'Agregar'}
                                                </button>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                )}
            </div>

        </main>
    );
}
