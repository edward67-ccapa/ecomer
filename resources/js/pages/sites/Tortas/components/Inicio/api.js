import { fetchSectionData } from '../../shared/apiBase';

export async function fetchInicioData(dominio, siteSlug) {
    return fetchSectionData(dominio, siteSlug, 'inicio');
}

export async function fetchServiciosData(dominio, siteSlug) {
    return fetchSectionData(dominio, siteSlug, 'servicios');
}

export async function fetchSomosData(dominio, siteSlug) {
    return fetchSectionData(dominio, siteSlug, 'somos');
}