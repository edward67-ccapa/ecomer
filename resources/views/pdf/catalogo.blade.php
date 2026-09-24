@php
    $primaryColor = $colorPrimario ?? $site->estilos['color_primario'] ?? '#ff8da2';

    $getDomPdfImageSrc = function ($prod) {
        if (!$prod) return null;

        $imagePath = is_string($prod) ? $prod : ($prod->imagen ?? null);
        if (empty($imagePath)) {
            $imgs = $prod->imagenes ?? null;
            if (is_string($imgs)) {
                $imgs = json_decode($imgs, true);
            }
            if (is_array($imgs) && count($imgs) > 0) {
                $imagePath = $imgs[0];
            }
        }

        if (empty($imagePath) || !is_string($imagePath)) return null;

        $cleanPath = ltrim(preg_replace('/^\/?storage\//', '', $imagePath), '/');
        $fullPath = public_path('storage/' . $cleanPath);

        if (!file_exists($fullPath)) {
            $fullPath = public_path(ltrim($imagePath, '/'));
            if (!file_exists($fullPath)) {
                $fullPath = storage_path('app/public/' . $cleanPath);
                if (!file_exists($fullPath)) {
                    return null;
                }
            }
        }

        // Si es WebP, convertir a JPEG con fondo blanco para DomPDF
        // (Al convertir a JPEG con lienzo blanco, las transparencias se componen sobre blanco
        // de forma imperceptible en la hoja y DomPDF las procesa 100% en PHP sin requerir la extensión GD).
        $ext = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));
        $isWebp = ($ext === 'webp') || (function_exists('mime_content_type') && @mime_content_type($fullPath) === 'image/webp');

        if ($isWebp) {
            $jpgPath = sys_get_temp_dir() . '/' . md5($fullPath . '_dompdf_jpg_v8') . '.jpg';
            if (!file_exists($jpgPath)) {
                $converted = false;

                // Método 1: GD
                if (function_exists('imagecreatefromwebp') && function_exists('imagejpeg')) {
                    $im = @imagecreatefromwebp($fullPath);
                    if ($im) {
                        $w = imagesx($im);
                        $h = imagesy($im);
                        $bg = imagecreatetruecolor($w, $h);
                        $white = imagecolorallocate($bg, 255, 255, 255);
                        imagefilledrectangle($bg, 0, 0, $w, $h, $white);
                        imagecopy($bg, $im, 0, 0, 0, 0, $w, $h);
                        imagejpeg($bg, $jpgPath, 92);
                        imagedestroy($im);
                        imagedestroy($bg);
                        $converted = true;
                    }
                }

                // Método 2: Imagick PHP Extension
                if (!$converted && class_exists('Imagick')) {
                    try {
                        $im = new \Imagick($fullPath);
                        $im->setImageBackgroundColor('white');
                        $im = $im->mergeImageLayers(\Imagick::LAYERMETHOD_FLATTEN);
                        $im->setImageFormat('jpeg');
                        $im->setImageCompressionQuality(92);
                        $im->writeImage($jpgPath);
                        $im->clear();
                        $im->destroy();
                        $converted = true;
                    } catch (\Throwable $e) {}
                }

                // Método 3: Python 3 PIL / Pillow (Fusión sobre fondo blanco)
                if (!$converted && function_exists('exec')) {
                    $pyCode = "from PIL import Image\n" .
                              "img = Image.open('" . addslashes($fullPath) . "')\n" .
                              "if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):\n" .
                              "    img = img.convert('RGBA')\n" .
                              "    bg = Image.new('RGB', img.size, (255, 255, 255))\n" .
                              "    bg.paste(img, mask=img.split()[3])\n" .
                              "    bg.save('" . addslashes($jpgPath) . "', 'JPEG', quality=92)\n" .
                              "else:\n" .
                              "    img.convert('RGB').save('" . addslashes($jpgPath) . "', 'JPEG', quality=92)\n";
                    @exec('python3 -c ' . escapeshellarg($pyCode) . ' 2>&1');
                    if (file_exists($jpgPath) && filesize($jpgPath) > 0) {
                        $converted = true;
                    }
                }

                // Método 4: dwebp CLI tool
                if (!$converted && function_exists('exec')) {
                    @exec('dwebp ' . escapeshellarg($fullPath) . ' -o ' . escapeshellarg($jpgPath) . ' 2>&1');
                    if (file_exists($jpgPath) && filesize($jpgPath) > 0) {
                        $converted = true;
                    }
                }

                // Método 5: ImageMagick / convert CLI tool
                if (!$converted && function_exists('exec')) {
                    @exec('convert ' . escapeshellarg($fullPath) . ' -background white -flatten ' . escapeshellarg($jpgPath) . ' 2>&1');
                    if (file_exists($jpgPath) && filesize($jpgPath) > 0) {
                        $converted = true;
                    }
                }
            }

            if (file_exists($jpgPath) && filesize($jpgPath) > 0) {
                return 'data:image/jpeg;base64,' . base64_encode(file_get_contents($jpgPath));
            }

            return null;
        }

        $mime = 'image/jpeg';
        if ($ext === 'png') {
            $mime = 'image/png';
        } elseif ($ext === 'gif') {
            $mime = 'image/gif';
        } elseif ($ext === 'svg' || (function_exists('mime_content_type') && @mime_content_type($fullPath) === 'image/svg+xml')) {
            $mime = 'image/svg+xml';
        }

        return 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($fullPath));
    };

    $logoSrc = $getDomPdfImageSrc($site->imagen ?? $site->logo_nav ?? null);

    // SVG Decorativo Triángulo Esquina Superior Derecha con Puntos
    $svgTriangle = '<svg xmlns="http://www.w3.org/2000/svg" width="130" height="130" viewBox="0 0 130 130">
        <polygon points="0,0 130,0 130,130" fill="' . $primaryColor . '" />
        <circle cx="82" cy="28" r="2.5" fill="#ffffff" />
        <circle cx="97" cy="28" r="2.5" fill="#ffffff" />
        <circle cx="112" cy="28" r="2.5" fill="#ffffff" />
        <circle cx="82" cy="43" r="2.5" fill="#ffffff" />
        <circle cx="97" cy="43" r="2.5" fill="#ffffff" />
        <circle cx="112" cy="43" r="2.5" fill="#ffffff" />
    </svg>';
    $triangleBase64 = 'data:image/svg+xml;base64,' . base64_encode($svgTriangle);

    // SVG Decorativo Línea de Chevrons
    $chevronsPath = '';
    for ($i = 0; $i < 32; $i++) {
        $x1 = 7 + ($i * 7);
        $x2 = 1 + ($i * 7);
        $chevronsPath .= "M{$x1} 1 L{$x2} 6 L{$x1} 11 ";
    }
    $svgChevrons = '<svg xmlns="http://www.w3.org/2000/svg" width="235" height="12" viewBox="0 0 235 12">
        <path d="' . $chevronsPath . '" stroke="' . $primaryColor . '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.45" fill="none" />
    </svg>';
    $chevronsBase64 = 'data:image/svg+xml;base64,' . base64_encode($svgChevrons);

    $chunks = $productos->chunk(12);
    $totalChunks = $chunks->count();
