import { apiFetch } from './api';

export async function getSeccionOferta(dominio, siteSlug) {
    return apiFetch(`/sites/${dominio}/${siteSlug}/oferta`);
}

export async function getSeccionDetalles(dominio, siteSlug) {
    return apiFetch(`/sites/${dominio}/${siteSlug}/detalles`);
}
