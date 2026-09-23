<?php

namespace App\Console\Commands;

use App\Services\ImageOptimizerService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class OptimizeStorageImages extends Command
{
    /**
     * El nombre y la firma del comando en la consola.
     *
     * @var string
     */
    protected $signature = 'images:optimize 
                            {--width=1920 : Ancho máximo en píxeles (default: 1920)}
                            {--max-kb=400 : Peso máximo por imagen en KB (default: 400)}
                            {--path= : Directorio específico dentro de storage/app/public}';

    /**
     * La descripción del comando.
     *
     * @var string
     */
    protected $description = 'Transforma y optimiza las imágenes a un máximo de 1920px de ancho y 400 KB de peso.';

    /**
     * Ejecutar el comando.
     */
    public function handle(): int
    {
        $maxWidth = (int) $this->option('width') ?: 1920;
        $maxKb = (int) $this->option('max-kb') ?: 400;
        $specificPath = $this->option('path');

        $this->info("=== Transformador y Optimizador de Imágenes ===");
        $this->info("Parámetros: Ancho máx = {$maxWidth}px | Peso máx = {$maxKb} KB");

        $diskPath = Storage::disk('public')->path('');
        $targetDir = $diskPath;

        if ($specificPath) {
            $targetDir = rtrim($diskPath, '/') . '/' . ltrim($specificPath, '/');
        }

        if (! file_exists($targetDir) || ! is_dir($targetDir)) {
            // Intentar también con public_path('storage')
            $targetDir = public_path('storage/' . ltrim($specificPath ?? '', '/'));
        }

        if (! file_exists($targetDir) || ! is_dir($targetDir)) {
            $this->error("El directorio especificado no existe: {$targetDir}");
            return Command::FAILURE;
        }

        $this->info("Escaneando imágenes en: {$targetDir}");

        // Buscar todos los archivos de imagen de forma recursiva
        $extensions = ['jpg', 'jpeg', 'png', 'webp', 'bmp'];
        $imageFiles = [];

        $directoryIterator = new \RecursiveDirectoryIterator($targetDir, \RecursiveDirectoryIterator::SKIP_DOTS);
        $iterator = new \RecursiveIteratorIterator($directoryIterator);

        foreach ($iterator as $file) {
            if ($file->isFile()) {
                $ext = strtolower($file->getExtension());
                if (in_array($ext, $extensions, true)) {
                    $imageFiles[] = $file->getRealPath();
                }
            }
        }

        $totalImages = count($imageFiles);
        if ($totalImages === 0) {
            $this->warn("No se encontraron imágenes para optimizar.");
            return Command::SUCCESS;
        }

        $this->info("Se encontraron {$totalImages} imágenes. Procesando...");

        $bar = $this->output->createProgressBar($totalImages);
        $bar->start();

        $totalOriginalSize = 0;
        $totalNewSize = 0;
        $optimizedCount = 0;
        $errorCount = 0;

        foreach ($imageFiles as $filePath) {
            $origSize = filesize($filePath);
            $totalOriginalSize += $origSize;

            $result = ImageOptimizerService::optimizeImage($filePath, $maxWidth, $maxKb);

            if ($result['success']) {
                $totalNewSize += $result['new_size'];
                $optimizedCount++;
            } else {
                $totalNewSize += $origSize;
                $errorCount++;
            }

            // Sincronizar también con public_path('storage/...') si es una ruta dentro de storage/app/public
            if (str_contains($filePath, storage_path('app/public/'))) {
                $relativePath = str_replace(storage_path('app/public/'), '', $filePath);
                $publicStoragePath = public_path('storage/' . ltrim($relativePath, '/'));
                if (file_exists(dirname($publicStoragePath))) {
                    @copy($filePath, $publicStoragePath);
                }
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $savedBytes = max(0, $totalOriginalSize - $totalNewSize);
        $savedKb = round($savedBytes / 1024, 2);
        $savedMb = round($savedKb / 1024, 2);

        $this->table(
            ['Métrica', 'Valor'],
            [
                ['Total imágenes procesadas', $totalImages],
                ['Imágenes optimizadas con éxito', $optimizedCount],
                ['Peso original total', round($totalOriginalSize / 1024 / 1024, 2) . ' MB'],
                ['Peso nuevo total', round($totalNewSize / 1024 / 1024, 2) . ' MB'],
                ['Ahorro total de espacio', "{$savedMb} MB ({$savedKb} KB)"],
            ]
        );

        $this->info("¡Optimización completada exitosamente!");
        return Command::SUCCESS;
    }
}
