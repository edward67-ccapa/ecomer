export default function Footer({ site, dominio, siteSlug }) {
    return (
        <footer
            className="mt-auto border-t py-10"
            style={{
                backgroundColor: 'var(--color-secundario)',
                color: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
        >
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 text-center md:flex-row md:text-left">
                <div>
                    <h3
                        className="text-lg font-bold"
                        style={{ fontFamily: 'var(--tipografia-titulos)' }}
                    >
                        {site.nombre}
                    </h3>
                    <p className="mt-1 text-xs text-gray-400">
                        {dominio}/{siteSlug} — Powered by Plantilla Corporativa
                    </p>
                </div>
                <div className="text-xs text-gray-400">
                    &copy; {new Date().getFullYear()} {site.nombre}. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}
