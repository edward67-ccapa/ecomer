import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Monedas\Pages\CreateMoneda::__invoke
* @see app/Filament/Resources/Monedas/Pages/CreateMoneda.php:7
* @route '/admin/monedas/create'
*/
const CreateMoneda = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateMoneda.url(options),
    method: 'get',
})

CreateMoneda.definition = {
    methods: ["get","head"],
    url: '/admin/monedas/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Monedas\Pages\CreateMoneda::__invoke
* @see app/Filament/Resources/Monedas/Pages/CreateMoneda.php:7
* @route '/admin/monedas/create'
*/
CreateMoneda.url = (options?: RouteQueryOptions) => {
    return CreateMoneda.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Monedas\Pages\CreateMoneda::__invoke
* @see app/Filament/Resources/Monedas/Pages/CreateMoneda.php:7
* @route '/admin/monedas/create'
*/
CreateMoneda.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateMoneda.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Monedas\Pages\CreateMoneda::__invoke
* @see app/Filament/Resources/Monedas/Pages/CreateMoneda.php:7
* @route '/admin/monedas/create'
*/
CreateMoneda.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: CreateMoneda.url(options),
    method: 'head',
})

/**
* @see \App\Filament\Resources\Monedas\Pages\CreateMoneda::__invoke
* @see app/Filament/Resources/Monedas/Pages/CreateMoneda.php:7
* @route '/admin/monedas/create'
*/
const CreateMonedaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CreateMoneda.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Monedas\Pages\CreateMoneda::__invoke
* @see app/Filament/Resources/Monedas/Pages/CreateMoneda.php:7
* @route '/admin/monedas/create'
*/
CreateMonedaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CreateMoneda.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Monedas\Pages\CreateMoneda::__invoke
* @see app/Filament/Resources/Monedas/Pages/CreateMoneda.php:7
* @route '/admin/monedas/create'
*/
CreateMonedaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CreateMoneda.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

CreateMoneda.form = CreateMonedaForm

export default CreateMoneda