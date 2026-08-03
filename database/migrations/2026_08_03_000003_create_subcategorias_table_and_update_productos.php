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
        Schema::create('subcategorias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('categoria_id')->constrained()->cascadeOnDelete();
            $table->string('nombre');
            $table->string('slug');
            $table->text('descripcion')->nullable();
            $table->string('imagen')->nullable();
            $table->unsignedSmallInteger('orden')->default(0);
            $table->boolean('activa')->default(true);
            $table->timestamps();

            $table->unique(['categoria_id', 'slug']);
        });

        Schema::table('productos', function (Blueprint $table) {
            $table->dropConstrainedForeignId('subcategoria_id');
        });

        Schema::table('productos', function (Blueprint $table) {
            $table->foreignId('subcategoria_id')
                ->nullable()
                ->after('categoria_id')
                ->constrained('subcategorias')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->dropConstrainedForeignId('subcategoria_id');
        });

        Schema::table('productos', function (Blueprint $table) {
            $table->foreignId('subcategoria_id')
                ->nullable()
                ->after('categoria_id')
                ->constrained('categorias')
                ->nullOnDelete();
        });

        Schema::dropIfExists('subcategorias');
    }
};
