import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Categorias\Pages\CreateCategoria::__invoke
 * @see app/Filament/Resources/Categorias/Pages/CreateCategoria.php:7
 * @route '/admin/categorias/create'
 */
const CreateCategoria = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateCategoria.url(options),
    method: 'get',
})

CreateCategoria.definition = {
    methods: ["get","head"],
    url: '/admin/categorias/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Categorias\Pages\CreateCategoria::__invoke
 * @see app/Filament/Resources/Categorias/Pages/CreateCategoria.php:7
 * @route '/admin/categorias/create'
 */
CreateCategoria.url = (options?: RouteQueryOptions) => {
    return CreateCategoria.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Categorias\Pages\CreateCategoria::__invoke
 * @see app/Filament/Resources/Categorias/Pages/CreateCategoria.php:7
 * @route '/admin/categorias/create'
 */
CreateCategoria.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateCategoria.url(options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\Categorias\Pages\CreateCategoria::__invoke
 * @see app/Filament/Resources/Categorias/Pages/CreateCategoria.php:7
 * @route '/admin/categorias/create'
 */
CreateCategoria.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: CreateCategoria.url(options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\Categorias\Pages\CreateCategoria::__invoke
 * @see app/Filament/Resources/Categorias/Pages/CreateCategoria.php:7
 * @route '/admin/categorias/create'
 */
    const CreateCategoriaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: CreateCategoria.url(options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\Categorias\Pages\CreateCategoria::__invoke
 * @see app/Filament/Resources/Categorias/Pages/CreateCategoria.php:7
 * @route '/admin/categorias/create'
 */
        CreateCategoriaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: CreateCategoria.url(options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\Categorias\Pages\CreateCategoria::__invoke
 * @see app/Filament/Resources/Categorias/Pages/CreateCategoria.php:7
 * @route '/admin/categorias/create'
 */
        CreateCategoriaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: CreateCategoria.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    CreateCategoria.form = CreateCategoriaForm
export default CreateCategoria