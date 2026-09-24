import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Sites\Pages\CreateSite::__invoke
* @see app/Filament/Resources/Sites/Pages/CreateSite.php:7
* @route '/admin/sites/create'
*/
const CreateSite = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateSite.url(options),
    method: 'get',
})

CreateSite.definition = {
    methods: ["get","head"],
    url: '/admin/sites/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Sites\Pages\CreateSite::__invoke
* @see app/Filament/Resources/Sites/Pages/CreateSite.php:7
* @route '/admin/sites/create'
*/
CreateSite.url = (options?: RouteQueryOptions) => {
    return CreateSite.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Sites\Pages\CreateSite::__invoke
* @see app/Filament/Resources/Sites/Pages/CreateSite.php:7
* @route '/admin/sites/create'
*/
CreateSite.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateSite.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Sites\Pages\CreateSite::__invoke
* @see app/Filament/Resources/Sites/Pages/CreateSite.php:7
* @route '/admin/sites/create'
*/
CreateSite.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: CreateSite.url(options),
    method: 'head',
})

/**
* @see \App\Filament\Resources\Sites\Pages\CreateSite::__invoke
* @see app/Filament/Resources/Sites/Pages/CreateSite.php:7
* @route '/admin/sites/create'
*/
const CreateSiteForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CreateSite.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Sites\Pages\CreateSite::__invoke
* @see app/Filament/Resources/Sites/Pages/CreateSite.php:7
* @route '/admin/sites/create'
*/
CreateSiteForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CreateSite.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Sites\Pages\CreateSite::__invoke
* @see app/Filament/Resources/Sites/Pages/CreateSite.php:7
* @route '/admin/sites/create'
*/
CreateSiteForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: CreateSite.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

CreateSite.form = CreateSiteForm

export default CreateSite