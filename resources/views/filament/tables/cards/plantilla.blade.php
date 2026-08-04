@php($record = $getRecord())
@php($imagen = $record->imagen ? asset('storage/'.$record->imagen) : null)

<div class="flex flex-col">
    @if ($imagen)
        <img
            src="{{ $imagen }}"
            alt="{{ $record->nombre }}"
            class="h-44 w-full object-cover"
        >
    @else
        <div class="flex h-44 w-full items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
            <x-heroicon-o-photo class="h-10 w-10" />
        </div>
    @endif

    <div class="flex flex-1 flex-col p-4">
        <div class="flex items-start justify-between gap-2">
            <h3 class="text-sm font-semibold text-gray-950 dark:text-white">
                {{ $record->nombre }}
            </h3>
            <span class="shrink-0 rounded-md bg-primary-500/10 px-1.5 py-0.5 text-xs font-medium text-primary-600 dark:text-primary-400">
                {{ str($record->tipo)->replace('_', ' ')->title() }}
            </span>
        </div>

        @if ($record->descripcion)
            <p class="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                {{ $record->descripcion }}
            </p>
        @endif

        <div class="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>
                {{ $record->secciones_count }}
                {{ $record->secciones_count === 1 ? 'sección' : 'secciones' }}
            </span>
            <span>
                {{ $record->activa ? 'Activa' : 'Inactiva' }}
            </span>
        </div>

        <div class="mt-3 grid grid-cols-1 gap-2">
            <a
                href="/admin/sites/create?plantilla_id={{ $record->id }}"
                class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-500"
            >
                <x-heroicon-o-plus class="h-4 w-4" />
                Usar plantilla
            </a>
            <a
                href="/plantillas/{{ $record->slug }}"
                target="_blank"
                class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
            >
                <x-heroicon-o-eye class="h-4 w-4" />
                Vista previa
            </a>
        </div>
    </div>
</div>
