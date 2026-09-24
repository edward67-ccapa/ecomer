import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Subcategorias\Pages\CreateSubcategoria::__invoke
* @see app/Filament/Resources/Subcategorias/Pages/CreateSubcategoria.php:7
* @route '/admin/subcategorias/create'
*/
const CreateSubcategoria = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateSubcategoria.url(options),
    method: 'get',
})

CreateSubcategoria.definition = {
    methods: ["get","head"],
    url: '/admin/subcategorias/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Subcategorias\Pages\CreateSubcategoria::__invoke
* @see app/Filament/Resources/Subcategorias/Pages/CreateSubcategoria.php:7
* @route '/admin/subcategorias/create'
*/
CreateSubcategoria.url = (options?: RouteQueryOptions) => {
    return CreateSubcategoria.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Subcategorias\Pages\CreateSubcategoria::__invoke
* @see app/Filament/Resources/Subcategorias/Pages/CreateSubcategoria.php:7
* @route '/admin/subcategorias/create'
*/
CreateSubcategoria.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateSubcategoria.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Subcategorias\Pages\CreateSubcategoria::__invoke
* @see app/Filament/Resources/Subcategorias/Pages/CreateSubcategoria.php:7
* @route '/admin/subcategorias/create'
*/
CreateSubcategoria.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: CreateSubcategoria.url(options),
    method: 'head',
})

/**
* @see \App\Filament\Resources\Subcategorias\Pages\CreateSubcategoria::__invoke
* @see app/Filament/Resources/Subcategorias/Pages/CreateSubcategoria.php:7
* @route '/admin/subcategorias/create'
*/
const CreateSubcategoriaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CreateSubcategoria.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Subcategorias\Pages\CreateSubcategoria::__invoke
* @see app/Filament/Resources/Subcategorias/Pages/CreateSubcategoria.php:7
* @route '/admin/subcategorias/create'
*/
CreateSubcategoriaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CreateSubcategoria.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Subcategorias\Pages\CreateSubcategoria::__invoke
* @see app/Filament/Resources/Subcategorias/Pages/CreateSubcategoria.php:7
* @route '/admin/subcategorias/create'
*/
CreateSubcategoriaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CreateSubcategoria.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

CreateSubcategoria.form = CreateSubcategoriaForm

export default CreateSubcategoria