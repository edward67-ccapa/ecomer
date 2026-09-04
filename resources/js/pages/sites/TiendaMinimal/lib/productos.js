import { apiFetch } from './api';

export async function getProductosTienda(tiendaId) {
    return apiFetch(`/tiendas/${tiendaId}/productos`);
}

export async function getProductoDetalle(productoSlug) {
    return apiFetch(`/productos/${productoSlug}`);
}
