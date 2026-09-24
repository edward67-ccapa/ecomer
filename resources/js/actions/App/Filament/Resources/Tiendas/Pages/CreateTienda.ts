import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Tiendas\Pages\CreateTienda::__invoke
* @see app/Filament/Resources/Tiendas/Pages/CreateTienda.php:7
* @route '/admin/tiendas/create'
*/
const CreateTienda = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateTienda.url(options),
    method: 'get',
})

CreateTienda.definition = {
    methods: ["get","head"],
    url: '/admin/tiendas/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Tiendas\Pages\CreateTienda::__invoke
* @see app/Filament/Resources/Tiendas/Pages/CreateTienda.php:7
* @route '/admin/tiendas/create'
*/
CreateTienda.url = (options?: RouteQueryOptions) => {
    return CreateTienda.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Tiendas\Pages\CreateTienda::__invoke
* @see app/Filament/Resources/Tiendas/Pages/CreateTienda.php:7
* @route '/admin/tiendas/create'
*/
CreateTienda.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateTienda.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Tiendas\Pages\CreateTienda::__invoke
* @see app/Filament/Resources/Tiendas/Pages/CreateTienda.php:7
* @route '/admin/tiendas/create'
*/
CreateTienda.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: CreateTienda.url(options),
    method: 'head',
})

/**
* @see \App\Filament\Resources\Tiendas\Pages\CreateTienda::__invoke
* @see app/Filament/Resources/Tiendas/Pages/CreateTienda.php:7
* @route '/admin/tiendas/create'
*/
const CreateTiendaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CreateTienda.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Tiendas\Pages\CreateTienda::__invoke
* @see app/Filament/Resources/Tiendas/Pages/CreateTienda.php:7
* @route '/admin/tiendas/create'
*/
CreateTiendaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CreateTienda.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Tiendas\Pages\CreateTienda::__invoke
* @see app/Filament/Resources/Tiendas/Pages/CreateTienda.php:7
* @route '/admin/tiendas/create'
*/
CreateTiendaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CreateTienda.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

CreateTienda.form = CreateTiendaForm

export default CreateTienda