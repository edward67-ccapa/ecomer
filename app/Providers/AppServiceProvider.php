<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if (file_exists(base_path('build/manifest.json')) && !file_exists(base_path('public/build/manifest.json'))) {
            $this->app->usePublicPath(base_path());
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \Illuminate\Support\Facades\View::share('errors', new \Illuminate\Support\ViewErrorBag);

        $tmpPath = storage_path('app/livewire-tmp');
        if (! file_exists($tmpPath)) {
            @mkdir($tmpPath, 0777, true);
        }

        \Filament\Support\Facades\FilamentView::registerRenderHook(
            \Filament\View\PanelsRenderHook::BODY_END,
            fn (): \Illuminate\Support\HtmlString => new \Illuminate\Support\HtmlString('
                <script>
                    document.addEventListener("DOMContentLoaded", () => {
                        const showUploadErrorNotification = (msg) => {
                            const errorText = msg || "El archivo excede el tamaño máximo permitido de 2MB.";
                            if (window.FilamentNotification) {
                                new FilamentNotification()
                                    .title("Error al subir imagen")
                                    .body(errorText)
                                    .danger()
                                    .send();
                            } else {
                                alert(errorText);
                            }
                        };

                        window.addEventListener("livewire-upload-error", (e) => {
                            showUploadErrorNotification("El archivo excede el tamaño máximo permitido de 2MB.");
                        });

                        document.addEventListener("FilePond:error", (e) => {
                            showUploadErrorNotification("El archivo excede el tamaño máximo permitido de 2MB.");
                        });
                    });
                </script>
            ')
        );

        \Filament\Forms\Components\FileUpload::macro('webp5Mb', function (string|\Closure|null $directory = null, ?string $disk = null) {
            /** @var \Filament\Forms\Components\FileUpload $this */
            $component = $this
                ->image()
                ->maxSize(2048) // 2MB max limit (2048 KB)
                ->validationMessages([
                    'max' => 'El archivo excede el tamaño máximo permitido de 2MB.',
                ]);

            if ($directory !== null) {
                $component->directory($directory);
            }
            if ($disk) {
                $component->disk($disk);
            }

            return $component->saveUploadedFileUsing(function (\Livewire\Features\SupportFileUploads\TemporaryUploadedFile $file, \Filament\Forms\Components\FileUpload $comp) {
                $dir = $comp->getDirectory() ?? 'uploads';
                $diskName = $comp->getDiskName() ?? 'public';

                return \App\Services\ImageUploadService::processAndSave($file, $dir, $diskName);
            });
        });
    }
}
