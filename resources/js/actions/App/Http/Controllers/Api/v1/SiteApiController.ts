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
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSite
* @see app/Http/Controllers/Api/v1/SiteApiController.php:25
* @route '/api/v1/sites/{dominio}/{site}'
*/
export const showSite = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showSite.url(args, options),
    method: 'get',
})

showSite.definition = {
    methods: ["get","head"],
    url: '/api/v1/sites/{dominio}/{site}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSite
* @see app/Http/Controllers/Api/v1/SiteApiController.php:25
* @route '/api/v1/sites/{dominio}/{site}'
*/
showSite.url = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions) => {
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

    return showSite.definition.url
            .replace('{dominio}', parsedArgs.dominio.toString())
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSite
* @see app/Http/Controllers/Api/v1/SiteApiController.php:25
* @route '/api/v1/sites/{dominio}/{site}'
*/
showSite.get = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showSite.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSite
* @see app/Http/Controllers/Api/v1/SiteApiController.php:25
* @route '/api/v1/sites/{dominio}/{site}'
*/
showSite.head = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showSite.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSite
* @see app/Http/Controllers/Api/v1/SiteApiController.php:25
* @route '/api/v1/sites/{dominio}/{site}'
*/
const showSiteForm = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showSite.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSite
* @see app/Http/Controllers/Api/v1/SiteApiController.php:25
* @route '/api/v1/sites/{dominio}/{site}'
*/
showSiteForm.get = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showSite.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSite
* @see app/Http/Controllers/Api/v1/SiteApiController.php:25
* @route '/api/v1/sites/{dominio}/{site}'
*/
showSiteForm.head = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showSite.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showSite.form = showSiteForm

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSection
* @see app/Http/Controllers/Api/v1/SiteApiController.php:42
* @route '/api/v1/sites/{dominio}/{site}/{seccion}'
*/
export const showSection = (args: { dominio: string | number, site: string | number, seccion: string | number } | [dominio: string | number, site: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showSection.url(args, options),
    method: 'get',
})

showSection.definition = {
    methods: ["get","head"],
    url: '/api/v1/sites/{dominio}/{site}/{seccion}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSection
* @see app/Http/Controllers/Api/v1/SiteApiController.php:42
* @route '/api/v1/sites/{dominio}/{site}/{seccion}'
*/
showSection.url = (args: { dominio: string | number, site: string | number, seccion: string | number } | [dominio: string | number, site: string | number, seccion: string | number ], options?: RouteQueryOptions) => {
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

    return showSection.definition.url
            .replace('{dominio}', parsedArgs.dominio.toString())
            .replace('{site}', parsedArgs.site.toString())
            .replace('{seccion}', parsedArgs.seccion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSection
* @see app/Http/Controllers/Api/v1/SiteApiController.php:42
* @route '/api/v1/sites/{dominio}/{site}/{seccion}'
*/
showSection.get = (args: { dominio: string | number, site: string | number, seccion: string | number } | [dominio: string | number, site: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showSection.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSection
* @see app/Http/Controllers/Api/v1/SiteApiController.php:42
* @route '/api/v1/sites/{dominio}/{site}/{seccion}'
*/
showSection.head = (args: { dominio: string | number, site: string | number, seccion: string | number } | [dominio: string | number, site: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showSection.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSection
* @see app/Http/Controllers/Api/v1/SiteApiController.php:42
* @route '/api/v1/sites/{dominio}/{site}/{seccion}'
*/
const showSectionForm = (args: { dominio: string | number, site: string | number, seccion: string | number } | [dominio: string | number, site: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showSection.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSection
* @see app/Http/Controllers/Api/v1/SiteApiController.php:42
* @route '/api/v1/sites/{dominio}/{site}/{seccion}'
*/
showSectionForm.get = (args: { dominio: string | number, site: string | number, seccion: string | number } | [dominio: string | number, site: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showSection.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\SiteApiController::showSection
* @see app/Http/Controllers/Api/v1/SiteApiController.php:42
* @route '/api/v1/sites/{dominio}/{site}/{seccion}'
*/
showSectionForm.head = (args: { dominio: string | number, site: string | number, seccion: string | number } | [dominio: string | number, site: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showSection.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showSection.form = showSectionForm

const SiteApiController = { index, showSite, showSection }

export default SiteApiController