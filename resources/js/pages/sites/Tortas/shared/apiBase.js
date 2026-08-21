import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

const cacheMap = new Map();

export async function apiFetch(endpoint, config = {}) {
    const cacheKey = `${endpoint}_${JSON.stringify(config)}`;

    if (cacheMap.has(cacheKey)) {
        return cacheMap.get(cacheKey);
    }

    const requestPromise = api
        .get(endpoint, config)
        .then((res) => res.data)
        .catch((err) => {
            cacheMap.delete(cacheKey);
            throw err;
        });

    cacheMap.set(cacheKey, requestPromise);
    return requestPromise;
}

export function clearApiCache() {
    cacheMap.clear();
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
