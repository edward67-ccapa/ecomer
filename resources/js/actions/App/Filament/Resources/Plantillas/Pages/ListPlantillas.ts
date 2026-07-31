import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Plantillas\Pages\ListPlantillas::__invoke
* @see app/Filament/Resources/Plantillas/Pages/ListPlantillas.php:7
* @route '/admin/plantillas'
*/
const ListPlantillas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListPlantillas.url(options),
    method: 'get',
})

ListPlantillas.definition = {
    methods: ["get","head"],
    url: '/admin/plantillas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Plantillas\Pages\ListPlantillas::__invoke
* @see app/Filament/Resources/Plantillas/Pages/ListPlantillas.php:7
* @route '/admin/plantillas'
*/
ListPlantillas.url = (options?: RouteQueryOptions) => {
    return ListPlantillas.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Plantillas\Pages\ListPlantillas::__invoke
* @see app/Filament/Resources/Plantillas/Pages/ListPlantillas.php:7
* @route '/admin/plantillas'
*/
ListPlantillas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListPlantillas.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Plantillas\Pages\ListPlantillas::__invoke
* @see app/Filament/Resources/Plantillas/Pages/ListPlantillas.php:7
* @route '/admin/plantillas'
*/
ListPlantillas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ListPlantillas.url(options),
    method: 'head',
})

/**
* @see \App\Filament\Resources\Plantillas\Pages\ListPlantillas::__invoke
* @see app/Filament/Resources/Plantillas/Pages/ListPlantillas.php:7
* @route '/admin/plantillas'
*/
const ListPlantillasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ListPlantillas.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Plantillas\Pages\ListPlantillas::__invoke
* @see app/Filament/Resources/Plantillas/Pages/ListPlantillas.php:7
* @route '/admin/plantillas'
*/
ListPlantillasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ListPlantillas.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Plantillas\Pages\ListPlantillas::__invoke
* @see app/Filament/Resources/Plantillas/Pages/ListPlantillas.php:7
* @route '/admin/plantillas'
*/
ListPlantillasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ListPlantillas.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

ListPlantillas.form = ListPlantillasForm

export default ListPlantillas