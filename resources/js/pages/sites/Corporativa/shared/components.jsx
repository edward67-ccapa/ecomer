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

    // Manejo especial de tipo 'grupo' (Ejemplo: miembros_equipo)
    if (item.tipo === 'grupo' && Array.isArray(item.valor)) {
        return (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {item.valor.map((subItem, index) => {
                    const nombre = subItem.nombre || subItem.titulo || subItem.label || `Elemento ${index + 1}`;
                    const cargo = subItem.cargo || subItem.subtitulo || subItem.descripcion || '';
                    const foto = subItem.foto || subItem.imagen || subItem.portada || '';

                    return (
                        <div
                            key={index}
                            className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            style={{ borderRadius: 'var(--radio-bordes)' }}
                        >
                            {foto && (
                                <div className="mb-4 overflow-hidden rounded-xl bg-gray-100">
                                    <img
                                        src={foto}
                                        alt={nombre}
                                        className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                            )}
                            <h3
                                className="text-xl font-bold text-gray-900"
                                style={{ fontFamily: 'var(--tipografia-titulos)' }}
                            >
                                {nombre}
                            </h3>
                            {cargo && (
                                <p className="mt-1 text-sm font-medium" style={{ color: 'var(--color-primario)' }}>
                                    {cargo}
                                </p>
                            )}

                            <div className="mt-3 space-y-1">
                                {Object.entries(subItem).map(([key, val]) => {
                                    if (['nombre', 'cargo', 'foto', 'titulo', 'imagen', 'subtitulo', 'descripcion'].includes(key) || !val) {
                                        return null;
                                    }
                                    return (
                                        <p key={key} className="text-xs text-gray-500">
                                            <span className="font-semibold text-gray-700">{etiqueta(key)}:</span> {val}
                                        </p>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
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
                className="inline-flex w-fit items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg"
                style={{ backgroundColor: 'var(--color-primario)', borderRadius: 'var(--radio-bordes)' }}
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
            <div className="overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.01]" style={{ borderRadius: 'var(--radio-bordes)' }}>
                <img
                    src={item.valor}
                    alt={item.label}
                    className="w-full object-cover"
                />
            </div>
        );
    }

    if (item.tipo === 'galeria' && Array.isArray(item.valor)) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {item.valor.map((src, i) => (
                    <div key={src + i} className="overflow-hidden shadow-md" style={{ borderRadius: 'var(--radio-bordes)' }}>
                        <img
                            src={src}
                            alt={`${item.label} ${i + 1}`}
                            className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                    </div>
                ))}
            </div>
        );
    }

    if (item.tipo === 'color') {
        return (
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <span
                    className="h-8 w-8 rounded-full shadow-inner ring-2 ring-white"
                    style={{ backgroundColor: item.valor }}
                />
                <span className="font-semibold text-gray-800">{item.valor}</span>
            </div>
        );
    }

    if (item.tipo === 'enlace') {
        return (
            <a
                href={item.valor}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg"
                style={{ backgroundColor: 'var(--color-primario)', borderRadius: 'var(--radio-bordes)' }}
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
                <p className="text-xl font-medium leading-relaxed text-gray-900">{item.valor}</p>
            ) : (
                <p className="text-base leading-relaxed text-gray-600">{item.valor}</p>
            )}
        </div>
    );
}

function EtiquetaBloque({ item }) {
    return (
        <div
            className="mb-2 text-xs font-black tracking-widest uppercase"
            style={{ color: 'var(--color-primario)' }}
        >
            {etiqueta(item.label)}
        </div>
    );
}

export { BloqueContenido, EtiquetaBloque };
