import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::indexByPlantilla
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:62
* @route '/api/v1/plantillas/{plantilla}/productos'
*/
export const indexByPlantilla = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexByPlantilla.url(args, options),
    method: 'get',
})

indexByPlantilla.definition = {
    methods: ["get","head"],
    url: '/api/v1/plantillas/{plantilla}/productos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::indexByPlantilla
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:62
* @route '/api/v1/plantillas/{plantilla}/productos'
*/
indexByPlantilla.url = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { plantilla: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { plantilla: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            plantilla: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        plantilla: typeof args.plantilla === 'object'
        ? args.plantilla.slug
        : args.plantilla,
    }

    return indexByPlantilla.definition.url
            .replace('{plantilla}', parsedArgs.plantilla.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::indexByPlantilla
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:62
* @route '/api/v1/plantillas/{plantilla}/productos'
*/
indexByPlantilla.get = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexByPlantilla.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::indexByPlantilla
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:62
* @route '/api/v1/plantillas/{plantilla}/productos'
*/
indexByPlantilla.head = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexByPlantilla.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::indexByPlantilla
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:62
* @route '/api/v1/plantillas/{plantilla}/productos'
*/
const indexByPlantillaForm = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexByPlantilla.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::indexByPlantilla
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:62
* @route '/api/v1/plantillas/{plantilla}/productos'
*/
indexByPlantillaForm.get = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexByPlantilla.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::indexByPlantilla
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:62
* @route '/api/v1/plantillas/{plantilla}/productos'
*/
indexByPlantillaForm.head = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexByPlantilla.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

indexByPlantilla.form = indexByPlantillaForm

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::destacadosByPlantilla
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:78
* @route '/api/v1/plantillas/{plantilla}/productos/destacados'
*/
export const destacadosByPlantilla = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: destacadosByPlantilla.url(args, options),
    method: 'get',
})

destacadosByPlantilla.definition = {
    methods: ["get","head"],
    url: '/api/v1/plantillas/{plantilla}/productos/destacados',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::destacadosByPlantilla
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:78
* @route '/api/v1/plantillas/{plantilla}/productos/destacados'
*/
destacadosByPlantilla.url = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { plantilla: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { plantilla: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            plantilla: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        plantilla: typeof args.plantilla === 'object'
        ? args.plantilla.slug
        : args.plantilla,
    }

    return destacadosByPlantilla.definition.url
            .replace('{plantilla}', parsedArgs.plantilla.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::destacadosByPlantilla
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:78
* @route '/api/v1/plantillas/{plantilla}/productos/destacados'
*/
destacadosByPlantilla.get = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: destacadosByPlantilla.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::destacadosByPlantilla
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:78
* @route '/api/v1/plantillas/{plantilla}/productos/destacados'
*/
destacadosByPlantilla.head = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: destacadosByPlantilla.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::destacadosByPlantilla
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:78
* @route '/api/v1/plantillas/{plantilla}/productos/destacados'
*/
const destacadosByPlantillaForm = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: destacadosByPlantilla.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::destacadosByPlantilla
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:78
* @route '/api/v1/plantillas/{plantilla}/productos/destacados'
*/
destacadosByPlantillaForm.get = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: destacadosByPlantilla.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::destacadosByPlantilla
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:78
* @route '/api/v1/plantillas/{plantilla}/productos/destacados'
*/
destacadosByPlantillaForm.head = (args: { plantilla: string | { slug: string } } | [plantilla: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: destacadosByPlantilla.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

destacadosByPlantilla.form = destacadosByPlantillaForm

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::destacadosBySite
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:118
* @route '/api/v1/sites/{dominio}/{site}/productos/destacados'
*/
export const destacadosBySite = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: destacadosBySite.url(args, options),
    method: 'get',
})

destacadosBySite.definition = {
    methods: ["get","head"],
    url: '/api/v1/sites/{dominio}/{site}/productos/destacados',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::destacadosBySite
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:118
* @route '/api/v1/sites/{dominio}/{site}/productos/destacados'
*/
destacadosBySite.url = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            dominio: args[0],
            site: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        dominio: args.dominio,
        site: args.site,
    }

    return destacadosBySite.definition.url
            .replace('{dominio}', parsedArgs.dominio.toString())
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::destacadosBySite
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:118
* @route '/api/v1/sites/{dominio}/{site}/productos/destacados'
*/
destacadosBySite.get = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: destacadosBySite.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::destacadosBySite
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:118
* @route '/api/v1/sites/{dominio}/{site}/productos/destacados'
*/
destacadosBySite.head = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: destacadosBySite.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::destacadosBySite
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:118
* @route '/api/v1/sites/{dominio}/{site}/productos/destacados'
*/
const destacadosBySiteForm = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: destacadosBySite.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::destacadosBySite
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:118
* @route '/api/v1/sites/{dominio}/{site}/productos/destacados'
*/
destacadosBySiteForm.get = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: destacadosBySite.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::destacadosBySite
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:118
* @route '/api/v1/sites/{dominio}/{site}/productos/destacados'
*/
destacadosBySiteForm.head = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: destacadosBySite.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

destacadosBySite.form = destacadosBySiteForm

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::indexBySite
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:95
* @route '/api/v1/sites/{dominio}/{site}/productos'
*/
export const indexBySite = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexBySite.url(args, options),
    method: 'get',
})

indexBySite.definition = {
    methods: ["get","head"],
    url: '/api/v1/sites/{dominio}/{site}/productos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::indexBySite
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:95
* @route '/api/v1/sites/{dominio}/{site}/productos'
*/
indexBySite.url = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            dominio: args[0],
            site: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        dominio: args.dominio,
        site: args.site,
    }

    return indexBySite.definition.url
            .replace('{dominio}', parsedArgs.dominio.toString())
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::indexBySite
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:95
* @route '/api/v1/sites/{dominio}/{site}/productos'
*/
indexBySite.get = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexBySite.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::indexBySite
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:95
* @route '/api/v1/sites/{dominio}/{site}/productos'
*/
indexBySite.head = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexBySite.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::indexBySite
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:95
* @route '/api/v1/sites/{dominio}/{site}/productos'
*/
const indexBySiteForm = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexBySite.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::indexBySite
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:95
* @route '/api/v1/sites/{dominio}/{site}/productos'
*/
indexBySiteForm.get = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexBySite.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::indexBySite
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:95
* @route '/api/v1/sites/{dominio}/{site}/productos'
*/
indexBySiteForm.head = (args: { dominio: string | number, site: string | number } | [dominio: string | number, site: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexBySite.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

indexBySite.form = indexBySiteForm

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::index
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:16
* @route '/api/v1/productos'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/productos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::index
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:16
* @route '/api/v1/productos'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::index
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:16
* @route '/api/v1/productos'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::index
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:16
* @route '/api/v1/productos'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::index
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:16
* @route '/api/v1/productos'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::index
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:16
* @route '/api/v1/productos'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::index
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:16
* @route '/api/v1/productos'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::destacados
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:27
* @route '/api/v1/productos/destacados'
*/
export const destacados = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: destacados.url(options),
    method: 'get',
})

destacados.definition = {
    methods: ["get","head"],
    url: '/api/v1/productos/destacados',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::destacados
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:27
* @route '/api/v1/productos/destacados'
*/
destacados.url = (options?: RouteQueryOptions) => {
    return destacados.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::destacados
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:27
* @route '/api/v1/productos/destacados'
*/
destacados.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: destacados.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::destacados
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:27
* @route '/api/v1/productos/destacados'
*/
destacados.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: destacados.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::destacados
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:27
* @route '/api/v1/productos/destacados'
*/
const destacadosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: destacados.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::destacados
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:27
* @route '/api/v1/productos/destacados'
*/
destacadosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: destacados.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::destacados
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:27
* @route '/api/v1/productos/destacados'
*/
destacadosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: destacados.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

destacados.form = destacadosForm

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::show
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:142
* @route '/api/v1/productos/{producto}'
*/
export const show = (args: { producto: string | { slug: string } } | [producto: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/productos/{producto}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::show
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:142
* @route '/api/v1/productos/{producto}'
*/
show.url = (args: { producto: string | { slug: string } } | [producto: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { producto: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { producto: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            producto: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        producto: typeof args.producto === 'object'
        ? args.producto.slug
        : args.producto,
    }

    return show.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::show
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:142
* @route '/api/v1/productos/{producto}'
*/
show.get = (args: { producto: string | { slug: string } } | [producto: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::show
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:142
* @route '/api/v1/productos/{producto}'
*/
show.head = (args: { producto: string | { slug: string } } | [producto: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::show
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:142
* @route '/api/v1/productos/{producto}'
*/
const showForm = (args: { producto: string | { slug: string } } | [producto: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::show
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:142
* @route '/api/v1/productos/{producto}'
*/
showForm.get = (args: { producto: string | { slug: string } } | [producto: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::show
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:142
* @route '/api/v1/productos/{producto}'
*/
showForm.head = (args: { producto: string | { slug: string } } | [producto: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::showTienda
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:39
* @route '/api/v1/tiendas/{tienda}'
*/
export const showTienda = (args: { tienda: number | { id: number } } | [tienda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showTienda.url(args, options),
    method: 'get',
})

showTienda.definition = {
    methods: ["get","head"],
    url: '/api/v1/tiendas/{tienda}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::showTienda
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:39
* @route '/api/v1/tiendas/{tienda}'
*/
showTienda.url = (args: { tienda: number | { id: number } } | [tienda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tienda: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { tienda: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            tienda: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        tienda: typeof args.tienda === 'object'
        ? args.tienda.id
        : args.tienda,
    }

    return showTienda.definition.url
            .replace('{tienda}', parsedArgs.tienda.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::showTienda
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:39
* @route '/api/v1/tiendas/{tienda}'
*/
showTienda.get = (args: { tienda: number | { id: number } } | [tienda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showTienda.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::showTienda
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:39
* @route '/api/v1/tiendas/{tienda}'
*/
showTienda.head = (args: { tienda: number | { id: number } } | [tienda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showTienda.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::showTienda
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:39
* @route '/api/v1/tiendas/{tienda}'
*/
const showTiendaForm = (args: { tienda: number | { id: number } } | [tienda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showTienda.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::showTienda
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:39
* @route '/api/v1/tiendas/{tienda}'
*/
showTiendaForm.get = (args: { tienda: number | { id: number } } | [tienda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showTienda.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::showTienda
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:39
* @route '/api/v1/tiendas/{tienda}'
*/
showTiendaForm.head = (args: { tienda: number | { id: number } } | [tienda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showTienda.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showTienda.form = showTiendaForm

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::indexByTienda
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:50
* @route '/api/v1/tiendas/{tienda}/productos'
*/
export const indexByTienda = (args: { tienda: number | { id: number } } | [tienda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexByTienda.url(args, options),
    method: 'get',
})

indexByTienda.definition = {
    methods: ["get","head"],
    url: '/api/v1/tiendas/{tienda}/productos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::indexByTienda
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:50
* @route '/api/v1/tiendas/{tienda}/productos'
*/
indexByTienda.url = (args: { tienda: number | { id: number } } | [tienda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tienda: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { tienda: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            tienda: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        tienda: typeof args.tienda === 'object'
        ? args.tienda.id
        : args.tienda,
    }

    return indexByTienda.definition.url
            .replace('{tienda}', parsedArgs.tienda.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::indexByTienda
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:50
* @route '/api/v1/tiendas/{tienda}/productos'
*/
indexByTienda.get = (args: { tienda: number | { id: number } } | [tienda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexByTienda.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::indexByTienda
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:50
* @route '/api/v1/tiendas/{tienda}/productos'
*/
indexByTienda.head = (args: { tienda: number | { id: number } } | [tienda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexByTienda.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::indexByTienda
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:50
* @route '/api/v1/tiendas/{tienda}/productos'
*/
const indexByTiendaForm = (args: { tienda: number | { id: number } } | [tienda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexByTienda.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::indexByTienda
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:50
* @route '/api/v1/tiendas/{tienda}/productos'
*/
indexByTiendaForm.get = (args: { tienda: number | { id: number } } | [tienda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexByTienda.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::indexByTienda
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:50
* @route '/api/v1/tiendas/{tienda}/productos'
*/
indexByTiendaForm.head = (args: { tienda: number | { id: number } } | [tienda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexByTienda.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

indexByTienda.form = indexByTiendaForm

const ProductoApiController = { indexByPlantilla, destacadosByPlantilla, destacadosBySite, indexBySite, index, destacados, show, showTienda, indexByTienda }

export default ProductoApiController