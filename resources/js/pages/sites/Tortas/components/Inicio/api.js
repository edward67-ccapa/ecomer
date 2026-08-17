import { fetchSectionData } from '../../shared/apiBase';

export async function fetchInicioData(dominio, siteSlug) {
    return fetchSectionData(dominio, siteSlug, 'inicio');
}
