import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import show from './show'
/**
* @see \App\Http\Controllers\SitePageController::home
* @see app/Http/Controllers/SitePageController.php:18
* @route '/{dominio}/{siteSlug}'
*/
export const home = (args: { dominio: string | number, siteSlug: string | number } | [dominio: string | number, siteSlug: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(args, options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '/{dominio}/{siteSlug}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SitePageController::home
* @see app/Http/Controllers/SitePageController.php:18
* @route '/{dominio}/{siteSlug}'
*/
home.url = (args: { dominio: string | number, siteSlug: string | number } | [dominio: string | number, siteSlug: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            dominio: args[0],
            siteSlug: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        dominio: args.dominio,
        siteSlug: args.siteSlug,
    }

    return home.definition.url
            .replace('{dominio}', parsedArgs.dominio.toString())
            .replace('{siteSlug}', parsedArgs.siteSlug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SitePageController::home
* @see app/Http/Controllers/SitePageController.php:18
* @route '/{dominio}/{siteSlug}'
*/
home.get = (args: { dominio: string | number, siteSlug: string | number } | [dominio: string | number, siteSlug: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::home
* @see app/Http/Controllers/SitePageController.php:18
* @route '/{dominio}/{siteSlug}'
*/
home.head = (args: { dominio: string | number, siteSlug: string | number } | [dominio: string | number, siteSlug: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SitePageController::home
* @see app/Http/Controllers/SitePageController.php:18
* @route '/{dominio}/{siteSlug}'
*/
const homeForm = (args: { dominio: string | number, siteSlug: string | number } | [dominio: string | number, siteSlug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: home.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::home
* @see app/Http/Controllers/SitePageController.php:18
* @route '/{dominio}/{siteSlug}'
*/
homeForm.get = (args: { dominio: string | number, siteSlug: string | number } | [dominio: string | number, siteSlug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: home.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::home
* @see app/Http/Controllers/SitePageController.php:18
* @route '/{dominio}/{siteSlug}'
*/
homeForm.head = (args: { dominio: string | number, siteSlug: string | number } | [dominio: string | number, siteSlug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: home.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

home.form = homeForm

const sitios = {
    show: Object.assign(show, show),
    home: Object.assign(home, home),
}

export default sitios