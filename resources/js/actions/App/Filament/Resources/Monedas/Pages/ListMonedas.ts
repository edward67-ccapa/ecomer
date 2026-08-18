import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Monedas\Pages\ListMonedas::__invoke
* @see app/Filament/Resources/Monedas/Pages/ListMonedas.php:7
* @route '/admin/monedas'
*/
const ListMonedas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListMonedas.url(options),
    method: 'get',
})

ListMonedas.definition = {
    methods: ["get","head"],
    url: '/admin/monedas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Monedas\Pages\ListMonedas::__invoke
* @see app/Filament/Resources/Monedas/Pages/ListMonedas.php:7
* @route '/admin/monedas'
*/
ListMonedas.url = (options?: RouteQueryOptions) => {
    return ListMonedas.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Monedas\Pages\ListMonedas::__invoke
* @see app/Filament/Resources/Monedas/Pages/ListMonedas.php:7
* @route '/admin/monedas'
*/
ListMonedas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListMonedas.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Monedas\Pages\ListMonedas::__invoke
* @see app/Filament/Resources/Monedas/Pages/ListMonedas.php:7
* @route '/admin/monedas'
*/
ListMonedas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ListMonedas.url(options),
    method: 'head',
})

/**
* @see \App\Filament\Resources\Monedas\Pages\ListMonedas::__invoke
* @see app/Filament/Resources/Monedas/Pages/ListMonedas.php:7
* @route '/admin/monedas'
*/
const ListMonedasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ListMonedas.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Monedas\Pages\ListMonedas::__invoke
* @see app/Filament/Resources/Monedas/Pages/ListMonedas.php:7
* @route '/admin/monedas'
*/
ListMonedasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ListMonedas.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Monedas\Pages\ListMonedas::__invoke
* @see app/Filament/Resources/Monedas/Pages/ListMonedas.php:7
* @route '/admin/monedas'
*/
ListMonedasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ListMonedas.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

ListMonedas.form = ListMonedasForm

export default ListMonedas