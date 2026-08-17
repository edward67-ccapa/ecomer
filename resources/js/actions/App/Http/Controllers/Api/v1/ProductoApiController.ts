import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::showTienda
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:14
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
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:14
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
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:14
* @route '/api/v1/tiendas/{tienda}'
*/
showTienda.get = (args: { tienda: number | { id: number } } | [tienda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showTienda.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::showTienda
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:14
* @route '/api/v1/tiendas/{tienda}'
*/
showTienda.head = (args: { tienda: number | { id: number } } | [tienda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showTienda.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::showTienda
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:14
* @route '/api/v1/tiendas/{tienda}'
*/
const showTiendaForm = (args: { tienda: number | { id: number } } | [tienda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showTienda.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::showTienda
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:14
* @route '/api/v1/tiendas/{tienda}'
*/
showTiendaForm.get = (args: { tienda: number | { id: number } } | [tienda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showTienda.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::showTienda
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:14
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
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:25
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
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:25
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
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:25
* @route '/api/v1/tiendas/{tienda}/productos'
*/
indexByTienda.get = (args: { tienda: number | { id: number } } | [tienda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexByTienda.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::indexByTienda
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:25
* @route '/api/v1/tiendas/{tienda}/productos'
*/
indexByTienda.head = (args: { tienda: number | { id: number } } | [tienda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexByTienda.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::indexByTienda
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:25
* @route '/api/v1/tiendas/{tienda}/productos'
*/
const indexByTiendaForm = (args: { tienda: number | { id: number } } | [tienda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexByTienda.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::indexByTienda
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:25
* @route '/api/v1/tiendas/{tienda}/productos'
*/
indexByTiendaForm.get = (args: { tienda: number | { id: number } } | [tienda: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexByTienda.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::indexByTienda
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:25
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

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::show
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:36
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
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:36
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
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:36
* @route '/api/v1/productos/{producto}'
*/
show.get = (args: { producto: string | { slug: string } } | [producto: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::show
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:36
* @route '/api/v1/productos/{producto}'
*/
show.head = (args: { producto: string | { slug: string } } | [producto: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::show
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:36
* @route '/api/v1/productos/{producto}'
*/
const showForm = (args: { producto: string | { slug: string } } | [producto: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::show
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:36
* @route '/api/v1/productos/{producto}'
*/
showForm.get = (args: { producto: string | { slug: string } } | [producto: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\ProductoApiController::show
* @see app/Http/Controllers/Api/v1/ProductoApiController.php:36
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

const ProductoApiController = { showTienda, indexByTienda, show }

export default ProductoApiController