@endphp
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>{{ $titulo }}</title>
    <style>
        @page {
            margin: 12px;
            size: a4 portrait;
        }
        * {
            box-sizing: border-box;
        }
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #1e293b;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }

        .page-frame {
            position: relative;
            border: none;
            padding: 10px 10px 6px 10px;
            box-sizing: border-box;
            background-color: #ffffff;
        }

        .page-break {
            page-break-after: always;
        }

        .corner-triangle {
            position: absolute;
            top: 0;
            right: 0;
            width: 120px;
            height: 120px;
            z-index: 10;
        }

        /* Cabecera */
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
        }
        .header-logo-td {
            width: 55%;
            vertical-align: middle;
            text-align: left;
        }
        .header-chevrons-td {
            width: 45%;
            vertical-align: middle;
            text-align: right;
            padding-right: 90px;
        }
        .site-logo {
            max-height: 42px;
            max-width: 180px;
            object-fit: contain;
        }
        .site-name-text {
            font-size: 20px;
            font-weight: 800;
            color: {{ $primaryColor }};
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* Grilla de Productos (2 columnas) */
        .grid-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 8px 6px;
            table-layout: fixed;
        }
        .grid-td {
            width: 50%;
            vertical-align: top;
            padding: 0;
        }

        /* Tarjeta de Producto */
        .product-card {
            border: 1px solid #e5e7eb;
            border-radius: 9px;
            background-color: #ffffff;
            padding: 6px 8px;
            height: 108px;
            overflow: hidden;
            box-sizing: border-box;
        }
        .card-inner-table {
            width: 100%;
            border-collapse: collapse;
            height: 100%;
        }
        .card-img-td {
            width: 80px;
            vertical-align: middle;
            text-align: center;
            padding-right: 8px;
        }
        .prod-img {
            width: 76px;
            height: 76px;
            object-fit: cover;
            border-radius: 8px;
            border: 1px solid #f1f5f9;
            display: block;
        }
        .card-img-placeholder {
            width: 78px;
            height: 78px;
            background-color: #fce7f3;
            border-radius: 8px;
            border: 1px solid #fbcfe8;
            line-height: 78px;
            text-align: center;
            color: {{ $primaryColor }};
            font-size: 8px;
            font-weight: bold;
        }
        .card-info-td {
            vertical-align: top;
            text-align: left;
        }

        /* Etiquetas y Textos */
        .badge-discount {
            background-color: #ef4444;
            color: #ffffff;
            font-size: 7.5px;
            font-weight: 800;
            padding: 1.5px 6px;
            border-radius: 6px;
            display: inline-block;
            margin-bottom: 2px;
            text-transform: uppercase;
        }
        .category-tag {
            font-size: 8px;
            font-weight: 800;
            color: #7c3aed;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: block;
            margin-bottom: 1px;
        }
        .prod-name {
            font-size: 11.5px;
            font-weight: 800;
            color: #111827;
            line-height: 1.15;
            margin-bottom: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .prod-desc {
            font-size: 7.8px;
            color: #64748b;
            line-height: 1.2;
            margin-bottom: 3px;
            height: 20px;
            overflow: hidden;
        }

        /* Precios */
        .price-box {
            margin-top: 2px;
        }
        .price-soles {
            font-size: 12px;
            font-weight: 800;
            color: #111827;
        }
        .price-soles-offer {
            font-size: 12px;
            font-weight: 800;
            color: #ef4444;
        }
        .price-striked {
            font-size: 9.5px;
            color: #94a3b8;
            text-decoration: line-through;
            margin-right: 4px;
            font-weight: 600;
        }
        .price-usd {
            font-size: 9.5px;
            font-weight: 700;
            color: #0d9488;
            margin-top: 1px;
        }
        .price-euros {
            font-size: 9.5px;
            font-weight: 700;
            color: #2563eb;
            margin-top: 1px;
        }
    </style>
</head>
<body>
    @foreach($chunks as $chunkIndex => $pageProducts)
        <div class="page-frame {{ $chunkIndex < $totalChunks - 1 ? 'page-break' : '' }}">
            <!-- Triángulo decorativo en esquina superior derecha con puntos -->
            <img src="{{ $triangleBase64 }}" class="corner-triangle" alt="" />

            <!-- Barra Superior (Logo / Nombre y Línea de Chevrons) -->
            <table class="header-table">
                <tr>
                    <td class="header-logo-td">
                        @if($logoSrc)
                            <img src="{{ $logoSrc }}" class="site-logo" alt="{{ $site->nombre }}">
                        @else
                            <h1 class="site-name-text">{{ $site->nombre }}</h1>
                        @endif
                    </td>
                    <td class="header-chevrons-td">
                        <img src="{{ $chevronsBase64 }}" style="height: 12px; vertical-align: middle;" alt="" />
                    </td>
                </tr>
            </table>

            <!-- Grilla de Tarjetas (2 columnas) -->
            <table class="grid-table">
                @php
                    $rows = $pageProducts->chunk(2);
                @endphp
                @foreach($rows as $row)
                    <tr>
                        @foreach($row as $prod)
                            @php
                                $imgSrc = $getDomPdfImageSrc($prod);

                                // Soles
                                $precioSoles = (float) ($prod->precio_soles ?? $prod->precio ?? 0);
                                $precioOfertaSoles = $prod->precio_oferta_soles ?? $prod->precio_oferta;
                                $precioOfertaSoles = $precioOfertaSoles !== null ? (float) $precioOfertaSoles : null;
                                $tieneOfertaSoles = $precioOfertaSoles !== null && $precioOfertaSoles < $precioSoles;

                                // Dólares
                                $precioDolares = ($prod->precio_dolares !== null && (float)$prod->precio_dolares > 0) ? (float) $prod->precio_dolares : null;
                                $precioOfertaDolares = ($prod->precio_oferta_dolares !== null && (float)$prod->precio_oferta_dolares > 0) ? (float) $prod->precio_oferta_dolares : null;
                                $tieneOfertaDolares = $precioDolares !== null && $precioOfertaDolares !== null && $precioOfertaDolares < $precioDolares;

                                // Euros
                                $precioEuros = ($prod->precio_euros !== null && (float)$prod->precio_euros > 0) ? (float) $prod->precio_euros : null;
                                $precioOfertaEuros = ($prod->precio_oferta_euros !== null && (float)$prod->precio_oferta_euros > 0) ? (float) $prod->precio_oferta_euros : null;
                                $tieneOfertaEuros = $precioEuros !== null && $precioOfertaEuros !== null && $precioOfertaEuros < $precioEuros;

                                // Descuento %
                                $descuentoPorcentaje = ($tieneOfertaSoles && $precioSoles > 0)
                                    ? round((($precioSoles - $precioOfertaSoles) / $precioSoles) * 100)
                                    : null;
                            @endphp

                            <td class="grid-td">
                                <div class="product-card">
                                    <table class="card-inner-table">
                                        <tr>
                                            <td class="card-img-td">
                                                @if($imgSrc)
                                                    <img src="{{ $imgSrc }}" class="prod-img" alt="{{ $prod->nombre }}">
                                                @else
                                                    <div class="card-img-placeholder">
                                                        {{ strtoupper(substr($prod->nombre, 0, 6)) }}
                                                    </div>
                                                @endif
                                            </td>
                                            <td class="card-info-td">
                                                @if($descuentoPorcentaje)
                                                    <span class="badge-discount">-{{ $descuentoPorcentaje }}% DESCUENTO</span>
                                                @endif

                                                @if($prod->categoria)
                                                    <span class="category-tag">{{ $prod->categoria->nombre }}</span>
                                                @endif

                                                <div class="prod-name" title="{{ $prod->nombre }}">{{ $prod->nombre }}</div>

                                                @if(!empty($prod->descripcion_corta))
                                                    <div class="prod-desc">{{ \Illuminate\Support\Str::limit(strip_tags($prod->descripcion_corta), 75) }}</div>
                                                @endif

                                                <div class="price-box">
                                                    {{-- Soles --}}
                                                    @if($tieneOfertaSoles)
                                                        <span class="price-striked">S/ {{ number_format($precioSoles, 2) }}</span>
                                                        <span class="price-soles-offer">S/ {{ number_format($precioOfertaSoles, 2) }}</span>
                                                    @else
                                                        <span class="price-soles">S/ {{ number_format($precioSoles, 2) }}</span>
                                                    @endif

                                                    {{-- Dólares --}}
                                                    @if($precioDolares)
                                                        <div class="price-usd">
                                                            @if($tieneOfertaDolares)
                                                                <span class="price-striked">$ {{ number_format($precioDolares, 2) }}</span>
                                                                <span>$ {{ number_format($precioOfertaDolares, 2) }} USD</span>
                                                            @else
                                                                <span>$ {{ number_format($precioDolares, 2) }} USD</span>
                                                            @endif
                                                        </div>
                                                    @endif

                                                    {{-- Euros --}}
                                                    @if($precioEuros)
                                                        <div class="price-euros">
                                                            @if($tieneOfertaEuros)
                                                                <span class="price-striked">€ {{ number_format($precioEuros, 2) }}</span>
                                                                <span>€ {{ number_format($precioOfertaEuros, 2) }} EUR</span>
                                                            @else
                                                                <span>€ {{ number_format($precioEuros, 2) }} EUR</span>
                                                            @endif
                                                        </div>
                                                    @endif
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </td>
                        @endforeach

                        @if($row->count() === 1)
                            <td class="grid-td"></td>
                        @endif
                    </tr>
                @endforeach
            </table>
        </div>
    @endforeach

    <!-- Script de DomPDF para número de página -->
    <script type="text/php">
        if (isset($pdf)) {
            $font = $fontMetrics->get_font("Helvetica", "bold");
            $size = 8;
            $color = array(0.5, 0.5, 0.5);
            $text = "Página {PAGE_NUM} de {PAGE_COUNT}";
            $x = ($pdf->get_width() - $fontMetrics->get_text_width($text, $font, $size)) / 2;
            $y = $pdf->get_height() - 20;
            $pdf->page_text($x, $y, $text, $font, $size, $color);
        }
    </script>
</body>
</html>
