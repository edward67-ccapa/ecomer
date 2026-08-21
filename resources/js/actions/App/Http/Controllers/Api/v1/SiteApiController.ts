import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::index
* @see app/Http/Controllers/Api/v1/SiteApiController.php:15
* @route '/api/v1/sites'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/sites',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::index
* @see app/Http/Controllers/Api/v1/SiteApiController.php:15
* @route '/api/v1/sites'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::index
* @see app/Http/Controllers/Api/v1/SiteApiController.php:15
* @route '/api/v1/sites'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::index
* @see app/Http/Controllers/Api/v1/SiteApiController.php:15
* @route '/api/v1/sites'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::index
* @see app/Http/Controllers/Api/v1/SiteApiController.php:15
* @route '/api/v1/sites'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::index
* @see app/Http/Controllers/Api/v1/SiteApiController.php:15
* @route '/api/v1/sites'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::index
* @see app/Http/Controllers/Api/v1/SiteApiController.php:15
* @route '/api/v1/sites'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSection
* @see app/Http/Controllers/Api/v1/SiteApiController.php:60
* @route '/api/v1/sites/{dominio}/{seccion}'
*/
const showSection59b4ede910234ae5c6690508612f0045 = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showSection59b4ede910234ae5c6690508612f0045.url(args, options),
    method: 'get',
})

