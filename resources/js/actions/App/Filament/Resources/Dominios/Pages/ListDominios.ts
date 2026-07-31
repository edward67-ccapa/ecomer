import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Dominios\Pages\ListDominios::__invoke
* @see app/Filament/Resources/Dominios/Pages/ListDominios.php:7
* @route '/admin/dominios'
*/
const ListDominios = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListDominios.url(options),
    method: 'get',
})

ListDominios.definition = {
    methods: ["get","head"],
    url: '/admin/dominios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Dominios\Pages\ListDominios::__invoke
* @see app/Filament/Resources/Dominios/Pages/ListDominios.php:7
* @route '/admin/dominios'
*/
ListDominios.url = (options?: RouteQueryOptions) => {
    return ListDominios.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Dominios\Pages\ListDominios::__invoke
* @see app/Filament/Resources/Dominios/Pages/ListDominios.php:7
* @route '/admin/dominios'
*/
ListDominios.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListDominios.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Dominios\Pages\ListDominios::__invoke
* @see app/Filament/Resources/Dominios/Pages/ListDominios.php:7
* @route '/admin/dominios'
*/
ListDominios.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ListDominios.url(options),
    method: 'head',
})

/**
* @see \App\Filament\Resources\Dominios\Pages\ListDominios::__invoke
* @see app/Filament/Resources/Dominios/Pages/ListDominios.php:7
* @route '/admin/dominios'
*/
const ListDominiosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ListDominios.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Dominios\Pages\ListDominios::__invoke
* @see app/Filament/Resources/Dominios/Pages/ListDominios.php:7
* @route '/admin/dominios'
*/
ListDominiosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ListDominios.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Dominios\Pages\ListDominios::__invoke
* @see app/Filament/Resources/Dominios/Pages/ListDominios.php:7
* @route '/admin/dominios'
*/
ListDominiosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ListDominios.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

ListDominios.form = ListDominiosForm

export default ListDominios