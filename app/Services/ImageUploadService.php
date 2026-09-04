<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;
use WebPConvert\WebPConvert;

class ImageUploadService
{
    /**
     * Process an uploaded file, limit size and convert to WebP format.
     */
    public static function processAndSave(TemporaryUploadedFile $file, string $directory = 'uploads', string $disk = 'public'): string
    {
        $directory = trim($directory, '/');
        $realPath = self::getAbsoluteFilePath($file);

        if ($realPath && file_exists($realPath)) {
            try {
                $tmpWebp = sys_get_temp_dir() . '/' . Str::random(40) . '.webp';

                WebPConvert::convert($realPath, $tmpWebp, [
                    'quality' => 82,
                    'max-quality' => 85,
                ]);

                if (file_exists($tmpWebp) && filesize($tmpWebp) > 0) {
                    $filename = Str::random(40) . '.webp';
                    $destinationPath = $directory . '/' . $filename;

                    Storage::disk($disk)->put($destinationPath, file_get_contents($tmpWebp));
                    @unlink($tmpWebp);

                    return $destinationPath;
                }
            } catch (\Throwable $e) {
                Log::warning('WebP image conversion via WebPConvert failed.', [
                    'error' => $e->getMessage(),
                    'file' => $file->getClientOriginalName(),
                ]);
            }
        }

        // Fallback: store the file with its original format
        return $file->store($directory, $disk);
    }

    /**
     * Resolve absolute file path on disk for TemporaryUploadedFile.
     */
    private static function getAbsoluteFilePath(TemporaryUploadedFile $file): ?string
    {
        $candidates = [
            $file->getRealPath(),
            $file->path(),
            $file->getPathname(),
        ];

        try {
            $fileDisk = $file->getDisk();
            if ($fileDisk && $file->getRealPath()) {
                $candidates[] = Storage::disk($fileDisk)->path($file->getRealPath());
            }
        } catch (\Throwable $e) {
            // Ignore if disk path cannot be resolved
        }

        foreach ($candidates as $candidate) {
            if ($candidate && is_string($candidate) && file_exists($candidate) && is_file($candidate)) {
                return $candidate;
            }
        }

        return null;
    }
}
