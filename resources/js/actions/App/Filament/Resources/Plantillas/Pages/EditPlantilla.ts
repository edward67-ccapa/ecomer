import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Plantillas\Pages\EditPlantilla::__invoke
* @see app/Filament/Resources/Plantillas/Pages/EditPlantilla.php:7
* @route '/admin/plantillas/{record}/edit'
*/
const EditPlantilla = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditPlantilla.url(args, options),
    method: 'get',
})

EditPlantilla.definition = {
    methods: ["get","head"],
    url: '/admin/plantillas/{record}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Plantillas\Pages\EditPlantilla::__invoke
* @see app/Filament/Resources/Plantillas/Pages/EditPlantilla.php:7
* @route '/admin/plantillas/{record}/edit'
*/
EditPlantilla.url = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return EditPlantilla.definition.url
            .replace('{record}', parsedArgs.record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Filament\Resources\Plantillas\Pages\EditPlantilla::__invoke
* @see app/Filament/Resources/Plantillas/Pages/EditPlantilla.php:7
* @route '/admin/plantillas/{record}/edit'
*/
EditPlantilla.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditPlantilla.url(args, options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Plantillas\Pages\EditPlantilla::__invoke
* @see app/Filament/Resources/Plantillas/Pages/EditPlantilla.php:7
* @route '/admin/plantillas/{record}/edit'
*/
EditPlantilla.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: EditPlantilla.url(args, options),
    method: 'head',
})

/**
* @see \App\Filament\Resources\Plantillas\Pages\EditPlantilla::__invoke
* @see app/Filament/Resources/Plantillas/Pages/EditPlantilla.php:7
* @route '/admin/plantillas/{record}/edit'
*/
const EditPlantillaForm = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: EditPlantilla.url(args, options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Plantillas\Pages\EditPlantilla::__invoke
* @see app/Filament/Resources/Plantillas/Pages/EditPlantilla.php:7
* @route '/admin/plantillas/{record}/edit'
*/
EditPlantillaForm.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: EditPlantilla.url(args, options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Plantillas\Pages\EditPlantilla::__invoke
* @see app/Filament/Resources/Plantillas/Pages/EditPlantilla.php:7
* @route '/admin/plantillas/{record}/edit'
*/
EditPlantillaForm.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: EditPlantilla.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

EditPlantilla.form = EditPlantillaForm

export default EditPlantilla