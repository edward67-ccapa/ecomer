import { useEffect, useState, useMemo, useRef, Fragment } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import DynamicIcon from '@/components/DynamicIcon';
import { useCartStore } from '@/stores/useCartStore';
import CartOffcanvas from '@/components/CartOffcanvas';

const getCategoryIcon = (nombre = '') => {
    const n = String(nombre).toLowerCase();
    if (n.includes('mueble') || n.includes('sala') || n.includes('sofá') || n.includes('comedor')) return 'FaCouch';
    if (n.includes('electro') || n.includes('tv') || n.includes('tele') || n.includes('aspiradora')) return 'FaTv';
    if (n.includes('baño') || n.includes('cocina') || n.includes('menaje')) return 'FaUtensils';
    if (n.includes('dormitorio') || n.includes('cama') || n.includes('colchón') || n.includes('ropero')) return 'FaBed';
    if (n.includes('tecnología') || n.includes('celular') || n.includes('laptop') || n.includes('cámara')) return 'FaLaptop';
    if (n.includes('jardín') || n.includes('libre') || n.includes('terraza') || n.includes('camping')) return 'FaTree';
    if (n.includes('herramienta') || n.includes('taladro')) return 'FaScrewdriverWrench';
    if (n.includes('aseo') || n.includes('limpieza') || n.includes('lavandería')) return 'FaPumpSoap';
    if (n.includes('pintura')) return 'FaPaintRoller';
    if (n.includes('piso') || n.includes('cerámico') || n.includes('pared')) return 'FaLayerGroup';
    if (n.includes('deco') || n.includes('adorno') || n.includes('lámpara') || n.includes('ilumina')) return 'FaBrush';
    if (n.includes('torta') || n.includes('pastel') || n.includes('postre') || n.includes('dulce')) return 'FaBirthdayCake';
    return 'FaBox';
};

