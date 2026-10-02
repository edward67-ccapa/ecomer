import { useMemo } from 'react';

export function useServiciosData(seccion, seccionesData, serviciosSitio = []) {
    const serviciosData = useMemo(() => {
        if (seccion) return seccion;
        if (!seccionesData) return null;

        if (seccionesData.servicios || seccionesData.SERVICIOS || seccionesData.Servicios) {
            return seccionesData.servicios || seccionesData.SERVICIOS || seccionesData.Servicios;
        }

        const normalize = (str) =>
            String(str || '')
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[-_ ]/g, '');

        const list = Array.isArray(seccionesData)
            ? seccionesData
            : Object.values(seccionesData);

        for (const item of list) {
            if (!item) continue;
            const slugNorm = normalize(item.slug || item.nombre || '');
            if (slugNorm === 'servicios' || slugNorm === 'servicio') {
                return item;
            }
        }

        return null;
    }, [seccion, seccionesData]);

    const getGroupData = (labelName) => {
        const normalizeStr = (str) =>
            String(str || '')
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[-_ ]/g, '');

        const targetNorm = normalizeStr(labelName);

        const item = serviciosData?.contenido?.find(
            (c) => normalizeStr(c.label) === targetNorm
        );
        const rawValor = item?.valor;
        const data = Array.isArray(rawValor) ? rawValor[0] : (rawValor || {});
        return { data, rawValor, group: item };
    };

    const extractUrl = (val) => {
        if (!val) return null;
        if (typeof val === 'string') return val.trim();
        if (Array.isArray(val)) {
            if (val.length === 0) return null;
            const first = val[0];
            return typeof first === 'string' ? first.trim() : extractUrl(first);
        }
        if (typeof val === 'object' && val !== null) {
            const possibleUrl = val.url || val.src || val.path || val.Imagen || val.imagen || Object.values(val)[0];
            return extractUrl(possibleUrl);
        }
        return null;
    };

    // 1. HERO
    const heroGroupData = getGroupData('hero');
    const heroGroup = heroGroupData.group ? heroGroupData : getGroupData('portada');
    const heroData = heroGroup.data || {};
    const rawImagenes = heroData.Imagenes || heroData.imagenes || heroData.images || heroData.Images;

    const getResponsiveFromObj = (obj) => {
        if (!obj || typeof obj !== 'object') return null;
        const pc = extractUrl(obj.Imagen_pc || obj.imagen_pc || obj.pc || obj.Imagen_PC || obj.imagen_desktop || obj.desktop);
        const tablet = extractUrl(obj.Imagen_tablet || obj.imagen_tablet || obj.tablet || obj.Imagen_Tablet);
        const cel = extractUrl(obj.Imagen_cel || obj.imagen_cel || obj.cel || obj.Imagen_Cel || obj.imagen_mobile || obj.mobile);
        if (pc || tablet || cel) {
            return { pc, tablet, cel };
        }
        return null;
    };

    let responsiveImg = null;
    if (Array.isArray(rawImagenes) && rawImagenes.length > 0) {
        const firstSlide = rawImagenes[0];
        if (typeof firstSlide === 'object' && firstSlide !== null) {
            responsiveImg = getResponsiveFromObj(firstSlide);
        }
        if (!responsiveImg) {
            const singleUrl = extractUrl(rawImagenes);
            if (singleUrl) {
                responsiveImg = { pc: singleUrl, tablet: singleUrl, cel: singleUrl };
            }
        }
    } else if (rawImagenes && typeof rawImagenes === 'object') {
        responsiveImg = getResponsiveFromObj(rawImagenes);
    }

    if (!responsiveImg) {
        responsiveImg = getResponsiveFromObj(heroData);
    }

    const heroImagenRaw = heroData.Imagen || heroData.imagen || heroData.Img || heroData.img;
    const fallbackImagen = extractUrl(heroImagenRaw);
    const heroTitulo = heroData.Titulo || heroData.titulo || heroData.title || heroData.Title || '';
    const heroDescripcion = heroData.Descripcion || heroData.descripcion || heroData.description || heroData.Description || heroData.Parrafo || heroData.parrafo || '';

    const hero = {
        imagen: responsiveImg?.cel || responsiveImg?.tablet || responsiveImg?.pc || fallbackImagen,
        responsiveImg,
        titulo: heroTitulo,
        descripcion: heroDescripcion,
        raw: heroData,
    };

    // 2. SERVICIOS BLOCK
    const serviciosGroup = getGroupData('servicios');
    const serviciosDataObj = serviciosGroup.data || {};
    const serviciosList = Array.isArray(serviciosDataObj.Servicios) ? serviciosDataObj.Servicios : [];

    let itemsFinales = [];
    if (serviciosList.length > 0) {
        itemsFinales = serviciosList.map((item, idx) => {
            const rawImg = item.Imagen || item.imagen;
            const img = Array.isArray(rawImg) ? rawImg[0] : rawImg;
            const rawBoton = item.Boton !== undefined ? item.Boton : item.boton;
            const botonTxt = typeof rawBoton === 'string' ? rawBoton.trim() : (rawBoton ? String(rawBoton).trim() : null);
            const rawIcono = item.BotonIcono !== undefined ? item.BotonIcono : item.botonIcono;
            const iconoTxt = typeof rawIcono === 'string' ? rawIcono.trim() : (rawIcono ? String(rawIcono).trim() : null);

            return {
                numero: `No - ${String(idx + 1).padStart(2, '0')}`,
                imagen: img,
                titulo: item.Titulo || item.titulo || '',
                descripcion: item.Descripcion || item.descripcion || '',
                boton: botonTxt || null,
                botonIcono: iconoTxt || (botonTxt ? 'FaChevronRight' : null),
                url: item.url || item.enlace || null,
            };
        });
    } else if (Array.isArray(serviciosSitio) && serviciosSitio.length > 0) {
        let count = 1;
        serviciosSitio.forEach((grupo) => {
            const list = grupo.servicios || [];
            list.forEach((s) => {
                itemsFinales.push({
                    id: s.id,
                    numero: `No - ${String(count++).padStart(2, '0')}`,
                    imagen: s.imagen,
                    icono: s.icono,
                    titulo: s.titulo || '',
                    subtitulo: s.subtitulo || '',
                    descripcion: s.descripcion || s.descripcioncorta || '',
                    lista: s.lista || [],
                    boton: s.boton || 'Más información',
                    botonIcono: 'FaChevronRight',
                    url: s.url || '#contacto',
                });
            });
        });
    }

    const serviciosBlock = {
        subIcono: serviciosDataObj.SubIcono || serviciosDataObj.subicono || 'MdOutlineCake',
        sub: serviciosDataObj.sub || serviciosDataObj.Sub || '',
        titulo: serviciosDataObj.Titulo || serviciosDataObj.titulo || '',
        items: itemsFinales,
        raw: serviciosDataObj,
    };

    // 3. PROCESOS BLOCK
    const procesosGroup = getGroupData('procesos');
    const procesosDataObj = procesosGroup.data || {};
    const procesosList = Array.isArray(procesosDataObj.Procesos)
        ? procesosDataObj.Procesos
        : (Array.isArray(procesosDataObj.procesos) ? procesosDataObj.procesos : []);

    const imagenFondoRaw = procesosDataObj.ImagenFondo || procesosDataObj.imagenfondo || procesosDataObj.imagen_fondo;
    const imagenFondo = Array.isArray(imagenFondoRaw) ? imagenFondoRaw[0] : (typeof imagenFondoRaw === 'string' ? imagenFondoRaw : null);

    const procesosBlock = {
        subIcono: procesosDataObj.SubIcono || procesosDataObj.subicono || 'PiCakeBold',
        sub: procesosDataObj.Sub || procesosDataObj.sub || '',
        titulo: procesosDataObj.Titulo || procesosDataObj.titulo || '',
        imagenFondo: imagenFondo,
        items: procesosList.map((item, idx) => ({
            numero: String(idx + 1).padStart(2, '0'),
            titulo: item.Titulo || item.titulo || '',
            descripcion: item.Descripcion || item.descripcion || '',
        })),
        raw: procesosDataObj,
    };

    // 4. VIDEO BLOCK
    const videoGroup = getGroupData('video');
    const videoDataObj = videoGroup.data || {};
    const videoGroupItem = videoGroup.group || {};
    const videoImagenRaw = videoDataObj.Imagen || videoDataObj.imagen;
    const videoImagen = Array.isArray(videoImagenRaw) ? videoImagenRaw[0] : videoImagenRaw;

    const videoBlock = {
        titulo: videoDataObj.Titulo || videoDataObj.titulo || '',
        imagen: videoImagen || '',
        enlace: videoGroupItem.enlace || videoDataObj.enlace || '',
        porcentajes: Array.isArray(videoDataObj.Porcentaje || videoDataObj.porcentaje)
            ? (videoDataObj.Porcentaje || videoDataObj.porcentaje).map((p) => ({
                titulo: p.Titulo || p.titulo || '',
                porcentaje: p.Porcentaje || p.porcentaje || '0',
            }))
            : [],
        info: Array.isArray(videoDataObj.Info || videoDataObj.info)
            ? (videoDataObj.Info || videoDataObj.info).map((i) => ({
                icono: i.Icono || i.icono || '',
                titulo: i.Titulo || i.titulo || '',
            }))
            : [],
        raw: videoDataObj,
    };

    // 5. SERVICIOS DETALLADOS BLOCK
    const serviciosDetalladosGroup = getGroupData('servicios_detallados') || getGroupData('serviciosdetallados') || getGroupData('servicios_detallado');
    const serviciosDetalladosDataObj = serviciosDetalladosGroup.data || {};

    const serviciosDetalladosBlock = {
        servicioName: serviciosDetalladosDataObj.ServicioName || serviciosDetalladosDataObj.servicioName || serviciosDetalladosDataObj.servicioname || 'postres',
        titulo: serviciosDetalladosDataObj.Titulo || serviciosDetalladosDataObj.titulo || '',
        descripcion: serviciosDetalladosDataObj.Descripcion || serviciosDetalladosDataObj.descripcion || '',
        items: Array.isArray(serviciosDetalladosDataObj.Items || serviciosDetalladosDataObj.items) ? (serviciosDetalladosDataObj.Items || serviciosDetalladosDataObj.items) : [],
        raw: serviciosDetalladosDataObj,
    };
    console.log(serviciosDetalladosGroup)
    return {
        serviciosData,
        hero,
        serviciosBlock,
        procesosBlock,
        videoBlock,
        serviciosDetalladosBlock,
        serviciosGroup: serviciosDataObj,
        procesosGroup: procesosDataObj,
        videoGroup: videoDataObj,
        serviciosSitio,
        loading: false,
    };
}
