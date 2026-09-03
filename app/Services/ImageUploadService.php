<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\Drivers\Imagick\Driver as ImagickDriver;
use Intervention\Image\ImageManager;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

class ImageUploadService
{
    /**
     * Process an uploaded file, limit size and convert to WebP format if supported.
     */
    public static function processAndSave(TemporaryUploadedFile $file, string $directory = 'uploads', string $disk = 'public'): string
    {
        $directory = trim($directory, '/');

        // Check if GD or Imagick PHP extensions are available for WebP conversion
        if (extension_loaded('gd') || extension_loaded('imagick')) {
            try {
                $driver = extension_loaded('gd') ? new GdDriver() : new ImagickDriver();
                $manager = new ImageManager($driver);

                $realPath = $file->getRealPath();
                if ($realPath && file_exists($realPath)) {
                    $image = $manager->read($realPath);
                    $encoded = $image->toWebp(82);

                    $filename = Str::random(40) . '.webp';
                    $destinationPath = $directory . '/' . $filename;

                    Storage::disk($disk)->put($destinationPath, (string) $encoded);

                    return $destinationPath;
                }
            } catch (\Throwable $e) {
                Log::warning('WebP image conversion failed, storing original file.', [
                    'error' => $e->getMessage(),
                    'file' => $file->getClientOriginalName(),
                ]);
            }
        }

        // Fallback: store the file with its original format
        return $file->store($directory, $disk);
    }
}
