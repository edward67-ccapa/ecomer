import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Servicios\Pages\EditServicio::__invoke
 * @see app/Filament/Resources/Servicios/Pages/EditServicio.php:7
 * @route '/admin/servicios/{record}/edit'
 */
const EditServicio = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditServicio.url(args, options),
    method: 'get',
})

EditServicio.definition = {
    methods: ["get","head"],
    url: '/admin/servicios/{record}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Servicios\Pages\EditServicio::__invoke
 * @see app/Filament/Resources/Servicios/Pages/EditServicio.php:7
 * @route '/admin/servicios/{record}/edit'
 */
EditServicio.url = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return EditServicio.definition.url
            .replace('{record}', parsedArgs.record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Filament\Resources\Servicios\Pages\EditServicio::__invoke
 * @see app/Filament/Resources/Servicios/Pages/EditServicio.php:7
 * @route '/admin/servicios/{record}/edit'
 */
EditServicio.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditServicio.url(args, options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\Servicios\Pages\EditServicio::__invoke
 * @see app/Filament/Resources/Servicios/Pages/EditServicio.php:7
 * @route '/admin/servicios/{record}/edit'
 */
EditServicio.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: EditServicio.url(args, options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\Servicios\Pages\EditServicio::__invoke
 * @see app/Filament/Resources/Servicios/Pages/EditServicio.php:7
 * @route '/admin/servicios/{record}/edit'
 */
    const EditServicioForm = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: EditServicio.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\Servicios\Pages\EditServicio::__invoke
 * @see app/Filament/Resources/Servicios/Pages/EditServicio.php:7
 * @route '/admin/servicios/{record}/edit'
 */
        EditServicioForm.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: EditServicio.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\Servicios\Pages\EditServicio::__invoke
 * @see app/Filament/Resources/Servicios/Pages/EditServicio.php:7
 * @route '/admin/servicios/{record}/edit'
 */
        EditServicioForm.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: EditServicio.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    EditServicio.form = EditServicioForm
export default EditServicio