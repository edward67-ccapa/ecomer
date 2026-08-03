import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Tiendas\Pages\EditTienda::__invoke
* @see app/Filament/Resources/Tiendas/Pages/EditTienda.php:7
* @route '/admin/tiendas/{record}/edit'
*/
const EditTienda = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditTienda.url(args, options),
    method: 'get',
})

EditTienda.definition = {
    methods: ["get","head"],
    url: '/admin/tiendas/{record}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Tiendas\Pages\EditTienda::__invoke
* @see app/Filament/Resources/Tiendas/Pages/EditTienda.php:7
* @route '/admin/tiendas/{record}/edit'
*/
EditTienda.url = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return EditTienda.definition.url
            .replace('{record}', parsedArgs.record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Filament\Resources\Tiendas\Pages\EditTienda::__invoke
* @see app/Filament/Resources/Tiendas/Pages/EditTienda.php:7
* @route '/admin/tiendas/{record}/edit'
*/
EditTienda.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditTienda.url(args, options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Tiendas\Pages\EditTienda::__invoke
* @see app/Filament/Resources/Tiendas/Pages/EditTienda.php:7
* @route '/admin/tiendas/{record}/edit'
*/
EditTienda.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: EditTienda.url(args, options),
    method: 'head',
})

/**
* @see \App\Filament\Resources\Tiendas\Pages\EditTienda::__invoke
* @see app/Filament/Resources/Tiendas/Pages/EditTienda.php:7
* @route '/admin/tiendas/{record}/edit'
*/
const EditTiendaForm = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: EditTienda.url(args, options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Tiendas\Pages\EditTienda::__invoke
* @see app/Filament/Resources/Tiendas/Pages/EditTienda.php:7
* @route '/admin/tiendas/{record}/edit'
*/
EditTiendaForm.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: EditTienda.url(args, options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Tiendas\Pages\EditTienda::__invoke
* @see app/Filament/Resources/Tiendas/Pages/EditTienda.php:7
* @route '/admin/tiendas/{record}/edit'
*/
EditTiendaForm.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: EditTienda.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

EditTienda.form = EditTiendaForm

export default EditTienda