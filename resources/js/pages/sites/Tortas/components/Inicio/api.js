import { apiFetch, fetchSectionData } from '../../shared/apiBase';

export async function fetchInicioData(dominio, siteSlug) {
    return fetchSectionData(dominio, siteSlug, 'inicio');
}

export async function fetchServiciosData(dominio, siteSlug) {
    return fetchSectionData(dominio, siteSlug, 'servicios');
}

export async function fetchSomosData(dominio, siteSlug) {
    return fetchSectionData(dominio, siteSlug, 'somos');
}

export async function fetchTortasDestacadasData(dominio, siteSlug) {
    return fetchSectionData(dominio, siteSlug, 'tortas_destacadas');
}

export async function fetchProductosDestacados(dominio, siteSlug) {
    if (dominio === 'plantillas') {
        return apiFetch(`/plantillas/${siteSlug}/productos/destacados`);
    }
    return apiFetch(`/sites/${dominio}/${siteSlug}/productos/destacados`);
}

export async function fetchPorQueElegirnosData(dominio, siteSlug) {
    return fetchSectionData(dominio, siteSlug, 'elegirnos');
}

export async function fetchContactoData(dominio, siteSlug) {
    return fetchSectionData(dominio, siteSlug, 'contacto');
}