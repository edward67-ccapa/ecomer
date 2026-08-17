import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export async function apiFetch(endpoint, config = {}) {
    const response = await api.get(endpoint, config);
    return response.data;
}

export async function fetchSectionData(dominio, siteSlug, seccionSlug) {
    if (dominio === 'plantillas') {
        const endpoint = seccionSlug
            ? `/plantillas/${siteSlug}/preview/${seccionSlug}`
            : `/plantillas/${siteSlug}/preview`;
        return apiFetch(endpoint);
    }

    return apiFetch(`/sites/${dominio}/${siteSlug}/${seccionSlug}`);
}
