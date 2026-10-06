import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
    items: [],
    isOpen: false,

    openCart: () => set({ isOpen: true }),
    closeCart: () => set({ isOpen: false }),
    toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

    addItem: (product, qty) => {
        if (!product) return;

        // Determinar la cantidad a añadir: prioridad a qty (2do argumento),
        // luego a product.cantidad (propiedad del objeto), por defecto 1.
        const cantidadToAdd = (qty !== undefined && qty !== null && !isNaN(Number(qty)) && Number(qty) > 0)
            ? Number(qty)
            : (product.cantidad !== undefined && product.cantidad !== null && !isNaN(Number(product.cantidad)) && Number(product.cantidad) > 0
                ? Number(product.cantidad)
                : 1);

        const currentItems = get().items;
        const productId = product.id || product.nombre;
        const existingIndex = currentItems.findIndex((item) => (item.id || item.nombre) === productId);

        let updatedItems;
        if (existingIndex > -1) {
            updatedItems = [...currentItems];
            updatedItems[existingIndex] = {
                ...updatedItems[existingIndex],
                cantidad: updatedItems[existingIndex].cantidad + cantidadToAdd,
            };
        } else {
            const precioNum = product.precio !== undefined && product.precio !== null && product.precio !== ''
                ? Number(product.precio)
                : parseFloat(product.precio_soles || product.precio_dolares || 0);

            updatedItems = [
                ...currentItems,
                {
                    ...product,
                    id: productId,
                    nombre: product.nombre,
                    precio: precioNum,
                    imagen: product.imagen || null,
                    cantidad: cantidadToAdd,
                },
            ];
        }

        set({ items: updatedItems, isOpen: true });
    },

    removeItem: (productId) => {
        set({
            items: get().items.filter((item) => (item.id || item.nombre) !== productId),
        });
    },

    updateQuantity: (productId, delta) => {
        const currentItems = get().items;
        const updatedItems = currentItems
            .map((item) => {
                if ((item.id || item.nombre) === productId) {
                    const newQty = item.cantidad + delta;
                    return newQty > 0 ? { ...item, cantidad: newQty } : null;
                }
                return item;
            })
            .filter(Boolean);

        set({ items: updatedItems });
    },

    clearCart: () => set({ items: [] }),

    getItemCount: () => {
        return get().items.reduce((total, item) => total + item.cantidad, 0);
    },

    getTotal: () => {
        return get().items.reduce((total, item) => total + item.precio * item.cantidad, 0);
    },
}));
