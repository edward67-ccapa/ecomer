<?php

namespace Tests\Unit;

use App\Services\ImageUploadService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;
use Tests\TestCase;

class ImageUploadServiceTest extends TestCase
{
    public function test_image_upload_service_stores_file()
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->create('test_product.jpg', 100, 'image/jpeg');

        // Create a temporary uploaded file mock
        $tempFile = $this->createMock(TemporaryUploadedFile::class);
        $tempFile->method('getRealPath')->willReturn($file->getRealPath());
        $tempFile->method('getClientOriginalName')->willReturn('test_product.jpg');
        $tempFile->method('store')->willReturnCallback(function ($dir, $disk) use ($file) {
            return Storage::disk($disk)->putFile($dir, $file);
        });

        $path = ImageUploadService::processAndSave($tempFile, 'productos', 'public');

        $this->assertNotEmpty($path);
        Storage::disk('public')->assertExists($path);
    }
}
