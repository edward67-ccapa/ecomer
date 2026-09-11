import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Productos\Pages\ListProductos::__invoke
 * @see app/Filament/Resources/Productos/Pages/ListProductos.php:7
 * @route '/admin/productos'
 */
const ListProductos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListProductos.url(options),
    method: 'get',
})

ListProductos.definition = {
    methods: ["get","head"],
    url: '/admin/productos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Productos\Pages\ListProductos::__invoke
 * @see app/Filament/Resources/Productos/Pages/ListProductos.php:7
 * @route '/admin/productos'
 */
ListProductos.url = (options?: RouteQueryOptions) => {
    return ListProductos.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Productos\Pages\ListProductos::__invoke
 * @see app/Filament/Resources/Productos/Pages/ListProductos.php:7
 * @route '/admin/productos'
 */
ListProductos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListProductos.url(options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\Productos\Pages\ListProductos::__invoke
 * @see app/Filament/Resources/Productos/Pages/ListProductos.php:7
 * @route '/admin/productos'
 */
ListProductos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ListProductos.url(options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\Productos\Pages\ListProductos::__invoke
 * @see app/Filament/Resources/Productos/Pages/ListProductos.php:7
 * @route '/admin/productos'
 */
    const ListProductosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ListProductos.url(options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\Productos\Pages\ListProductos::__invoke
 * @see app/Filament/Resources/Productos/Pages/ListProductos.php:7
 * @route '/admin/productos'
 */
        ListProductosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ListProductos.url(options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\Productos\Pages\ListProductos::__invoke
 * @see app/Filament/Resources/Productos/Pages/ListProductos.php:7
 * @route '/admin/productos'
 */
        ListProductosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ListProductos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ListProductos.form = ListProductosForm
export default ListProductos