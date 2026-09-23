export default function BanerPieSection({ seccionData }) {
    if (!seccionData) return null;

    const itemImagen = seccionData.contenido?.find(
        (c) => c.label?.toLowerCase() === 'imagen' || c.tipo === 'imagen' || c.label?.toLowerCase() === 'img'
    );

    const val = itemImagen?.valor;
    const imagenUrl = Array.isArray(val) ? val[0] : (typeof val === 'string' ? val : null);
    const enlace = itemImagen?.enlace || seccionData.enlace || null;

    if (!imagenUrl) return null;

    const content = (
        <div className="w-full max-w-full overflow-hidden">
            <img
                src={imagenUrl}
                alt={seccionData.nombre || 'Banner Pie'}
                className="w-full h-auto max-w-full object-cover block"
                loading="lazy"
                decoding="async"
            />
        </div>
    );

    return (
        <section id="baner-pie" className="w-full max-w-full overflow-hidden bg-white">
            {enlace ? (
                <a
                    href={enlace}
                    target={enlace.startsWith('http') ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className="block w-full max-w-full group"
                >
                    {content}
                </a>
            ) : (
                content
            )}
        </section>
    );
}
