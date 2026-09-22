@php
    $getDomPdfImageSrc = function ($prod) {
        if (!$prod) return null;
        
        $imagePath = $prod->imagen ?? null;
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

        $ext = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));

        if ($ext === 'webp') {
            if (function_exists('imagecreatefromwebp')) {
                $im = @imagecreatefromwebp($fullPath);
                if ($im) {
                    ob_start();
                    imagejpeg($im, null, 85);
                    $data = ob_get_clean();
                    imagedestroy($im);
                    return 'data:image/jpeg;base64,' . base64_encode($data);
                }
            }

            $jpgPath = sys_get_temp_dir() . '/' . md5($fullPath) . '.jpg';
            if (!file_exists($jpgPath)) {
                $cmd = sprintf("python3 -c \"from PIL import Image; Image.open(%s).convert(%s).save(%s, %s, quality=85)\"", escapeshellarg($fullPath), escapeshellarg("RGB"), escapeshellarg($jpgPath), escapeshellarg("JPEG"));
                @exec($cmd);
            }

            if (file_exists($jpgPath)) {
                return 'data:image/jpeg;base64,' . base64_encode(file_get_contents($jpgPath));
            }

            try {
                if (!file_exists($jpgPath)) {
                    \WebPConvert\WebPConvert::convert($fullPath, $jpgPath);
                }
                if (file_exists($jpgPath)) {
                    return 'data:image/jpeg;base64,' . base64_encode(file_get_contents($jpgPath));
                }
            } catch (\Throwable $e) {}

            return null;
        }

        return 'data:image/' . ($ext === 'jpg' ? 'jpeg' : $ext) . ';base64,' . base64_encode(file_get_contents($fullPath));
    };
@endphp
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>{{ $titulo }}</title>
    <style>
        @page { margin: 25px; }
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #2d3748;
            margin: 0;
            padding: 0;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }
        .site-name {
            font-size: 24px;
            font-weight: bold;
            color: #1a202c;
            margin: 0;
        }
        .cat-title {
            font-size: 16px;
            color: #718096;
            margin-top: 5px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .product-table {
            width: 100%;
            border-collapse: collapse;
        }
        .product-cell {
            width: 50%;
            vertical-align: top;
            padding: 8px;
            box-sizing: border-box;
        }
        .product-card {
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 12px;
            background-color: #ffffff;
            position: relative;
        }
        .card-inner-table {
            width: 100%;
            border-collapse: collapse;
        }
        .card-img-td {
            width: 40%;
            vertical-align: top;
            text-align: center;
            padding-right: 10px;
        }
        .card-info-td {
            vertical-align: top;
            text-align: left;
        }
        .product-img {
            max-width: 100%;
            max-height: 130px;
            object-fit: cover;
            border-radius: 8px;
        }
        .badge-discount {
            background-color: #e53e3e;
            color: #ffffff;
            font-size: 9px;
            font-weight: bold;
            padding: 2px 7px;
            border-radius: 10px;
            display: inline-block;
            margin-bottom: 5px;
        }
        .product-category {
            font-size: 10px;
            font-weight: bold;
            color: #805ad5;
            text-transform: uppercase;
            margin-bottom: 3px;
        }
        .product-name {
            font-size: 14px;
            font-weight: bold;
            color: #1a202c;
            margin-bottom: 5px;
            line-height: 1.2;
        }
        .product-desc-corta {
            font-size: 10px;
            color: #718096;
            margin-bottom: 8px;
            line-height: 1.3;
        }
        .prices-container {
            margin-top: 6px;
            padding-top: 6px;
            border-top: 1px dashed #edf2f7;
        }
        .price-original {
            text-decoration: line-through;
            color: #a0aec0;
            font-size: 11px;
            margin-right: 4px;
        }
        .price-oferta {
            font-size: 14px;
            font-weight: bold;
            color: #e53e3e;
        }
        .price-regular {
            font-size: 14px;
            font-weight: bold;
            color: #2d3748;
        }
        .price-usd {
            font-size: 11px;
            font-weight: bold;
            color: #319795;
            margin-top: 2px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #e2e8f0;
            font-size: 10px;
            color: #a0aec0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="site-name">{{ $site->nombre }}</h1>
        <div class="cat-title">{{ $titulo }}</div>
    </div>

    <table class="product-table">
        @foreach($productos->chunk(2) as $row)
            <tr>
                @foreach($row as $prod)
                    @php
                        $imgSrc = $getDomPdfImageSrc($prod);

                        $precioSoles = (float) ($prod->precio_soles ?? $prod->precio ?? 0);
                        $precioOfertaSoles = $prod->precio_oferta_soles ?? $prod->precio_oferta;
                        $precioOfertaSoles = $precioOfertaSoles ? (float) $precioOfertaSoles : null;

                        $precioDolares = $prod->precio_dolares ? (float) $prod->precio_dolares : null;
                        $precioOfertaDolares = $prod->precio_oferta_dolares ? (float) $prod->precio_oferta_dolares : null;

                        $tieneOferta = $precioOfertaSoles !== null && $precioOfertaSoles < $precioSoles;
                        $descuentoPorcentaje = ($tieneOferta && $precioSoles > 0)
                            ? round((($precioSoles - $precioOfertaSoles) / $precioSoles) * 100)
                            : null;
                    @endphp
                    <td class="product-cell">
                        <div class="product-card">
                            <table class="card-inner-table">
                                <tr>
                                    @if($imgSrc)
                                        <td class="card-img-td">
                                            <img src="{{ $imgSrc }}" class="product-img">
                                        </td>
                                    @endif
                                    <td class="card-info-td">
                                        @if($descuentoPorcentaje)
                                            <div><span class="badge-discount">-{{ $descuentoPorcentaje }}% DESCUENTO</span></div>
                                        @endif

                                        @if($prod->categoria)
                                            <div class="product-category">{{ $prod->categoria->nombre }}</div>
                                        @endif

                                        <div class="product-name">{{ $prod->nombre }}</div>

                                        @if(!empty($prod->descripcion_corta))
                                            <div class="product-desc-corta">{{ $prod->descripcion_corta }}</div>
                                        @endif

                                        <div class="prices-container">
                                            {{-- Soles --}}
                                            <div>
                                                @if($tieneOferta)
                                                    <span class="price-original">S/ {{ number_format($precioSoles, 2) }}</span>
                                                    <span class="price-oferta">S/ {{ number_format($precioOfertaSoles, 2) }}</span>
                                                @else
                                                    <span class="price-regular">S/ {{ number_format($precioSoles, 2) }}</span>
                                                @endif
                                            </div>

                                            {{-- Dólares --}}
                                            @if($precioDolares)
                                                <div class="price-usd">
                                                    @if($precioOfertaDolares && $precioOfertaDolares < $precioDolares)
                                                        <span style="text-decoration: line-through; color: #a0aec0; font-size: 10px;">$ {{ number_format($precioDolares, 2) }}</span>
                                                        <span>$ {{ number_format($precioOfertaDolares, 2) }} USD</span>
                                                    @else
                                                        <span>$ {{ number_format($precioDolares, 2) }} USD</span>
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
                @if($row->count() < 2)
                    <td class="product-cell"></td>
                @endif
            </tr>
        @endforeach
    </table>

    <div class="footer">
        Catálogo de productos — {{ $site->nombre }} — {{ date('d/m/Y') }}
    </div>
</body>
</html>
