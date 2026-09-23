@php
    $primaryColor = $colorPrimario ?? $site->estilos['color_primario'] ?? '#2563EB';

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

        $jpgPath = sys_get_temp_dir() . '/' . md5($fullPath . '_white_v2') . '.jpg';
        if (!file_exists($jpgPath)) {
            $cmd = sprintf(
                "python3 -c \"from PIL import Image; im = Image.open(%s); bg = Image.new('RGB', im.size, (255, 255, 255)); im = im.convert('RGBA') if im.mode == 'P' else im; bg.paste(im, (0, 0), im) if 'A' in im.mode else bg.paste(im, (0, 0)); bg.save(%s, 'JPEG', quality=95)\"",
                escapeshellarg($fullPath),
                escapeshellarg($jpgPath)
            );
            @exec($cmd);
        }

        if (file_exists($jpgPath)) {
            return 'data:image/jpeg;base64,' . base64_encode(file_get_contents($jpgPath));
        }

        return 'data:image/jpeg;base64,' . base64_encode(file_get_contents($fullPath));
    };

    $logoSrc = $getDomPdfImageSrc($site->imagen ?? $site->logo_nav ?? null);

    $renderSpecs = function($desc) {
        if (empty($desc)) return '';
        $lines = preg_split('/[\r\n]+/', trim($desc));
        if (count($lines) === 1 && str_contains($desc, ',')) {
            $lines = explode(',', $desc);
        }
        $html = '<ul class="spec-list">';
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line) {
                $html .= '<li><span class="bullet">•</span> ' . e($line) . '</li>';
            }
        }
        $html .= '</ul>';
        return $html;
    };
@endphp
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>{{ $titulo }}</title>
    <style>
        @page {
            margin: 15px;
        }
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #1e293b;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }

        .page {
            position: relative;
            box-sizing: border-box;
            border: none;
            padding: 15px;
            min-height: 980px;
            background-color: #ffffff;
            overflow: hidden;
        }

        .page-break {
            page-break-after: always;
        }

        /* Decorative Corner Triangles */
        .corner-triangle-top-right {
            position: absolute;
            top: 0;
            right: 0;
            width: 0;
            height: 0;
            border-top: 90px solid {{ $primaryColor }};
            border-left: 90px solid transparent;
            z-index: 1;
        }
        .corner-dots {
            position: absolute;
            top: 6px;
            right: 6px;
            color: #ffffff;
            font-size: 8px;
            z-index: 2;
            letter-spacing: 2px;
            line-height: 10px;
        }

        /* Header Bar */
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
            position: relative;
            z-index: 3;
        }
        .header-logo-td {
            width: 50%;
            vertical-align: middle;
            text-align: left;
        }
        .header-chevrons-td {
            width: 50%;
            vertical-align: middle;
            text-align: right;
            padding-right: 50px;
        }
        .site-logo {
            max-height: 48px;
            max-width: 190px;
            object-fit: contain;
        }
        .site-name-text {
            font-size: 20px;
            font-weight: 800;
            color: {{ $primaryColor }};
            margin: 0;
        }
        .chevrons {
            font-size: 20px;
            font-weight: bold;
            color: {{ $primaryColor }};
            opacity: 0.35;
            letter-spacing: -2px;
        }

        /* Product Card Box */
        .product-card {
            width: 100%;
            border: none;
            background-color: transparent;
            padding: 2px 0;
            margin-bottom: 6px;
            box-sizing: border-box;
            box-shadow: none;
        }

        .product-table {
            width: 100%;
            border-collapse: collapse;
        }
        .prod-col-img {
            width: 42%;
            vertical-align: middle;
            text-align: center;
            padding: 2px;
        }
        .prod-col-info {
            vertical-align: middle;
            text-align: left;
            padding: 2px 10px;
        }

        .prod-img {
            max-width: 100%;
            max-height: 175px;
            object-fit: contain;
            border-radius: 10px;
        }

        .prod-title {
            font-size: 19px;
            font-weight: 800;
            color: #0f172a;
            margin: 2px 0 5px 0;
            line-height: 1.2;
        }

        .category-badge {
            display: inline-block;
            font-size: 10px;
            font-weight: 800;
            color: #7c3aed;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 1px;
        }

        .badge-discount {
            background-color: #ef4444;
            color: #ffffff;
            font-size: 9px;
            font-weight: 800;
            padding: 2px 8px;
            border-radius: 10px;
            display: inline-block;
            margin-bottom: 4px;
        }

        .spec-list {
            list-style: none;
            padding: 0;
            margin: 0 0 6px 0;
        }
        .spec-list li {
            font-size: 11px;
            color: #64748b;
            margin-bottom: 2px;
            line-height: 1.3;
        }
        .spec-list .bullet {
            color: {{ $primaryColor }};
            font-weight: bold;
            margin-right: 4px;
        }

        /* Dotted Separator above Prices */
        .price-section {
            border-top: 1.5px dotted #cbd5e1;
            margin-top: 6px;
            padding-top: 6px;
        }

        .price-row-soles {
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
        }
        .price-soles-offer {
            font-size: 18px;
            font-weight: 800;
            color: #ef4444;
        }

        .price-striked {
            font-size: 13px;
            text-decoration: line-through;
            color: #94a3b8;
            margin-right: 5px;
            font-weight: 600;
        }

        .price-row-dolares {
            font-size: 13px;
            font-weight: 700;
            color: #0d9488;
            margin-top: 2px;
        }

        .price-row-euros {
            font-size: 13px;
            font-weight: 700;
            color: #2563eb;
            margin-top: 2px;
        }

        /* Middle Divider Line with block */
        .divider-table {
            width: 100%;
            border-collapse: collapse;
            margin: 6px 0 10px 0;
        }
        .divider-line {
            border-bottom: 2px solid {{ $primaryColor }};
            width: 42%;
        }
        .divider-block {
            width: 16%;
            height: 8px;
            background-color: {{ $primaryColor }};
            border-radius: 3px;
        }
    </style>
