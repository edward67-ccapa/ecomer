<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TikTokApiController extends Controller
{
    /**
     * Proxy request to TikTok oEmbed endpoint with caching to avoid CORS and 503 rate-limits.
     */
    public function oembed(Request $request): JsonResponse
    {
        $id = $request->query('id');
        $url = $request->query('url');

        if (! $url && $id) {
            $url = "https://www.tiktok.com/@tiktok/video/{$id}";
        }

        if (! $url) {
            return response()->json([
                'success' => false,
                'message' => 'El parámetro URL o ID de vídeo es requerido.'
            ], 400);
        }

        // Clean cache key based on video URL
        $cacheKey = 'tiktok_oembed_' . md5($url);

        // Cache response for 24 hours (86400 seconds)
        $data = Cache::remember($cacheKey, 86400, function () use ($url) {
            try {
                $response = Http::withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                    'Accept' => 'application/json',
                    'Accept-Language' => 'es-ES,es;q=0.9,en;q=0.8',
                ])
                ->timeout(5)
                ->get('https://www.tiktok.com/oembed', [
                    'url' => $url,
                ]);

                if ($response->successful()) {
                    $json = $response->json();
                    if (is_array($json) && !empty($json['thumbnail_url'])) {
                        return $json;
                    }
                }

                Log::warning("TikTok oEmbed devolvió estado {$response->status()} para {$url}");
            } catch (\Throwable $e) {
                Log::error("Error consultando oEmbed de TikTok: " . $e->getMessage());
            }

            return null;
        });

        if (! $data) {
            return response()->json([
                'success' => false,
                'thumbnail_url' => null,
                'author_name' => null,
                'author_unique_id' => null,
                'title' => null,
            ], 200, [
                'Access-Control-Allow-Origin' => '*',
            ]);
        }

        return response()->json(array_merge(['success' => true], $data), 200, [
            'Access-Control-Allow-Origin' => '*',
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }
}
