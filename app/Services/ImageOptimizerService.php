<?php

namespace App\Services;

class ImageOptimizerService
{
    /**
     * Redimensiona la imagen a un máximo de $maxWidth de ancho (default 1920px) y la comprime a un peso máximo de $maxSizeKb KB (default 400 KB).
     *
     * @param  string  $filePath  Ruta absoluta del archivo de imagen
     * @param  int  $maxWidth  Ancho máximo en px (default 1920)
     * @param  int  $maxSizeKb  Peso máximo en KB (default 400)
     * @return array Resultado del proceso
     */
    public static function optimizeImage(string $filePath, int $maxWidth = 1920, int $maxSizeKb = 400): array
    {
        $defaultResult = [
            'success' => false,
            'original_size' => 0,
            'new_size' => 0,
            'width' => 0,
            'height' => 0,
            'message' => '',
        ];

        if (! file_exists($filePath) || ! is_file($filePath) || ! is_writable($filePath)) {
            $defaultResult['message'] = 'Archivo no existe o no tiene permisos de escritura.';

            return $defaultResult;
        }

        $originalSize = filesize($filePath);
        $maxSizeBytes = $maxSizeKb * 1024;
        $defaultResult['original_size'] = $originalSize;

        $imageInfo = @getimagesize($filePath);
        if (! extension_loaded('gd') && file_exists('/opt/lampp/bin/php')) {
            $phpBin = '/opt/lampp/bin/php';
            $cwebpBin = file_exists('/opt/lampp/bin/cwebp') ? '/opt/lampp/bin/cwebp' : 'cwebp';
            $dwebpBin = file_exists('/opt/lampp/bin/dwebp') ? '/opt/lampp/bin/dwebp' : 'dwebp';

            $code = '
                $filePath = '.var_export($filePath, true).';
                $maxWidth = '.(int) $maxWidth.';
                $maxSizeBytes = '.(int) $maxSizeBytes.';
                $cwebpBin = '.var_export($cwebpBin, true).';
                $dwebpBin = '.var_export($dwebpBin, true).';

                $imageInfo = @getimagesize($filePath);
                if (!$imageInfo) exit(1);
                list($origWidth, $origHeight, $type) = $imageInfo;

                $srcImage = null;
                if ($type == IMAGETYPE_JPEG) $srcImage = @imagecreatefromjpeg($filePath);
                else if ($type == IMAGETYPE_PNG) $srcImage = @imagecreatefrompng($filePath);
                else if ($type == IMAGETYPE_WEBP && function_exists("imagecreatefromwebp")) $srcImage = @imagecreatefromwebp($filePath);
                else if ($type == IMAGETYPE_WEBP) {
                    $tmpPng = sys_get_temp_dir() . "/d_" . md5($filePath . time()) . ".png";
                    @exec(escapeshellarg($dwebpBin) . " " . escapeshellarg($filePath) . " -o " . escapeshellarg($tmpPng) . " 2>&1");
                    if (file_exists($tmpPng) && filesize($tmpPng) > 0) {
                        $srcImage = @imagecreatefrompng($tmpPng);
                        @unlink($tmpPng);
                    }
                }

                if (!$srcImage && function_exists("imagecreatefromstring")) {
                    $data = @file_get_contents($filePath);
                    if ($data !== false) $srcImage = @imagecreatefromstring($data);
                }

                if (!$srcImage) exit(2);

                $w = $origWidth; $h = $origHeight;
                if ($w > $maxWidth) {
                    $ratio = $maxWidth / $w;
                    $w = $maxWidth;
                    $h = (int) max(1, round($origHeight * $ratio));
                }

                $quality = 85;
                $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

                for ($i = 0; $i < 6; $i++) {
                    $canvas = imagecreatetruecolor($w, $h);
                    if (in_array($ext, ["png", "webp"], true)) {
                        imagealphablending($canvas, false);
                        imagesavealpha($canvas, true);
                        $transparent = imagecolorallocatealpha($canvas, 255, 255, 255, 127);
                        imagefilledrectangle($canvas, 0, 0, $w, $h, $transparent);
                    } else {
                        $bg = imagecolorallocate($canvas, 255, 255, 255);
                        imagefill($canvas, 0, 0, $bg);
                    }
                    imagecopyresampled($canvas, $srcImage, 0, 0, 0, 0, $w, $h, $origWidth, $origHeight);

                    $targetExt = in_array($ext, ["png", "webp"], true) ? $ext : "jpg";
                    $tmp = sys_get_temp_dir() . "/o_" . md5($filePath . microtime(true)) . "." . $targetExt;

                    if ($targetExt === "webp" && function_exists("imagewebp")) {
                        @imagewebp($canvas, $tmp, $quality);
                    } else if ($targetExt === "png" && function_exists("imagepng")) {
                        @imagepng($canvas, $tmp, (int) max(0, min(9, round((100 - $quality) / 10))));
                    } else if ($ext === "webp" && file_exists($cwebpBin)) {
                        $tp = sys_get_temp_dir() . "/p_" . md5($filePath) . ".png";
                        @imagepng($canvas, $tp);
                        @exec(escapeshellarg($cwebpBin) . " -q " . (int)$quality . " -resize " . (int)$w . " 0 " . escapeshellarg($tp) . " -o " . escapeshellarg($tmp) . " 2>&1");
                        if (file_exists($tp)) @unlink($tp);
                    } else {
                        @imagejpeg($canvas, $tmp, $quality);
                    }

                    imagedestroy($canvas);

                    if (file_exists($tmp) && filesize($tmp) > 0) {
                        $currSize = filesize($tmp);
                        if ($currSize <= $maxSizeBytes) {
                            @copy($tmp, $filePath);
                            @unlink($tmp);
                            @imagedestroy($srcImage);
                            echo "OK:" . $currSize . ":" . $w . ":" . $h;
                            exit(0);
                        }
                        @unlink($tmp);
                    }

                    if ($quality > 45) {
                        $quality -= 15;
                    } else {
                        $w = (int) max(100, round($w * 0.85));
                        $h = (int) max(100, round($h * 0.85));
                        $quality = 75;
                    }
                }

                @imagedestroy($srcImage);
                exit(3);
            ';

            $cmd = escapeshellcmd($phpBin).' -r '.escapeshellarg($code).' 2>&1';
            $output = [];
            $ret = -1;
            exec($cmd, $output, $ret);
            $outStr = implode("\n", $output);

            if ($ret === 0 && str_contains($outStr, 'OK:')) {
                $parts = explode(':', trim($outStr));
                $newSize = isset($parts[1]) ? (int) $parts[1] : filesize($filePath);
                $w = isset($parts[2]) ? (int) $parts[2] : $maxWidth;
                $h = isset($parts[3]) ? (int) $parts[3] : 0;

                return [
                    'success' => true,
                    'original_size' => $originalSize,
                    'new_size' => $newSize,
                    'width' => $w,
                    'height' => $h,
                    'quality' => 80,
                    'message' => 'Optimizado a '.round($newSize / 1024, 1).' KB con ancho '.$w.'px.',
                ];
            }
        }

        if (! $imageInfo) {
            $defaultResult['message'] = 'No se pudo obtener información de la imagen.';

            return $defaultResult;
        }

        [$origWidth, $origHeight, $type] = $imageInfo;

        // Cargar recurso GD según el tipo de imagen
        $srcImage = null;
        $tmpConvertedPng = null;

        switch ($type) {
            case IMAGETYPE_JPEG:
                if (function_exists('imagecreatefromjpeg')) {
                    $srcImage = @imagecreatefromjpeg($filePath);
                }
                break;
            case IMAGETYPE_PNG:
                if (function_exists('imagecreatefrompng')) {
                    $srcImage = @imagecreatefrompng($filePath);
                }
                break;
            case IMAGETYPE_WEBP:
                if (function_exists('imagecreatefromwebp')) {
                    $srcImage = @imagecreatefromwebp($filePath);
                }
                // Fallback con dwebp binario si GD no tiene soporte nativo de WebP
                if (! $srcImage) {
                    $dwebpBin = file_exists('/opt/lampp/bin/dwebp') ? '/opt/lampp/bin/dwebp' : (exec('which dwebp') ?: null);
                    if ($dwebpBin) {
                        $tmpConvertedPng = sys_get_temp_dir().'/dwebp_'.md5($filePath.microtime(true)).'.png';
                        @exec(escapeshellarg($dwebpBin).' '.escapeshellarg($filePath).' -o '.escapeshellarg($tmpConvertedPng).' 2>&1');
                        if (file_exists($tmpConvertedPng) && filesize($tmpConvertedPng) > 0 && function_exists('imagecreatefrompng')) {
                            $srcImage = @imagecreatefrompng($tmpConvertedPng);
                        }
                    }
                }
                break;
            case IMAGETYPE_GIF:
                if (function_exists('imagecreatefromgif')) {
                    $srcImage = @imagecreatefromgif($filePath);
                }
                break;
            case IMAGETYPE_BMP:
                if (function_exists('imagecreatefrombmp')) {
                    $srcImage = @imagecreatefrombmp($filePath);
                }
                break;
        }

        if (! $srcImage && function_exists('imagecreatefromstring')) {
            $data = @file_get_contents($filePath);
            if ($data !== false) {
                $srcImage = @imagecreatefromstring($data);
            }
        }

        // Limpiar archivo temporal si se usó dwebp
        if ($tmpConvertedPng && file_exists($tmpConvertedPng)) {
            @unlink($tmpConvertedPng);
        }

        if (! $srcImage) {
            $defaultResult['message'] = 'No se pudo decodificar el formato de imagen.';

            return $defaultResult;
        }

        // Calcular dimensiones (máximo $maxWidth px de ancho)
        $currentWidth = $origWidth;
        $currentHeight = $origHeight;

        if ($currentWidth > $maxWidth) {
            $ratio = $maxWidth / $currentWidth;
            $currentWidth = $maxWidth;
            $currentHeight = (int) max(1, round($origHeight * $ratio));
        }

        // Iterar compresión y dimensiones hasta que el peso sea <= $maxSizeBytes
        $quality = 85;
        $cwebpBin = file_exists('/opt/lampp/bin/cwebp') ? '/opt/lampp/bin/cwebp' : (exec('which cwebp') ?: null);
        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

        for ($attempt = 0; $attempt < 6; $attempt++) {
            $canvas = imagecreatetruecolor($currentWidth, $currentHeight);

            if (in_array($ext, ['png', 'webp'], true)) {
                // Preservar la transparencia transparente para PNG y WebP
                imagealphablending($canvas, false);
                imagesavealpha($canvas, true);
                $transparent = imagecolorallocatealpha($canvas, 255, 255, 255, 127);
                imagefilledrectangle($canvas, 0, 0, $currentWidth, $currentHeight, $transparent);
            } else {
                // Fondo blanco únicamente para imágenes JPG/JPEG
                $bg = imagecolorallocate($canvas, 255, 255, 255);
                imagefill($canvas, 0, 0, $bg);
            }

            imagecopyresampled(
                $canvas,
                $srcImage,
                0, 0, 0, 0,
                $currentWidth,
                $currentHeight,
                $origWidth,
                $origHeight
            );

            $targetExt = in_array($ext, ['png', 'webp'], true) ? $ext : 'jpg';
            $tmpFile = sys_get_temp_dir().'/opt_'.md5($filePath.microtime(true)).'.'.$targetExt;

            if ($targetExt === 'webp' && function_exists('imagewebp')) {
                @imagewebp($canvas, $tmpFile, $quality);
            } elseif ($targetExt === 'png' && function_exists('imagepng')) {
                // imagepng usa calidad de 0 (sin compresión) a 9 (máxima compresión)
                $pngQuality = (int) max(0, min(9, round((100 - $quality) / 10)));
                @imagepng($canvas, $tmpFile, $pngQuality);
            } elseif ($ext === 'webp' && $cwebpBin) {
                $tmpPng = sys_get_temp_dir().'/tmp_cwebp_'.md5($filePath).'.png';
                @imagepng($canvas, $tmpPng);
                @exec(escapeshellarg($cwebpBin).' -q '.(int) $quality.' -resize '.(int) $currentWidth.' 0 '.escapeshellarg($tmpPng).' -o '.escapeshellarg($tmpFile).' 2>&1');
                if (file_exists($tmpPng)) {
                    @unlink($tmpPng);
                }
            } else {
                @imagejpeg($canvas, $tmpFile, $quality);
            }

            imagedestroy($canvas);

            if (file_exists($tmpFile) && filesize($tmpFile) > 0) {
                $currentSize = filesize($tmpFile);

                if ($currentSize <= $maxSizeBytes) {
                    @copy($tmpFile, $filePath);
                    @unlink($tmpFile);
                    imagedestroy($srcImage);

                    return [
                        'success' => true,
                        'original_size' => $originalSize,
                        'new_size' => $currentSize,
                        'width' => $currentWidth,
                        'height' => $currentHeight,
                        'quality' => $quality,
                        'message' => 'Optimizado a '.round($currentSize / 1024, 1).' KB con ancho '.$currentWidth.'px.',
                    ];
                }
            }

            if (file_exists($tmpFile)) {
                @unlink($tmpFile);
            }

            // Reducir calidad o dimensiones progresivamente
            if ($quality > 45) {
                $quality -= 15;
            } else {
                $currentWidth = (int) max(100, round($currentWidth * 0.85));
                $currentHeight = (int) max(100, round($currentHeight * 0.85));
                $quality = 75;
            }
        }

        imagedestroy($srcImage);

        return $defaultResult;
    }
}
