@php
    $statePath = $getStatePath();
@endphp

<x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
>
    <div
        x-data="{
            open: false,
            currentUrl: '',
            init() {
                this.currentUrl = $wire.get('{{ $statePath }}') || '';
            },
            toggle() {
                this.open = !this.open;
                if (this.open) {
                    this.currentUrl = $wire.get('{{ $statePath }}') || '';
                    $nextTick(() => {
                        if (this.$refs.urlInput) {
                            this.$refs.urlInput.value = this.currentUrl;
                            this.$refs.urlInput.focus();
                        }
                    });
                } else {
                    this.cancel();
                }
            },
            cancel() {
                this.open = false;
                this.currentUrl = $wire.get('{{ $statePath }}') || '';
            },
            saveUrl() {
                const rawVal = this.$refs.urlInput ? this.$refs.urlInput.value.trim() : '';
                const newVal = rawVal !== '' ? rawVal : null;
                const oldVal = $wire.get('{{ $statePath }}') || null;

                if (newVal !== oldVal) {
                    this.currentUrl = newVal || '';
                    $wire.set('{{ $statePath }}', newVal);
                }

                this.open = false;
            },
            clearUrl() {
                const oldVal = $wire.get('{{ $statePath }}') || null;
                if (oldVal !== null) {
                    this.currentUrl = '';
                    $wire.set('{{ $statePath }}', null);
                }
                this.open = false;
            }
        }"
        class="relative inline-block mt-1"
        @click.outside="cancel()"
    >
        <!-- BOTÓN DE ENLACE COMPACTO -->
        <div class="flex items-center gap-2">
            <button
                type="button"
                @click="toggle()"
                :class="{
                    'bg-primary-50 dark:bg-primary-950/60 border-primary-500 text-primary-600 dark:text-primary-400 font-semibold shadow-sm': currentUrl,
                    'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400 hover:text-gray-900 dark:hover:text-white': !currentUrl
                }"
                class="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-xl border transition cursor-pointer"
            >
                <span x-text="currentUrl ? '🔗 Enlace configurado' : '🔗 Agregar enlace'"></span>
            </button>

            <!-- Quitar enlace -->
            <template x-if="currentUrl">
                <button
                    type="button"
                    @click="clearUrl()"
                    class="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition cursor-pointer"
                    title="Quitar enlace"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </template>
        </div>

        <!-- POPOVER FLOTANTE ABSOLUTO (SOLO EXISTE EN EL DOM CUANDO OPEN === TRUE) -->
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
                    <button type="button" @click="cancel()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs">✕</button>
                </div>

                <input
                    type="text"
                    x-ref="urlInput"
                    :value="currentUrl"
                    placeholder="https://ejemplo.com o #contacto"
                    class="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 outline-none transition shadow-sm"
                    @keydown.enter.prevent="saveUrl()"
                    @keydown.escape.prevent="cancel()"
                />

                <div class="flex items-center justify-between pt-1">
                    <span class="text-[10px] text-gray-400">Pega la dirección web deseada</span>
                    <button
                        type="button"
                        @click="saveUrl()"
                        class="px-3 py-1 text-xs font-bold rounded-lg bg-primary-600 text-white hover:bg-primary-500 transition shadow-sm cursor-pointer"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </template>
    </div>
</x-dynamic-component>
