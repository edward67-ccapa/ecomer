import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults, validateParameters } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PlantillasController::index
* @see app/Http/Controllers/PlantillasController.php:15
* @route '/plantillas'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/plantillas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PlantillasController::index
* @see app/Http/Controllers/PlantillasController.php:15
* @route '/plantillas'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlantillasController::index
* @see app/Http/Controllers/PlantillasController.php:15
* @route '/plantillas'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlantillasController::index
* @see app/Http/Controllers/PlantillasController.php:15
* @route '/plantillas'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PlantillasController::index
* @see app/Http/Controllers/PlantillasController.php:15
* @route '/plantillas'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlantillasController::index
* @see app/Http/Controllers/PlantillasController.php:15
* @route '/plantillas'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlantillasController::index
* @see app/Http/Controllers/PlantillasController.php:15
* @route '/plantillas'
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
* @see \App\Http\Controllers\PlantillasController::preview
* @see app/Http/Controllers/PlantillasController.php:37
* @route '/plantillas/{plantilla}/{seccion?}'
*/
export const preview = (args: { plantilla: string | { slug: string }, seccion?: string | number } | [plantilla: string | { slug: string }, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/plantillas/{plantilla}/{seccion?}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PlantillasController::preview
* @see app/Http/Controllers/PlantillasController.php:37
* @route '/plantillas/{plantilla}/{seccion?}'
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
* @see \App\Http\Controllers\PlantillasController::preview
* @see app/Http/Controllers/PlantillasController.php:37
* @route '/plantillas/{plantilla}/{seccion?}'
*/
preview.get = (args: { plantilla: string | { slug: string }, seccion?: string | number } | [plantilla: string | { slug: string }, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlantillasController::preview
* @see app/Http/Controllers/PlantillasController.php:37
* @route '/plantillas/{plantilla}/{seccion?}'
*/
preview.head = (args: { plantilla: string | { slug: string }, seccion?: string | number } | [plantilla: string | { slug: string }, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PlantillasController::preview
* @see app/Http/Controllers/PlantillasController.php:37
* @route '/plantillas/{plantilla}/{seccion?}'
*/
const previewForm = (args: { plantilla: string | { slug: string }, seccion?: string | number } | [plantilla: string | { slug: string }, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: preview.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlantillasController::preview
* @see app/Http/Controllers/PlantillasController.php:37
* @route '/plantillas/{plantilla}/{seccion?}'
*/
previewForm.get = (args: { plantilla: string | { slug: string }, seccion?: string | number } | [plantilla: string | { slug: string }, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: preview.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlantillasController::preview
* @see app/Http/Controllers/PlantillasController.php:37
* @route '/plantillas/{plantilla}/{seccion?}'
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

const plantillas = {
    index: Object.assign(index, index),
    preview: Object.assign(preview, preview),
}

export default plantillas