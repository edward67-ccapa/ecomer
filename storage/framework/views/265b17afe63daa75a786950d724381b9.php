<?php
    $statePath = $getStatePath();
?>

<?php if (isset($component)) { $__componentOriginal511d4862ff04963c3c16115c05a86a9d = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal511d4862ff04963c3c16115c05a86a9d = $attributes; } ?>
<?php $component = Illuminate\View\DynamicComponent::resolve(['component' => $getFieldWrapperView()] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('dynamic-component'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\DynamicComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['field' => $field]); ?>
<?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::processComponentKey($component); ?>

    <div
        x-data="{
            open: false,
            state: $wire.<?php echo e($applyStateBindingModifiers("\$entangle('{$statePath}')")); ?>,
            toggle() {
                this.open = !this.open;
                if (this.open) {
                    $nextTick(() => {
                        if (this.$refs.urlInput) {
                            this.$refs.urlInput.focus();
                        }
                    });
                }
            },
            setUrl(val) {
                const newVal = (val && val.trim() !== '') ? val.trim() : null;
                this.state = newVal;
            },
            clearUrl() {
                this.state = null;
                this.open = false;
            }
        }"
        class="relative inline-block mt-1"
        @click.outside="open = false"
    >
        <!-- BOTÓN DE ENLACE COMPACTO -->
        <div class="flex items-center gap-2">
            <button
                type="button"
                @click="toggle()"
                :class="{
                    'bg-primary-50 dark:bg-primary-950/60 border-primary-500 text-primary-600 dark:text-primary-400 font-semibold shadow-sm': state,
                    'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400 hover:text-gray-900 dark:hover:text-white': !state
                }"
                class="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-xl border transition cursor-pointer"
            >
                <span x-text="state ? '🔗 Enlace configurado' : '🔗 Agregar enlace'"></span>
            </button>

            <!-- Quitar enlace (100% Front-end puro, 0ms, sin llamadas HTTP al servidor) -->
            <template x-if="state">
                <button
                    type="button"
                    @click.prevent.stop="clearUrl()"
                    class="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition cursor-pointer"
                    title="Quitar enlace"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </template>
        </div>

        <!-- POPOVER FLOTANTE ABSOLUTO -->
        <template x-if="open">
            <div
                x-transition:enter="transition ease-out duration-100"
                x-transition:enter-start="opacity-0 scale-95"
                x-transition:enter-end="opacity-100 scale-100"
                x-transition:leave="transition ease-in duration-75"
                x-transition:leave-start="opacity-100 scale-100"
                x-transition:leave-end="opacity-0 scale-95"
                class="absolute left-0 top-full mt-2 w-[280px] sm:w-[340px] z-50 p-3.5 border rounded-2xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-2xl space-y-3"
            >
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-gray-800 dark:text-gray-200">🔗 Configurar Enlace (URL)</span>
                    <button type="button" @click="open = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs p-1">✕</button>
                </div>

                <input
                    type="text"
                    x-ref="urlInput"
                    :value="state || ''"
                    @input="setUrl($event.target.value)"
                    placeholder="https://ejemplo.com o #contacto"
                    class="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 outline-none transition shadow-sm"
                    @keydown.enter.prevent="open = false"
                    @keydown.escape.prevent="open = false"
                />

                <div class="flex items-center justify-between pt-0.5">
                    <span class="text-[10px] text-gray-400">Pega la dirección web deseada</span>
                </div>
            </div>
        </template>
    </div>
 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal511d4862ff04963c3c16115c05a86a9d)): ?>
<?php $attributes = $__attributesOriginal511d4862ff04963c3c16115c05a86a9d; ?>
<?php unset($__attributesOriginal511d4862ff04963c3c16115c05a86a9d); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal511d4862ff04963c3c16115c05a86a9d)): ?>
<?php $component = $__componentOriginal511d4862ff04963c3c16115c05a86a9d; ?>
<?php unset($__componentOriginal511d4862ff04963c3c16115c05a86a9d); ?>
<?php endif; ?>
<?php /**PATH /opt/lampp/htdocs/ecomer/resources/views/filament/forms/components/link-picker.blade.php ENDPATH**/ ?>