import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults, validateParameters } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PlantillasController::index
* @see app/Http/Controllers/PlantillasController.php:17
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
* @see app/Http/Controllers/PlantillasController.php:17
* @route '/plantillas'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlantillasController::index
* @see app/Http/Controllers/PlantillasController.php:17
* @route '/plantillas'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlantillasController::index
* @see app/Http/Controllers/PlantillasController.php:17
* @route '/plantillas'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PlantillasController::index
* @see app/Http/Controllers/PlantillasController.php:17
* @route '/plantillas'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlantillasController::index
* @see app/Http/Controllers/PlantillasController.php:17
* @route '/plantillas'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlantillasController::index
* @see app/Http/Controllers/PlantillasController.php:17
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
* @see \App\Http\Controllers\PlantillasController::descargarCatalogo
* @see app/Http/Controllers/PlantillasController.php:156
* @route '/plantillas/{plantilla}/catalogo/descargar-pdf'
*/
export const descargarCatalogo = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargarCatalogo.url(args, options),
    method: 'get',
})

descargarCatalogo.definition = {
    methods: ["get","head"],
    url: '/plantillas/{plantilla}/catalogo/descargar-pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PlantillasController::descargarCatalogo
* @see app/Http/Controllers/PlantillasController.php:156
* @route '/plantillas/{plantilla}/catalogo/descargar-pdf'
*/
descargarCatalogo.url = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return descargarCatalogo.definition.url
            .replace('{plantilla}', parsedArgs.plantilla.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlantillasController::descargarCatalogo
* @see app/Http/Controllers/PlantillasController.php:156
* @route '/plantillas/{plantilla}/catalogo/descargar-pdf'
*/
descargarCatalogo.get = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargarCatalogo.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlantillasController::descargarCatalogo
* @see app/Http/Controllers/PlantillasController.php:156
* @route '/plantillas/{plantilla}/catalogo/descargar-pdf'
*/
descargarCatalogo.head = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: descargarCatalogo.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PlantillasController::descargarCatalogo
* @see app/Http/Controllers/PlantillasController.php:156
* @route '/plantillas/{plantilla}/catalogo/descargar-pdf'
*/
const descargarCatalogoForm = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: descargarCatalogo.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlantillasController::descargarCatalogo
* @see app/Http/Controllers/PlantillasController.php:156
* @route '/plantillas/{plantilla}/catalogo/descargar-pdf'
*/
descargarCatalogoForm.get = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: descargarCatalogo.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlantillasController::descargarCatalogo
* @see app/Http/Controllers/PlantillasController.php:156
* @route '/plantillas/{plantilla}/catalogo/descargar-pdf'
*/
descargarCatalogoForm.head = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: descargarCatalogo.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

descargarCatalogo.form = descargarCatalogoForm

/**
* @see \App\Http\Controllers\PlantillasController::preview
* @see app/Http/Controllers/PlantillasController.php:39
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
* @see app/Http/Controllers/PlantillasController.php:39
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
* @see app/Http/Controllers/PlantillasController.php:39
* @route '/plantillas/{plantilla}/{seccion?}'
*/
preview.get = (args: { plantilla: string | { slug: string }, seccion?: string | number } | [plantilla: string | { slug: string }, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlantillasController::preview
* @see app/Http/Controllers/PlantillasController.php:39
* @route '/plantillas/{plantilla}/{seccion?}'
*/
preview.head = (args: { plantilla: string | { slug: string }, seccion?: string | number } | [plantilla: string | { slug: string }, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PlantillasController::preview
* @see app/Http/Controllers/PlantillasController.php:39
* @route '/plantillas/{plantilla}/{seccion?}'
*/
const previewForm = (args: { plantilla: string | { slug: string }, seccion?: string | number } | [plantilla: string | { slug: string }, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: preview.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlantillasController::preview
* @see app/Http/Controllers/PlantillasController.php:39
* @route '/plantillas/{plantilla}/{seccion?}'
*/
previewForm.get = (args: { plantilla: string | { slug: string }, seccion?: string | number } | [plantilla: string | { slug: string }, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: preview.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlantillasController::preview
* @see app/Http/Controllers/PlantillasController.php:39
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

const PlantillasController = { index, descargarCatalogo, preview }

export default PlantillasController