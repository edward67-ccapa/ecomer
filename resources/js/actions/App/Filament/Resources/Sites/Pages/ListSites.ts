import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Sites\Pages\ListSites::__invoke
* @see app/Filament/Resources/Sites/Pages/ListSites.php:7
* @route '/admin/sites'
*/
const ListSites = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListSites.url(options),
    method: 'get',
})

ListSites.definition = {
    methods: ["get","head"],
    url: '/admin/sites',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Sites\Pages\ListSites::__invoke
* @see app/Filament/Resources/Sites/Pages/ListSites.php:7
* @route '/admin/sites'
*/
ListSites.url = (options?: RouteQueryOptions) => {
    return ListSites.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Sites\Pages\ListSites::__invoke
* @see app/Filament/Resources/Sites/Pages/ListSites.php:7
* @route '/admin/sites'
*/
ListSites.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListSites.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Sites\Pages\ListSites::__invoke
* @see app/Filament/Resources/Sites/Pages/ListSites.php:7
* @route '/admin/sites'
*/
ListSites.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ListSites.url(options),
    method: 'head',
})

/**
* @see \App\Filament\Resources\Sites\Pages\ListSites::__invoke
* @see app/Filament/Resources/Sites/Pages/ListSites.php:7
* @route '/admin/sites'
*/
const ListSitesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ListSites.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Sites\Pages\ListSites::__invoke
* @see app/Filament/Resources/Sites/Pages/ListSites.php:7
* @route '/admin/sites'
*/
ListSitesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ListSites.url(options),
    method: 'get',
})

/**
* @see \App\Filament\Resources\Sites\Pages\ListSites::__invoke
* @see app/Filament/Resources/Sites/Pages/ListSites.php:7
* @route '/admin/sites'
*/
ListSitesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ListSites.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

ListSites.form = ListSitesForm

export default ListSites