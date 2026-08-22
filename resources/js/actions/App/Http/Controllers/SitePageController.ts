import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:35
* @route '/{param1}/{param2}/{param3}'
*/
const show0eafefde54f71dc0248fbeba8012a228 = (args: { param1: string | number, param2: string | number, param3: string | number } | [param1: string | number, param2: string | number, param3: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show0eafefde54f71dc0248fbeba8012a228.url(args, options),
    method: 'get',
})

show0eafefde54f71dc0248fbeba8012a228.definition = {
    methods: ["get","head"],
    url: '/{param1}/{param2}/{param3}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:35
* @route '/{param1}/{param2}/{param3}'
*/
show0eafefde54f71dc0248fbeba8012a228.url = (args: { param1: string | number, param2: string | number, param3: string | number } | [param1: string | number, param2: string | number, param3: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            param1: args[0],
            param2: args[1],
            param3: args[2],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        param1: args.param1,
        param2: args.param2,
        param3: args.param3,
    }

    return show0eafefde54f71dc0248fbeba8012a228.definition.url
            .replace('{param1}', parsedArgs.param1.toString())
            .replace('{param2}', parsedArgs.param2.toString())
            .replace('{param3}', parsedArgs.param3.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:35
* @route '/{param1}/{param2}/{param3}'
*/
show0eafefde54f71dc0248fbeba8012a228.get = (args: { param1: string | number, param2: string | number, param3: string | number } | [param1: string | number, param2: string | number, param3: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show0eafefde54f71dc0248fbeba8012a228.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:35
* @route '/{param1}/{param2}/{param3}'
*/
show0eafefde54f71dc0248fbeba8012a228.head = (args: { param1: string | number, param2: string | number, param3: string | number } | [param1: string | number, param2: string | number, param3: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show0eafefde54f71dc0248fbeba8012a228.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:35
* @route '/{param1}/{param2}/{param3}'
*/
const show0eafefde54f71dc0248fbeba8012a228Form = (args: { param1: string | number, param2: string | number, param3: string | number } | [param1: string | number, param2: string | number, param3: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show0eafefde54f71dc0248fbeba8012a228.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:35
* @route '/{param1}/{param2}/{param3}'
*/
show0eafefde54f71dc0248fbeba8012a228Form.get = (args: { param1: string | number, param2: string | number, param3: string | number } | [param1: string | number, param2: string | number, param3: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show0eafefde54f71dc0248fbeba8012a228.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:35
* @route '/{param1}/{param2}/{param3}'
*/
show0eafefde54f71dc0248fbeba8012a228Form.head = (args: { param1: string | number, param2: string | number, param3: string | number } | [param1: string | number, param2: string | number, param3: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show0eafefde54f71dc0248fbeba8012a228.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show0eafefde54f71dc0248fbeba8012a228.form = show0eafefde54f71dc0248fbeba8012a228Form
/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:35
* @route '/{dominio}/{seccion}'
*/
const show0001254fc6f9d86a3e515c910343db99 = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show0001254fc6f9d86a3e515c910343db99.url(args, options),
    method: 'get',
})

show0001254fc6f9d86a3e515c910343db99.definition = {
    methods: ["get","head"],
    url: '/{dominio}/{seccion}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:35
* @route '/{dominio}/{seccion}'
*/
show0001254fc6f9d86a3e515c910343db99.url = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions) => {
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

    return show0001254fc6f9d86a3e515c910343db99.definition.url
            .replace('{dominio}', parsedArgs.dominio.toString())
            .replace('{seccion}', parsedArgs.seccion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:35
* @route '/{dominio}/{seccion}'
*/
show0001254fc6f9d86a3e515c910343db99.get = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show0001254fc6f9d86a3e515c910343db99.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:35
* @route '/{dominio}/{seccion}'
*/
show0001254fc6f9d86a3e515c910343db99.head = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show0001254fc6f9d86a3e515c910343db99.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:35
* @route '/{dominio}/{seccion}'
*/
const show0001254fc6f9d86a3e515c910343db99Form = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show0001254fc6f9d86a3e515c910343db99.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:35
* @route '/{dominio}/{seccion}'
*/
show0001254fc6f9d86a3e515c910343db99Form.get = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show0001254fc6f9d86a3e515c910343db99.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitePageController::show
* @see app/Http/Controllers/SitePageController.php:35
* @route '/{dominio}/{seccion}'
*/
show0001254fc6f9d86a3e515c910343db99Form.head = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show0001254fc6f9d86a3e515c910343db99.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show0001254fc6f9d86a3e515c910343db99.form = show0001254fc6f9d86a3e515c910343db99Form

/**
* Multiple routes resolve to \App\Http\Controllers\SitePageController::show, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `show['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const show = {
    '/{param1}/{param2}/{param3}': show0eafefde54f71dc0248fbeba8012a228,
    '/{dominio}/{seccion}': show0001254fc6f9d86a3e515c910343db99,
}

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