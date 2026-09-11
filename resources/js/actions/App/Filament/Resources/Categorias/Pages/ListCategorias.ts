import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Categorias\Pages\ListCategorias::__invoke
 * @see app/Filament/Resources/Categorias/Pages/ListCategorias.php:7
 * @route '/admin/categorias'
 */
const ListCategorias = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListCategorias.url(options),
    method: 'get',
})

ListCategorias.definition = {
    methods: ["get","head"],
    url: '/admin/categorias',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Categorias\Pages\ListCategorias::__invoke
 * @see app/Filament/Resources/Categorias/Pages/ListCategorias.php:7
 * @route '/admin/categorias'
 */
ListCategorias.url = (options?: RouteQueryOptions) => {
    return ListCategorias.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Categorias\Pages\ListCategorias::__invoke
 * @see app/Filament/Resources/Categorias/Pages/ListCategorias.php:7
 * @route '/admin/categorias'
 */
ListCategorias.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListCategorias.url(options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\Categorias\Pages\ListCategorias::__invoke
 * @see app/Filament/Resources/Categorias/Pages/ListCategorias.php:7
 * @route '/admin/categorias'
 */
ListCategorias.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ListCategorias.url(options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\Categorias\Pages\ListCategorias::__invoke
 * @see app/Filament/Resources/Categorias/Pages/ListCategorias.php:7
 * @route '/admin/categorias'
 */
    const ListCategoriasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ListCategorias.url(options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\Categorias\Pages\ListCategorias::__invoke
 * @see app/Filament/Resources/Categorias/Pages/ListCategorias.php:7
 * @route '/admin/categorias'
 */
        ListCategoriasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ListCategorias.url(options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\Categorias\Pages\ListCategorias::__invoke
 * @see app/Filament/Resources/Categorias/Pages/ListCategorias.php:7
 * @route '/admin/categorias'
 */
        ListCategoriasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ListCategorias.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ListCategorias.form = ListCategoriasForm
export default ListCategorias