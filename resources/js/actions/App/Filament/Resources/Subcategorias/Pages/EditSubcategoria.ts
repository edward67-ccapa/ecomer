import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Subcategorias\Pages\EditSubcategoria::__invoke
* @see app/Filament/Resources/Subcategorias/Pages/EditSubcategoria.php:7
* @route '/admin/subcategorias/{record}/edit'
*/
const EditSubcategoria = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditSubcategoria.url(args, options),
    method: 'get',
})

EditSubcategoria.definition = {
    methods: ["get","head"],
    url: '/admin/subcategorias/{record}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Subcategorias\Pages\EditSubcategoria::__invoke
* @see app/Filament/Resources/Subcategorias/Pages/EditSubcategoria.php:7
* @route '/admin/subcategorias/{record}/edit'
*/
EditSubcategoria.url = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return EditSubcategoria.definition.url
            .replace('{record}', parsedArgs.record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Filament\Resources\Subcategorias\Pages\EditSubcategoria::__invoke
* @see app/Filament/Resources/Subcategorias/Pages/EditSubcategoria.php:7
* @route '/admin/subcategorias/{record}/edit'
*/
EditSubcategoria.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditSubcategoria.url(args, options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Subcategorias\Pages\EditSubcategoria::__invoke
* @see app/Filament/Resources/Subcategorias/Pages/EditSubcategoria.php:7
* @route '/admin/subcategorias/{record}/edit'
*/
EditSubcategoria.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: EditSubcategoria.url(args, options),
    method: 'head',
})

/**
* @see \App\Filament\Resources\Subcategorias\Pages\EditSubcategoria::__invoke
* @see app/Filament/Resources/Subcategorias/Pages/EditSubcategoria.php:7
* @route '/admin/subcategorias/{record}/edit'
*/
const EditSubcategoriaForm = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: EditSubcategoria.url(args, options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Subcategorias\Pages\EditSubcategoria::__invoke
* @see app/Filament/Resources/Subcategorias/Pages/EditSubcategoria.php:7
* @route '/admin/subcategorias/{record}/edit'
*/
EditSubcategoriaForm.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: EditSubcategoria.url(args, options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Subcategorias\Pages\EditSubcategoria::__invoke
* @see app/Filament/Resources/Subcategorias/Pages/EditSubcategoria.php:7
* @route '/admin/subcategorias/{record}/edit'
*/
EditSubcategoriaForm.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: EditSubcategoria.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

EditSubcategoria.form = EditSubcategoriaForm

export default EditSubcategoria