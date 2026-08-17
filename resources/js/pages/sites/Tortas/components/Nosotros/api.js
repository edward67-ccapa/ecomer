import { fetchSectionData } from '../../shared/apiBase';

export async function fetchNosotrosData(dominio, siteSlug) {
    return fetchSectionData(dominio, siteSlug, 'nosotros');
}
