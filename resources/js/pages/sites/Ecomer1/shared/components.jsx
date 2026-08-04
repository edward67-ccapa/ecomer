function etiqueta(label) {
    return label.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function BloqueContenido({ item, styles }) {
    if (
        item.valor == null ||
        item.valor === '' ||
        (Array.isArray(item.valor) && item.valor.length === 0)
    ) {
        return null;
    }

    if (
        item.enlace &&
        item.tipo !== 'imagen' &&
        item.tipo !== 'galeria' &&
        item.tipo !== 'color'
    ) {
        return (
            <a
                href={item.enlace}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: 'var(--color-primario)' }}
            >
                {item.valor}
                <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                </svg>
            </a>
        );
    }

    if (item.tipo === 'imagen') {
        return (
            <div>
                <img
                    src={item.valor}
                    alt={item.label}
                    className="w-full rounded-xl object-cover"
                    style={{ borderRadius: 'var(--radio-bordes)' }}
                />
            </div>
        );
    }

    if (item.tipo === 'galeria') {
        return (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {item.valor.map((src, i) => (
                    <img
                        key={src + i}
                        src={src}
                        alt={`${item.label} ${i + 1}`}
                        className="aspect-square w-full rounded-xl object-cover"
                        style={{ borderRadius: 'var(--radio-bordes)' }}
                    />
                ))}
            </div>
        );
    }

    if (item.tipo === 'color') {
        return (
            <div className="flex items-center gap-3">
                <span
                    className="h-9 w-9 rounded-full ring-1 ring-black/10"
                    style={{ backgroundColor: item.valor }}
                />
                <span className="font-medium text-gray-700">{item.valor}</span>
            </div>
        );
    }

    if (item.tipo === 'enlace') {
        return (
            <a
                href={item.valor}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: 'var(--color-primario)' }}
            >
                {etiqueta(item.label)}
                <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                </svg>
            </a>
        );
    }

    return (
        <div>
            {item.tipo === 'texto' ? (
                <p className="text-lg leading-8 text-gray-800">{item.valor}</p>
            ) : (
                <p className="text-lg leading-8 text-gray-600">{item.valor}</p>
            )}
        </div>
    );
}

function EtiquetaBloque({ item }) {
    return (
        <div
            className="mb-2 text-xs font-bold tracking-widest uppercase"
            style={{ color: 'var(--color-primario)' }}
        >
            {etiqueta(item.label)}
        </div>
    );
}

export { BloqueContenido, EtiquetaBloque };
