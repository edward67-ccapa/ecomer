@php($record = $getRecord())
@php($imagen = $record->imagen ? asset('storage/'.$record->imagen) : null)
@php($precio = number_format((float) $record->precio, 2))
@php($precioOferta = $record->precio_oferta !== null ? number_format((float) $record->precio_oferta, 2) : null)

<div class="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
    @if ($imagen)
        <img
            src="{{ $imagen }}"
            alt="{{ $record->nombre }}"
            class="h-44 w-full object-cover"
        >
    @else
        <div class="flex h-44 w-full items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
            <x-heroicon-o-shopping-bag class="h-10 w-10" />
        </div>
    @endif

    <div class="flex flex-1 flex-col p-4">
        <div class="flex items-start justify-between gap-2">
            <h3 class="text-sm font-semibold text-gray-950 dark:text-white">
                {{ $record->nombre }}
            </h3>
            @if ($record->destacado)
                <span class="shrink-0 rounded-md bg-amber-500/10 px-1.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                    Destacado
                </span>
            @endif
        </div>

        @if ($record->categoria)
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {{ $record->categoria->nombre }}
            </p>
        @endif

        <div class="mt-3 flex items-end gap-2">
            @if ($precioOferta)
                <span class="text-sm font-bold text-primary-600">
                    ${{ $precioOferta }}
                </span>
                <span class="text-xs text-gray-400 line-through">
                    ${{ $precio }}
                </span>
            @else
                <span class="text-sm font-bold text-gray-950 dark:text-white">
                    ${{ $precio }}
                </span>
            @endif
            @if ($record->cantidad)
                <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ $record->cantidad }}
                </span>
            @endif
        </div>

        <div class="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>
                Stock: {{ $record->stock }}
            </span>
            <span class="{{ $record->activo ? 'text-success-600 dark:text-success-400' : '' }}">
                {{ $record->activo ? 'Activo' : 'Inactivo' }}
            </span>
        </div>
    </div>
</div>
