import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:24
* @route '/{dominio}/{site}/{seccion}'
*/
export const show = (args: { dominio: string | number, site: string | number, seccion: string | number } | [dominio: string | number, site: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/{dominio}/{site}/{seccion}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:24
* @route '/{dominio}/{site}/{seccion}'
*/
show.url = (args: { dominio: string | number, site: string | number, seccion: string | number } | [dominio: string | number, site: string | number, seccion: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            dominio: args[0],
            site: args[1],
            seccion: args[2],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        dominio: args.dominio,
        site: args.site,
        seccion: args.seccion,
    }

    return show.definition.url
            .replace('{dominio}', parsedArgs.dominio.toString())
            .replace('{site}', parsedArgs.site.toString())
            .replace('{seccion}', parsedArgs.seccion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:24
* @route '/{dominio}/{site}/{seccion}'
*/
show.get = (args: { dominio: string | number, site: string | number, seccion: string | number } | [dominio: string | number, site: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:24
* @route '/{dominio}/{site}/{seccion}'
*/
show.head = (args: { dominio: string | number, site: string | number, seccion: string | number } | [dominio: string | number, site: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:24
* @route '/{dominio}/{site}/{seccion}'
*/
const showForm = (args: { dominio: string | number, site: string | number, seccion: string | number } | [dominio: string | number, site: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:24
* @route '/{dominio}/{site}/{seccion}'
*/
showForm.get = (args: { dominio: string | number, site: string | number, seccion: string | number } | [dominio: string | number, site: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:24
* @route '/{dominio}/{site}/{seccion}'
*/
showForm.head = (args: { dominio: string | number, site: string | number, seccion: string | number } | [dominio: string | number, site: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see app/Http/Controllers/SitePageController.php:17
* @route '/{dominio}/{site}'
*/
export const redirectToFirst = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirectToFirst.url(args, options),
    method: 'get',
})

redirectToFirst.definition = {
    methods: ["get","head"],
    url: '/{dominio}/{site}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SitePageController::redirectToFirst
* @see app/Http/Controllers/SitePageController.php:17
* @route '/{dominio}/{site}'
*/
redirectToFirst.url = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            dominio: args[0],
            site: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        dominio: args.dominio,
        site: args.site,
    }

    return redirectToFirst.definition.url
            .replace('{dominio}', parsedArgs.dominio.toString())
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SitePageController::redirectToFirst
* @see app/Http/Controllers/SitePageController.php:17
* @route '/{dominio}/{site}'
*/
redirectToFirst.get = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirectToFirst.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::redirectToFirst
* @see app/Http/Controllers/SitePageController.php:17
* @route '/{dominio}/{site}'
*/
redirectToFirst.head = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: redirectToFirst.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SitePageController::redirectToFirst
* @see app/Http/Controllers/SitePageController.php:17
* @route '/{dominio}/{site}'
*/
const redirectToFirstForm = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirectToFirst.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::redirectToFirst
* @see app/Http/Controllers/SitePageController.php:17
* @route '/{dominio}/{site}'
*/
redirectToFirstForm.get = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirectToFirst.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::redirectToFirst
* @see app/Http/Controllers/SitePageController.php:17
* @route '/{dominio}/{site}'
*/
redirectToFirstForm.head = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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