showSection59b4ede910234ae5c6690508612f0045.definition = {
    methods: ["get","head"],
    url: '/api/v1/sites/{dominio}/{seccion}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSection
* @see app/Http/Controllers/Api/v1/SiteApiController.php:60
* @route '/api/v1/sites/{dominio}/{seccion}'
*/
showSection59b4ede910234ae5c6690508612f0045.url = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions) => {
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

    return showSection59b4ede910234ae5c6690508612f0045.definition.url
            .replace('{dominio}', parsedArgs.dominio.toString())
            .replace('{seccion}', parsedArgs.seccion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSection
* @see app/Http/Controllers/Api/v1/SiteApiController.php:60
* @route '/api/v1/sites/{dominio}/{seccion}'
*/
showSection59b4ede910234ae5c6690508612f0045.get = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showSection59b4ede910234ae5c6690508612f0045.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSection
* @see app/Http/Controllers/Api/v1/SiteApiController.php:60
* @route '/api/v1/sites/{dominio}/{seccion}'
*/
showSection59b4ede910234ae5c6690508612f0045.head = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showSection59b4ede910234ae5c6690508612f0045.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSection
* @see app/Http/Controllers/Api/v1/SiteApiController.php:60
* @route '/api/v1/sites/{dominio}/{seccion}'
*/
const showSection59b4ede910234ae5c6690508612f0045Form = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showSection59b4ede910234ae5c6690508612f0045.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSection
* @see app/Http/Controllers/Api/v1/SiteApiController.php:60
* @route '/api/v1/sites/{dominio}/{seccion}'
*/
showSection59b4ede910234ae5c6690508612f0045Form.get = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showSection59b4ede910234ae5c6690508612f0045.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSection
* @see app/Http/Controllers/Api/v1/SiteApiController.php:60
* @route '/api/v1/sites/{dominio}/{seccion}'
*/
showSection59b4ede910234ae5c6690508612f0045Form.head = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showSection59b4ede910234ae5c6690508612f0045.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showSection59b4ede910234ae5c6690508612f0045.form = showSection59b4ede910234ae5c6690508612f0045Form
/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSection
* @see app/Http/Controllers/Api/v1/SiteApiController.php:60
* @route '/api/v1/sites/{dominio}/{site}/{seccion}'
*/
const showSection38a32a6d7d70adc7eda0fe7c91a318d8 = (args: { dominio: string | number, site: string | number, seccion: string | number } | [dominio: string | number, site: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showSection38a32a6d7d70adc7eda0fe7c91a318d8.url(args, options),
    method: 'get',
})

showSection38a32a6d7d70adc7eda0fe7c91a318d8.definition = {
    methods: ["get","head"],
    url: '/api/v1/sites/{dominio}/{site}/{seccion}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSection
* @see app/Http/Controllers/Api/v1/SiteApiController.php:60
* @route '/api/v1/sites/{dominio}/{site}/{seccion}'
*/
showSection38a32a6d7d70adc7eda0fe7c91a318d8.url = (args: { dominio: string | number, site: string | number, seccion: string | number } | [dominio: string | number, site: string | number, seccion: string | number ], options?: RouteQueryOptions) => {
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

    return showSection38a32a6d7d70adc7eda0fe7c91a318d8.definition.url
            .replace('{dominio}', parsedArgs.dominio.toString())
            .replace('{site}', parsedArgs.site.toString())
            .replace('{seccion}', parsedArgs.seccion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSection
* @see app/Http/Controllers/Api/v1/SiteApiController.php:60
* @route '/api/v1/sites/{dominio}/{site}/{seccion}'
*/
showSection38a32a6d7d70adc7eda0fe7c91a318d8.get = (args: { dominio: string | number, site: string | number, seccion: string | number } | [dominio: string | number, site: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showSection38a32a6d7d70adc7eda0fe7c91a318d8.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSection
* @see app/Http/Controllers/Api/v1/SiteApiController.php:60
* @route '/api/v1/sites/{dominio}/{site}/{seccion}'
*/
showSection38a32a6d7d70adc7eda0fe7c91a318d8.head = (args: { dominio: string | number, site: string | number, seccion: string | number } | [dominio: string | number, site: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showSection38a32a6d7d70adc7eda0fe7c91a318d8.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSection
* @see app/Http/Controllers/Api/v1/SiteApiController.php:60
* @route '/api/v1/sites/{dominio}/{site}/{seccion}'
*/
const showSection38a32a6d7d70adc7eda0fe7c91a318d8Form = (args: { dominio: string | number, site: string | number, seccion: string | number } | [dominio: string | number, site: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showSection38a32a6d7d70adc7eda0fe7c91a318d8.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSection
* @see app/Http/Controllers/Api/v1/SiteApiController.php:60
* @route '/api/v1/sites/{dominio}/{site}/{seccion}'
*/
showSection38a32a6d7d70adc7eda0fe7c91a318d8Form.get = (args: { dominio: string | number, site: string | number, seccion: string | number } | [dominio: string | number, site: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showSection38a32a6d7d70adc7eda0fe7c91a318d8.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSection
* @see app/Http/Controllers/Api/v1/SiteApiController.php:60
* @route '/api/v1/sites/{dominio}/{site}/{seccion}'
*/
showSection38a32a6d7d70adc7eda0fe7c91a318d8Form.head = (args: { dominio: string | number, site: string | number, seccion: string | number } | [dominio: string | number, site: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showSection38a32a6d7d70adc7eda0fe7c91a318d8.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showSection38a32a6d7d70adc7eda0fe7c91a318d8.form = showSection38a32a6d7d70adc7eda0fe7c91a318d8Form

/**
* Multiple routes resolve to \App\Http\Controllers\Api\v1\SiteApiController::showSection, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `showSection['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const showSection = {
    '/api/v1/sites/{dominio}/{seccion}': showSection59b4ede910234ae5c6690508612f0045,
    '/api/v1/sites/{dominio}/{site}/{seccion}': showSection38a32a6d7d70adc7eda0fe7c91a318d8,
}

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSite
* @see app/Http/Controllers/Api/v1/SiteApiController.php:45
* @route '/api/v1/sites/{dominio}'
*/
const showSitefd647586bc344bbe2dd8e3d8023457f9 = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showSitefd647586bc344bbe2dd8e3d8023457f9.url(args, options),
    method: 'get',
})

showSitefd647586bc344bbe2dd8e3d8023457f9.definition = {
    methods: ["get","head"],
    url: '/api/v1/sites/{dominio}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSite
* @see app/Http/Controllers/Api/v1/SiteApiController.php:45
* @route '/api/v1/sites/{dominio}'
*/
showSitefd647586bc344bbe2dd8e3d8023457f9.url = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return showSitefd647586bc344bbe2dd8e3d8023457f9.definition.url
            .replace('{dominio}', parsedArgs.dominio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSite
* @see app/Http/Controllers/Api/v1/SiteApiController.php:45
* @route '/api/v1/sites/{dominio}'
*/
showSitefd647586bc344bbe2dd8e3d8023457f9.get = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showSitefd647586bc344bbe2dd8e3d8023457f9.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSite
* @see app/Http/Controllers/Api/v1/SiteApiController.php:45
* @route '/api/v1/sites/{dominio}'
*/
showSitefd647586bc344bbe2dd8e3d8023457f9.head = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showSitefd647586bc344bbe2dd8e3d8023457f9.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSite
* @see app/Http/Controllers/Api/v1/SiteApiController.php:45
* @route '/api/v1/sites/{dominio}'
*/
const showSitefd647586bc344bbe2dd8e3d8023457f9Form = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showSitefd647586bc344bbe2dd8e3d8023457f9.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSite
* @see app/Http/Controllers/Api/v1/SiteApiController.php:45
* @route '/api/v1/sites/{dominio}'
*/
showSitefd647586bc344bbe2dd8e3d8023457f9Form.get = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showSitefd647586bc344bbe2dd8e3d8023457f9.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSite
* @see app/Http/Controllers/Api/v1/SiteApiController.php:45
* @route '/api/v1/sites/{dominio}'
*/
showSitefd647586bc344bbe2dd8e3d8023457f9Form.head = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showSitefd647586bc344bbe2dd8e3d8023457f9.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showSitefd647586bc344bbe2dd8e3d8023457f9.form = showSitefd647586bc344bbe2dd8e3d8023457f9Form
/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSite
* @see app/Http/Controllers/Api/v1/SiteApiController.php:45
* @route '/api/v1/sites/{dominio}/{site}'
*/
const showSited39cf58583f4ff26ee7470bf48d24cf7 = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showSited39cf58583f4ff26ee7470bf48d24cf7.url(args, options),
    method: 'get',
})

showSited39cf58583f4ff26ee7470bf48d24cf7.definition = {
    methods: ["get","head"],
    url: '/api/v1/sites/{dominio}/{site}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSite
* @see app/Http/Controllers/Api/v1/SiteApiController.php:45
* @route '/api/v1/sites/{dominio}/{site}'
*/
showSited39cf58583f4ff26ee7470bf48d24cf7.url = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions) => {
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

    return showSited39cf58583f4ff26ee7470bf48d24cf7.definition.url
            .replace('{dominio}', parsedArgs.dominio.toString())
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSite
* @see app/Http/Controllers/Api/v1/SiteApiController.php:45
* @route '/api/v1/sites/{dominio}/{site}'
*/
showSited39cf58583f4ff26ee7470bf48d24cf7.get = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showSited39cf58583f4ff26ee7470bf48d24cf7.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSite
* @see app/Http/Controllers/Api/v1/SiteApiController.php:45
* @route '/api/v1/sites/{dominio}/{site}'
*/
showSited39cf58583f4ff26ee7470bf48d24cf7.head = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showSited39cf58583f4ff26ee7470bf48d24cf7.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSite
* @see app/Http/Controllers/Api/v1/SiteApiController.php:45
* @route '/api/v1/sites/{dominio}/{site}'
*/
const showSited39cf58583f4ff26ee7470bf48d24cf7Form = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showSited39cf58583f4ff26ee7470bf48d24cf7.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSite
* @see app/Http/Controllers/Api/v1/SiteApiController.php:45
* @route '/api/v1/sites/{dominio}/{site}'
*/
showSited39cf58583f4ff26ee7470bf48d24cf7Form.get = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showSited39cf58583f4ff26ee7470bf48d24cf7.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSite
* @see app/Http/Controllers/Api/v1/SiteApiController.php:45
* @route '/api/v1/sites/{dominio}/{site}'
*/
showSited39cf58583f4ff26ee7470bf48d24cf7Form.head = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showSited39cf58583f4ff26ee7470bf48d24cf7.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showSited39cf58583f4ff26ee7470bf48d24cf7.form = showSited39cf58583f4ff26ee7470bf48d24cf7Form

/**
* Multiple routes resolve to \App\Http\Controllers\Api\v1\SiteApiController::showSite, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `showSite['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const showSite = {
    '/api/v1/sites/{dominio}': showSitefd647586bc344bbe2dd8e3d8023457f9,
    '/api/v1/sites/{dominio}/{site}': showSited39cf58583f4ff26ee7470bf48d24cf7,
}

const SiteApiController = { index, showSection, showSite }

export default SiteApiController