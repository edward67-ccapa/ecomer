import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SitePageController::full
* @see app/Http/Controllers/SitePageController.php:27
* @route '/{dominio}/{siteSlug}/{seccion}'
*/
export const full = (args: { dominio: string | number, siteSlug: string | number, seccion: string | number } | [dominio: string | number, siteSlug: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: full.url(args, options),
    method: 'get',
})

full.definition = {
    methods: ["get","head"],
    url: '/{dominio}/{siteSlug}/{seccion}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SitePageController::full
* @see app/Http/Controllers/SitePageController.php:27
* @route '/{dominio}/{siteSlug}/{seccion}'
*/
full.url = (args: { dominio: string | number, siteSlug: string | number, seccion: string | number } | [dominio: string | number, siteSlug: string | number, seccion: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            dominio: args[0],
            siteSlug: args[1],
            seccion: args[2],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        dominio: args.dominio,
        siteSlug: args.siteSlug,
        seccion: args.seccion,
    }

    return full.definition.url
            .replace('{dominio}', parsedArgs.dominio.toString())
            .replace('{siteSlug}', parsedArgs.siteSlug.toString())
            .replace('{seccion}', parsedArgs.seccion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SitePageController::full
* @see app/Http/Controllers/SitePageController.php:27
* @route '/{dominio}/{siteSlug}/{seccion}'
*/
full.get = (args: { dominio: string | number, siteSlug: string | number, seccion: string | number } | [dominio: string | number, siteSlug: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: full.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::full
* @see app/Http/Controllers/SitePageController.php:27
* @route '/{dominio}/{siteSlug}/{seccion}'
*/
full.head = (args: { dominio: string | number, siteSlug: string | number, seccion: string | number } | [dominio: string | number, siteSlug: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: full.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SitePageController::full
* @see app/Http/Controllers/SitePageController.php:27
* @route '/{dominio}/{siteSlug}/{seccion}'
*/
const fullForm = (args: { dominio: string | number, siteSlug: string | number, seccion: string | number } | [dominio: string | number, siteSlug: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: full.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::full
* @see app/Http/Controllers/SitePageController.php:27
* @route '/{dominio}/{siteSlug}/{seccion}'
*/
fullForm.get = (args: { dominio: string | number, siteSlug: string | number, seccion: string | number } | [dominio: string | number, siteSlug: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: full.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::full
* @see app/Http/Controllers/SitePageController.php:27
* @route '/{dominio}/{siteSlug}/{seccion}'
*/
fullForm.head = (args: { dominio: string | number, siteSlug: string | number, seccion: string | number } | [dominio: string | number, siteSlug: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: full.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

full.form = fullForm

const show = {
    full: Object.assign(full, full),
}

export default show