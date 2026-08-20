import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
    items: [],
    isOpen: false,

    openCart: () => set({ isOpen: true }),
    closeCart: () => set({ isOpen: false }),
    toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

    addItem: (product, cantidad = 1) => {
        if (!product) return;
        const currentItems = get().items;
        const productId = product.id || product.nombre;
        const existingIndex = currentItems.findIndex((item) => (item.id || item.nombre) === productId);

        let updatedItems;
        if (existingIndex > -1) {
            updatedItems = [...currentItems];
            updatedItems[existingIndex].cantidad += cantidad;
        } else {
            const precioNum =
                parseFloat(product.precio_soles || product.precio_dolares || product.precio || 0);
            updatedItems = [
                ...currentItems,
                {
                    id: productId,
                    nombre: product.nombre,
                    precio: precioNum,
                    imagen: product.imagen || null,
                    cantidad: cantidad,
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
