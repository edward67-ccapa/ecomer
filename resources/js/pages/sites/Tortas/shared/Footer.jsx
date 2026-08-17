export default function Footer({ site, dominio, siteSlug }) {
    return (
        <footer
            className="border-t py-8 text-center text-sm"
            style={{
                color: 'var(--color-secundario)',
                borderColor:
                    'color-mix(in srgb, var(--color-secundario) 15%, transparent)',
            }}
        >
            <span className="font-semibold">{site.nombre}</span>
            <span className="mx-2 opacity-50">·</span>
            <span className="opacity-60">
                {dominio}/{siteSlug} — Creado con Ecomer
            </span>
        </footer>
    );
}
