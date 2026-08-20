@php
    $statePath = $getStatePath();
@endphp

@once
    <script>
        if (!window.__ICON_PICKER_DATA__) {
            window.__ICON_PICKER_DATA__ = {
                svgs: @js(App\Helpers\IconRegistry::getSvgs()),
                categories: @js(App\Filament\Resources\Plantillas\Schemas\PlantillaForm::getIconOptions())
            };
        }
    </script>
@endonce

<x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
>
    <div
        x-data="{
            state: $wire.entangle('{{ $statePath }}'),
            search: '',
            open: false,
            data: window.__ICON_PICKER_DATA__
        }"
        class="relative inline-block"
        @click.outside="open = false"
    >
        <!-- BOTÓN DE SELECCIÓN: SOLO MUESTRA EL ÍCONO SELECCIONADO (0 MB OVERHEAD) -->
        <div class="flex items-center gap-2">
            <button
                type="button"
                @click="open = !open"
                :title="state ? state : 'Seleccionar ícono'"
                class="w-12 h-12 flex items-center justify-center rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 hover:border-primary-500 focus:ring-2 focus:ring-primary-500 outline-none transition cursor-pointer shadow-sm"
            >
                <div x-show="state && data.svgs[state]" x-html="state && data.svgs[state] ? data.svgs[state] : ''" class="w-6 h-6 flex items-center justify-center"></div>

                <div x-show="!state || !data.svgs[state]" class="w-6 h-6 flex items-center justify-center text-gray-400 dark:text-gray-500">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                </div>
            </button>

            <!-- Quitar ícono -->
            <template x-if="state">
                <button
                    type="button"
                    @click="state = null; open = false"
                    class="p-2.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition cursor-pointer"
                    title="Quitar ícono"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </template>
        </div>

        <!-- CAJA FLOTANTE ABSOLUTA ULTRA-RÁPIDA (SOLO RENDERIZA CUANDO SE ABRE) -->
        <div
            x-show="open"
            x-transition:enter="transition ease-out duration-100"
            x-transition:enter-start="opacity-0 scale-95"
            x-transition:enter-end="opacity-100 scale-100"
            x-transition:leave="transition ease-in duration-75"
            x-transition:leave-start="opacity-100 scale-100"
            x-transition:leave-end="opacity-0 scale-95"
            style="display: none;"
            class="absolute left-0 top-full mt-2 w-[320px] sm:w-[380px] z-50 p-3.5 border rounded-2xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-2xl space-y-3"
        >
            <!-- Buscador -->
            <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input
                    type="text"
                    x-model="search"
                    placeholder="Buscar ícono..."
                    class="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                />
            </div>

            <!-- Grilla visual ultra ligera -->
            <div class="max-h-60 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                <template x-for="(icons, groupName) in data.categories" :key="groupName">
                    <div x-show="Object.keys(icons).some(k => !search || k.toLowerCase().includes(search.toLowerCase()) || icons[k].toLowerCase().includes(search.toLowerCase()))">
                        <div class="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5" x-text="groupName"></div>

                        <div class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
                            <template x-for="(label, key) in icons" :key="key">
                                <button
                                    type="button"
                                    x-show="!search || key.toLowerCase().includes(search.toLowerCase()) || label.toLowerCase().includes(search.toLowerCase())"
                                    @click="state = key; open = false"
                                    :title="label"
                                    :class="{
                                        'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-950/60 border-primary-500 text-primary-600 dark:text-primary-400': state === key,
                                        'bg-gray-50 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700/80 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200': state !== key
                                    }"
                                    class="flex items-center justify-center h-10 rounded-lg border transition transform hover:scale-105 cursor-pointer"
                                >
                                    <div x-html="data.svgs[key]" class="w-5 h-5 flex items-center justify-center"></div>
                                </button>
                            </template>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</x-dynamic-component>
