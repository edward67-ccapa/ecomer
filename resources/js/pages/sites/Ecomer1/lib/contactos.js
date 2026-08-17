import { apiFetch } from './api';

export async function getSeccionContactos(dominio, siteSlug) {
    return apiFetch(`/sites/${dominio}/${siteSlug}/contactos`);
}
