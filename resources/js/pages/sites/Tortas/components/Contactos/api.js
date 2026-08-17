import { fetchSectionData } from '../../shared/apiBase';

export async function fetchContactosData(dominio, siteSlug) {
    return fetchSectionData(dominio, siteSlug, 'contactos');
}
