const BASE_URL = '/api/v1';

export async function apiFetch(endpoint, options = {}) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Error HTTP: ${res.status}`);
    }

    return res.json();
}

export async function fetchSiteSection(dominio, siteSlug, seccionSlug) {
    return apiFetch(`/sites/${dominio}/${siteSlug}/${seccionSlug}`);
}

export async function fetchSiteHome(dominio, siteSlug) {
    return apiFetch(`/sites/${dominio}/${siteSlug}`);
}