</head>
<body>
    @php
        $chunks = $productos->chunk(3);
        $totalChunks = $chunks->count();
    @endphp

    @foreach($chunks as $chunkIndex => $pageProducts)
        <div class="page {{ $chunkIndex < $totalChunks - 1 ? 'page-break' : '' }}">
            <!-- Top Right Corner Triangle Accent -->
            <div class="corner-triangle-top-right"></div>
            <div class="corner-dots">:::<br>:::</div>

            <!-- Header Bar -->
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
                        <span class="chevrons">«««««««««««««««««</span>
                    </td>
                </tr>
            </table>

            @foreach($pageProducts->values() as $prodIndex => $prod)
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

                    // Alternar posición de imagen: Producto 1 (imagen a la izquierda), Producto 2 (imagen a la derecha), Producto 3 (imagen a la izquierda)
                    $imageOnLeft = ($prodIndex % 2 === 0);
                @endphp

                <div class="product-card">
                    <table class="product-table">
                        <tr>
                            @if($imageOnLeft)
                                {{-- Imagen a la Izquierda --}}
                                @if($imgSrc)
                                    <td class="prod-col-img">
                                        <img src="{{ $imgSrc }}" class="prod-img">
                                    </td>
                                @endif
                                <td class="prod-col-info" style="width: {{ $imgSrc ? '58%' : '100%' }};">
                                    @if($descuentoPorcentaje)
                                        <div><span class="badge-discount">-{{ $descuentoPorcentaje }}% DESCUENTO</span></div>
                                    @endif

                                    @if($prod->categoria)
                                        <div class="category-badge">{{ $prod->categoria->nombre }}</div>
                                    @endif

                                    <div class="prod-title">{{ $prod->nombre }}</div>

                                    @if(!empty($prod->descripcion_corta))
                                        {!! $renderSpecs($prod->descripcion_corta) !!}
                                    @endif

                                    <div class="price-section">
                                        {{-- Soles --}}
                                        <div class="price-row-soles">
                                            @if($tieneOfertaSoles)
                                                <span class="price-striked">S/ {{ number_format($precioSoles, 2) }}</span>
                                                <span class="price-soles-offer">S/ {{ number_format($precioOfertaSoles, 2) }}</span>
                                            @else
                                                <span>S/ {{ number_format($precioSoles, 2) }}</span>
                                            @endif
                                        </div>

                                        {{-- Dólares --}}
                                        @if($precioDolares)
                                            <div class="price-row-dolares">
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
                                            <div class="price-row-euros">
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
                            @else
                                {{-- Imagen a la Derecha --}}
                                <td class="prod-col-info" style="width: {{ $imgSrc ? '58%' : '100%' }};">
                                    @if($descuentoPorcentaje)
                                        <div><span class="badge-discount">-{{ $descuentoPorcentaje }}% DESCUENTO</span></div>
                                    @endif

                                    @if($prod->categoria)
                                        <div class="category-badge">{{ $prod->categoria->nombre }}</div>
                                    @endif

                                    <div class="prod-title">{{ $prod->nombre }}</div>

                                    @if(!empty($prod->descripcion_corta))
                                        {!! $renderSpecs($prod->descripcion_corta) !!}
                                    @endif

                                    <div class="price-section">
                                        {{-- Soles --}}
                                        <div class="price-row-soles">
                                            @if($tieneOfertaSoles)
                                                <span class="price-striked">S/ {{ number_format($precioSoles, 2) }}</span>
                                                <span class="price-soles-offer">S/ {{ number_format($precioOfertaSoles, 2) }}</span>
                                            @else
                                                <span>S/ {{ number_format($precioSoles, 2) }}</span>
                                            @endif
                                        </div>

                                        {{-- Dólares --}}
                                        @if($precioDolares)
                                            <div class="price-row-dolares">
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
                                            <div class="price-row-euros">
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
                                @if($imgSrc)
                                    <td class="prod-col-img">
                                        <img src="{{ $imgSrc }}" class="prod-img">
                                    </td>
                                @endif
                            @endif
                        </tr>
                    </table>
                </div>

                @if($prodIndex < $pageProducts->count() - 1)
                    <!-- Separator Line between products on the same page -->
                    <table class="divider-table">
                        <tr>
                            <td class="divider-line"></td>
                            <td class="divider-block"></td>
                            <td class="divider-line"></td>
                        </tr>
                    </table>
                @endif
            @endforeach
        </div>
    @endforeach

    <!-- DomPDF Script for Page Numbering (Página X de Y) -->
    <script type="text/php">
        if (isset($pdf)) {
            $font = $fontMetrics->get_font("Helvetica", "bold");
            $size = 9;
            $color = array(0.4, 0.4, 0.4);
            $text = "Página {PAGE_NUM} de {PAGE_COUNT}";
            $x = ($pdf->get_width() - $fontMetrics->get_text_width($text, $font, $size)) / 2;
            $y = $pdf->get_height() - 25;
            $pdf->page_text($x, $y, $text, $font, $size, $color);
        }
    </script>
</body>
</html>
