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
        Schema::create('marcas', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('slug')->unique();
            $table->string('imagen')->nullable();
            $table->text('descripcion')->nullable();
            $table->integer('orden')->default(0);
            $table->boolean('activa')->default(true);
            $table->timestamps();
        });

        Schema::table('productos', function (Blueprint $table) {
            $table->foreignId('marca_id')->nullable()->constrained('marcas')->nullOnDelete();
        });

        Schema::create('site_marca', function (Blueprint $table) {
            $table->id();
            $table->foreignId('site_id')->constrained('sites')->cascadeOnDelete();
            $table->foreignId('marca_id')->constrained('marcas')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('plantilla_marca', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plantilla_id')->constrained('plantillas')->cascadeOnDelete();
            $table->foreignId('marca_id')->constrained('marcas')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plantilla_marca');
        Schema::dropIfExists('site_marca');

        Schema::table('productos', function (Blueprint $table) {
            $table->dropForeign(['marca_id']);
            $table->dropColumn('marca_id');
        });

        Schema::dropIfExists('marcas');
    }
};
