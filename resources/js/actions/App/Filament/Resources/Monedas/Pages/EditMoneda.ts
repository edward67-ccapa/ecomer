import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Monedas\Pages\EditMoneda::__invoke
* @see app/Filament/Resources/Monedas/Pages/EditMoneda.php:7
* @route '/admin/monedas/{record}/edit'
*/
const EditMoneda = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditMoneda.url(args, options),
    method: 'get',
})

EditMoneda.definition = {
    methods: ["get","head"],
    url: '/admin/monedas/{record}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Monedas\Pages\EditMoneda::__invoke
* @see app/Filament/Resources/Monedas/Pages/EditMoneda.php:7
* @route '/admin/monedas/{record}/edit'
*/
EditMoneda.url = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return EditMoneda.definition.url
            .replace('{record}', parsedArgs.record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Filament\Resources\Monedas\Pages\EditMoneda::__invoke
* @see app/Filament/Resources/Monedas/Pages/EditMoneda.php:7
* @route '/admin/monedas/{record}/edit'
*/
EditMoneda.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditMoneda.url(args, options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Monedas\Pages\EditMoneda::__invoke
* @see app/Filament/Resources/Monedas/Pages/EditMoneda.php:7
* @route '/admin/monedas/{record}/edit'
*/
EditMoneda.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: EditMoneda.url(args, options),
    method: 'head',
})

/**
* @see \App\Filament\Resources\Monedas\Pages\EditMoneda::__invoke
* @see app/Filament/Resources/Monedas/Pages/EditMoneda.php:7
* @route '/admin/monedas/{record}/edit'
*/
const EditMonedaForm = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: EditMoneda.url(args, options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Monedas\Pages\EditMoneda::__invoke
* @see app/Filament/Resources/Monedas/Pages/EditMoneda.php:7
* @route '/admin/monedas/{record}/edit'
*/
EditMonedaForm.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: EditMoneda.url(args, options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Monedas\Pages\EditMoneda::__invoke
* @see app/Filament/Resources/Monedas/Pages/EditMoneda.php:7
* @route '/admin/monedas/{record}/edit'
*/
EditMonedaForm.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: EditMoneda.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

EditMoneda.form = EditMonedaForm

export default EditMoneda