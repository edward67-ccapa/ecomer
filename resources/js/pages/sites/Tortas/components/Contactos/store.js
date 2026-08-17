import { create } from 'zustand';
import { fetchContactosData } from './api';
import { mapContactosData } from './mapper';

export const useContactosStore = create((set) => ({
    seccionData: null,
    mapped: {},
    loading: false,
    error: null,

    initContactos: (seccion) => {
        if (seccion) {
            set({
                seccionData: seccion,
                mapped: mapContactosData(seccion.contenido || []),
            });
        }
    },

    loadContactosApi: async (dominio, siteSlug) => {
        set({ loading: true, error: null });
        try {
            const response = await fetchContactosData(dominio, siteSlug);
            const seccion = response.seccionActiva;
            set({
                seccionData: seccion,
                mapped: mapContactosData(seccion?.contenido || []),
                loading: false,
            });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
}));
