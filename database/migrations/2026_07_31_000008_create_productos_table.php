<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('site_id')->constrained()->cascadeOnDelete();
            $table->foreignId('categoria_id')->nullable()->constrained()->nullOnDelete();
            $table->string('nombre');
            $table->string('slug');
            $table->text('descripcion')->nullable();
            $table->decimal('precio', 10, 2);
            $table->decimal('precio_oferta', 10, 2)->nullable();
            $table->string('cantidad')->nullable();
            $table->unsignedInteger('stock')->default(0);
            $table->string('sku')->nullable();
            $table->string('imagen')->nullable();
            $table->json('imagenes')->nullable();
            $table->boolean('activo')->default(true);
            $table->boolean('destacado')->default(false);
            $table->unsignedSmallInteger('orden')->default(0);
            $table->timestamps();

            $table->unique(['site_id', 'slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
