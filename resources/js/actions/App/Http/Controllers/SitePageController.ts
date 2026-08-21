import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:27
* @route '/{dominio}/{siteSlug}/{seccion}'
*/
export const show = (args: { dominio: string | number, siteSlug: string | number, seccion: string | number } | [dominio: string | number, siteSlug: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/{dominio}/{siteSlug}/{seccion}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:27
* @route '/{dominio}/{siteSlug}/{seccion}'
*/
show.url = (args: { dominio: string | number, siteSlug: string | number, seccion: string | number } | [dominio: string | number, siteSlug: string | number, seccion: string | number ], options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{dominio}', parsedArgs.dominio.toString())
            .replace('{siteSlug}', parsedArgs.siteSlug.toString())
            .replace('{seccion}', parsedArgs.seccion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:27
* @route '/{dominio}/{siteSlug}/{seccion}'
*/
show.get = (args: { dominio: string | number, siteSlug: string | number, seccion: string | number } | [dominio: string | number, siteSlug: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:27
* @route '/{dominio}/{siteSlug}/{seccion}'
*/
show.head = (args: { dominio: string | number, siteSlug: string | number, seccion: string | number } | [dominio: string | number, siteSlug: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:27
* @route '/{dominio}/{siteSlug}/{seccion}'
*/
const showForm = (args: { dominio: string | number, siteSlug: string | number, seccion: string | number } | [dominio: string | number, siteSlug: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:27
* @route '/{dominio}/{siteSlug}/{seccion}'
*/
showForm.get = (args: { dominio: string | number, siteSlug: string | number, seccion: string | number } | [dominio: string | number, siteSlug: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:27
* @route '/{dominio}/{siteSlug}/{seccion}'
*/
showForm.head = (args: { dominio: string | number, siteSlug: string | number, seccion: string | number } | [dominio: string | number, siteSlug: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\SitePageController::redirectToFirst
* @see app/Http/Controllers/SitePageController.php:18
* @route '/{dominio}/{siteSlug}'
*/
export const redirectToFirst = (args: { dominio: string | number, siteSlug: string | number } | [dominio: string | number, siteSlug: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirectToFirst.url(args, options),
    method: 'get',
})

redirectToFirst.definition = {
    methods: ["get","head"],
    url: '/{dominio}/{siteSlug}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SitePageController::redirectToFirst
* @see app/Http/Controllers/SitePageController.php:18
* @route '/{dominio}/{siteSlug}'
*/
redirectToFirst.url = (args: { dominio: string | number, siteSlug: string | number } | [dominio: string | number, siteSlug: string | number ], options?: RouteQueryOptions) => {
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

    return redirectToFirst.definition.url
            .replace('{dominio}', parsedArgs.dominio.toString())
            .replace('{siteSlug}', parsedArgs.siteSlug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SitePageController::redirectToFirst
* @see app/Http/Controllers/SitePageController.php:18
* @route '/{dominio}/{siteSlug}'
*/
redirectToFirst.get = (args: { dominio: string | number, siteSlug: string | number } | [dominio: string | number, siteSlug: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirectToFirst.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::redirectToFirst
* @see app/Http/Controllers/SitePageController.php:18
* @route '/{dominio}/{siteSlug}'
*/
redirectToFirst.head = (args: { dominio: string | number, siteSlug: string | number } | [dominio: string | number, siteSlug: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: redirectToFirst.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SitePageController::redirectToFirst
* @see app/Http/Controllers/SitePageController.php:18
* @route '/{dominio}/{siteSlug}'
*/
const redirectToFirstForm = (args: { dominio: string | number, siteSlug: string | number } | [dominio: string | number, siteSlug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirectToFirst.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::redirectToFirst
* @see app/Http/Controllers/SitePageController.php:18
* @route '/{dominio}/{siteSlug}'
*/
redirectToFirstForm.get = (args: { dominio: string | number, siteSlug: string | number } | [dominio: string | number, siteSlug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirectToFirst.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::redirectToFirst
* @see app/Http/Controllers/SitePageController.php:18
* @route '/{dominio}/{siteSlug}'
*/
redirectToFirstForm.head = (args: { dominio: string | number, siteSlug: string | number } | [dominio: string | number, siteSlug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirectToFirst.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

redirectToFirst.form = redirectToFirstForm

const SitePageController = { show, redirectToFirst }

export default SitePageController