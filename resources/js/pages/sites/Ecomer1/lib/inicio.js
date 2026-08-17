import { apiFetch } from './api';

export async function getSeccionInicio(dominio, siteSlug) {
    return apiFetch(`/sites/${dominio}/${siteSlug}/inicio`);
}
