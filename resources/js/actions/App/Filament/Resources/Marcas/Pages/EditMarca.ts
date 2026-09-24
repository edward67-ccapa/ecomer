import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Marcas\Pages\EditMarca::__invoke
* @see app/Filament/Resources/Marcas/Pages/EditMarca.php:7
* @route '/admin/marcas/{record}/edit'
*/
const EditMarca = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditMarca.url(args, options),
    method: 'get',
})

EditMarca.definition = {
    methods: ["get","head"],
    url: '/admin/marcas/{record}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Marcas\Pages\EditMarca::__invoke
* @see app/Filament/Resources/Marcas/Pages/EditMarca.php:7
* @route '/admin/marcas/{record}/edit'
*/
EditMarca.url = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return EditMarca.definition.url
            .replace('{record}', parsedArgs.record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Filament\Resources\Marcas\Pages\EditMarca::__invoke
* @see app/Filament/Resources/Marcas/Pages/EditMarca.php:7
* @route '/admin/marcas/{record}/edit'
*/
EditMarca.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditMarca.url(args, options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Marcas\Pages\EditMarca::__invoke
* @see app/Filament/Resources/Marcas/Pages/EditMarca.php:7
* @route '/admin/marcas/{record}/edit'
*/
EditMarca.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: EditMarca.url(args, options),
    method: 'head',
})

/**
* @see \App\Filament\Resources\Marcas\Pages\EditMarca::__invoke
* @see app/Filament/Resources/Marcas/Pages/EditMarca.php:7
* @route '/admin/marcas/{record}/edit'
*/
const EditMarcaForm = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: EditMarca.url(args, options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Marcas\Pages\EditMarca::__invoke
* @see app/Filament/Resources/Marcas/Pages/EditMarca.php:7
* @route '/admin/marcas/{record}/edit'
*/
EditMarcaForm.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: EditMarca.url(args, options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Marcas\Pages\EditMarca::__invoke
* @see app/Filament/Resources/Marcas/Pages/EditMarca.php:7
* @route '/admin/marcas/{record}/edit'
*/
EditMarcaForm.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: EditMarca.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

EditMarca.form = EditMarcaForm

export default EditMarca