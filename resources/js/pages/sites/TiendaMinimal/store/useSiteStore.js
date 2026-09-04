import { create } from 'zustand';
import { fetchSiteSection } from '../lib/api';
import { mapSectionContent, mapSiteStyles } from '../mapper/siteMapper';

export const useSiteStore = create((set, get) => ({
    site: null,
    secciones: [],
    seccionActiva: null,
    contenidoMapped: {},
    styles: {},
    loading: false,
    error: null,

    // Inicializar estado desde props de Inertia o SSR
    initStore: (initialProps) => {
        if (!initialProps) return;
        set({
            site: initialProps.site || null,
            secciones: initialProps.secciones || [],
            seccionActiva: initialProps.seccionActiva || null,
            contenidoMapped: mapSectionContent(initialProps.seccionActiva?.contenido || []),
            styles: mapSiteStyles(initialProps.estilos || {}),
        });
    },

    // Cargar sección mediante REST API desacoplada
    loadSectionApi: async (dominio, siteSlug, seccionSlug) => {
        set({ loading: true, error: null });
        try {
            const data = await fetchSiteSection(dominio, siteSlug, seccionSlug);
            set({
                site: data.site,
                secciones: data.secciones,
                seccionActiva: data.seccionActiva,
                contenidoMapped: mapSectionContent(data.seccionActiva?.contenido || []),
                styles: mapSiteStyles(data.estilos || {}),
                loading: false,
            });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
}));
