import { create } from 'zustand';
import { fetchNosotrosData } from './api';
import { mapNosotrosData } from './mapper';

export const useNosotrosStore = create((set) => ({
    seccionData: null,
    mapped: {},
    loading: false,
    error: null,

    initNosotros: (seccion) => {
        if (seccion) {
            set({
                seccionData: seccion,
                mapped: mapNosotrosData(seccion.contenido || []),
            });
        }
    },

    loadNosotrosApi: async (dominio, siteSlug) => {
        set({ loading: true, error: null });
        try {
            const response = await fetchNosotrosData(dominio, siteSlug);
            const seccion = response.seccionActiva;
            set({
                seccionData: seccion,
                mapped: mapNosotrosData(seccion?.contenido || []),
                loading: false,
            });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
}));