export default function Header({ site, dominio, siteSlug, secciones, seccionActiva, tieneTienda, productos, seccionesData, serviciosSitio, marcasSitio = [], estilos, esDetalleProducto = false }) {
    const [isScrolled, setIsScrolled] = useState(false);

    // --- SCROLL DETECTION ---
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsScrolled(scrollY > 30);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Limpiar cualquier #hash persistente en la URL para evitar saltos repentinos al hacer scroll
        if (typeof window !== 'undefined' && window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleAnchorClick = (e, anchorId) => {
        if (anchorId) {
            e.preventDefault();
            const elem = document.getElementById(anchorId);
            if (elem) {
                const headerOffset = 70;
                const elementPosition = elem.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth',
                });
            }
            if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
                window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
        }
    };

    const openCart = useCartStore((state) => state.openCart);
    const cartCount = useCartStore((state) => state.getItemCount());
    const hasStore = Boolean(site?.tiene_tienda ?? tieneTienda ?? (productos && productos.length > 0) ?? true);

    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);
    const [mobileMarcasSubmenuOpen, setMobileMarcasSubmenuOpen] = useState(false);

    // --- CATÁLOGO DE PRODUCTOS CONFIGURATION ---
    const { url: currentUrl } = usePage();
    const catalogoConfig = estilos?.catalogo || {};
    const isCatalogoActivo = Boolean(catalogoConfig.activo);
    const catalogoTitulo = catalogoConfig.titulo || 'Catálogo';
    const catalogoEnlace = catalogoConfig.enlace ? String(catalogoConfig.enlace).trim() : null;
    const isCatalogoUrlActive = Boolean(currentUrl && currentUrl.includes('catalogo=1'));
    const downloadUrl = catalogoEnlace
        ? catalogoEnlace
        : (dominio === 'plantillas'
            ? `/plantillas/${siteSlug}/catalogo/descargar-pdf`
            : (siteSlug ? `/${dominio}/${siteSlug}/catalogo/descargar-pdf` : `/${dominio}/catalogo/descargar-pdf`));

    const handleDescargarCatalogo = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        window.location.href = downloadUrl;
    };

    // --- MEGA MENU HOVER STATE ---
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [megaMenuTab, setMegaMenuTab] = useState('categorias'); // 'categorias' | 'marcas'
    const [activeHoverCategory, setActiveHoverCategory] = useState(null);
    const [activeHoverMarca, setActiveHoverMarca] = useState(null);
    const hoverTimeoutRef = useRef(null);

    const handleMouseEnterMega = (tab = null) => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        if (tab && typeof tab === 'string') {
            setMegaMenuTab(tab);
            setActiveHoverCategory(null);
            setActiveHoverMarca(null);
        }
        setIsMegaMenuOpen(true);
    };

    const handleMouseLeaveMega = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setIsMegaMenuOpen(false);
        }, 220);
    };

    const handleMegaMenuClick = () => {
        setIsMegaMenuOpen(false);
        setMobileMenuOpen(false);
    };

    const getProductosUrl = (catName, subName) => {
        let baseUrl = dominio === 'plantillas'
            ? `/plantillas/${siteSlug}/productos`
            : (siteSlug ? `/${dominio}/${siteSlug}/productos` : `/${dominio}/productos`);

        const params = new URLSearchParams();
        if (catName) params.set('categoria', catName);
        if (subName) params.set('subcategoria', subName);

        const str = params.toString();
        return str ? `${baseUrl}?${str}` : baseUrl;
    };

    const getMarcaUrl = (marcaNombre) => {
        let baseUrl = dominio === 'plantillas'
            ? `/plantillas/${siteSlug}/productos`
            : (siteSlug ? `/${dominio}/${siteSlug}/productos` : `/${dominio}/productos`);

        const params = new URLSearchParams();
        if (marcaNombre) params.set('marca', marcaNombre);

        const str = params.toString();
        return str ? `${baseUrl}?${str}` : baseUrl;
    };

    const handleSearchSubmit = (e) => {
        e?.preventDefault();
        const term = searchQuery.trim();
        if (!term) return;

        const targetUrl = dominio === 'plantillas'
            ? `/plantillas/${siteSlug}/productos?q=${encodeURIComponent(term)}`
            : (siteSlug ? `/${dominio}/${siteSlug}/productos?q=${encodeURIComponent(term)}` : `/${dominio}/productos?q=${encodeURIComponent(term)}`);

        router.visit(targetUrl);
        setMobileSearchOpen(false);
        setMobileMenuOpen(false);
    };

    // --- DATA EXTRACTION ---
    const activeNav =
        seccionesData?.nav ||
        seccionesData?.NAV ||
        seccionesData?.['nav'] ||
        Object.values(seccionesData || {}).find((s) => s?.slug?.toLowerCase() === 'nav');

    const getNavContent = (labelName) => {
        return activeNav?.contenido?.find(
            (c) => c.label?.toLowerCase() === labelName.toLowerCase()
        )?.valor;
    };

    const mensajeNav = getNavContent('mensaje');
    const rawNavActions = getNavContent('accion') || getNavContent('acciones') || getNavContent('accion_nav');
    const cmsNavActions = Array.isArray(rawNavActions) ? rawNavActions : [];
    const globalActions = Array.isArray(estilos?.acciones_nav) ? estilos.acciones_nav : [];
    const combinedNavActions = [...globalActions, ...cmsNavActions];
    const accionesNav = combinedNavActions.filter((item, index, self) =>
        index === self.findIndex((t) => (t.texto || t.Texto) === (item.texto || item.Texto) && (t.icono || t.icon) === (item.icono || item.icon))
    );
    const logoNav = getNavContent('logo') || getNavContent('logo_nav') || site?.imagen;

    // --- NAVEGACIÓN DINÁMICA Y RENOMBRADO PERSONALIZADO EN FRONTEND ---
    const navSecciones = useMemo(() => {
        let list = Array.isArray(secciones) ? [...secciones] : [];

        const prodOrden = estilos?.seccion_productos?.orden !== undefined && estilos?.seccion_productos?.orden !== ''
            ? Number(estilos.seccion_productos.orden)
            : 2;

        const hasProductosOrTienda = list.some((s) => {
            const slug = (s.slug || '').toLowerCase();
            return slug === 'productos' || slug === 'tienda' || slug === 'tiendas';
        });

        if (hasStore && !hasProductosOrTienda) {
            list.push({ slug: 'productos', nombre: 'Productos', orden: prodOrden });
        }

        const servOrden = estilos?.seccion_servicios?.orden !== undefined && estilos?.seccion_servicios?.orden !== ''
            ? Number(estilos.seccion_servicios.orden)
            : 3;

        const hasServiciosInList = list.some((s) => {
            const slug = (s.slug || '').toLowerCase();
            return slug === 'servicios' || slug === 'servicio';
        });

        const hasServiciosData = Array.isArray(serviciosSitio) && serviciosSitio.length > 0;

        if (hasServiciosData && !hasServiciosInList) {
            list.push({ slug: 'servicios', nombre: 'Servicios', orden: servOrden });
        }

        const catOrden = estilos?.catalogo?.orden !== undefined && estilos?.catalogo?.orden !== ''
            ? Number(estilos.catalogo.orden)
            : 4;

        const hasCatalogoInList = list.some((s) => (s.slug || '').toLowerCase() === 'catalogo');

        if (isCatalogoActivo && !hasCatalogoInList) {
            list.push({ slug: 'catalogo', nombre: catalogoTitulo, isCatalogo: true, orden: catOrden });
        }

        const marcasOrden = estilos?.seccion_marcas?.orden !== undefined && estilos?.seccion_marcas?.orden !== ''
            ? Number(estilos.seccion_marcas.orden)
            : 5;

        const hasMarcasInList = list.some((s) => {
            const slug = (s.slug || '').toLowerCase();
            return slug === 'marcas' || slug === 'marca';
        });

        const hasMarcasData = Array.isArray(marcasSitio) && marcasSitio.length > 0;

        if (hasMarcasData && !hasMarcasInList) {
            list.push({ slug: 'marcas', nombre: 'Marcas', orden: marcasOrden });
        }

        list = list.map((s) => {
            const slug = (s.slug || '').toLowerCase();
            if (slug === 'productos' || slug === 'tienda' || slug === 'tiendas') {
                return { ...s, orden: estilos?.seccion_productos?.orden !== undefined && estilos?.seccion_productos?.orden !== '' ? Number(estilos.seccion_productos.orden) : (s.orden ?? 2) };
            }
            if (slug === 'servicios' || slug === 'servicio') {
                return { ...s, orden: estilos?.seccion_servicios?.orden !== undefined && estilos?.seccion_servicios?.orden !== '' ? Number(estilos.seccion_servicios.orden) : (s.orden ?? 3) };
            }
            if (slug === 'catalogo') {
                return { ...s, isCatalogo: true, orden: estilos?.catalogo?.orden !== undefined && estilos?.catalogo?.orden !== '' ? Number(estilos.catalogo.orden) : (s.orden ?? 4) };
            }
            if (slug === 'marcas' || slug === 'marca') {
                return { ...s, orden: estilos?.seccion_marcas?.orden !== undefined && estilos?.seccion_marcas?.orden !== '' ? Number(estilos.seccion_marcas.orden) : (s.orden ?? 5) };
            }
            return { ...s, orden: s.orden ?? 99 };
        });

        list.sort((a, b) => Number(a.orden ?? 99) - Number(b.orden ?? 99));

        return list;
    }, [secciones, hasStore, serviciosSitio, marcasSitio, estilos, isCatalogoActivo, catalogoTitulo]);

    const getDisplayName = (seccion) => {
        const slugLower = (seccion?.slug || '').toLowerCase().trim();
        const nombreLower = (seccion?.nombre || '').toLowerCase().trim();

        if (slugLower === 'inicio' || slugLower === 'hero' || nombreLower === 'inicio' || nombreLower === 'hero') {
            return 'Inicio';
        }

        if (slugLower === 'tienda' || slugLower === 'tiendas' || nombreLower === 'tienda' || nombreLower === 'tiendas') {
            return 'Productos';
        }

        if (slugLower === 'servicios' || slugLower === 'servicio' || nombreLower === 'servicios' || nombreLower === 'servicio') {
            return 'Servicios';
        }

        return seccion?.nombre || seccion?.slug || '';
    };

    // --- ÁRBOLES DE CATEGORÍAS PARA EL MEGA MENU ---
    const categoriasArbol = useMemo(() => {
        const catMap = new Map();

        if (Array.isArray(productos) && productos.length > 0) {
            productos.forEach((prod) => {
                const cat = typeof prod.categoria === 'object' ? prod.categoria?.nombre : prod.categoria;
                const sub = typeof prod.subcategoria === 'object' ? prod.subcategoria?.nombre : prod.subcategoria;

                if (!cat) return;

                const propioIcono = typeof prod.categoria === 'object'
                    ? (prod.categoria?.icono || null)
                    : (prod.categoria_icono || prod.categoria_objeto?.icono || null);

                if (!catMap.has(cat)) {
                    catMap.set(cat, {
                        nombre: cat,
                        count: 0,
                        icono: propioIcono || null,
                        maxDesc: 0,
                        ofertaBadge: null,
                        subcategoriasMap: new Map(),
                        productos: [],
                    });
                }

                const catData = catMap.get(cat);
                catData.count += 1;
                catData.productos.push(prod);

                if (propioIcono && catData.icono !== propioIcono) {
                    catData.icono = propioIcono;
                }

                const tieneOferta = Boolean(prod.precio_oferta || prod.precio_oferta_soles);
                const precioRegular = Number(prod.precio_soles || prod.precio || 0);
                const precioOferta = tieneOferta ? Number(prod.precio_oferta_soles || prod.precio_oferta) : null;
                if (tieneOferta && precioRegular > 0 && precioOferta) {
                    const desc = Math.round(((precioRegular - precioOferta) / precioRegular) * 100);
                    if (desc > 0 && desc > catData.maxDesc) {
                        catData.maxDesc = desc;
                        catData.ofertaBadge = `HASTA ${desc}%`;
                    }
                }

                if (sub) {
                    catData.subcategoriasMap.set(sub, (catData.subcategoriasMap.get(sub) || 0) + 1);
                }
            });
        }

        return Array.from(catMap.values()).map((catData) => ({
            nombre: catData.nombre,
            count: catData.count,
            icono: catData.icono,
            ofertaBadge: catData.ofertaBadge || 'HASTA 30%',
            productos: catData.productos,
            subcategorias: Array.from(catData.subcategoriasMap.entries()).map(([subNombre, subCount]) => ({
                nombre: subNombre,
                count: subCount,
            })),
        }));
    }, [productos]);

    const activeCategoryData = useMemo(() => {
        if (!activeHoverCategory) return null;
        return categoriasArbol.find((c) => c.nombre === activeHoverCategory) || null;
    }, [activeHoverCategory, categoriasArbol]);

    // --- ÁRBOLES DE MARCAS PARA EL MEGA MENU ---
    const marcasArbol = useMemo(() => {
        const map = new Map();

        // 1. Desde marcasSitio (backend)
        if (Array.isArray(marcasSitio) && marcasSitio.length > 0) {
            marcasSitio.forEach((m) => {
                const name = typeof m === 'string' ? m : (m.titulo || m.nombre || '');
                if (!name) return;
                const key = name.toLowerCase().trim();
                const rawImg = typeof m === 'object' ? (m.imagen || m.logo || null) : null;
                const formattedImg = rawImg ? (rawImg.startsWith('http') || rawImg.startsWith('data:') ? rawImg : `/storage/${rawImg.replace(/^\/?storage\//, '')}`) : null;
                map.set(key, {
                    id: typeof m === 'object' ? m.id : null,
                    nombre: name,
                    imagen: formattedImg,
                    slug: typeof m === 'object' ? m.slug : null,
                    count: 0,
                    productos: [],
                });
            });
        }

        // 2. Desde los productos
        if (Array.isArray(productos) && productos.length > 0) {
            productos.forEach((prod) => {
                let mName = null;
                let rawImg = null;
                let mSlug = null;
                let mId = null;

                if (prod.marca_objeto && (prod.marca_objeto.titulo || prod.marca_objeto.nombre)) {
                    mName = prod.marca_objeto.titulo || prod.marca_objeto.nombre;
                    rawImg = prod.marca_objeto.imagen || prod.marca_objeto.logo || null;
                    mSlug = prod.marca_objeto.slug || null;
                    mId = prod.marca_objeto.id || null;
                } else if (prod.marca && typeof prod.marca === 'string' && prod.marca.trim()) {
                    mName = prod.marca.trim();
                    rawImg = prod.marca_imagen || null;
                }

                if (mName) {
                    const key = mName.toLowerCase().trim();
                    const formattedImg = rawImg ? (rawImg.startsWith('http') || rawImg.startsWith('data:') ? rawImg : `/storage/${rawImg.replace(/^\/?storage\//, '')}`) : null;

                    if (!map.has(key)) {
                        map.set(key, {
                            id: mId,
                            nombre: mName,
                            imagen: formattedImg,
                            slug: mSlug,
                            count: 0,
                            productos: [],
                        });
                    }
                    const mData = map.get(key);
                    mData.count += 1;
                    mData.productos.push(prod);
                    if (!mData.imagen && formattedImg) {
                        mData.imagen = formattedImg;
                    }
                }
            });
        }

        return Array.from(map.values());
    }, [marcasSitio, productos]);

    const activeMarcaData = useMemo(() => {
        if (!activeHoverMarca) return null;
        return marcasArbol.find((m) => m.nombre === activeHoverMarca) || null;
    }, [activeHoverMarca, marcasArbol]);

    // --- STYLES BASED ON SCROLL ---
    const activeSlug = (seccionActiva?.slug || '').toLowerCase().trim();
    const activeNombre = (seccionActiva?.nombre || '').toLowerCase().trim();
    const transparentSections = ['inicio', 'hero', 'nav', 'nosotros', 'sobre-nosotros', 'servicios', 'servicio', 'contacto', 'contactos', ''];
    const transparentNames = ['inicio', 'hero', 'nosotros', 'sobre nosotros', 'servicios', 'servicio', 'contacto', 'contactos'];

    const isHeroPage =
        !esDetalleProducto &&
        (!seccionActiva ||
            transparentSections.includes(activeSlug) ||
            transparentNames.includes(activeNombre));
    const isTransparentMode = isHeroPage && !isScrolled;

    const headerBg = isTransparentMode
        ? 'bg-transparent border-transparent shadow-none'
        : 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200/60';

    return (
        <>
            <header
                suppressHydrationWarning
                className={`fixed top-0 z-50 w-full max-w-full transition-all duration-300 ${headerBg}`}
            >
                {/* 1. ARRIBA: EL AVISO CON EL FONDO GLOBAL */}
                {mensajeNav && (
                    <div
                        suppressHydrationWarning
                        className={`w-full text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide transition-all duration-300 ${isTransparentMode ? 'bg-[var(--color-primario)]/90 backdrop-blur-xs border-b border-white/10' : ''
                            }`}
                        style={{
                            backgroundColor: isTransparentMode ? undefined : 'var(--color-primario)',
                            fontFamily: 'var(--tipografia-texto)',
                        }}
                    >
                        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-white/20 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-xs">
                                Aviso
                            </span>
                            <span className="text-[11px] sm:text-xs font-semibold">{mensajeNav}</span>
                        </div>
                    </div>
                )}

                {/* 2. ABAJO DEL AVISO: LOS ÍCONOS CON SU TEXTO */}
                {Array.isArray(accionesNav) && accionesNav.length > 0 && (
                    <div
                        suppressHydrationWarning
                        className={`w-full border-b text-xs py-1.5 px-4 transition-all duration-300 ${isTransparentMode
                            ? 'border-white/10 bg-transparent text-white/90'
                            : 'border-gray-200/60 bg-white/95 backdrop-blur-md text-gray-700'
                            }`}
                        style={{
                            fontFamily: 'var(--tipografia-texto)',
                        }}
                    >
                        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center sm:justify-end gap-x-4 sm:gap-x-6 gap-y-1">
                            {accionesNav.map((item, idx) => {
                                const iconName = item.icono || item.icon;
                                const rawTextVal = item.texto || '';
                                const textVal = typeof rawTextVal === 'string' ? rawTextVal.replace(/\s*\r?\n\s*/g, ' / ') : rawTextVal;
                                const isLink = typeof rawTextVal === 'string' && (rawTextVal.includes('.com') || rawTextVal.startsWith('http'));
                                const isPhone = iconName === 'FaWhatsapp' || iconName === 'FaPhone';
                                const cleanDigits = typeof rawTextVal === 'string' ? rawTextVal.replace(/\D/g, '') : '';
                                const href = isLink
                                    ? (rawTextVal.startsWith('http') ? rawTextVal : `https://${rawTextVal}`)
                                    : (isPhone ? (iconName === 'FaWhatsapp' ? `https://wa.me/${cleanDigits}` : `tel:${cleanDigits}`) : null);

                                const content = (
                                    <div className={`group flex items-center gap-1.5 transition-colors ${isTransparentMode
                                        ? 'text-white/90 hover:text-white'
                                        : 'text-gray-700 hover:text-gray-900'
                                        }`}>
                                        {iconName && (
                                            <DynamicIcon
                                                name={iconName}
                                                className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:scale-110"
                                                style={{
                                                    color: isTransparentMode ? '#ffffff' : 'var(--color-primario)',
                                                }}
                                            />
                                        )}
                                        <span className="text-[11px] sm:text-xs font-medium group-hover:underline underline-offset-2">
                                            {textVal}
                                        </span>
                                    </div>
                                );

                                return href ? (
                                    <a
                                        key={idx}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="cursor-pointer"
                                    >
                                        {content}
                                    </a>
                                ) : (
                                    <div key={idx}>
                                        {content}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 3. ABAJO: LOGO A LA IZQUIERDA, MENÚ AL MEDIO, BUSCADOR Y CARRITO A LA DERECHA */}
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 transition-all duration-300">
                    {/* 3.1. IZQUIERDA: BOTÓN HAMBURGUESA MÓVIL Y LOGO */}
                    <div className="flex flex-1 items-center justify-start gap-2 sm:gap-3">
                        {/* Botón Hamburguesa Móvil */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`md:hidden p-2 rounded-xl transition cursor-pointer ${isTransparentMode
                                ? 'text-white hover:bg-white/20'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            title={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                        >
                            {mobileMenuOpen ? (
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>

                        {/* Logo del Sitio */}
                        <Link
                            href={dominio === 'plantillas' ? `/plantillas/${siteSlug}/${secciones?.[0]?.slug || 'inicio'}` : (siteSlug ? `/${dominio}/${siteSlug}/${secciones?.[0]?.slug || 'inicio'}` : `/${dominio}/${secciones?.[0]?.slug || 'inicio'}`)}
                            className="flex items-center justify-center transition-transform hover:scale-102"
                        >
                            {logoNav || site?.imagen ? (
                                <img
                                    src={logoNav || site?.imagen}
                                    alt={site?.nombre || ''}
                                    width={180}
                                    height={48}
                                    decoding="async"
                                    className="h-10 sm:h-12 w-auto max-h-18 object-contain transition-all duration-300"
                                />
                            ) : (
                                <span className={`text-xl font-extrabold tracking-tight transition-colors duration-300 ${isTransparentMode ? 'text-white drop-shadow-sm' : 'text-gray-900'
                                    }`}>
                                    {site?.nombre}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* 3.2. AL MEDIO: NAVEGACIÓN DESKTOP */}
                    <div className="flex shrink-0 items-center justify-center">
                        <nav className="hidden md:flex flex-wrap items-center justify-center gap-1">
                            {navSecciones?.map((seccion) => {
                                const slugLower = seccion.slug?.toLowerCase() || '';
                                const nombreLower = (seccion.nombre || '').toLowerCase();
                                const filtroProdLower = (seccion.filtro_producto || '').toLowerCase();
                                const displayName = getDisplayName(seccion);
                                const normalizedSlug = slugLower.replace(/[\s_]+/g, '-');
                                const anchorId = slugLower === 'contactos' ? 'contacto' : normalizedSlug;
                                const isInicioPage = !seccionActiva || seccionActiva.slug?.toLowerCase() === 'inicio';

                                const isInicio = slugLower === 'inicio' || slugLower === 'hero';
                                const isProductos = slugLower === 'productos' || slugLower === 'tienda' || slugLower === 'tiendas';
                                const isServicios = slugLower === 'servicios' || slugLower === 'servicio';
                                const isNosotros = slugLower === 'nosotros' || slugLower === 'sobre-nosotros';
                                const isContacto = slugLower === 'contacto' || slugLower === 'contactos';
                                const isLiquidaciones =
                                    slugLower === 'liquidacion' ||
                                    slugLower === 'liquidaciones' ||
                                    filtroProdLower === 'liquidaciones' ||
                                    filtroProdLower === 'liquidacion' ||
                                    nombreLower.includes('liquidaci');

                                const isOfertas =
                                    slugLower === 'oferta' ||
                                    slugLower === 'ofertas' ||
                                    filtroProdLower === 'ofertas' ||
                                    filtroProdLower === 'oferta' ||
                                    nombreLower.includes('oferta');

                                const hasStandalonePage = isInicio || isProductos || isServicios || isNosotros || isContacto;

                                const pageSlugTarget = isInicio ? 'inicio' : (isProductos ? 'productos' : (isServicios ? 'servicios' : (isNosotros ? 'nosotros' : (isContacto ? 'contacto' : seccion.slug))));
                                const activa = (isInicio
                                    ? (!seccionActiva || seccionActiva.slug?.toLowerCase() === 'inicio' || seccionActiva.slug?.toLowerCase() === 'hero')
                                    : (pageSlugTarget === seccionActiva?.slug?.toLowerCase() || (isProductos && seccionActiva?.slug?.toLowerCase() === 'productos') || (isServicios && seccionActiva?.slug?.toLowerCase() === 'servicios') || (isNosotros && (seccionActiva?.slug?.toLowerCase() === 'nosotros' || seccionActiva?.slug?.toLowerCase() === 'sobre-nosotros')) || (isContacto && (seccionActiva?.slug?.toLowerCase() === 'contacto' || seccionActiva?.slug?.toLowerCase() === 'contactos'))))
                                    && !isCatalogoUrlActive;

                                const linkClasses = `rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-300 ${activa
                                    ? 'text-white shadow-xs'
                                    : isTransparentMode
                                        ? 'text-white/90 hover:text-white hover:bg-white/20'
                                        : 'text-gray-800 hover:text-white hover:bg-[var(--color-primario)]/60'
                                    }`;
                                const activeStyle = activa ? { backgroundColor: 'var(--color-primario)', color: '#fff' } : {};

                                if (slugLower === 'catalogo' || seccion.isCatalogo) {
                                    if (!isCatalogoActivo) return null;
                                    return (
                                        <a
                                            key="catalogo"
                                            href={downloadUrl}
                                            onClick={handleDescargarCatalogo}
                                            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-300 cursor-pointer ${
                                                isCatalogoUrlActive
                                                    ? 'text-white shadow-xs'
                                                    : isTransparentMode
                                                        ? 'text-white/90 hover:text-white hover:bg-white/20'
                                                        : 'text-gray-800 hover:text-white hover:bg-[var(--color-primario)]/60'
                                            }`}
                                            style={isCatalogoUrlActive ? { backgroundColor: 'var(--color-primario)', color: '#fff' } : {}}
                                        >
                                            {catalogoTitulo}
                                        </a>
                                    );
                                }

                                if (isLiquidaciones) {
                                    const targetUrl = dominio === 'plantillas'
                                        ? `/plantillas/${siteSlug}/productos?liquidaciones=1`
                                        : (siteSlug ? `/${dominio}/${siteSlug}/productos?liquidaciones=1` : `/${dominio}/productos?liquidaciones=1`);
                                    const isLiquidacionesActiva = Boolean(currentUrl && (currentUrl.includes('liquidaciones=1') || currentUrl.includes('liquidacion=1') || currentUrl.includes('filtro_producto=liquidaciones') || currentUrl.includes('filtro_producto=liquidacion')));

                                    const linkClassesLiq = `rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-300 ${isLiquidacionesActiva
                                        ? 'text-white shadow-xs'
                                        : isTransparentMode
                                            ? 'text-white/90 hover:text-white hover:bg-white/20'
                                            : 'text-gray-800 hover:text-white hover:bg-[var(--color-primario)]/60'
                                        }`;

                                    return (
                                        <Link
                                            key={seccion.slug || 'liquidaciones'}
                                            href={targetUrl}
                                            className={linkClassesLiq}
                                            style={isLiquidacionesActiva ? { backgroundColor: 'var(--color-primario)', color: '#fff' } : {}}
                                        >
                                            {displayName}
                                        </Link>
                                    );
                                }

                                if (isOfertas) {
                                    const targetUrl = dominio === 'plantillas'
                                        ? `/plantillas/${siteSlug}/productos?ofertas=1`
                                        : (siteSlug ? `/${dominio}/${siteSlug}/productos?ofertas=1` : `/${dominio}/productos?ofertas=1`);
                                    const isOfertasActiva = Boolean(currentUrl && (currentUrl.includes('ofertas=1') || currentUrl.includes('oferta=1') || currentUrl.includes('solo_ofertas=1') || currentUrl.includes('filtro_producto=ofertas') || currentUrl.includes('filtro_producto=oferta')));

                                    const linkClassesOf = `rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-300 ${isOfertasActiva
                                        ? 'text-white shadow-xs'
                                        : isTransparentMode
                                            ? 'text-white/90 hover:text-white hover:bg-white/20'
                                            : 'text-gray-800 hover:text-white hover:bg-[var(--color-primario)]/60'
                                        }`;

                                    return (
                                        <Link
                                            key={seccion.slug || 'ofertas'}
                                            href={targetUrl}
                                            className={linkClassesOf}
                                            style={isOfertasActiva ? { backgroundColor: 'var(--color-primario)', color: '#fff' } : {}}
                                        >
                                            {displayName}
                                        </Link>
                                    );
                                }

                                if (isProductos) {
                                    return (
                                        <div
                                            key={seccion.slug || 'productos'}
                                            className="relative"
                                            onMouseEnter={() => handleMouseEnterMega('categorias')}
                                            onMouseLeave={handleMouseLeaveMega}
                                        >
                                            <Link
                                                href={getProductosUrl(null, null)}
                                                className={`inline-flex items-center gap-1.5 ${linkClasses}`}
                                                style={activeStyle}
                                            >
                                                <span>{displayName}</span>
                                                <DynamicIcon
                                                    name="FaChevronDown"
                                                    className={`h-3 w-3 transition-transform duration-300 ${isMegaMenuOpen && megaMenuTab === 'categorias' ? 'rotate-180 text-white' : 'opacity-70'
                                                        }`}
                                                />
                                            </Link>
                                        </div>
                                    );
                                }

                                const isMarcas = slugLower === 'marcas' || slugLower === 'marca';
                                if (isMarcas && marcasArbol.length > 0) {
                                    return (
                                        <div
                                            key={seccion.slug || 'marcas'}
                                            className="relative"
                                            onMouseEnter={() => handleMouseEnterMega('marcas')}
                                            onMouseLeave={handleMouseLeaveMega}
                                        >
                                            <Link
                                                href={getProductosUrl(null, null)}
                                                className={`inline-flex items-center gap-1.5 ${linkClasses}`}
                                                style={activeStyle}
                                            >
                                                <span>{displayName}</span>
                                                <DynamicIcon
                                                    name="FaChevronDown"
                                                    className={`h-3 w-3 transition-transform duration-300 ${isMegaMenuOpen && megaMenuTab === 'marcas' ? 'rotate-180 text-white' : 'opacity-70'
                                                        }`}
                                                />
                                            </Link>
                                        </div>
                                    );
                                }

                                if (hasStandalonePage) {
                                    return (
                                        <Link
                                            key={seccion.slug}
                                            href={dominio === 'plantillas' ? `/plantillas/${siteSlug}/${pageSlugTarget}` : (siteSlug ? `/${dominio}/${siteSlug}/${pageSlugTarget}` : `/${dominio}/${pageSlugTarget}`)}
                                            className={linkClasses}
                                            style={activeStyle}
                                        >
                                            {displayName}
                                        </Link>
                                    );
                                }

                                const mainPageSlug = (secciones && secciones[0]?.slug) || 'inicio';
                                const anchorHref = isInicioPage
                                    ? `#${anchorId}`
                                    : (dominio === 'plantillas' ? `/plantillas/${siteSlug}/${mainPageSlug}#${anchorId}` : (siteSlug ? `/${dominio}/${siteSlug}/${mainPageSlug}#${anchorId}` : `/${dominio}/${mainPageSlug}#${anchorId}`));

                                return (
                                    <a
                                        key={seccion.slug}
                                        href={anchorHref}
                                        onClick={(e) => isInicioPage && handleAnchorClick(e, anchorId)}
                                        className={linkClasses}
                                        style={activeStyle}
                                    >
                                        {displayName}
                                    </a>
                                );
                            })}
                        </nav>
                    </div>

                    {/* 3.3. A LA DERECHA: BUSCADOR Y CARRITO */}
                    <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
                        {/* Buscador Desktop */}
                        <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-36 lg:w-48 rounded-full py-1.5 pl-8 pr-3 text-xs outline-none transition duration-300 ${isTransparentMode
                                    ? 'border border-white/30 bg-white/20 backdrop-blur-md text-white placeholder-white/70 focus:border-white focus:bg-white/30 focus:ring-2 focus:ring-white/20'
                                    : 'border border-gray-300/80 bg-white/90 text-gray-900 placeholder-gray-400 focus:border-[var(--color-primario)] focus:ring-2 focus:ring-[var(--color-primario)]/20 shadow-2xs'
                                    }`}
                            />
                            <button
                                type="submit"
                                className={`absolute left-2.5 top-1/2 -translate-y-1/2 transition cursor-pointer ${isTransparentMode ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-[var(--color-primario)]'
                                    }`}
                                title="Buscar"
                            >
                                <DynamicIcon name="FaMagnifyingGlass" className="h-3.5 w-3.5" />
                            </button>
                        </form>

                        {/* Botón Lupa Móvil */}
                        <button
                            type="button"
                            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                            className={`md:hidden p-2 rounded-xl transition cursor-pointer ${isTransparentMode
                                ? 'text-white hover:bg-white/20'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            title="Buscar productos"
                        >
                            <DynamicIcon name="FaMagnifyingGlass" className="h-4 w-4" />
                        </button>

                        {/* Botón Carrito */}
                        {hasStore && (
                            <button
                                type="button"
                                onClick={openCart}
                                className={`relative flex items-center justify-center rounded-xl p-2 transition cursor-pointer ${isTransparentMode
                                    ? 'border border-white/30 bg-white/20 backdrop-blur-md text-white hover:bg-white/30 shadow-sm'
                                    : 'border border-gray-200/80 bg-white/90 text-gray-800 hover:bg-gray-100 hover:text-black shadow-2xs'
                                    }`}
                                title="Ver Carrito de Compras"
                            >
                                <DynamicIcon
                                    name="FaCartShopping"
                                    className={`h-5 w-5 transition-colors ${isTransparentMode ? 'text-white' : 'text-[var(--color-primario)]'
                                        }`}
                                />
                                {cartCount > 0 && (
                                    <span
                                        className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-md animate-scale"
                                        style={{ backgroundColor: 'var(--color-primario)' }}
                                    >
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* 4. MEGA MENU DESPLEGABLE EN HOVER CON ESTILO SODIMAC / RETAIL */}
                <AnimatePresence>
                    {isMegaMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            onMouseEnter={handleMouseEnterMega}
                            onMouseLeave={handleMouseLeaveMega}
                            className="absolute top-full left-0 w-full bg-white border-t border-b border-gray-200/80 shadow-2xl z-50 text-gray-800 backdrop-blur-xl"
                        >
                            <div className="max-w-7xl mx-auto flex min-h-[380px] max-h-[540px] overflow-hidden">
                                {/* COLUMNA IZQUIERDA: PESTAÑAS Y LISTADO (CATEGORÍAS Y MARCAS) */}
                                <div className="w-64 sm:w-72 bg-gray-50/90 border-r border-gray-200/70 p-3 overflow-y-auto shrink-0 space-y-2">
                                    {/* Pestañas de Selección: Categorías / Marcas */}
                                    {marcasArbol.length > 0 ? (
                                        <div className="flex border border-gray-200/90 p-1 bg-gray-200/60 rounded-xl gap-1">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setMegaMenuTab('categorias');
                                                    setActiveHoverCategory(null);
                                                    setActiveHoverMarca(null);
                                                }}
                                                className={`flex-1 py-1.5 text-xs font-extrabold rounded-lg transition-all duration-200 cursor-pointer ${
                                                    megaMenuTab === 'categorias'
                                                        ? 'bg-white text-[var(--color-primario)] shadow-xs'
                                                        : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                            >
                                                Categorías ({categoriasArbol.length})
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setMegaMenuTab('marcas');
                                                    setActiveHoverCategory(null);
                                                    setActiveHoverMarca(null);
                                                }}
                                                className={`flex-1 py-1.5 text-xs font-extrabold rounded-lg transition-all duration-200 cursor-pointer ${
                                                    megaMenuTab === 'marcas'
                                                        ? 'bg-white text-[var(--color-primario)] shadow-xs'
                                                        : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                            >
                                                Marcas ({marcasArbol.length})
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 flex items-center justify-between">
                                            <span>Categorías</span>
                                            <span className="text-[10px] bg-gray-200 px-2 py-0.5 rounded-full text-gray-600 font-semibold">{categoriasArbol.length}</span>
                                        </div>
                                    )}

                                    {/* LISTADO SEGÚN PESTAÑA SELECCIONADA */}
                                    {megaMenuTab === 'categorias' ? (
                                        <>
                                            {/* Opción Ver Todo el Catálogo */}
                                            <Link
                                                href={getProductosUrl(null, null)}
                                                onClick={handleMegaMenuClick}
                                                onMouseEnter={() => setActiveHoverCategory(null)}
                                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                                                    activeHoverCategory === null
                                                        ? 'bg-[var(--color-primario)] text-white shadow-md'
                                                        : 'text-gray-700 hover:bg-gray-200/60 hover:text-gray-900'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <DynamicIcon name="FaGrip" className="h-4 w-4" />
                                                    <span>Ver todo el Catálogo</span>
                                                </div>
                                                <DynamicIcon name="FaChevronRight" className="h-3 w-3 opacity-70" />
                                            </Link>

                                            {/* Lista de Categorías */}
                                            {categoriasArbol.map((cat) => {
                                                const isSelected = activeHoverCategory === cat.nombre;
                                                return (
                                                    <div
                                                        key={cat.nombre}
                                                        onMouseEnter={() => setActiveHoverCategory(cat.nombre)}
                                                        onClick={() => {
                                                            handleMegaMenuClick();
                                                            router.visit(getProductosUrl(cat.nombre, null));
                                                        }}
                                                        className={`group/cat w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
                                                            isSelected
                                                                ? 'bg-white text-[var(--color-primario)] shadow-sm font-bold border border-gray-200/80 translate-x-1'
                                                                : 'text-gray-700 hover:bg-gray-200/50 hover:text-gray-900'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                                            {cat.icono && (
                                                                <span className={`p-1.5 rounded-lg transition-colors ${
                                                                    isSelected ? 'bg-[var(--color-primario)]/10 text-[var(--color-primario)]' : 'bg-gray-200/60 text-gray-500 group-hover/cat:text-gray-800'
                                                                }`}>
                                                                    <DynamicIcon name={cat.icono} className="h-3.5 w-3.5 shrink-0" />
                                                                </span>
                                                            )}
                                                            <span className="truncate">{cat.nombre}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 shrink-0">
                                                            {cat.ofertaBadge && (
                                                                <span className="text-[9px] font-black bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md uppercase">
                                                                    {cat.ofertaBadge}
                                                                </span>
                                                            )}
                                                            <DynamicIcon name="FaChevronRight" className={`h-3 w-3 transition-transform ${isSelected ? 'text-[var(--color-primario)] translate-x-0.5' : 'text-gray-400'}`} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    ) : (
                                        <>
                                            {/* Opción Ver Todas las Marcas */}
                                            <Link
                                                href={getProductosUrl(null, null)}
                                                onClick={handleMegaMenuClick}
                                                onMouseEnter={() => setActiveHoverMarca(null)}
                                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                                                    activeHoverMarca === null
                                                        ? 'bg-[var(--color-primario)] text-white shadow-md'
                                                        : 'text-gray-700 hover:bg-gray-200/60 hover:text-gray-900'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <DynamicIcon name="FaAward" className="h-4 w-4" />
                                                    <span>Todas las Marcas</span>
                                                </div>
                                                <DynamicIcon name="FaChevronRight" className="h-3 w-3 opacity-70" />
                                            </Link>

                                            {/* Lista de Marcas */}
                                            {marcasArbol.map((m) => {
                                                const isSelected = activeHoverMarca === m.nombre;
                                                return (
                                                    <div
                                                        key={m.nombre}
                                                        onMouseEnter={() => setActiveHoverMarca(m.nombre)}
                                                        onClick={() => {
                                                            handleMegaMenuClick();
                                                            router.visit(getMarcaUrl(m.nombre));
                                                        }}
                                                        className={`group/marca w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
                                                            isSelected
                                                                ? 'bg-white text-[var(--color-primario)] shadow-sm font-bold border border-gray-200/80 translate-x-1'
                                                                : 'text-gray-700 hover:bg-gray-200/50 hover:text-gray-900'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                                            {m.imagen ? (
                                                                <img src={m.imagen} alt={m.nombre} className="h-4 w-4 object-contain rounded shrink-0 bg-white" />
                                                            ) : (
                                                                <span className={`p-1.5 rounded-lg transition-colors ${
                                                                    isSelected ? 'bg-[var(--color-primario)]/10 text-[var(--color-primario)]' : 'bg-gray-200/60 text-gray-500'
                                                                }`}>
                                                                    <DynamicIcon name="FaTag" className="h-3 w-3 shrink-0" />
                                                                </span>
                                                            )}
                                                            <span className="truncate">{m.nombre}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 shrink-0">
                                                            {m.count > 0 && (
                                                                <span className="text-[10px] font-bold text-gray-500 bg-gray-200/80 px-1.5 py-0.5 rounded-md">
                                                                    {m.count}
                                                                </span>
                                                            )}
                                                            <DynamicIcon name="FaChevronRight" className={`h-3 w-3 transition-transform ${isSelected ? 'text-[var(--color-primario)] translate-x-0.5' : 'text-gray-400'}`} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    )}
                                </div>

                                {/* COLUMNA DERECHA: SUBCATEGORÍAS & OFERTAS / MARCAS */}
                                <div className="flex-1 p-6 overflow-y-auto bg-white flex flex-col justify-between">
                                    {megaMenuTab === 'marcas' ? (
                                        activeMarcaData ? (
                                            <div>
                                                {/* Header de la Marca Seleccionada */}
                                                <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
                                                    <div className="flex items-center gap-3">
                                                        {activeMarcaData.imagen ? (
                                                            <img src={activeMarcaData.imagen} alt={activeMarcaData.nombre} className="h-10 w-10 object-contain rounded-xl p-1 border border-gray-200 bg-white shadow-2xs" />
                                                        ) : (
                                                            <span className="p-2.5 rounded-xl bg-[var(--color-primario)]/10 text-[var(--color-primario)]">
                                                                <DynamicIcon name="FaAward" className="h-5 w-5" />
                                                            </span>
                                                        )}
                                                        <div>
                                                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                                <span>{activeMarcaData.nombre}</span>
                                                            </h3>
                                                            <p className="text-xs text-gray-500 font-medium">
                                                                {activeMarcaData.count} {activeMarcaData.count === 1 ? 'producto disponible' : 'productos disponibles'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Link
                                                        href={getMarcaUrl(activeMarcaData.nombre)}
                                                        onClick={handleMegaMenuClick}
                                                        className="text-xs font-bold text-[var(--color-primario)] hover:underline flex items-center gap-1"
                                                    >
                                                        <span>Ver todos los productos de esta marca</span>
                                                        <DynamicIcon name="FaArrowRight" className="h-3 w-3" />
                                                    </Link>
                                                </div>

                                                {/* Muestra de Productos de esta marca */}
                                                {activeMarcaData.productos && activeMarcaData.productos.length > 0 ? (
                                                    <div>
                                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                                            Productos Destacados de {activeMarcaData.nombre}
                                                        </h4>
                                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                            {activeMarcaData.productos.slice(0, 4).map((p, idx) => (
                                                                <Link
                                                                    key={p.id || idx}
                                                                    href={getMarcaUrl(activeMarcaData.nombre) + `&producto=${p.slug || p.id}`}
                                                                    onClick={handleMegaMenuClick}
                                                                    className="group/prod p-2.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all flex items-center gap-2.5 bg-gray-50/50 hover:bg-white"
                                                                >
                                                                    {p.imagen ? (
                                                                        <img src={p.imagen} alt={p.nombre} className="h-10 w-10 object-cover rounded-lg shrink-0 bg-white" />
                                                                    ) : (
                                                                        <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center shrink-0 text-gray-400">
                                                                            <DynamicIcon name="FaBox" className="h-4 w-4" />
                                                                        </div>
                                                                    )}
                                                                    <div className="min-w-0 flex-1">
                                                                        <p className="text-xs font-semibold text-gray-800 truncate group-hover/prod:text-[var(--color-primario)] transition-colors">
                                                                            {p.nombre}
                                                                        </p>
                                                                        <p className="text-xs font-black text-gray-900">
                                                                            S/ {Number(p.precio_oferta_soles || p.precio_oferta || p.precio_soles || p.precio || 0).toFixed(2)}
                                                                        </p>
                                                                    </div>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="py-8 text-center text-gray-400">
                                                        <DynamicIcon name="FaTag" className="h-6 w-6 mx-auto mb-2 opacity-50" />
                                                        <p className="text-xs">Explora todos los productos disponibles de {activeMarcaData.nombre}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            /* Vista general de Marcas */
                                            <div>
                                                <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                                                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                                        <span>Catálogo de Marcas</span>
                                                        <span className="text-[10px] bg-red-600 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">NUESTRAS MARCAS</span>
                                                    </h3>
                                                    <Link
                                                        href={getProductosUrl(null, null)}
                                                        onClick={handleMegaMenuClick}
                                                        className="text-xs font-bold text-[var(--color-primario)] hover:underline flex items-center gap-1"
                                                    >
                                                        <span>Ver catálogo completo</span>
                                                        <DynamicIcon name="FaArrowRight" className="h-3 w-3" />
                                                    </Link>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    {marcasArbol.map((m) => (
                                                        <Link
                                                            key={m.nombre}
                                                            href={getMarcaUrl(m.nombre)}
                                                            onClick={handleMegaMenuClick}
                                                            className="group/marcard bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-white hover:shadow-md transition-all flex items-center gap-3"
                                                        >
                                                            {m.imagen ? (
                                                                <img src={m.imagen} alt={m.nombre} className="h-9 w-9 object-contain rounded-xl p-1 bg-white border border-gray-200/60 shrink-0" />
                                                            ) : (
                                                                <div className="h-9 w-9 rounded-xl bg-gray-200/80 flex items-center justify-center shrink-0 text-gray-500 group-hover/marcard:text-[var(--color-primario)]">
                                                                    <DynamicIcon name="FaAward" className="h-4 w-4" />
                                                                </div>
                                                            )}
                                                            <div className="min-w-0 flex-1">
                                                                <h4 className="text-xs font-bold text-gray-900 truncate group-hover/marcard:text-[var(--color-primario)] transition-colors">
                                                                    {m.nombre}
                                                                </h4>
                                                                <p className="text-[11px] text-gray-400 font-medium">
                                                                    {m.count} {m.count === 1 ? 'producto' : 'productos'}
                                                                </p>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    ) : activeCategoryData ? (
                                        <div>
                                            {/* Header de la Categoría Seleccionada */}
                                            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    {activeCategoryData.icono && (
                                                        <span className="p-2.5 rounded-xl bg-[var(--color-primario)]/10 text-[var(--color-primario)]">
                                                            <DynamicIcon name={activeCategoryData.icono} className="h-5 w-5" />
                                                        </span>
                                                    )}
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                            <span>{activeCategoryData.nombre}</span>
                                                            {activeCategoryData.ofertaBadge && (
                                                                <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                                                                    {activeCategoryData.ofertaBadge}
                                                                </span>
                                                            )}
                                                        </h3>
                                                        <p className="text-xs text-gray-500 font-medium">
                                                            {activeCategoryData.count} productos disponibles
                                                        </p>
                                                    </div>
                                                </div>
                                                <Link
                                                    href={getProductosUrl(activeCategoryData.nombre, null)}
                                                    onClick={handleMegaMenuClick}
                                                    className="text-xs font-bold text-[var(--color-primario)] hover:underline flex items-center gap-1"
                                                >
                                                    <span>Ver toda la categoría</span>
                                                    <DynamicIcon name="FaArrowRight" className="h-3 w-3" />
                                                </Link>
                                            </div>

                                            {/* Subcategorías en Grid */}
                                            {activeCategoryData.subcategorias && activeCategoryData.subcategorias.length > 0 ? (
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                                    {activeCategoryData.subcategorias.map((sub) => (
                                                        <div key={sub.nombre} className="group/sub">
                                                            <Link
                                                                href={getProductosUrl(activeCategoryData.nombre, sub.nombre)}
                                                                onClick={handleMegaMenuClick}
                                                                className="text-sm font-bold text-gray-900 hover:text-[var(--color-primario)] transition-colors flex items-center gap-1.5 mb-2"
                                                            >
                                                                <span>{sub.nombre}</span>
                                                                <span className="text-xs text-gray-400 font-normal">({sub.count})</span>
                                                                <DynamicIcon name="FaChevronRight" className="h-3 w-3 text-gray-400 opacity-0 group-hover/sub:opacity-100 group-hover/sub:translate-x-1 transition-all" />
                                                            </Link>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="py-6 text-sm text-gray-500 flex items-center gap-2">
                                                    <DynamicIcon name="FaTag" className="h-4 w-4 text-[var(--color-primario)]" />
                                                    <span>Explora todos los productos en {activeCategoryData.nombre}</span>
                                                </div>
                                            )}

                                            {/* Muestra de Productos Destacados */}
                                            {activeCategoryData.productos && activeCategoryData.productos.length > 0 && (
                                                <div className="mt-8 pt-6 border-t border-gray-100">
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                                        Destacados en {activeCategoryData.nombre}
                                                    </h4>
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                        {activeCategoryData.productos.slice(0, 4).map((p, idx) => (
                                                            <Link
                                                                key={p.id || idx}
                                                                href={getProductosUrl(activeCategoryData.nombre, null) + `&producto=${p.slug || p.id}`}
                                                                onClick={handleMegaMenuClick}
                                                                className="group/prod p-2.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all flex items-center gap-2.5 bg-gray-50/50 hover:bg-white"
                                                            >
                                                                {p.imagen ? (
                                                                    <img src={p.imagen} alt={p.nombre} className="h-10 w-10 object-cover rounded-lg shrink-0 bg-white" />
                                                                ) : (
                                                                    <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center shrink-0 text-gray-400">
                                                                        <DynamicIcon name="FaBox" className="h-4 w-4" />
                                                                    </div>
                                                                )}
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="text-xs font-semibold text-gray-800 truncate group-hover/prod:text-[var(--color-primario)] transition-colors">
                                                                        {p.nombre}
                                                                    </p>
                                                                    <p className="text-xs font-black text-gray-900">
                                                                        S/ {Number(p.precio_oferta_soles || p.precio_oferta || p.precio_soles || p.precio || 0).toFixed(2)}
                                                                    </p>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        /* Vista predeterminada cuando no hay categoría específica activa */
                                        <div>
                                            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                                                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                                    <span>Catálogo de Categorías</span>
                                                    <span className="text-[10px] bg-red-600 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">OFERTAS Y DESCUENTOS</span>
                                                </h3>
                                                <Link
                                                    href={getProductosUrl(null, null)}
                                                    onClick={handleMegaMenuClick}
                                                    className="text-xs font-bold text-[var(--color-primario)] hover:underline flex items-center gap-1"
                                                >
                                                    <span>Ver catálogo completo</span>
                                                    <DynamicIcon name="FaArrowRight" className="h-3 w-3" />
                                                </Link>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                                                {categoriasArbol.map((cat) => (
                                                    <div key={cat.nombre} className="group/catcard bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-white hover:shadow-md transition-all">
                                                        <Link
                                                            href={getProductosUrl(cat.nombre, null)}
                                                            onClick={handleMegaMenuClick}
                                                            className="flex items-center justify-between mb-2"
                                                        >
                                                            <span className="text-sm font-bold text-gray-900 group-hover/catcard:text-[var(--color-primario)] transition-colors flex items-center gap-2">
                                                                {cat.icono && <DynamicIcon name={cat.icono} className="h-4 w-4 text-[var(--color-primario)]" />}
                                                                <span>{cat.nombre}</span>
                                                            </span>
                                                            {cat.ofertaBadge && (
                                                                <span className="text-[9px] font-black bg-red-600 text-white px-1.5 py-0.5 rounded-full uppercase">
                                                                    {cat.ofertaBadge}
                                                                </span>
                                                            )}
                                                        </Link>

                                                        {cat.subcategorias && cat.subcategorias.length > 0 ? (
                                                            <div className="space-y-1 mt-2">
                                                                {cat.subcategorias.slice(0, 3).map((sub) => (
                                                                    <Link
                                                                        key={sub.nombre}
                                                                        href={getProductosUrl(cat.nombre, sub.nombre)}
                                                                        onClick={handleMegaMenuClick}
                                                                        className="block text-xs text-gray-500 hover:text-gray-900 hover:translate-x-0.5 transition-all truncate"
                                                                    >
                                                                        {sub.nombre}
                                                                    </Link>
                                                                ))}
                                                                {cat.subcategorias.length > 3 && (
                                                                    <Link
                                                                        href={getProductosUrl(cat.nombre, null)}
                                                                        onClick={handleMegaMenuClick}
                                                                        className="block text-[11px] font-bold text-[var(--color-primario)] pt-1"
                                                                    >
                                                                        + ver {cat.subcategorias.length - 3} más
                                                                    </Link>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-gray-400 font-normal">
                                                                {cat.count} {cat.count === 1 ? 'producto' : 'productos'}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* PANEL DESPLEGABLE DE BÚSQUEDA MÓVIL */}
                {mobileSearchOpen && (
                    <div className="md:hidden border-t border-gray-200/80 bg-white px-4 py-3 shadow-lg text-gray-900">
                        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                            <input
                                type="text"
                                autoFocus
                                placeholder="Buscar productos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-xl py-2 pl-9 pr-10 text-xs outline-none border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-[var(--color-primario)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primario)]/20"
                            />
                            <button
                                type="submit"
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--color-primario)]"
                            >
                                <DynamicIcon name="FaMagnifyingGlass" className="h-4 w-4" />
                            </button>
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            )}
                        </form>
                    </div>
                )}

                {/* MENÚ MÓVIL DESPLEGABLE (FONDO BLANCO SIEMPRE) */}
                {mobileMenuOpen && (
                    <nav className="md:hidden border-t border-gray-200/80 bg-white px-6 py-4 space-y-1.5 shadow-2xl text-gray-900">
                        {navSecciones?.map((seccion) => {
                            const slugLower = seccion.slug?.toLowerCase() || '';
                            const nombreLower = (seccion.nombre || '').toLowerCase();
                            const filtroProdLower = (seccion.filtro_producto || '').toLowerCase();
                            const displayName = getDisplayName(seccion);
                            const normalizedSlug = slugLower.replace(/[\s_]+/g, '-');
                            const anchorId = slugLower === 'contactos' ? 'contacto' : normalizedSlug;
                            const isInicioPage = !seccionActiva || seccionActiva.slug?.toLowerCase() === 'inicio';

                            const isInicio = slugLower === 'inicio' || slugLower === 'hero';
                            const isProductos = slugLower === 'productos' || slugLower === 'tienda' || slugLower === 'tiendas';
                            const isServicios = slugLower === 'servicios' || slugLower === 'servicio';
                            const isNosotros = slugLower === 'nosotros' || slugLower === 'sobre-nosotros';
                            const isContacto = slugLower === 'contacto' || slugLower === 'contactos';
                            const isLiquidaciones =
                                slugLower === 'liquidacion' ||
                                slugLower === 'liquidaciones' ||
                                filtroProdLower === 'liquidaciones' ||
                                filtroProdLower === 'liquidacion' ||
                                nombreLower.includes('liquidaci');

                            const isOfertas =
                                slugLower === 'oferta' ||
                                slugLower === 'ofertas' ||
                                filtroProdLower === 'ofertas' ||
                                filtroProdLower === 'oferta' ||
                                nombreLower.includes('oferta');

                            const hasStandalonePage = isInicio || isProductos || isServicios || isNosotros || isContacto;

                            const pageSlugTarget = isInicio ? 'inicio' : (isProductos ? 'productos' : (isServicios ? 'servicios' : (isNosotros ? 'nosotros' : (isContacto ? 'contacto' : seccion.slug))));
                            const activa = isInicio
                                ? (!seccionActiva || seccionActiva.slug?.toLowerCase() === 'inicio' || seccionActiva.slug?.toLowerCase() === 'hero')
                                : (pageSlugTarget === seccionActiva?.slug?.toLowerCase() || (isProductos && seccionActiva?.slug?.toLowerCase() === 'productos') || (isServicios && seccionActiva?.slug?.toLowerCase() === 'servicios') || (isNosotros && (seccionActiva?.slug?.toLowerCase() === 'nosotros' || seccionActiva?.slug?.toLowerCase() === 'sobre-nosotros')) || (isContacto && (seccionActiva?.slug?.toLowerCase() === 'contacto' || seccionActiva?.slug?.toLowerCase() === 'contactos')));

                            const linkClasses = `block rounded-lg px-3 py-2.5 text-sm font-semibold transition ${activa
                                ? 'text-white shadow-xs'
                                : 'text-gray-800 hover:bg-gray-100 hover:text-gray-900'
                                }`;
                            const activeStyle = activa ? { backgroundColor: 'var(--color-primario)', color: '#fff' } : {};

                                if (slugLower === 'catalogo' || seccion.isCatalogo) {
                                    if (!isCatalogoActivo) return null;
                                    return (
                                        <a
                                            key="catalogo"
                                            href={downloadUrl}
                                            onClick={(e) => {
                                                setMobileMenuOpen(false);
                                                handleDescargarCatalogo(e);
                                            }}
                                            className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                        >
                                            {catalogoTitulo}
                                        </a>
                                    );
                                }

                                if (isLiquidaciones) {
                                    const targetUrl = dominio === 'plantillas'
                                        ? `/plantillas/${siteSlug}/productos?liquidaciones=1`
                                        : (siteSlug ? `/${dominio}/${siteSlug}/productos?liquidaciones=1` : `/${dominio}/productos?liquidaciones=1`);
                                    const isLiquidacionesActiva = Boolean(currentUrl && (currentUrl.includes('liquidaciones=1') || currentUrl.includes('liquidacion=1') || currentUrl.includes('filtro_producto=liquidaciones') || currentUrl.includes('filtro_producto=liquidacion')));

                                    return (
                                        <Link
                                            key={seccion.slug || 'liquidaciones'}
                                            href={targetUrl}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`block rounded-lg px-3 py-2.5 text-sm font-semibold transition ${isLiquidacionesActiva
                                                ? 'text-white shadow-xs'
                                                : 'text-gray-800 hover:bg-gray-100 hover:text-gray-900'
                                                }`}
                                            style={isLiquidacionesActiva ? { backgroundColor: 'var(--color-primario)', color: '#fff' } : {}}
                                        >
                                            {displayName}
                                        </Link>
                                    );
                                }

                                if (isOfertas) {
                                    const targetUrl = dominio === 'plantillas'
                                        ? `/plantillas/${siteSlug}/productos?ofertas=1`
                                        : (siteSlug ? `/${dominio}/${siteSlug}/productos?ofertas=1` : `/${dominio}/productos?ofertas=1`);
                                    const isOfertasActiva = Boolean(currentUrl && (currentUrl.includes('ofertas=1') || currentUrl.includes('oferta=1') || currentUrl.includes('solo_ofertas=1') || currentUrl.includes('filtro_producto=ofertas') || currentUrl.includes('filtro_producto=oferta')));

                                    return (
                                        <Link
                                            key={seccion.slug || 'ofertas'}
                                            href={targetUrl}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`block rounded-lg px-3 py-2.5 text-sm font-semibold transition ${isOfertasActiva
                                                ? 'text-white shadow-xs'
                                                : 'text-gray-800 hover:bg-gray-100 hover:text-gray-900'
                                                }`}
                                            style={isOfertasActiva ? { backgroundColor: 'var(--color-primario)', color: '#fff' } : {}}
                                        >
                                            {displayName}
                                        </Link>
                                    );
                                }

                                if (isProductos && (categoriasArbol.length > 0 || marcasArbol.length > 0)) {
                                    return (
                                        <div key={seccion.slug} className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <Link
                                                    href={getProductosUrl(null, null)}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={`${linkClasses} flex-1`}
                                                    style={activeStyle}
                                                >
                                                    {displayName}
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => setMobileSubmenuOpen(!mobileSubmenuOpen)}
                                                    className="p-2 text-gray-500 hover:text-gray-900 cursor-pointer"
                                                >
                                                    <DynamicIcon name="FaChevronDown" className={`h-4 w-4 transition-transform ${mobileSubmenuOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                            </div>
                                            {mobileSubmenuOpen && (
                                                <div className="pl-4 space-y-3 border-l-2 border-[var(--color-primario)]/30 ml-2 my-1.5 pt-1">
                                                    {/* Sub-sección Categorías */}
                                                    {categoriasArbol.length > 0 && (
                                                        <div className="space-y-1.5">
                                                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">Categorías</span>
                                                            {categoriasArbol.map((cat) => (
                                                                <div key={cat.nombre} className="space-y-1">
                                                                    <Link
                                                                        href={getProductosUrl(cat.nombre, null)}
                                                                        onClick={() => setMobileMenuOpen(false)}
                                                                        className="flex items-center gap-2 text-xs font-bold text-gray-800 hover:text-[var(--color-primario)] py-0.5"
                                                                    >
                                                                        {cat.icono && <DynamicIcon name={cat.icono} className="h-3.5 w-3.5 text-[var(--color-primario)] shrink-0" />}
                                                                        <span>{cat.nombre}</span>
                                                                    </Link>
                                                                    {cat.subcategorias?.map((sub) => (
                                                                        <Link
                                                                            key={sub.nombre}
                                                                            href={getProductosUrl(cat.nombre, sub.nombre)}
                                                                            onClick={() => setMobileMenuOpen(false)}
                                                                            className="block text-[11px] text-gray-600 hover:text-gray-900 pl-2 py-0.5"
                                                                        >
                                                                            • {sub.nombre}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Sub-sección Marcas */}
                                                    {marcasArbol.length > 0 && (
                                                        <div className="space-y-1.5 pt-2 border-t border-gray-100">
                                                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">Marcas</span>
                                                            <div className="grid grid-cols-2 gap-1.5">
                                                                {marcasArbol.map((m) => (
                                                                    <Link
                                                                        key={m.nombre}
                                                                        href={getMarcaUrl(m.nombre)}
                                                                        onClick={() => setMobileMenuOpen(false)}
                                                                        className="flex items-center gap-1.5 text-xs font-medium text-gray-700 hover:text-[var(--color-primario)] p-1 rounded-md hover:bg-gray-100"
                                                                    >
                                                                        {m.imagen ? (
                                                                            <img src={m.imagen} alt={m.nombre} className="h-3.5 w-3.5 object-contain rounded shrink-0" />
                                                                        ) : (
                                                                            <DynamicIcon name="FaTag" className="h-3 w-3 text-[var(--color-primario)] shrink-0" />
                                                                        )}
                                                                        <span className="truncate">{m.nombre}</span>
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }

                                if (isMarcas && marcasArbol.length > 0) {
                                    return (
                                        <div key={seccion.slug || 'marcas'} className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <Link
                                                    href={getProductosUrl(null, null)}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={`${linkClasses} flex-1`}
                                                    style={activeStyle}
                                                >
                                                    {displayName}
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => setMobileMarcasSubmenuOpen(!mobileMarcasSubmenuOpen)}
                                                    className="p-2 text-gray-500 hover:text-gray-900 cursor-pointer"
                                                >
                                                    <DynamicIcon name="FaChevronDown" className={`h-4 w-4 transition-transform ${mobileMarcasSubmenuOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                            </div>
                                            {mobileMarcasSubmenuOpen && (
                                                <div className="pl-4 space-y-2 border-l-2 border-[var(--color-primario)]/30 ml-2 my-1.5 pt-1">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {marcasArbol.map((m) => (
                                                            <Link
                                                                key={m.nombre}
                                                                href={getMarcaUrl(m.nombre)}
                                                                onClick={() => setMobileMenuOpen(false)}
                                                                className="flex items-center gap-2 text-xs font-semibold text-gray-800 hover:text-[var(--color-primario)] p-2 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white transition shadow-2xs"
                                                            >
                                                                {m.imagen ? (
                                                                    <img src={m.imagen} alt={m.nombre} className="h-6 w-6 object-contain rounded-lg shrink-0 bg-white p-0.5 border border-gray-200" />
                                                                ) : (
                                                                    <DynamicIcon name="FaTag" className="h-4 w-4 text-[var(--color-primario)] shrink-0" />
                                                                )}
                                                                <div className="min-w-0 flex-1">
                                                                    <span className="truncate block font-bold text-gray-900">{m.nombre}</span>
                                                                    {m.count > 0 && <span className="text-[10px] text-gray-400 block">{m.count} productos</span>}
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }

                            if (hasStandalonePage) {
                                return (
                                    <Link
                                        key={seccion.slug}
                                        href={dominio === 'plantillas' ? `/plantillas/${siteSlug}/${pageSlugTarget}` : (siteSlug ? `/${dominio}/${siteSlug}/${pageSlugTarget}` : `/${dominio}/${pageSlugTarget}`)}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={linkClasses}
                                        style={activeStyle}
                                    >
                                        {displayName}
                                    </Link>
                                );
                            }

                            const mainPageSlug = (secciones && secciones[0]?.slug) || 'inicio';
                            const anchorHref = isInicioPage
                                ? `#${anchorId}`
                                : (dominio === 'plantillas' ? `/plantillas/${siteSlug}/${mainPageSlug}#${anchorId}` : (siteSlug ? `/${dominio}/${siteSlug}/${mainPageSlug}#${anchorId}` : `/${dominio}/${mainPageSlug}#${anchorId}`));

                            return (
                                <a
                                    key={seccion.slug}
                                    href={anchorHref}
                                    onClick={(e) => {
                                        setMobileMenuOpen(false);
                                        if (isInicioPage) handleAnchorClick(e, anchorId);
                                    }}
                                    className={linkClasses}
                                    style={activeStyle}
                                >
                                    {displayName}
                                </a>
                            );
                        })}
                    </nav>
                )}
            </header>

            {/* OFFCANVAS DRAWER DEL CARRITO */}
            <CartOffcanvas site={site} estilos={estilos} seccionesData={seccionesData} />
        </>
    );
}