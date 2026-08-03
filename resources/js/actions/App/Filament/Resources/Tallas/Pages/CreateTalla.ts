import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Tallas\Pages\CreateTalla::__invoke
* @see app/Filament/Resources/Tallas/Pages/CreateTalla.php:7
* @route '/admin/tallas/create'
*/
const CreateTalla = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateTalla.url(options),
    method: 'get',
})

CreateTalla.definition = {
    methods: ["get","head"],
    url: '/admin/tallas/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Tallas\Pages\CreateTalla::__invoke
* @see app/Filament/Resources/Tallas/Pages/CreateTalla.php:7
* @route '/admin/tallas/create'
*/
CreateTalla.url = (options?: RouteQueryOptions) => {
    return CreateTalla.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Tallas\Pages\CreateTalla::__invoke
* @see app/Filament/Resources/Tallas/Pages/CreateTalla.php:7
* @route '/admin/tallas/create'
*/
CreateTalla.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateTalla.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Tallas\Pages\CreateTalla::__invoke
* @see app/Filament/Resources/Tallas/Pages/CreateTalla.php:7
* @route '/admin/tallas/create'
*/
CreateTalla.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: CreateTalla.url(options),
    method: 'head',
})

/**
* @see \App\Filament\Resources\Tallas\Pages\CreateTalla::__invoke
* @see app/Filament/Resources/Tallas/Pages/CreateTalla.php:7
* @route '/admin/tallas/create'
*/
const CreateTallaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CreateTalla.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Tallas\Pages\CreateTalla::__invoke
* @see app/Filament/Resources/Tallas/Pages/CreateTalla.php:7
* @route '/admin/tallas/create'
*/
CreateTallaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CreateTalla.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Tallas\Pages\CreateTalla::__invoke
* @see app/Filament/Resources/Tallas/Pages/CreateTalla.php:7
* @route '/admin/tallas/create'
*/
CreateTallaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CreateTalla.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

CreateTalla.form = CreateTallaForm

export default CreateTalla