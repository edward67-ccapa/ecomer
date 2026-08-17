import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults, validateParameters } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\v1\PlantillaApiController::index
* @see app/Http/Controllers/Api/v1/PlantillaApiController.php:15
* @route '/api/v1/plantillas'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/plantillas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\v1\PlantillaApiController::index
* @see app/Http/Controllers/Api/v1/PlantillaApiController.php:15
* @route '/api/v1/plantillas'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\v1\PlantillaApiController::index
* @see app/Http/Controllers/Api/v1/PlantillaApiController.php:15
* @route '/api/v1/plantillas'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\PlantillaApiController::index
* @see app/Http/Controllers/Api/v1/PlantillaApiController.php:15
* @route '/api/v1/plantillas'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\v1\PlantillaApiController::index
* @see app/Http/Controllers/Api/v1/PlantillaApiController.php:15
* @route '/api/v1/plantillas'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\PlantillaApiController::index
* @see app/Http/Controllers/Api/v1/PlantillaApiController.php:15
* @route '/api/v1/plantillas'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\PlantillaApiController::index
* @see app/Http/Controllers/Api/v1/PlantillaApiController.php:15
* @route '/api/v1/plantillas'
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
* @see \App\Http\Controllers\Api\v1\PlantillaApiController::show
* @see app/Http/Controllers/Api/v1/PlantillaApiController.php:26
* @route '/api/v1/plantillas/{plantilla}'
*/
export const show = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/plantillas/{plantilla}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\v1\PlantillaApiController::show
* @see app/Http/Controllers/Api/v1/PlantillaApiController.php:26
* @route '/api/v1/plantillas/{plantilla}'
*/
show.url = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { plantilla: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { plantilla: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            plantilla: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        plantilla: typeof args.plantilla === 'object'
        ? args.plantilla.slug
        : args.plantilla,
    }

    return show.definition.url
            .replace('{plantilla}', parsedArgs.plantilla.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\v1\PlantillaApiController::show
* @see app/Http/Controllers/Api/v1/PlantillaApiController.php:26
* @route '/api/v1/plantillas/{plantilla}'
*/
show.get = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\PlantillaApiController::show
* @see app/Http/Controllers/Api/v1/PlantillaApiController.php:26
* @route '/api/v1/plantillas/{plantilla}'
*/
show.head = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\v1\PlantillaApiController::show
* @see app/Http/Controllers/Api/v1/PlantillaApiController.php:26
* @route '/api/v1/plantillas/{plantilla}'
*/
const showForm = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\PlantillaApiController::show
* @see app/Http/Controllers/Api/v1/PlantillaApiController.php:26
* @route '/api/v1/plantillas/{plantilla}'
*/
showForm.get = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\PlantillaApiController::show
* @see app/Http/Controllers/Api/v1/PlantillaApiController.php:26
* @route '/api/v1/plantillas/{plantilla}'
*/
showForm.head = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\v1\PlantillaApiController::preview
* @see app/Http/Controllers/Api/v1/PlantillaApiController.php:33
* @route '/api/v1/plantillas/{plantilla}/preview/{seccion?}'
*/
export const preview = (args: { plantilla: string | { slug: string }, seccion?: string | number } | [plantilla: string | { slug: string }, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/api/v1/plantillas/{plantilla}/preview/{seccion?}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\v1\PlantillaApiController::preview
* @see app/Http/Controllers/Api/v1/PlantillaApiController.php:33
* @route '/api/v1/plantillas/{plantilla}/preview/{seccion?}'
*/
preview.url = (args: { plantilla: string | { slug: string }, seccion?: string | number } | [plantilla: string | { slug: string }, seccion: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            plantilla: args[0],
            seccion: args[1],
        }
    }

    args = applyUrlDefaults(args)

    validateParameters(args, [
        "seccion",
    ])

    const parsedArgs = {
        plantilla: typeof args.plantilla === 'object'
        ? args.plantilla.slug
        : args.plantilla,
        seccion: args.seccion,
    }

    return preview.definition.url
            .replace('{plantilla}', parsedArgs.plantilla.toString())
            .replace('{seccion?}', parsedArgs.seccion?.toString() ?? '')
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\v1\PlantillaApiController::preview
* @see app/Http/Controllers/Api/v1/PlantillaApiController.php:33
* @route '/api/v1/plantillas/{plantilla}/preview/{seccion?}'
*/
preview.get = (args: { plantilla: string | { slug: string }, seccion?: string | number } | [plantilla: string | { slug: string }, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\PlantillaApiController::preview
* @see app/Http/Controllers/Api/v1/PlantillaApiController.php:33
* @route '/api/v1/plantillas/{plantilla}/preview/{seccion?}'
*/
preview.head = (args: { plantilla: string | { slug: string }, seccion?: string | number } | [plantilla: string | { slug: string }, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\v1\PlantillaApiController::preview
* @see app/Http/Controllers/Api/v1/PlantillaApiController.php:33
* @route '/api/v1/plantillas/{plantilla}/preview/{seccion?}'
*/
const previewForm = (args: { plantilla: string | { slug: string }, seccion?: string | number } | [plantilla: string | { slug: string }, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: preview.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\PlantillaApiController::preview
* @see app/Http/Controllers/Api/v1/PlantillaApiController.php:33
* @route '/api/v1/plantillas/{plantilla}/preview/{seccion?}'
*/
previewForm.get = (args: { plantilla: string | { slug: string }, seccion?: string | number } | [plantilla: string | { slug: string }, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: preview.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\PlantillaApiController::preview
* @see app/Http/Controllers/Api/v1/PlantillaApiController.php:33
* @route '/api/v1/plantillas/{plantilla}/preview/{seccion?}'
*/
previewForm.head = (args: { plantilla: string | { slug: string }, seccion?: string | number } | [plantilla: string | { slug: string }, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: preview.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

preview.form = previewForm

const PlantillaApiController = { index, show, preview }

export default PlantillaApiController