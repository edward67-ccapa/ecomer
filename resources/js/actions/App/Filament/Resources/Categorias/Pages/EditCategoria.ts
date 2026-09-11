import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Categorias\Pages\EditCategoria::__invoke
 * @see app/Filament/Resources/Categorias/Pages/EditCategoria.php:7
 * @route '/admin/categorias/{record}/edit'
 */
const EditCategoria = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditCategoria.url(args, options),
    method: 'get',
})

EditCategoria.definition = {
    methods: ["get","head"],
    url: '/admin/categorias/{record}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Categorias\Pages\EditCategoria::__invoke
 * @see app/Filament/Resources/Categorias/Pages/EditCategoria.php:7
 * @route '/admin/categorias/{record}/edit'
 */
EditCategoria.url = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return EditCategoria.definition.url
            .replace('{record}', parsedArgs.record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Filament\Resources\Categorias\Pages\EditCategoria::__invoke
 * @see app/Filament/Resources/Categorias/Pages/EditCategoria.php:7
 * @route '/admin/categorias/{record}/edit'
 */
EditCategoria.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditCategoria.url(args, options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\Categorias\Pages\EditCategoria::__invoke
 * @see app/Filament/Resources/Categorias/Pages/EditCategoria.php:7
 * @route '/admin/categorias/{record}/edit'
 */
EditCategoria.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: EditCategoria.url(args, options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\Categorias\Pages\EditCategoria::__invoke
 * @see app/Filament/Resources/Categorias/Pages/EditCategoria.php:7
 * @route '/admin/categorias/{record}/edit'
 */
    const EditCategoriaForm = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: EditCategoria.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\Categorias\Pages\EditCategoria::__invoke
 * @see app/Filament/Resources/Categorias/Pages/EditCategoria.php:7
 * @route '/admin/categorias/{record}/edit'
 */
        EditCategoriaForm.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: EditCategoria.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\Categorias\Pages\EditCategoria::__invoke
 * @see app/Filament/Resources/Categorias/Pages/EditCategoria.php:7
 * @route '/admin/categorias/{record}/edit'
 */
        EditCategoriaForm.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: EditCategoria.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    EditCategoria.form = EditCategoriaForm
export default EditCategoria