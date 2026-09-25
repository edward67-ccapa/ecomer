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
        const item = serviciosData?.contenido?.find(
            (c) => (c.label || '').toLowerCase() === labelName.toLowerCase()
        );
        const rawValor = item?.valor;
        const data = Array.isArray(rawValor) ? rawValor[0] : (rawValor || {});
        return { data, rawValor, group: item };
    };

    // 1. HERO
    const heroGroup = getGroupData('hero');
    const heroData = heroGroup.data || {};
    const heroImagenRaw = heroData.Imagen || heroData.imagen || heroData.Img;
    const heroImagen = Array.isArray(heroImagenRaw) ? heroImagenRaw[0] : heroImagenRaw;
    const heroTitulo = heroData.Titulo || heroData.titulo || 'Our Service';
    const heroDescripcion = heroData.Descripcion || heroData.descripcion || '';

    const hero = {
        imagen: heroImagen,
        titulo: heroTitulo,
        descripcion: heroDescripcion,
        raw: heroData,
    };

    // 2. SERVICIOS BLOCK
    const serviciosGroup = getGroupData('servicios');
    const serviciosDataObj = serviciosGroup.data || {};
    const serviciosList = Array.isArray(serviciosDataObj.Servicios) ? serviciosDataObj.Servicios : [];

    const serviciosBlock = {
        subIcono: serviciosDataObj.SubIcono || serviciosDataObj.subicono || 'MdOutlineCake',
        sub: serviciosDataObj.sub || serviciosDataObj.Sub || '',
        titulo: serviciosDataObj.Titulo || serviciosDataObj.titulo || '',
        items: serviciosList.map((item, idx) => {
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
            };
        }),
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
