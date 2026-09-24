import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Marcas\Pages\ListMarcas::__invoke
* @see app/Filament/Resources/Marcas/Pages/ListMarcas.php:7
* @route '/admin/marcas'
*/
const ListMarcas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListMarcas.url(options),
    method: 'get',
})

ListMarcas.definition = {
    methods: ["get","head"],
    url: '/admin/marcas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Marcas\Pages\ListMarcas::__invoke
* @see app/Filament/Resources/Marcas/Pages/ListMarcas.php:7
* @route '/admin/marcas'
*/
ListMarcas.url = (options?: RouteQueryOptions) => {
    return ListMarcas.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Marcas\Pages\ListMarcas::__invoke
* @see app/Filament/Resources/Marcas/Pages/ListMarcas.php:7
* @route '/admin/marcas'
*/
ListMarcas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListMarcas.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Marcas\Pages\ListMarcas::__invoke
* @see app/Filament/Resources/Marcas/Pages/ListMarcas.php:7
* @route '/admin/marcas'
*/
ListMarcas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ListMarcas.url(options),
    method: 'head',
})

/**
* @see \App\Filament\Resources\Marcas\Pages\ListMarcas::__invoke
* @see app/Filament/Resources/Marcas/Pages/ListMarcas.php:7
* @route '/admin/marcas'
*/
const ListMarcasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ListMarcas.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Marcas\Pages\ListMarcas::__invoke
* @see app/Filament/Resources/Marcas/Pages/ListMarcas.php:7
* @route '/admin/marcas'
*/
ListMarcasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ListMarcas.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Marcas\Pages\ListMarcas::__invoke
* @see app/Filament/Resources/Marcas/Pages/ListMarcas.php:7
* @route '/admin/marcas'
*/
ListMarcasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ListMarcas.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

ListMarcas.form = ListMarcasForm

export default ListMarcas