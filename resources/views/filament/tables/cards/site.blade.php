@php($record = $getRecord())
@php($imagen = $record->imagen ? asset('storage/'.$record->imagen) : ($record->plantilla?->imagen ? asset('storage/'.$record->plantilla->imagen) : null))

<div class="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
    @if ($imagen)
        <img
            src="{{ $imagen }}"
            alt="{{ $record->nombre }}"
            class="h-44 w-full object-cover"
        >
    @else
        <div class="flex h-44 w-full items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
            <x-heroicon-o-globe-alt class="h-10 w-10" />
        </div>
    @endif

    <div class="flex flex-1 flex-col p-4">
        <div class="flex items-start justify-between gap-2">
            <h3 class="text-sm font-semibold text-gray-950 dark:text-white">
                {{ $record->nombre }}
            </h3>
            <span class="shrink-0 rounded-md px-1.5 py-0.5 text-xs font-medium {{ $record->estado === 'publicado' ? 'bg-success-500/10 text-success-600 dark:text-success-400' : 'bg-gray-500/10 text-gray-500' }}">
                {{ $record->estado }}
            </span>
        </div>

        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {{ $record->plantilla?->nombre ?? '—' }}
            @if ($record->dominio)
                · {{ $record->dominio->nombre }}/{{ $record->slug }}
            @endif
        </p>

        @if ($record->estado === 'publicado' && $record->dominio)
            <a
                href="/{{ $record->dominio->nombre }}/{{ $record->slug }}"
                target="_blank"
                class="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-500"
            >
                <x-heroicon-o-eye class="h-4 w-4" />
                Visitar sitio
            </a>
        @endif
    </div>
</div>
