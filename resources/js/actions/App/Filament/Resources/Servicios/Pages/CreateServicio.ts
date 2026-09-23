import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Servicios\Pages\CreateServicio::__invoke
 * @see app/Filament/Resources/Servicios/Pages/CreateServicio.php:7
 * @route '/admin/servicios/create'
 */
const CreateServicio = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateServicio.url(options),
    method: 'get',
})

CreateServicio.definition = {
    methods: ["get","head"],
    url: '/admin/servicios/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Servicios\Pages\CreateServicio::__invoke
 * @see app/Filament/Resources/Servicios/Pages/CreateServicio.php:7
 * @route '/admin/servicios/create'
 */
CreateServicio.url = (options?: RouteQueryOptions) => {
    return CreateServicio.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Servicios\Pages\CreateServicio::__invoke
 * @see app/Filament/Resources/Servicios/Pages/CreateServicio.php:7
 * @route '/admin/servicios/create'
 */
CreateServicio.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateServicio.url(options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\Servicios\Pages\CreateServicio::__invoke
 * @see app/Filament/Resources/Servicios/Pages/CreateServicio.php:7
 * @route '/admin/servicios/create'
 */
CreateServicio.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: CreateServicio.url(options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\Servicios\Pages\CreateServicio::__invoke
 * @see app/Filament/Resources/Servicios/Pages/CreateServicio.php:7
 * @route '/admin/servicios/create'
 */
    const CreateServicioForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: CreateServicio.url(options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\Servicios\Pages\CreateServicio::__invoke
 * @see app/Filament/Resources/Servicios/Pages/CreateServicio.php:7
 * @route '/admin/servicios/create'
 */
        CreateServicioForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: CreateServicio.url(options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\Servicios\Pages\CreateServicio::__invoke
 * @see app/Filament/Resources/Servicios/Pages/CreateServicio.php:7
 * @route '/admin/servicios/create'
 */
        CreateServicioForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: CreateServicio.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    CreateServicio.form = CreateServicioForm
export default CreateServicio