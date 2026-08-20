import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/stores/useCartStore';
import DynamicIcon from '@/components/DynamicIcon';

export default function CartOffcanvas() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart, getTotal, getItemCount } =
        useCartStore();
    const [mensajeCheckout, setMensajeCheckout] = useState(false);

    const count = getItemCount();
    const total = getTotal();

    const handleComprar = () => {
        setMensajeCheckout(true);
        setTimeout(() => setMensajeCheckout(false), 4000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* BACKDROP OVERLAY */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity"
                    />

                    {/* DRAWER PANEL (PURE WHITE) */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
                    >
                        {/* HEADER */}
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-white">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primario)] text-white shadow-sm">
                                    <DynamicIcon name="FaCartShopping" className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h2
                                        className="text-lg font-bold text-gray-900"
                                        style={{ fontFamily: 'var(--tipografia-titulos)' }}
                                    >
                                        Tu Carrito
                                    </h2>
                                    <p
                                        className="text-xs text-gray-500"
                                        style={{ fontFamily: 'var(--tipografia-texto)' }}
                                    >
                                        {count === 1 ? '1 producto agregado' : `${count} productos agregados`}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={closeCart}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
                            >
                                <DynamicIcon name="FaXmark" className="h-5 w-5" />
                            </button>
                        </div>

                        {/* BODY / ITEMS LIST */}
                        <div className="flex-1 overflow-y-auto p-6 bg-white">
                            {items.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center text-center">
                                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                                        <DynamicIcon name="FaCartShopping" className="h-10 w-10" />
                                    </div>
                                    <h3
                                        className="text-base font-bold text-gray-800 mb-1"
                                        style={{ fontFamily: 'var(--tipografia-titulos)' }}
                                    >
                                        El carrito está vacío
                                    </h3>
                                    <p
                                        className="text-xs text-gray-500 max-w-xs leading-relaxed"
                                        style={{ fontFamily: 'var(--tipografia-texto)' }}
                                    >
                                        Explora nuestras creaciones destacadas y agrega tus productos favoritos aquí.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-3 shadow-xs"
                                            style={{ borderRadius: 'var(--radio-bordes)' }}
                                        >
                                            {/* Imagen del producto */}
                                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                                {item.imagen ? (
                                                    <img
                                                        src={item.imagen}
                                                        alt={item.nombre}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-xl">
                                                        🎂
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h4
                                                    className="truncate text-sm font-bold text-gray-900"
                                                    style={{ fontFamily: 'var(--tipografia-titulos)' }}
                                                >
                                                    {item.nombre}
                                                </h4>
                                                <p
                                                    className="text-xs font-semibold text-[var(--color-primario)] mt-0.5"
                                                    style={{ fontFamily: 'var(--tipografia-titulos)' }}
                                                >
                                                    S/ {item.precio.toFixed(2)}
                                                </p>

                                                {/* Cantidad controls */}
                                                <div className="mt-2 flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-xs font-bold text-gray-800 min-w-4 text-center">
                                                        {item.cantidad}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Subtotal & Delete */}
                                            <div className="flex flex-col items-end gap-2">
                                                <span className="text-sm font-extrabold text-gray-900">
                                                    S/ {(item.precio * item.cantidad).toFixed(2)}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-gray-400 hover:text-red-500 transition cursor-pointer"
                                                    title="Eliminar producto"
                                                >
                                                    <DynamicIcon name="FaTrash" className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* FOOTER */}
                        {items.length > 0 && (
                            <div className="border-t border-gray-100 p-6 bg-white">
                                {mensajeCheckout && (
                                    <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-xs font-medium text-emerald-800 border border-emerald-200">
                                        🛒 ¡Gracias por tu interés! El proceso de compra estará disponible muy pronto.
                                    </div>
                                )}

                                <div className="mb-4 flex items-center justify-between text-base">
                                    <span className="font-semibold text-gray-600">Total:</span>
                                    <span
                                        className="text-xl font-extrabold text-gray-900"
                                        style={{ color: 'var(--color-primario)', fontFamily: 'var(--tipografia-titulos)' }}
                                    >
                                        S/ {total.toFixed(2)}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={clearCart}
                                        className="w-full py-3 text-xs font-semibold text-gray-500 hover:text-red-600 transition border border-gray-200 rounded-xl cursor-pointer"
                                        style={{ borderRadius: 'var(--radio-bordes)' }}
                                    >
                                        Vaciar carrito
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleComprar}
                                        className="w-full py-3 text-sm font-bold text-white shadow-md hover:shadow-lg hover:brightness-105 active:scale-95 transition-all duration-200 cursor-pointer"
                                        style={{
                                            backgroundColor: 'var(--color-primario)',
                                            borderRadius: 'var(--radio-bordes)',
                                            fontFamily: 'var(--tipografia-titulos)',
                                        }}
                                    >
                                        Comprar 🛍️
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
