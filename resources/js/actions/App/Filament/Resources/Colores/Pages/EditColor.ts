import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Colores\Pages\EditColor::__invoke
* @see app/Filament/Resources/Colores/Pages/EditColor.php:7
* @route '/admin/colores/{record}/edit'
*/
const EditColor = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditColor.url(args, options),
    method: 'get',
})

EditColor.definition = {
    methods: ["get","head"],
    url: '/admin/colores/{record}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Colores\Pages\EditColor::__invoke
* @see app/Filament/Resources/Colores/Pages/EditColor.php:7
* @route '/admin/colores/{record}/edit'
*/
EditColor.url = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return EditColor.definition.url
            .replace('{record}', parsedArgs.record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Filament\Resources\Colores\Pages\EditColor::__invoke
* @see app/Filament/Resources/Colores/Pages/EditColor.php:7
* @route '/admin/colores/{record}/edit'
*/
EditColor.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditColor.url(args, options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Colores\Pages\EditColor::__invoke
* @see app/Filament/Resources/Colores/Pages/EditColor.php:7
* @route '/admin/colores/{record}/edit'
*/
EditColor.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: EditColor.url(args, options),
    method: 'head',
})

/**
* @see \App\Filament\Resources\Colores\Pages\EditColor::__invoke
* @see app/Filament/Resources/Colores/Pages/EditColor.php:7
* @route '/admin/colores/{record}/edit'
*/
const EditColorForm = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: EditColor.url(args, options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Colores\Pages\EditColor::__invoke
* @see app/Filament/Resources/Colores/Pages/EditColor.php:7
* @route '/admin/colores/{record}/edit'
*/
EditColorForm.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: EditColor.url(args, options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Colores\Pages\EditColor::__invoke
* @see app/Filament/Resources/Colores/Pages/EditColor.php:7
* @route '/admin/colores/{record}/edit'
*/
EditColorForm.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: EditColor.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

EditColor.form = EditColorForm

export default EditColor