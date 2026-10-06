import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\v1\TikTokApiController::oembed
* @see app/Http/Controllers/Api/v1/TikTokApiController.php:17
* @route '/api/v1/tiktok-oembed'
*/
const oembed37225db75fc0647542ccba7d49d1f4af = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: oembed37225db75fc0647542ccba7d49d1f4af.url(options),
    method: 'get',
})

oembed37225db75fc0647542ccba7d49d1f4af.definition = {
    methods: ["get","head"],
    url: '/api/v1/tiktok-oembed',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\v1\TikTokApiController::oembed
* @see app/Http/Controllers/Api/v1/TikTokApiController.php:17
* @route '/api/v1/tiktok-oembed'
*/
oembed37225db75fc0647542ccba7d49d1f4af.url = (options?: RouteQueryOptions) => {
    return oembed37225db75fc0647542ccba7d49d1f4af.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\v1\TikTokApiController::oembed
* @see app/Http/Controllers/Api/v1/TikTokApiController.php:17
* @route '/api/v1/tiktok-oembed'
*/
oembed37225db75fc0647542ccba7d49d1f4af.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: oembed37225db75fc0647542ccba7d49d1f4af.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\TikTokApiController::oembed
* @see app/Http/Controllers/Api/v1/TikTokApiController.php:17
* @route '/api/v1/tiktok-oembed'
*/
oembed37225db75fc0647542ccba7d49d1f4af.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: oembed37225db75fc0647542ccba7d49d1f4af.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\v1\TikTokApiController::oembed
* @see app/Http/Controllers/Api/v1/TikTokApiController.php:17
* @route '/api/v1/tiktok-oembed'
*/
const oembed37225db75fc0647542ccba7d49d1f4afForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: oembed37225db75fc0647542ccba7d49d1f4af.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\TikTokApiController::oembed
* @see app/Http/Controllers/Api/v1/TikTokApiController.php:17
* @route '/api/v1/tiktok-oembed'
*/
oembed37225db75fc0647542ccba7d49d1f4afForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: oembed37225db75fc0647542ccba7d49d1f4af.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\TikTokApiController::oembed
* @see app/Http/Controllers/Api/v1/TikTokApiController.php:17
* @route '/api/v1/tiktok-oembed'
*/
oembed37225db75fc0647542ccba7d49d1f4afForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: oembed37225db75fc0647542ccba7d49d1f4af.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

oembed37225db75fc0647542ccba7d49d1f4af.form = oembed37225db75fc0647542ccba7d49d1f4afForm
/**
* @see \App\Http\Controllers\Api\v1\TikTokApiController::oembed
* @see app/Http/Controllers/Api/v1/TikTokApiController.php:17
* @route '/api/tiktok-oembed'
*/
const oembed4e5421b5155041cc533542d9d2870ca6 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: oembed4e5421b5155041cc533542d9d2870ca6.url(options),
    method: 'get',
})

oembed4e5421b5155041cc533542d9d2870ca6.definition = {
    methods: ["get","head"],
    url: '/api/tiktok-oembed',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\v1\TikTokApiController::oembed
* @see app/Http/Controllers/Api/v1/TikTokApiController.php:17
* @route '/api/tiktok-oembed'
*/
oembed4e5421b5155041cc533542d9d2870ca6.url = (options?: RouteQueryOptions) => {
    return oembed4e5421b5155041cc533542d9d2870ca6.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\v1\TikTokApiController::oembed
* @see app/Http/Controllers/Api/v1/TikTokApiController.php:17
* @route '/api/tiktok-oembed'
*/
oembed4e5421b5155041cc533542d9d2870ca6.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: oembed4e5421b5155041cc533542d9d2870ca6.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\TikTokApiController::oembed
* @see app/Http/Controllers/Api/v1/TikTokApiController.php:17
* @route '/api/tiktok-oembed'
*/
oembed4e5421b5155041cc533542d9d2870ca6.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: oembed4e5421b5155041cc533542d9d2870ca6.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\v1\TikTokApiController::oembed
* @see app/Http/Controllers/Api/v1/TikTokApiController.php:17
* @route '/api/tiktok-oembed'
*/
const oembed4e5421b5155041cc533542d9d2870ca6Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: oembed4e5421b5155041cc533542d9d2870ca6.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\TikTokApiController::oembed
* @see app/Http/Controllers/Api/v1/TikTokApiController.php:17
* @route '/api/tiktok-oembed'
*/
oembed4e5421b5155041cc533542d9d2870ca6Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: oembed4e5421b5155041cc533542d9d2870ca6.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\v1\TikTokApiController::oembed
* @see app/Http/Controllers/Api/v1/TikTokApiController.php:17
* @route '/api/tiktok-oembed'
*/
oembed4e5421b5155041cc533542d9d2870ca6Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: oembed4e5421b5155041cc533542d9d2870ca6.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

oembed4e5421b5155041cc533542d9d2870ca6.form = oembed4e5421b5155041cc533542d9d2870ca6Form

/**
* Multiple routes resolve to \App\Http\Controllers\Api\v1\TikTokApiController::oembed, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `oembed['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const oembed = {
    '/api/v1/tiktok-oembed': oembed37225db75fc0647542ccba7d49d1f4af,
    '/api/tiktok-oembed': oembed4e5421b5155041cc533542d9d2870ca6,
}

const TikTokApiController = { oembed }

export default TikTokApiController