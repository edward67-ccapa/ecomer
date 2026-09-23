import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SitePageController::descargarCatalogo
 * @see app/Http/Controllers/SitePageController.php:373
 * @route '/{param1}/{param2}/catalogo/descargar-pdf'
 */
const descargarCatalogobeeae37e65ef939033903be744aedb4c = (args: { param1: string | number, param2: string | number } | [param1: string | number, param2: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargarCatalogobeeae37e65ef939033903be744aedb4c.url(args, options),
    method: 'get',
})

descargarCatalogobeeae37e65ef939033903be744aedb4c.definition = {
    methods: ["get","head"],
    url: '/{param1}/{param2}/catalogo/descargar-pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SitePageController::descargarCatalogo
 * @see app/Http/Controllers/SitePageController.php:373
 * @route '/{param1}/{param2}/catalogo/descargar-pdf'
 */
descargarCatalogobeeae37e65ef939033903be744aedb4c.url = (args: { param1: string | number, param2: string | number } | [param1: string | number, param2: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    param1: args[0],
                    param2: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        param1: args.param1,
                                param2: args.param2,
                }

    return descargarCatalogobeeae37e65ef939033903be744aedb4c.definition.url
            .replace('{param1}', parsedArgs.param1.toString())
            .replace('{param2}', parsedArgs.param2.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SitePageController::descargarCatalogo
 * @see app/Http/Controllers/SitePageController.php:373
 * @route '/{param1}/{param2}/catalogo/descargar-pdf'
 */
descargarCatalogobeeae37e65ef939033903be744aedb4c.get = (args: { param1: string | number, param2: string | number } | [param1: string | number, param2: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargarCatalogobeeae37e65ef939033903be744aedb4c.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SitePageController::descargarCatalogo
 * @see app/Http/Controllers/SitePageController.php:373
 * @route '/{param1}/{param2}/catalogo/descargar-pdf'
 */
descargarCatalogobeeae37e65ef939033903be744aedb4c.head = (args: { param1: string | number, param2: string | number } | [param1: string | number, param2: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: descargarCatalogobeeae37e65ef939033903be744aedb4c.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SitePageController::descargarCatalogo
 * @see app/Http/Controllers/SitePageController.php:373
 * @route '/{param1}/{param2}/catalogo/descargar-pdf'
 */
    const descargarCatalogobeeae37e65ef939033903be744aedb4cForm = (args: { param1: string | number, param2: string | number } | [param1: string | number, param2: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: descargarCatalogobeeae37e65ef939033903be744aedb4c.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SitePageController::descargarCatalogo
 * @see app/Http/Controllers/SitePageController.php:373
 * @route '/{param1}/{param2}/catalogo/descargar-pdf'
 */
        descargarCatalogobeeae37e65ef939033903be744aedb4cForm.get = (args: { param1: string | number, param2: string | number } | [param1: string | number, param2: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: descargarCatalogobeeae37e65ef939033903be744aedb4c.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SitePageController::descargarCatalogo
 * @see app/Http/Controllers/SitePageController.php:373
 * @route '/{param1}/{param2}/catalogo/descargar-pdf'
 */
        descargarCatalogobeeae37e65ef939033903be744aedb4cForm.head = (args: { param1: string | number, param2: string | number } | [param1: string | number, param2: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: descargarCatalogobeeae37e65ef939033903be744aedb4c.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    descargarCatalogobeeae37e65ef939033903be744aedb4c.form = descargarCatalogobeeae37e65ef939033903be744aedb4cForm
    /**
* @see \App\Http\Controllers\SitePageController::descargarCatalogo
 * @see app/Http/Controllers/SitePageController.php:373
 * @route '/{dominio}/catalogo/descargar-pdf'
 */
const descargarCatalogoa0db0def83886227f6725985f3117c4e = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargarCatalogoa0db0def83886227f6725985f3117c4e.url(args, options),
    method: 'get',
})

descargarCatalogoa0db0def83886227f6725985f3117c4e.definition = {
    methods: ["get","head"],
    url: '/{dominio}/catalogo/descargar-pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SitePageController::descargarCatalogo
 * @see app/Http/Controllers/SitePageController.php:373
 * @route '/{dominio}/catalogo/descargar-pdf'
 */
descargarCatalogoa0db0def83886227f6725985f3117c4e.url = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { dominio: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    dominio: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        dominio: args.dominio,
                }

    return descargarCatalogoa0db0def83886227f6725985f3117c4e.definition.url
            .replace('{dominio}', parsedArgs.dominio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SitePageController::descargarCatalogo
 * @see app/Http/Controllers/SitePageController.php:373
 * @route '/{dominio}/catalogo/descargar-pdf'
 */
descargarCatalogoa0db0def83886227f6725985f3117c4e.get = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargarCatalogoa0db0def83886227f6725985f3117c4e.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SitePageController::descargarCatalogo
 * @see app/Http/Controllers/SitePageController.php:373
 * @route '/{dominio}/catalogo/descargar-pdf'
 */
descargarCatalogoa0db0def83886227f6725985f3117c4e.head = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: descargarCatalogoa0db0def83886227f6725985f3117c4e.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SitePageController::descargarCatalogo
 * @see app/Http/Controllers/SitePageController.php:373
 * @route '/{dominio}/catalogo/descargar-pdf'
 */
    const descargarCatalogoa0db0def83886227f6725985f3117c4eForm = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: descargarCatalogoa0db0def83886227f6725985f3117c4e.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SitePageController::descargarCatalogo
 * @see app/Http/Controllers/SitePageController.php:373
 * @route '/{dominio}/catalogo/descargar-pdf'
 */
        descargarCatalogoa0db0def83886227f6725985f3117c4eForm.get = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: descargarCatalogoa0db0def83886227f6725985f3117c4e.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SitePageController::descargarCatalogo
 * @see app/Http/Controllers/SitePageController.php:373
 * @route '/{dominio}/catalogo/descargar-pdf'
 */
        descargarCatalogoa0db0def83886227f6725985f3117c4eForm.head = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: descargarCatalogoa0db0def83886227f6725985f3117c4e.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    descargarCatalogoa0db0def83886227f6725985f3117c4e.form = descargarCatalogoa0db0def83886227f6725985f3117c4eForm

/**
* Multiple routes resolve to \App\Http\Controllers\SitePageController::descargarCatalogo, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `descargarCatalogo['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const descargarCatalogo = {
    '/{param1}/{param2}/catalogo/descargar-pdf': descargarCatalogobeeae37e65ef939033903be744aedb4c,
    '/{dominio}/catalogo/descargar-pdf': descargarCatalogoa0db0def83886227f6725985f3117c4e,
}

/**
* @see \App\Http\Controllers\SitePageController::show
 * @see app/Http/Controllers/SitePageController.php:37
 * @route '/{param1}/{param2}/{param3}'
 */
const show0eafefde54f71dc0248fbeba8012a228 = (args: { param1: string | number, param2: string | number, param3: string | number } | [param1: string | number, param2: string | number, param3: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show0eafefde54f71dc0248fbeba8012a228.url(args, options),
    method: 'get',
})

show0eafefde54f71dc0248fbeba8012a228.definition = {
    methods: ["get","head"],
    url: '/{param1}/{param2}/{param3}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SitePageController::show
 * @see app/Http/Controllers/SitePageController.php:37
 * @route '/{param1}/{param2}/{param3}'
 */
show0eafefde54f71dc0248fbeba8012a228.url = (args: { param1: string | number, param2: string | number, param3: string | number } | [param1: string | number, param2: string | number, param3: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    param1: args[0],
                    param2: args[1],
                    param3: args[2],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        param1: args.param1,
                                param2: args.param2,
                                param3: args.param3,
                }

    return show0eafefde54f71dc0248fbeba8012a228.definition.url
            .replace('{param1}', parsedArgs.param1.toString())
            .replace('{param2}', parsedArgs.param2.toString())
            .replace('{param3}', parsedArgs.param3.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SitePageController::show
 * @see app/Http/Controllers/SitePageController.php:37
 * @route '/{param1}/{param2}/{param3}'
 */
show0eafefde54f71dc0248fbeba8012a228.get = (args: { param1: string | number, param2: string | number, param3: string | number } | [param1: string | number, param2: string | number, param3: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show0eafefde54f71dc0248fbeba8012a228.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SitePageController::show
 * @see app/Http/Controllers/SitePageController.php:37
 * @route '/{param1}/{param2}/{param3}'
 */
show0eafefde54f71dc0248fbeba8012a228.head = (args: { param1: string | number, param2: string | number, param3: string | number } | [param1: string | number, param2: string | number, param3: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show0eafefde54f71dc0248fbeba8012a228.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SitePageController::show
 * @see app/Http/Controllers/SitePageController.php:37
 * @route '/{param1}/{param2}/{param3}'
 */
    const show0eafefde54f71dc0248fbeba8012a228Form = (args: { param1: string | number, param2: string | number, param3: string | number } | [param1: string | number, param2: string | number, param3: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show0eafefde54f71dc0248fbeba8012a228.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SitePageController::show
 * @see app/Http/Controllers/SitePageController.php:37
 * @route '/{param1}/{param2}/{param3}'
 */
        show0eafefde54f71dc0248fbeba8012a228Form.get = (args: { param1: string | number, param2: string | number, param3: string | number } | [param1: string | number, param2: string | number, param3: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show0eafefde54f71dc0248fbeba8012a228.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SitePageController::show
 * @see app/Http/Controllers/SitePageController.php:37
 * @route '/{param1}/{param2}/{param3}'
 */
        show0eafefde54f71dc0248fbeba8012a228Form.head = (args: { param1: string | number, param2: string | number, param3: string | number } | [param1: string | number, param2: string | number, param3: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show0eafefde54f71dc0248fbeba8012a228.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show0eafefde54f71dc0248fbeba8012a228.form = show0eafefde54f71dc0248fbeba8012a228Form
    /**
* @see \App\Http\Controllers\SitePageController::show
 * @see app/Http/Controllers/SitePageController.php:37
 * @route '/{dominio}/{seccion}'
 */
const show0001254fc6f9d86a3e515c910343db99 = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show0001254fc6f9d86a3e515c910343db99.url(args, options),
    method: 'get',
})

show0001254fc6f9d86a3e515c910343db99.definition = {
    methods: ["get","head"],
    url: '/{dominio}/{seccion}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SitePageController::show
 * @see app/Http/Controllers/SitePageController.php:37
 * @route '/{dominio}/{seccion}'
 */
show0001254fc6f9d86a3e515c910343db99.url = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    dominio: args[0],
                    seccion: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        dominio: args.dominio,
                                seccion: args.seccion,
                }

    return show0001254fc6f9d86a3e515c910343db99.definition.url
            .replace('{dominio}', parsedArgs.dominio.toString())
            .replace('{seccion}', parsedArgs.seccion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SitePageController::show
 * @see app/Http/Controllers/SitePageController.php:37
 * @route '/{dominio}/{seccion}'
 */
show0001254fc6f9d86a3e515c910343db99.get = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show0001254fc6f9d86a3e515c910343db99.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SitePageController::show
 * @see app/Http/Controllers/SitePageController.php:37
 * @route '/{dominio}/{seccion}'
 */
show0001254fc6f9d86a3e515c910343db99.head = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show0001254fc6f9d86a3e515c910343db99.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SitePageController::show
 * @see app/Http/Controllers/SitePageController.php:37
 * @route '/{dominio}/{seccion}'
 */
    const show0001254fc6f9d86a3e515c910343db99Form = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show0001254fc6f9d86a3e515c910343db99.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SitePageController::show
 * @see app/Http/Controllers/SitePageController.php:37
 * @route '/{dominio}/{seccion}'
 */
        show0001254fc6f9d86a3e515c910343db99Form.get = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show0001254fc6f9d86a3e515c910343db99.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SitePageController::show
 * @see app/Http/Controllers/SitePageController.php:37
 * @route '/{dominio}/{seccion}'
 */
        show0001254fc6f9d86a3e515c910343db99Form.head = (args: { dominio: string | number, seccion: string | number } | [dominio: string | number, seccion: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show0001254fc6f9d86a3e515c910343db99.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show0001254fc6f9d86a3e515c910343db99.form = show0001254fc6f9d86a3e515c910343db99Form

/**
* Multiple routes resolve to \App\Http\Controllers\SitePageController::show, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `show['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const show = {
    '/{param1}/{param2}/{param3}': show0eafefde54f71dc0248fbeba8012a228,
    '/{dominio}/{seccion}': show0001254fc6f9d86a3e515c910343db99,
}

/**
* @see \App\Http\Controllers\SitePageController::redirectToFirst
 * @see app/Http/Controllers/SitePageController.php:19
 * @route '/{dominio}'
 */
export const redirectToFirst = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirectToFirst.url(args, options),
    method: 'get',
})

redirectToFirst.definition = {
    methods: ["get","head"],
    url: '/{dominio}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SitePageController::redirectToFirst
 * @see app/Http/Controllers/SitePageController.php:19
 * @route '/{dominio}'
 */
redirectToFirst.url = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { dominio: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    dominio: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        dominio: args.dominio,
                }

    return redirectToFirst.definition.url
            .replace('{dominio}', parsedArgs.dominio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SitePageController::redirectToFirst
 * @see app/Http/Controllers/SitePageController.php:19
 * @route '/{dominio}'
 */
redirectToFirst.get = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirectToFirst.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SitePageController::redirectToFirst
 * @see app/Http/Controllers/SitePageController.php:19
 * @route '/{dominio}'
 */
redirectToFirst.head = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: redirectToFirst.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SitePageController::redirectToFirst
 * @see app/Http/Controllers/SitePageController.php:19
 * @route '/{dominio}'
 */
    const redirectToFirstForm = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: redirectToFirst.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SitePageController::redirectToFirst
 * @see app/Http/Controllers/SitePageController.php:19
 * @route '/{dominio}'
 */
        redirectToFirstForm.get = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: redirectToFirst.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SitePageController::redirectToFirst
 * @see app/Http/Controllers/SitePageController.php:19
 * @route '/{dominio}'
 */
        redirectToFirstForm.head = (args: { dominio: string | number } | [dominio: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: redirectToFirst.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    redirectToFirst.form = redirectToFirstForm
const SitePageController = { descargarCatalogo, show, redirectToFirst }

export default SitePageController