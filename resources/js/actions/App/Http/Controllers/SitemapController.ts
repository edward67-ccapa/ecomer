import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap.xml'
*/
const index8a115ddf5518c330da8983f802a6240f = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index8a115ddf5518c330da8983f802a6240f.url(options),
    method: 'get',
})

index8a115ddf5518c330da8983f802a6240f.definition = {
    methods: ["get","head"],
    url: '/sitemap.xml',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap.xml'
*/
index8a115ddf5518c330da8983f802a6240f.url = (options?: RouteQueryOptions) => {
    return index8a115ddf5518c330da8983f802a6240f.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap.xml'
*/
index8a115ddf5518c330da8983f802a6240f.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index8a115ddf5518c330da8983f802a6240f.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap.xml'
*/
index8a115ddf5518c330da8983f802a6240f.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index8a115ddf5518c330da8983f802a6240f.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap.xml'
*/
const index8a115ddf5518c330da8983f802a6240fForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index8a115ddf5518c330da8983f802a6240f.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap.xml'
*/
index8a115ddf5518c330da8983f802a6240fForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index8a115ddf5518c330da8983f802a6240f.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap.xml'
*/
index8a115ddf5518c330da8983f802a6240fForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index8a115ddf5518c330da8983f802a6240f.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index8a115ddf5518c330da8983f802a6240f.form = index8a115ddf5518c330da8983f802a6240fForm
/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap'
*/
const index54102249427a5297adbb3051d76fd6e8 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index54102249427a5297adbb3051d76fd6e8.url(options),
    method: 'get',
})

index54102249427a5297adbb3051d76fd6e8.definition = {
    methods: ["get","head"],
    url: '/sitemap',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap'
*/
index54102249427a5297adbb3051d76fd6e8.url = (options?: RouteQueryOptions) => {
    return index54102249427a5297adbb3051d76fd6e8.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap'
*/
index54102249427a5297adbb3051d76fd6e8.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index54102249427a5297adbb3051d76fd6e8.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap'
*/
index54102249427a5297adbb3051d76fd6e8.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index54102249427a5297adbb3051d76fd6e8.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap'
*/
const index54102249427a5297adbb3051d76fd6e8Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index54102249427a5297adbb3051d76fd6e8.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap'
*/
index54102249427a5297adbb3051d76fd6e8Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index54102249427a5297adbb3051d76fd6e8.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap'
*/
index54102249427a5297adbb3051d76fd6e8Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index54102249427a5297adbb3051d76fd6e8.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index54102249427a5297adbb3051d76fd6e8.form = index54102249427a5297adbb3051d76fd6e8Form
/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap_index.xml'
*/
const indexe5eec81c57d807ab088a389489f2cede = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexe5eec81c57d807ab088a389489f2cede.url(options),
    method: 'get',
})

indexe5eec81c57d807ab088a389489f2cede.definition = {
    methods: ["get","head"],
    url: '/sitemap_index.xml',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap_index.xml'
*/
indexe5eec81c57d807ab088a389489f2cede.url = (options?: RouteQueryOptions) => {
    return indexe5eec81c57d807ab088a389489f2cede.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap_index.xml'
*/
indexe5eec81c57d807ab088a389489f2cede.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexe5eec81c57d807ab088a389489f2cede.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap_index.xml'
*/
indexe5eec81c57d807ab088a389489f2cede.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexe5eec81c57d807ab088a389489f2cede.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap_index.xml'
*/
const indexe5eec81c57d807ab088a389489f2cedeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexe5eec81c57d807ab088a389489f2cede.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap_index.xml'
*/
indexe5eec81c57d807ab088a389489f2cedeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexe5eec81c57d807ab088a389489f2cede.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap_index.xml'
*/
indexe5eec81c57d807ab088a389489f2cedeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexe5eec81c57d807ab088a389489f2cede.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

indexe5eec81c57d807ab088a389489f2cede.form = indexe5eec81c57d807ab088a389489f2cedeForm
/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap.php'
*/
const indexd76b47b579e4916e9bff798c511a6c7f = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexd76b47b579e4916e9bff798c511a6c7f.url(options),
    method: 'get',
})

indexd76b47b579e4916e9bff798c511a6c7f.definition = {
    methods: ["get","head"],
    url: '/sitemap.php',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap.php'
*/
indexd76b47b579e4916e9bff798c511a6c7f.url = (options?: RouteQueryOptions) => {
    return indexd76b47b579e4916e9bff798c511a6c7f.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap.php'
*/
indexd76b47b579e4916e9bff798c511a6c7f.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexd76b47b579e4916e9bff798c511a6c7f.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap.php'
*/
indexd76b47b579e4916e9bff798c511a6c7f.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexd76b47b579e4916e9bff798c511a6c7f.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap.php'
*/
const indexd76b47b579e4916e9bff798c511a6c7fForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexd76b47b579e4916e9bff798c511a6c7f.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap.php'
*/
indexd76b47b579e4916e9bff798c511a6c7fForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexd76b47b579e4916e9bff798c511a6c7f.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SitemapController::index
* @see app/Http/Controllers/SitemapController.php:10
* @route '/sitemap.php'
*/
indexd76b47b579e4916e9bff798c511a6c7fForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexd76b47b579e4916e9bff798c511a6c7f.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

indexd76b47b579e4916e9bff798c511a6c7f.form = indexd76b47b579e4916e9bff798c511a6c7fForm

/**
* Multiple routes resolve to \App\Http\Controllers\SitemapController::index, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `index['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const index = {
    '/sitemap.xml': index8a115ddf5518c330da8983f802a6240f,
    '/sitemap': index54102249427a5297adbb3051d76fd6e8,
    '/sitemap_index.xml': indexe5eec81c57d807ab088a389489f2cede,
    '/sitemap.php': indexd76b47b579e4916e9bff798c511a6c7f,
}

const SitemapController = { index }

export default SitemapController