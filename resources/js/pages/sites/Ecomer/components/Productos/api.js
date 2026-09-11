import { apiFetch, fetchSectionData } from '../../shared/apiBase';

export async function fetchProductosData(dominio, siteSlug) {
    return fetchSectionData(dominio, siteSlug, 'productos');
}

export async function fetchProductosList(dominio, siteSlug) {
    if (dominio === 'plantillas') {
        return apiFetch(`/plantillas/${siteSlug}/productos`);
    }
    return apiFetch(`/sites/${dominio}/${siteSlug}/productos`);
}
