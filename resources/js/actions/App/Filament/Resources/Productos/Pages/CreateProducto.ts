import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Productos\Pages\CreateProducto::__invoke
 * @see app/Filament/Resources/Productos/Pages/CreateProducto.php:7
 * @route '/admin/productos/create'
 */
const CreateProducto = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateProducto.url(options),
    method: 'get',
})

CreateProducto.definition = {
    methods: ["get","head"],
    url: '/admin/productos/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Productos\Pages\CreateProducto::__invoke
 * @see app/Filament/Resources/Productos/Pages/CreateProducto.php:7
 * @route '/admin/productos/create'
 */
CreateProducto.url = (options?: RouteQueryOptions) => {
    return CreateProducto.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Productos\Pages\CreateProducto::__invoke
 * @see app/Filament/Resources/Productos/Pages/CreateProducto.php:7
 * @route '/admin/productos/create'
 */
CreateProducto.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateProducto.url(options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\Productos\Pages\CreateProducto::__invoke
 * @see app/Filament/Resources/Productos/Pages/CreateProducto.php:7
 * @route '/admin/productos/create'
 */
CreateProducto.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: CreateProducto.url(options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\Productos\Pages\CreateProducto::__invoke
 * @see app/Filament/Resources/Productos/Pages/CreateProducto.php:7
 * @route '/admin/productos/create'
 */
    const CreateProductoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: CreateProducto.url(options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\Productos\Pages\CreateProducto::__invoke
 * @see app/Filament/Resources/Productos/Pages/CreateProducto.php:7
 * @route '/admin/productos/create'
 */
        CreateProductoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: CreateProducto.url(options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\Productos\Pages\CreateProducto::__invoke
 * @see app/Filament/Resources/Productos/Pages/CreateProducto.php:7
 * @route '/admin/productos/create'
 */
        CreateProductoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: CreateProducto.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    CreateProducto.form = CreateProductoForm
export default CreateProducto