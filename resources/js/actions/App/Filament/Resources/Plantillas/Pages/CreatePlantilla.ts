import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Plantillas\Pages\CreatePlantilla::__invoke
* @see app/Filament/Resources/Plantillas/Pages/CreatePlantilla.php:7
* @route '/admin/plantillas/create'
*/
const CreatePlantilla = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreatePlantilla.url(options),
    method: 'get',
})

CreatePlantilla.definition = {
    methods: ["get","head"],
    url: '/admin/plantillas/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Plantillas\Pages\CreatePlantilla::__invoke
* @see app/Filament/Resources/Plantillas/Pages/CreatePlantilla.php:7
* @route '/admin/plantillas/create'
*/
CreatePlantilla.url = (options?: RouteQueryOptions) => {
    return CreatePlantilla.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Plantillas\Pages\CreatePlantilla::__invoke
* @see app/Filament/Resources/Plantillas/Pages/CreatePlantilla.php:7
* @route '/admin/plantillas/create'
*/
CreatePlantilla.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreatePlantilla.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Plantillas\Pages\CreatePlantilla::__invoke
* @see app/Filament/Resources/Plantillas/Pages/CreatePlantilla.php:7
* @route '/admin/plantillas/create'
*/
CreatePlantilla.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: CreatePlantilla.url(options),
    method: 'head',
})

/**
* @see \App\Filament\Resources\Plantillas\Pages\CreatePlantilla::__invoke
* @see app/Filament/Resources/Plantillas/Pages/CreatePlantilla.php:7
* @route '/admin/plantillas/create'
*/
const CreatePlantillaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CreatePlantilla.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Plantillas\Pages\CreatePlantilla::__invoke
* @see app/Filament/Resources/Plantillas/Pages/CreatePlantilla.php:7
* @route '/admin/plantillas/create'
*/
CreatePlantillaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CreatePlantilla.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Plantillas\Pages\CreatePlantilla::__invoke
* @see app/Filament/Resources/Plantillas/Pages/CreatePlantilla.php:7
* @route '/admin/plantillas/create'
*/
CreatePlantillaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CreatePlantilla.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

CreatePlantilla.form = CreatePlantillaForm

export default CreatePlantilla