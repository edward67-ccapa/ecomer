<?php if (isset($component)) { $__componentOriginal166a02a7c5ef5a9331faf66fa665c256 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal166a02a7c5ef5a9331faf66fa665c256 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'filament-panels::components.page.index','data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('filament-panels::page'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::processComponentKey($component); ?>

    <div class="space-y-6">
        <!-- Tarjeta Principal con la URL del Sitemap -->
        <div class="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div class="space-y-1">
                    <div class="flex items-center gap-2">
                        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Gestor de Sitemap XML</h2>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400">
                            ● Generado Dinámicamente
                        </span>
                    </div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        Tu mapa del sitio se encuentra listo y optimizado para motores de búsqueda (Google, Bing, Yahoo).
                    </p>
                    <div class="pt-2 flex items-center gap-2">
                        <code class="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-amber-600 dark:text-amber-400 font-mono select-all font-semibold">
                            <?php echo e($sitemapUrl); ?>

                        </code>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <a href="<?php echo e($sitemapUrl); ?>" target="_blank" class="fi-btn fi-btn-size-md fi-btn-color-primary inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors shadow-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                        Ver sitemap.xml
                    </a>
                </div>
            </div>
        </div>

        <!-- Tabla de URLs indexadas -->
        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div>
                    <h3 class="text-base font-semibold text-gray-900 dark:text-white">URLs Indexadas en el Sitemap</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Total de <?php echo e(count($urls)); ?> URLs configuradas actualmente</p>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                    <thead class="bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <tr>
                            <th scope="col" class="px-6 py-3">URL / Dirección</th>
                            <th scope="col" class="px-6 py-3">Tipo de Contenido</th>
                            <th scope="col" class="px-6 py-3 text-center">Frecuencia</th>
                            <th scope="col" class="px-6 py-3 text-center">Prioridad SEO</th>
                            <th scope="col" class="px-6 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::openLoop(); ?><?php endif; ?><?php $__currentLoopData = $urls; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $urlItem): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::startLoopIteration(); ?><?php endif; ?>
                            <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                <td class="px-6 py-4 font-mono text-xs text-gray-900 dark:text-white font-medium">
                                    <a href="<?php echo e($urlItem['loc']); ?>" target="_blank" class="hover:underline text-amber-600 dark:text-amber-400">
                                        <?php echo e($urlItem['loc']); ?>

                                    </a>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                                        <?php echo e($urlItem['tipo']); ?>

                                    </span>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <span class="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                        <?php echo e($urlItem['changefreq']); ?>

                                    </span>
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                                        <?php echo e($urlItem['priority']); ?>

                                    </span>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <a href="<?php echo e($urlItem['loc']); ?>" target="_blank" class="text-xs font-medium text-amber-600 hover:text-amber-500 dark:text-amber-400">
                                        Visitar →
                                    </a>
                                </td>
                            </tr>
                        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::endLoop(); ?><?php endif; ?><?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::closeLoop(); ?><?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Consejos SEO -->
        <div class="p-6 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-xl">
            <div class="flex items-start gap-3">
                <svg class="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="space-y-1">
                    <h4 class="text-sm font-semibold text-gray-900 dark:text-white">¿Cómo indexar tu sitio en buscadores?</h4>
                    <p class="text-xs text-gray-600 dark:text-gray-300">
                        Copia la URL <code class="font-bold text-amber-700 dark:text-amber-400"><?php echo e($sitemapUrl); ?></code> y envíala en <strong>Google Search Console</strong> o <strong>Bing Webmaster Tools</strong> en la sección "Sitemaps" para asegurar que todos tus cambios y nuevos sitios se indexen rápidamente.
                    </p>
                </div>
            </div>
        </div>
    </div>
 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal166a02a7c5ef5a9331faf66fa665c256)): ?>
<?php $attributes = $__attributesOriginal166a02a7c5ef5a9331faf66fa665c256; ?>
<?php unset($__attributesOriginal166a02a7c5ef5a9331faf66fa665c256); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal166a02a7c5ef5a9331faf66fa665c256)): ?>
<?php $component = $__componentOriginal166a02a7c5ef5a9331faf66fa665c256; ?>
<?php unset($__componentOriginal166a02a7c5ef5a9331faf66fa665c256); ?>
<?php endif; ?>
<?php /**PATH /opt/lampp/htdocs/ecomer/resources/views/filament/pages/sitemap.blade.php ENDPATH**/ ?>