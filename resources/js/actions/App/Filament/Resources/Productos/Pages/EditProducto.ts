import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Productos\Pages\EditProducto::__invoke
 * @see app/Filament/Resources/Productos/Pages/EditProducto.php:7
 * @route '/admin/productos/{record}/edit'
 */
const EditProducto = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditProducto.url(args, options),
    method: 'get',
})

EditProducto.definition = {
    methods: ["get","head"],
    url: '/admin/productos/{record}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Productos\Pages\EditProducto::__invoke
 * @see app/Filament/Resources/Productos/Pages/EditProducto.php:7
 * @route '/admin/productos/{record}/edit'
 */
EditProducto.url = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { record: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    record: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        record: args.record,
                }

    return EditProducto.definition.url
            .replace('{record}', parsedArgs.record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Filament\Resources\Productos\Pages\EditProducto::__invoke
 * @see app/Filament/Resources/Productos/Pages/EditProducto.php:7
 * @route '/admin/productos/{record}/edit'
 */
EditProducto.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditProducto.url(args, options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\Productos\Pages\EditProducto::__invoke
 * @see app/Filament/Resources/Productos/Pages/EditProducto.php:7
 * @route '/admin/productos/{record}/edit'
 */
EditProducto.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: EditProducto.url(args, options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\Productos\Pages\EditProducto::__invoke
 * @see app/Filament/Resources/Productos/Pages/EditProducto.php:7
 * @route '/admin/productos/{record}/edit'
 */
    const EditProductoForm = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: EditProducto.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\Productos\Pages\EditProducto::__invoke
 * @see app/Filament/Resources/Productos/Pages/EditProducto.php:7
 * @route '/admin/productos/{record}/edit'
 */
        EditProductoForm.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: EditProducto.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\Productos\Pages\EditProducto::__invoke
 * @see app/Filament/Resources/Productos/Pages/EditProducto.php:7
 * @route '/admin/productos/{record}/edit'
 */
        EditProductoForm.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: EditProducto.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    EditProducto.form = EditProductoForm
export default EditProducto