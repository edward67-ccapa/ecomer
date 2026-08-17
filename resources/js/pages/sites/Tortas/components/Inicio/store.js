import { create } from 'zustand';
import { fetchInicioData } from './api';
import { mapInicioData } from './mapper';

export const useInicioStore = create((set) => ({
    seccionData: null,
    mapped: {},
    loading: false,
    error: null,

    initInicio: (seccion) => {
        if (seccion) {
            set({
                seccionData: seccion,
                mapped: mapInicioData(seccion.contenido || []),
            });
        }
    },

    loadInicioApi: async (dominio, siteSlug) => {
        set({ loading: true, error: null });
        try {
            const response = await fetchInicioData(dominio, siteSlug);
            const seccion = response.seccionActiva;
            set({
                seccionData: seccion,
                mapped: mapInicioData(seccion?.contenido || []),
                loading: false,
            });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
}));
