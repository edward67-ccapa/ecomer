import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Tallas\Pages\EditTalla::__invoke
* @see app/Filament/Resources/Tallas/Pages/EditTalla.php:7
* @route '/admin/tallas/{record}/edit'
*/
const EditTalla = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditTalla.url(args, options),
    method: 'get',
})

EditTalla.definition = {
    methods: ["get","head"],
    url: '/admin/tallas/{record}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Tallas\Pages\EditTalla::__invoke
* @see app/Filament/Resources/Tallas/Pages/EditTalla.php:7
* @route '/admin/tallas/{record}/edit'
*/
EditTalla.url = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return EditTalla.definition.url
            .replace('{record}', parsedArgs.record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Filament\Resources\Tallas\Pages\EditTalla::__invoke
* @see app/Filament/Resources/Tallas/Pages/EditTalla.php:7
* @route '/admin/tallas/{record}/edit'
*/
EditTalla.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditTalla.url(args, options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Tallas\Pages\EditTalla::__invoke
* @see app/Filament/Resources/Tallas/Pages/EditTalla.php:7
* @route '/admin/tallas/{record}/edit'
*/
EditTalla.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: EditTalla.url(args, options),
    method: 'head',
})

/**
* @see \App\Filament\Resources\Tallas\Pages\EditTalla::__invoke
* @see app/Filament/Resources/Tallas/Pages/EditTalla.php:7
* @route '/admin/tallas/{record}/edit'
*/
const EditTallaForm = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: EditTalla.url(args, options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Tallas\Pages\EditTalla::__invoke
* @see app/Filament/Resources/Tallas/Pages/EditTalla.php:7
* @route '/admin/tallas/{record}/edit'
*/
EditTallaForm.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: EditTalla.url(args, options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Tallas\Pages\EditTalla::__invoke
* @see app/Filament/Resources/Tallas/Pages/EditTalla.php:7
* @route '/admin/tallas/{record}/edit'
*/
EditTallaForm.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: EditTalla.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

EditTalla.form = EditTallaForm

export default EditTalla