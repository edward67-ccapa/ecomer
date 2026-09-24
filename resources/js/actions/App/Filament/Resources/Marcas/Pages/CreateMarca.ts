import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Marcas\Pages\CreateMarca::__invoke
* @see app/Filament/Resources/Marcas/Pages/CreateMarca.php:7
* @route '/admin/marcas/create'
*/
const CreateMarca = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateMarca.url(options),
    method: 'get',
})

CreateMarca.definition = {
    methods: ["get","head"],
    url: '/admin/marcas/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Marcas\Pages\CreateMarca::__invoke
* @see app/Filament/Resources/Marcas/Pages/CreateMarca.php:7
* @route '/admin/marcas/create'
*/
CreateMarca.url = (options?: RouteQueryOptions) => {
    return CreateMarca.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Marcas\Pages\CreateMarca::__invoke
* @see app/Filament/Resources/Marcas/Pages/CreateMarca.php:7
* @route '/admin/marcas/create'
*/
CreateMarca.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateMarca.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Marcas\Pages\CreateMarca::__invoke
* @see app/Filament/Resources/Marcas/Pages/CreateMarca.php:7
* @route '/admin/marcas/create'
*/
CreateMarca.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: CreateMarca.url(options),
    method: 'head',
})

/**
* @see \App\Filament\Resources\Marcas\Pages\CreateMarca::__invoke
* @see app/Filament/Resources/Marcas/Pages/CreateMarca.php:7
* @route '/admin/marcas/create'
*/
const CreateMarcaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CreateMarca.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Marcas\Pages\CreateMarca::__invoke
* @see app/Filament/Resources/Marcas/Pages/CreateMarca.php:7
* @route '/admin/marcas/create'
*/
CreateMarcaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CreateMarca.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Marcas\Pages\CreateMarca::__invoke
* @see app/Filament/Resources/Marcas/Pages/CreateMarca.php:7
* @route '/admin/marcas/create'
*/
CreateMarcaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CreateMarca.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

CreateMarca.form = CreateMarcaForm

export default CreateMarca