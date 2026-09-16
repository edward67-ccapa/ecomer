import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Dominios\Pages\EditDominio::__invoke
* @see app/Filament/Resources/Dominios/Pages/EditDominio.php:7
* @route '/admin/dominios/{record}/edit'
*/
const EditDominio = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditDominio.url(args, options),
    method: 'get',
})

EditDominio.definition = {
    methods: ["get","head"],
    url: '/admin/dominios/{record}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Dominios\Pages\EditDominio::__invoke
* @see app/Filament/Resources/Dominios/Pages/EditDominio.php:7
* @route '/admin/dominios/{record}/edit'
*/
EditDominio.url = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return EditDominio.definition.url
            .replace('{record}', parsedArgs.record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Filament\Resources\Dominios\Pages\EditDominio::__invoke
* @see app/Filament/Resources/Dominios/Pages/EditDominio.php:7
* @route '/admin/dominios/{record}/edit'
*/
EditDominio.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditDominio.url(args, options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Dominios\Pages\EditDominio::__invoke
* @see app/Filament/Resources/Dominios/Pages/EditDominio.php:7
* @route '/admin/dominios/{record}/edit'
*/
EditDominio.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: EditDominio.url(args, options),
    method: 'head',
})

/**
* @see \App\Filament\Resources\Dominios\Pages\EditDominio::__invoke
* @see app/Filament/Resources/Dominios/Pages/EditDominio.php:7
* @route '/admin/dominios/{record}/edit'
*/
const EditDominioForm = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: EditDominio.url(args, options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Dominios\Pages\EditDominio::__invoke
* @see app/Filament/Resources/Dominios/Pages/EditDominio.php:7
* @route '/admin/dominios/{record}/edit'
*/
EditDominioForm.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: EditDominio.url(args, options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Dominios\Pages\EditDominio::__invoke
* @see app/Filament/Resources/Dominios/Pages/EditDominio.php:7
* @route '/admin/dominios/{record}/edit'
*/
EditDominioForm.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: EditDominio.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

EditDominio.form = EditDominioForm

export default EditDominio