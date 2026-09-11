import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Servicios\Pages\ListServicios::__invoke
 * @see app/Filament/Resources/Servicios/Pages/ListServicios.php:7
 * @route '/admin/servicios'
 */
const ListServicios = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListServicios.url(options),
    method: 'get',
})

ListServicios.definition = {
    methods: ["get","head"],
    url: '/admin/servicios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Servicios\Pages\ListServicios::__invoke
 * @see app/Filament/Resources/Servicios/Pages/ListServicios.php:7
 * @route '/admin/servicios'
 */
ListServicios.url = (options?: RouteQueryOptions) => {
    return ListServicios.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Servicios\Pages\ListServicios::__invoke
 * @see app/Filament/Resources/Servicios/Pages/ListServicios.php:7
 * @route '/admin/servicios'
 */
ListServicios.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListServicios.url(options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\Servicios\Pages\ListServicios::__invoke
 * @see app/Filament/Resources/Servicios/Pages/ListServicios.php:7
 * @route '/admin/servicios'
 */
ListServicios.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ListServicios.url(options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\Servicios\Pages\ListServicios::__invoke
 * @see app/Filament/Resources/Servicios/Pages/ListServicios.php:7
 * @route '/admin/servicios'
 */
    const ListServiciosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ListServicios.url(options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\Servicios\Pages\ListServicios::__invoke
 * @see app/Filament/Resources/Servicios/Pages/ListServicios.php:7
 * @route '/admin/servicios'
 */
        ListServiciosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ListServicios.url(options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\Servicios\Pages\ListServicios::__invoke
 * @see app/Filament/Resources/Servicios/Pages/ListServicios.php:7
 * @route '/admin/servicios'
 */
        ListServiciosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ListServicios.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ListServicios.form = ListServiciosForm
export default ListServicios