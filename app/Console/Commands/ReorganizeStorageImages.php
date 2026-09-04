<?php

namespace App\Console\Commands;

use App\Models\Plantilla;
use App\Models\Respuesta;
use App\Models\Site;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ReorganizeStorageImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'storage:reorganize-images';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reorganiza las imágenes existentes en storage según la estructura del frontend (plantillas/{slug} y sites/{slug})';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Iniciando reorganización de imágenes en storage/app/public...');
        $disk = Storage::disk('public');

        // 1. Reorganizar imágenes de Plantillas
        $this->info('Procesando Plantillas...');
        foreach (Plantilla::all() as $plantilla) {
            if (! empty($plantilla->imagen)) {
                $slug = Str::slug($plantilla->slug ?: "plantilla-{$plantilla->id}");
                $oldPath = ltrim($plantilla->imagen, '/');
                $filename = basename($oldPath);
                $targetDir = "plantillas/{$slug}";
                $newPath = "{$targetDir}/{$filename}";

                if ($oldPath !== $newPath && $disk->exists($oldPath)) {
                    $disk->makeDirectory($targetDir);
                    $disk->move($oldPath, $newPath);
                    $plantilla->update(['imagen' => $newPath]);
                    $this->line("  [Plantilla] Movido {$oldPath} -> {$newPath}");
                }
            }
        }

        // 2. Reorganizar imágenes de Sitios (Logo / Portada)
        $this->info('Procesando Sitios...');
        foreach (Site::all() as $site) {
            if (! empty($site->imagen)) {
                $slug = Str::slug($site->slug ?: "site-{$site->id}");
                $oldPath = ltrim($site->imagen, '/');
                $filename = basename($oldPath);
                $targetDir = "sites/{$slug}";
                $newPath = "{$targetDir}/{$filename}";

                if ($oldPath !== $newPath && $disk->exists($oldPath)) {
                    $disk->makeDirectory($targetDir);
                    $disk->move($oldPath, $newPath);
                    $site->update(['imagen' => $newPath]);
                    $this->line("  [Site] Movido {$oldPath} -> {$newPath}");
                }
            }
        }

        // 3. Reorganizar imágenes en Respuestas de contenido
        $this->info('Procesando Respuestas...');
        foreach (Respuesta::all() as $respuesta) {
            if (empty($respuesta->valor)) {
                continue;
            }

            $valor = $respuesta->valor;
            $modified = false;

            $slug = null;
            $baseFolder = 'sites';
            if ($respuesta->site_id && ($site = Site::find($respuesta->site_id))) {
                $slug = Str::slug($site->slug ?: "site-{$site->id}");
                $baseFolder = 'sites';
            } elseif ($respuesta->plantilla_id && ($plantilla = Plantilla::find($respuesta->plantilla_id))) {
                $slug = Str::slug($plantilla->slug ?: "plantilla-{$respuesta->plantilla_id}");
                $baseFolder = 'plantillas';
            }

            if (! $slug) {
                continue;
            }

            $targetDir = "{$baseFolder}/{$slug}/contenido";

            $processValue = function (mixed $val) use (&$processValue, &$modified, $disk, $targetDir): mixed {
                if (is_string($val) && (str_contains($val, 'sites/') || str_contains($val, 'plantillas/') || str_contains($val, 'uploads/'))) {
                    $oldPath = ltrim($val, '/');
                    $filename = basename($oldPath);
                    $newPath = "{$targetDir}/{$filename}";

                    if ($oldPath !== $newPath && $disk->exists($oldPath)) {
                        $disk->makeDirectory($targetDir);
                        $disk->move($oldPath, $newPath);
                        $modified = true;
                        return $newPath;
                    }
                } elseif (is_array($val)) {
                    $newArr = [];
                    foreach ($val as $k => $v) {
                        $newArr[$k] = $processValue($v);
                    }
                    return $newArr;
                }
                return $val;
            };

            $newValue = $processValue($valor);
            if ($modified) {
                $respuesta->update(['valor' => $newValue]);
                $this->line("  [Respuesta] ID {$respuesta->id} actualizada con nueva ruta.");
            }
        }

        $this->info('Reorganización de imágenes completada con éxito.');

        return Command::SUCCESS;
    }
}
