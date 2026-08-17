import DynamicIcon from '@/components/DynamicIcon';

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

    if (item.tipo === 'icono' || item.tipo === 'icon') {
        return (
            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm" style={{ borderRadius: 'var(--radio-bordes)' }}>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg text-white" style={{ backgroundColor: 'var(--color-primario)' }}>
                    <DynamicIcon name={item.valor} className="h-5 w-5" />
                </div>
                <span className="font-semibold text-gray-800">{item.valor}</span>
            </div>
        );
    }

    if (item.tipo === 'grupo' && Array.isArray(item.valor)) {
        return (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {item.valor.map((subItem, index) => {
                    const nombre = subItem.nombre || subItem.titulo || subItem.label || `Elemento ${index + 1}`;
                    const cargo = subItem.cargo || subItem.subtitulo || subItem.descripcion || subItem.numero || '';
                    const foto = subItem.foto || subItem.imagen || subItem.portada || '';
                    const icono = subItem.icono || subItem.icon || '';
                    const enlace = subItem.enlace || subItem.url || subItem.link || '';

                    const CardTag = enlace ? 'a' : 'div';
                    const linkProps = enlace ? { href: enlace, target: '_blank', rel: 'noreferrer' } : {};

                    return (
                        <CardTag
                            key={index}
                            {...linkProps}
                            className={`group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                                enlace ? 'cursor-pointer hover:border-gray-300' : ''
                            }`}
                            style={{ borderRadius: 'var(--radio-bordes)' }}
                        >
                            {icono && (
                                <div
                                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-md transition-transform duration-300 group-hover:scale-110"
                                    style={{ backgroundColor: 'var(--color-primario)' }}
                                >
                                    <DynamicIcon name={icono} className="h-6 w-6" />
                                </div>
                            )}

                            {foto && !icono && (
                                <div className="mb-4 overflow-hidden rounded-xl bg-gray-100">
                                    <img
                                        src={foto}
                                        alt={nombre}
                                        className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                            )}

                            <h3
                                className="flex items-center justify-between text-xl font-bold text-gray-900"
                                style={{ fontFamily: 'var(--tipografia-titulos)' }}
                            >
                                <span>{nombre}</span>
                                {enlace && (
                                    <span
                                        className="text-sm opacity-0 transition-opacity group-hover:opacity-100"
                                        style={{ color: 'var(--color-primario)' }}
                                    >
                                        ↗
                                    </span>
                                )}
                            </h3>

                            {cargo && (
                                <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--color-primario)' }}>
                                    {cargo}
                                </p>
                            )}

                            <div className="mt-3 space-y-1">
                                {Object.entries(subItem).map(([key, val]) => {
                                    if (
                                        [
                                            'nombre',
                                            'cargo',
                                            'foto',
                                            'titulo',
                                            'imagen',
                                            'subtitulo',
                                            'descripcion',
                                            'numero',
                                            'icono',
                                            'icon',
                                            'enlace',
                                            'url',
                                            'link',
                                        ].includes(key) ||
                                        !val
                                    ) {
                                        return null;
                                    }
                                    return (
                                        <p key={key} className="text-xs text-gray-500">
                                            <span className="font-semibold text-gray-700">{etiqueta(key)}:</span> {val}
                                        </p>
                                    );
                                })}
                            </div>
                        </CardTag>
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
