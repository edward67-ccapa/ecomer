import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Tallas\Pages\ListTallas::__invoke
* @see app/Filament/Resources/Tallas/Pages/ListTallas.php:7
* @route '/admin/tallas'
*/
const ListTallas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListTallas.url(options),
    method: 'get',
})

ListTallas.definition = {
    methods: ["get","head"],
    url: '/admin/tallas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Tallas\Pages\ListTallas::__invoke
* @see app/Filament/Resources/Tallas/Pages/ListTallas.php:7
* @route '/admin/tallas'
*/
ListTallas.url = (options?: RouteQueryOptions) => {
    return ListTallas.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Tallas\Pages\ListTallas::__invoke
* @see app/Filament/Resources/Tallas/Pages/ListTallas.php:7
* @route '/admin/tallas'
*/
ListTallas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListTallas.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Tallas\Pages\ListTallas::__invoke
* @see app/Filament/Resources/Tallas/Pages/ListTallas.php:7
* @route '/admin/tallas'
*/
ListTallas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ListTallas.url(options),
    method: 'head',
})

/**
* @see \App\Filament\Resources\Tallas\Pages\ListTallas::__invoke
* @see app/Filament/Resources/Tallas/Pages/ListTallas.php:7
* @route '/admin/tallas'
*/
const ListTallasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ListTallas.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Tallas\Pages\ListTallas::__invoke
* @see app/Filament/Resources/Tallas/Pages/ListTallas.php:7
* @route '/admin/tallas'
*/
ListTallasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ListTallas.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Tallas\Pages\ListTallas::__invoke
* @see app/Filament/Resources/Tallas/Pages/ListTallas.php:7
* @route '/admin/tallas'
*/
ListTallasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ListTallas.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

ListTallas.form = ListTallasForm

export default ListTallas