import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Colores\Pages\CreateColor::__invoke
* @see app/Filament/Resources/Colores/Pages/CreateColor.php:7
* @route '/admin/colores/create'
*/
const CreateColor = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateColor.url(options),
    method: 'get',
})

CreateColor.definition = {
    methods: ["get","head"],
    url: '/admin/colores/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Colores\Pages\CreateColor::__invoke
* @see app/Filament/Resources/Colores/Pages/CreateColor.php:7
* @route '/admin/colores/create'
*/
CreateColor.url = (options?: RouteQueryOptions) => {
    return CreateColor.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Colores\Pages\CreateColor::__invoke
* @see app/Filament/Resources/Colores/Pages/CreateColor.php:7
* @route '/admin/colores/create'
*/
CreateColor.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateColor.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Colores\Pages\CreateColor::__invoke
* @see app/Filament/Resources/Colores/Pages/CreateColor.php:7
* @route '/admin/colores/create'
*/
CreateColor.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: CreateColor.url(options),
    method: 'head',
})

/**
* @see \App\Filament\Resources\Colores\Pages\CreateColor::__invoke
* @see app/Filament/Resources/Colores/Pages/CreateColor.php:7
* @route '/admin/colores/create'
*/
const CreateColorForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CreateColor.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Colores\Pages\CreateColor::__invoke
* @see app/Filament/Resources/Colores/Pages/CreateColor.php:7
* @route '/admin/colores/create'
*/
CreateColorForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CreateColor.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Colores\Pages\CreateColor::__invoke
* @see app/Filament/Resources/Colores/Pages/CreateColor.php:7
* @route '/admin/colores/create'
*/
CreateColorForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CreateColor.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

CreateColor.form = CreateColorForm

export default CreateColor