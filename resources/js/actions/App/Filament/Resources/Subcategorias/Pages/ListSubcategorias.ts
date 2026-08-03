import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Subcategorias\Pages\ListSubcategorias::__invoke
* @see app/Filament/Resources/Subcategorias/Pages/ListSubcategorias.php:7
* @route '/admin/subcategorias'
*/
const ListSubcategorias = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListSubcategorias.url(options),
    method: 'get',
})

ListSubcategorias.definition = {
    methods: ["get","head"],
    url: '/admin/subcategorias',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Subcategorias\Pages\ListSubcategorias::__invoke
* @see app/Filament/Resources/Subcategorias/Pages/ListSubcategorias.php:7
* @route '/admin/subcategorias'
*/
ListSubcategorias.url = (options?: RouteQueryOptions) => {
    return ListSubcategorias.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Subcategorias\Pages\ListSubcategorias::__invoke
* @see app/Filament/Resources/Subcategorias/Pages/ListSubcategorias.php:7
* @route '/admin/subcategorias'
*/
ListSubcategorias.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListSubcategorias.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Subcategorias\Pages\ListSubcategorias::__invoke
* @see app/Filament/Resources/Subcategorias/Pages/ListSubcategorias.php:7
* @route '/admin/subcategorias'
*/
ListSubcategorias.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ListSubcategorias.url(options),
    method: 'head',
})

/**
* @see \App\Filament\Resources\Subcategorias\Pages\ListSubcategorias::__invoke
* @see app/Filament/Resources/Subcategorias/Pages/ListSubcategorias.php:7
* @route '/admin/subcategorias'
*/
const ListSubcategoriasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ListSubcategorias.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Subcategorias\Pages\ListSubcategorias::__invoke
* @see app/Filament/Resources/Subcategorias/Pages/ListSubcategorias.php:7
* @route '/admin/subcategorias'
*/
ListSubcategoriasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ListSubcategorias.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Subcategorias\Pages\ListSubcategorias::__invoke
* @see app/Filament/Resources/Subcategorias/Pages/ListSubcategorias.php:7
* @route '/admin/subcategorias'
*/
ListSubcategoriasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ListSubcategorias.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

ListSubcategorias.form = ListSubcategoriasForm

export default ListSubcategorias