import { apiFetch } from './api';

export async function getSeccionNosotros(dominio, siteSlug) {
    return apiFetch(`/sites/${dominio}/${siteSlug}/nosotros`);
}
