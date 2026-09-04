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
            $tmpWebp = sys_get_temp_dir() . '/' . Str::random(40) . '.webp';

            if (self::convertToWebp($realPath, $tmpWebp, 82)) {
                $filename = Str::random(40) . '.webp';
                $destinationPath = $directory . '/' . $filename;
                $contents = file_get_contents($tmpWebp);

                Storage::disk($disk)->put($destinationPath, $contents);

                // Dual save: sync directly to public_path('storage/...') for servers without working symlinks (cPanel)
                self::syncToPublicPath($destinationPath, $contents);

                @unlink($tmpWebp);

                return $destinationPath;
            }
        }

        // Fallback: store the file with its original format
        $storedPath = $file->store($directory, $disk);

        try {
            $sourcePath = Storage::disk($disk)->path($storedPath);
            if (file_exists($sourcePath)) {
                self::syncToPublicPath($storedPath, file_get_contents($sourcePath));
            }
        } catch (\Throwable $e) {
            // Ignore error if disk path cannot be read
        }

        return $storedPath;
    }

    /**
     * Copy file content to public_path('storage/...') if directory exists or can be created.
     */
    private static function syncToPublicPath(string $relativeDestination, string $contents): void
    {
        try {
            $targetPath = public_path('storage/' . ltrim($relativeDestination, '/'));
            $targetDir = dirname($targetPath);

            if (! file_exists($targetDir)) {
                @mkdir($targetDir, 0755, true);
            }

            @file_put_contents($targetPath, $contents);
        } catch (\Throwable $e) {
            // Ignore sync errors
        }
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

    /**
     * Attempt WebP conversion using WebPConvert, Imagick, or GD.
     */
    private static function convertToWebp(string $sourcePath, string $targetPath, int $quality = 82): bool
    {
        // 1. Try WebPConvert library
        try {
            WebPConvert::convert($sourcePath, $targetPath, [
                'quality' => $quality,
                'max-quality' => min(100, $quality + 5),
            ]);
            if (file_exists($targetPath) && filesize($targetPath) > 0) {
                return true;
            }
        } catch (\Throwable $e) {
            Log::warning('WebPConvert failed: ' . $e->getMessage());
        }

        // 2. Try Imagick extension if available
        if (class_exists('\Imagick')) {
            try {
                $im = new \Imagick($sourcePath);
                $im->setImageFormat('webp');
                $im->setImageCompressionQuality($quality);
                $im->writeImage($targetPath);
                $im->clear();
                $im->destroy();
                if (file_exists($targetPath) && filesize($targetPath) > 0) {
                    return true;
                }
            } catch (\Throwable $e) {
                Log::warning('Imagick WebP conversion failed: ' . $e->getMessage());
            }
        }

        // 3. Try native GD extension if functions exist
        if (function_exists('imagewebp') && function_exists('imagecreatefromstring')) {
            try {
                $data = file_get_contents($sourcePath);
                $im = @imagecreatefromstring($data);
                if ($im !== false) {
                    imagealphablending($im, false);
                    imagesavealpha($im, true);
                    $success = @imagewebp($im, $targetPath, $quality);
                    imagedestroy($im);
                    if ($success && file_exists($targetPath) && filesize($targetPath) > 0) {
                        return true;
                    }
                }
            } catch (\Throwable $e) {
                Log::warning('GD WebP conversion failed: ' . $e->getMessage());
            }
        }

        return false;
    }
}
