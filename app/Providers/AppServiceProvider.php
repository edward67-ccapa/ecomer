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

        \Filament\Forms\Components\FileUpload::macro('webp5Mb', function (string|\Closure|null $directory = null, ?string $disk = null) {
            /** @var \Filament\Forms\Components\FileUpload $this */
            $component = $this
                ->image()
                ->maxSize(5120); // 5MB max limit

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
