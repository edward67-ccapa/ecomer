import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Colores\Pages\ListColores::__invoke
* @see app/Filament/Resources/Colores/Pages/ListColores.php:7
* @route '/admin/colores'
*/
const ListColores = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListColores.url(options),
    method: 'get',
})

ListColores.definition = {
    methods: ["get","head"],
    url: '/admin/colores',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Colores\Pages\ListColores::__invoke
* @see app/Filament/Resources/Colores/Pages/ListColores.php:7
* @route '/admin/colores'
*/
ListColores.url = (options?: RouteQueryOptions) => {
    return ListColores.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Colores\Pages\ListColores::__invoke
* @see app/Filament/Resources/Colores/Pages/ListColores.php:7
* @route '/admin/colores'
*/
ListColores.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListColores.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Colores\Pages\ListColores::__invoke
* @see app/Filament/Resources/Colores/Pages/ListColores.php:7
* @route '/admin/colores'
*/
ListColores.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ListColores.url(options),
    method: 'head',
})

/**
* @see \App\Filament\Resources\Colores\Pages\ListColores::__invoke
* @see app/Filament/Resources/Colores/Pages/ListColores.php:7
* @route '/admin/colores'
*/
const ListColoresForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ListColores.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Colores\Pages\ListColores::__invoke
* @see app/Filament/Resources/Colores/Pages/ListColores.php:7
* @route '/admin/colores'
*/
ListColoresForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ListColores.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Colores\Pages\ListColores::__invoke
* @see app/Filament/Resources/Colores/Pages/ListColores.php:7
* @route '/admin/colores'
*/
ListColoresForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ListColores.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

ListColores.form = ListColoresForm

export default ListColores