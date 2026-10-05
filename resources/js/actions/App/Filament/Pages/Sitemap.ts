import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Filament\Pages\Sitemap::__invoke
* @see app/Filament/Pages/Sitemap.php:7
* @route '/admin/sitemap'
*/
const Sitemap = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Sitemap.url(options),
    method: 'get',
})

Sitemap.definition = {
    methods: ["get","head"],
    url: '/admin/sitemap',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Pages\Sitemap::__invoke
* @see app/Filament/Pages/Sitemap.php:7
* @route '/admin/sitemap'
*/
Sitemap.url = (options?: RouteQueryOptions) => {
    return Sitemap.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Pages\Sitemap::__invoke
* @see app/Filament/Pages/Sitemap.php:7
* @route '/admin/sitemap'
*/
Sitemap.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Sitemap.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Pages\Sitemap::__invoke
* @see app/Filament/Pages/Sitemap.php:7
* @route '/admin/sitemap'
*/
Sitemap.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Sitemap.url(options),
    method: 'head',
})

/**
* @see \App\Filament\Pages\Sitemap::__invoke
* @see app/Filament/Pages/Sitemap.php:7
* @route '/admin/sitemap'
*/
const SitemapForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Sitemap.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Pages\Sitemap::__invoke
* @see app/Filament/Pages/Sitemap.php:7
* @route '/admin/sitemap'
*/
SitemapForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Sitemap.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Pages\Sitemap::__invoke
* @see app/Filament/Pages/Sitemap.php:7
* @route '/admin/sitemap'
*/
SitemapForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Sitemap.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Sitemap.form = SitemapForm

export default Sitemap