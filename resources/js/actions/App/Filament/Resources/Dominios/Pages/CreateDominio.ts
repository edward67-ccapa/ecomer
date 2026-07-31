import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Dominios\Pages\CreateDominio::__invoke
* @see app/Filament/Resources/Dominios/Pages/CreateDominio.php:7
* @route '/admin/dominios/create'
*/
const CreateDominio = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateDominio.url(options),
    method: 'get',
})

CreateDominio.definition = {
    methods: ["get","head"],
    url: '/admin/dominios/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Dominios\Pages\CreateDominio::__invoke
* @see app/Filament/Resources/Dominios/Pages/CreateDominio.php:7
* @route '/admin/dominios/create'
*/
CreateDominio.url = (options?: RouteQueryOptions) => {
    return CreateDominio.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Dominios\Pages\CreateDominio::__invoke
* @see app/Filament/Resources/Dominios/Pages/CreateDominio.php:7
* @route '/admin/dominios/create'
*/
CreateDominio.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateDominio.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Dominios\Pages\CreateDominio::__invoke
* @see app/Filament/Resources/Dominios/Pages/CreateDominio.php:7
* @route '/admin/dominios/create'
*/
CreateDominio.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: CreateDominio.url(options),
    method: 'head',
})

/**
* @see \App\Filament\Resources\Dominios\Pages\CreateDominio::__invoke
* @see app/Filament/Resources/Dominios/Pages/CreateDominio.php:7
* @route '/admin/dominios/create'
*/
const CreateDominioForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CreateDominio.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Dominios\Pages\CreateDominio::__invoke
* @see app/Filament/Resources/Dominios/Pages/CreateDominio.php:7
* @route '/admin/dominios/create'
*/
CreateDominioForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CreateDominio.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Dominios\Pages\CreateDominio::__invoke
* @see app/Filament/Resources/Dominios/Pages/CreateDominio.php:7
* @route '/admin/dominios/create'
*/
CreateDominioForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CreateDominio.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

CreateDominio.form = CreateDominioForm

export default CreateDominio