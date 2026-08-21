import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:35
* @route '/{dominio}/{seccion}'
*/
export const show = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/{dominio}/{seccion}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:35
* @route '/{dominio}/{seccion}'
*/
show.url = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            dominio: args[0],
            seccion: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        dominio: args.dominio,
        seccion: args.seccion,
    }

    return show.definition.url
            .replace('{dominio}', parsedArgs.dominio.toString())
            .replace('{seccion}', parsedArgs.seccion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:35
* @route '/{dominio}/{seccion}'
*/
show.get = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:35
* @route '/{dominio}/{seccion}'
*/
show.head = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:35
* @route '/{dominio}/{seccion}'
*/
const showForm = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:35
* @route '/{dominio}/{seccion}'
*/
showForm.get = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:35
* @route '/{dominio}/{seccion}'
*/
showForm.head = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see app/Http/Controllers/SitePageController.php:19
* @route '/{dominio}'
*/
export const redirectToFirst = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirectToFirst.url(args, options),
    method: 'get',
})

redirectToFirst.definition = {
    methods: ["get","head"],
    url: '/{dominio}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SitePageController::redirectToFirst
* @see app/Http/Controllers/SitePageController.php:19
* @route '/{dominio}'
*/
redirectToFirst.url = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { dominio: args }
    }

    if (Array.isArray(args)) {
        args = {
            dominio: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        dominio: args.dominio,
    }

    return redirectToFirst.definition.url
            .replace('{dominio}', parsedArgs.dominio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SitePageController::redirectToFirst
* @see app/Http/Controllers/SitePageController.php:19
* @route '/{dominio}'
*/
redirectToFirst.get = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirectToFirst.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::redirectToFirst
* @see app/Http/Controllers/SitePageController.php:19
* @route '/{dominio}'
*/
redirectToFirst.head = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: redirectToFirst.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SitePageController::redirectToFirst
* @see app/Http/Controllers/SitePageController.php:19
* @route '/{dominio}'
*/
const redirectToFirstForm = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirectToFirst.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::redirectToFirst
* @see app/Http/Controllers/SitePageController.php:19
* @route '/{dominio}'
*/
redirectToFirstForm.get = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirectToFirst.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::redirectToFirst
* @see app/Http/Controllers/SitePageController.php:19
* @route '/{dominio}'
*/
redirectToFirstForm.head = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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