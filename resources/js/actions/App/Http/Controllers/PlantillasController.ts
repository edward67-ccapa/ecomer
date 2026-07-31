import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PlantillasController::index
* @see app/Http/Controllers/PlantillasController.php:12
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
* @see app/Http/Controllers/PlantillasController.php:12
* @route '/plantillas'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlantillasController::index
* @see app/Http/Controllers/PlantillasController.php:12
* @route '/plantillas'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlantillasController::index
* @see app/Http/Controllers/PlantillasController.php:12
* @route '/plantillas'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PlantillasController::index
* @see app/Http/Controllers/PlantillasController.php:12
* @route '/plantillas'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlantillasController::index
* @see app/Http/Controllers/PlantillasController.php:12
* @route '/plantillas'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlantillasController::index
* @see app/Http/Controllers/PlantillasController.php:12
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

const PlantillasController = { index }

export default PlantillasController