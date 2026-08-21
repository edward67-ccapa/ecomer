import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/stores/useCartStore';
import DynamicIcon from '@/components/DynamicIcon';
import { fetchSectionData } from '@/pages/sites/Tortas/shared/apiBase';

export default function CartOffcanvas() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart, getTotal, getItemCount } =
        useCartStore();

    // Campos de formulario para el pedido
    const [nombre, setNombre] = useState('');
    const [numero, setNumero] = useState('');
    const [fecha, setFecha] = useState('');
    const [idea, setIdea] = useState('');

    const [whatsappUrl, setWhatsappUrl] = useState('https://wa.me/');

    const count = getItemCount();
    const total = getTotal();

    // Obtener número de WhatsApp dinámico desde la API
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const pathParts = window.location.pathname.split('/').filter(Boolean);
            if (pathParts.length >= 2) {
                const dom = pathParts[0];
                const slug = pathParts[1];
                Promise.allSettled([
                    fetchSectionData(dom, slug, 'nav'),
                    fetchSectionData(dom, slug, 'contacto'),
                ]).then(([navRes, contactosRes]) => {
                    const nav = navRes.status === 'fulfilled' ? (navRes.value?.seccionActiva || navRes.value) : null;
                    const contactos = contactosRes.status === 'fulfilled' ? (contactosRes.value?.seccionActiva || contactosRes.value) : null;

                    const accionesNav = nav?.contenido?.find((c) => c.label === 'accion_nav')?.valor || [];
                    const waNav = accionesNav.find((a) => a.icon?.toLowerCase() === 'fawhatsapp')?.texto;
                    const itemContacto = contactos?.contenido?.find(
                        (c) => c.label?.toLowerCase() === 'whatsap' || c.label?.toLowerCase() === 'whatsapp'
                    );

                    const rawVal = waNav || itemContacto?.enlace || (Array.isArray(itemContacto?.valor) ? itemContacto.valor[0]?.texto : null);

                    if (rawVal) {
                        if (rawVal.startsWith('http')) {
                            setWhatsappUrl(rawVal);
                        } else {
                            const cleanNum = rawVal.replace(/\D/g, '');
                            if (cleanNum) {
                                const finalNum = cleanNum.length === 9 ? `51${cleanNum}` : cleanNum;
                                setWhatsappUrl(`https://wa.me/${finalNum}`);
                            }
                        }
                    }
                });
            }
        }
    }, []);

    const handleEnviarWhatsApp = (e) => {
        e.preventDefault();

        let mensaje = `¡Hola!\n*Quisiera realizar la compra de los siguientes productos:*\n\n`;

        items.forEach((item) => {
            mensaje += `• ${item.cantidad}x *${item.nombre}* - S/ ${(item.precio * item.cantidad).toFixed(2)}\n`;
        });

        mensaje += `\n*Total a pagar:* S/ ${total.toFixed(2)}\n\n`;

        if (nombre) mensaje += `*Nombre:* ${nombre}\n`;
        if (numero) mensaje += `*Teléfono / WhatsApp:* ${numero}\n`;
        if (fecha) mensaje += `*Fecha del evento:* ${fecha}\n`;
        if (idea) mensaje += `*Idea / Detalles:* ${idea}\n`;

        let urlBase = whatsappUrl || 'https://wa.me/';
        if (!urlBase.includes('wa.me') && !urlBase.includes('whatsapp.com')) {
            urlBase = 'https://wa.me/';
        }

        const separator = urlBase.includes('?') ? '&' : '?';
        const finalUrl = `${urlBase}${separator}text=${encodeURIComponent(mensaje)}`;

        window.open(finalUrl, '_blank', 'noopener,noreferrer');
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
                        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-xs transition-opacity"
                    />

                    {/* DRAWER PANEL */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-md flex-col bg-white shadow-2xl"
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

                        {/* BODY / ITEMS LIST + FORMULARIO */}
                        <div className="flex-1 overflow-y-auto p-6 bg-white space-y-6">
                            {items.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center text-center py-12">
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
                                <>
                                    {/* LISTA DE PRODUCTOS */}
                                    <div className="space-y-4">
                                        {items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-3 shadow-xs"
                                                style={{ borderRadius: 'var(--radio-bordes)' }}
                                            >
                                                {/* Imagen */}
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

                                    {/* FORMULARIO DATOS DE COMPRA */}
                                    <form id="cart-form" onSubmit={handleEnviarWhatsApp} className="space-y-3 pt-4 border-t border-gray-100">
                                        <h4
                                            className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-2"
                                            style={{ fontFamily: 'var(--tipografia-titulos)' }}
                                        >
                                            Datos para tu pedido
                                        </h4>

                                        <div>
                                            <input
                                                type="text"
                                                value={nombre}
                                                onChange={(e) => setNombre(e.target.value)}
                                                placeholder="Nombre completo *"
                                                required
                                                className="w-full px-3.5 py-2.5 border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none text-xs text-gray-800 placeholder-gray-400 transition"
                                                style={{ borderRadius: 'var(--radio-bordes)' }}
                                            />
                                        </div>

                                        <div>
                                            <input
                                                type="tel"
                                                value={numero}
                                                onChange={(e) => setNumero(e.target.value)}
                                                placeholder="Número de teléfono / WhatsApp *"
                                                required
                                                className="w-full px-3.5 py-2.5 border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none text-xs text-gray-800 placeholder-gray-400 transition"
                                                style={{ borderRadius: 'var(--radio-bordes)' }}
                                            />
                                        </div>

                                        <div>
                                            <input
                                                type="date"
                                                value={fecha}
                                                onChange={(e) => setFecha(e.target.value)}
                                                placeholder="Fecha del evento"
                                                className="w-full px-3.5 py-2.5 border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none text-xs text-gray-800 placeholder-gray-400 transition"
                                                style={{ borderRadius: 'var(--radio-bordes)' }}
                                            />
                                        </div>

                                        <div>
                                            <textarea
                                                rows={2}
                                                value={idea}
                                                onChange={(e) => setIdea(e.target.value)}
                                                placeholder="Cuéntanos tu idea / detalles de la torta..."
                                                className="w-full px-3.5 py-2.5 border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none text-xs text-gray-800 placeholder-gray-400 transition resize-none"
                                                style={{ borderRadius: 'var(--radio-bordes)' }}
                                            />
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>

                        {/* FOOTER */}
                        {items.length > 0 && (
                            <div className="border-t border-gray-100 p-6 bg-white">
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
                                        type="submit"
                                        form="cart-form"
                                        className="w-full py-3 text-sm font-bold text-white shadow-md hover:shadow-lg hover:brightness-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                                        style={{
                                            backgroundColor: '#25D366',
                                            borderRadius: 'var(--radio-bordes)',
                                            fontFamily: 'var(--tipografia-titulos)',
                                        }}
                                    >
                                        <span>Comprar</span>
                                        <DynamicIcon name="FaWhatsapp" className="h-4 w-4 text-white" />
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
