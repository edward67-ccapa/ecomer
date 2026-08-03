import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Tiendas\Pages\ListTiendas::__invoke
* @see app/Filament/Resources/Tiendas/Pages/ListTiendas.php:7
* @route '/admin/tiendas'
*/
const ListTiendas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListTiendas.url(options),
    method: 'get',
})

ListTiendas.definition = {
    methods: ["get","head"],
    url: '/admin/tiendas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Tiendas\Pages\ListTiendas::__invoke
* @see app/Filament/Resources/Tiendas/Pages/ListTiendas.php:7
* @route '/admin/tiendas'
*/
ListTiendas.url = (options?: RouteQueryOptions) => {
    return ListTiendas.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Tiendas\Pages\ListTiendas::__invoke
* @see app/Filament/Resources/Tiendas/Pages/ListTiendas.php:7
* @route '/admin/tiendas'
*/
ListTiendas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListTiendas.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Tiendas\Pages\ListTiendas::__invoke
* @see app/Filament/Resources/Tiendas/Pages/ListTiendas.php:7
* @route '/admin/tiendas'
*/
ListTiendas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ListTiendas.url(options),
    method: 'head',
})

/**
* @see \App\Filament\Resources\Tiendas\Pages\ListTiendas::__invoke
* @see app/Filament/Resources/Tiendas/Pages/ListTiendas.php:7
* @route '/admin/tiendas'
*/
const ListTiendasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ListTiendas.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Tiendas\Pages\ListTiendas::__invoke
* @see app/Filament/Resources/Tiendas/Pages/ListTiendas.php:7
* @route '/admin/tiendas'
*/
ListTiendasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ListTiendas.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Tiendas\Pages\ListTiendas::__invoke
* @see app/Filament/Resources/Tiendas/Pages/ListTiendas.php:7
* @route '/admin/tiendas'
*/
ListTiendasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ListTiendas.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

ListTiendas.form = ListTiendasForm

export default ListTiendas