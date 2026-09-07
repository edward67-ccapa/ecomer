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
        Schema::create('servicios', function (Blueprint $table) {
            $table->id();
            $table->string('titulo')->nullable();
            $table->string('subtitulo')->nullable();
            $table->text('descripcion')->nullable();
            $table->text('descripcioncorta')->nullable();
            $table->text('lista')->nullable();
            $table->string('icono')->nullable();
            $table->string('imagen')->nullable();
            $table->string('boton')->nullable();
            $table->string('url')->nullable();
            $table->integer('orden')->default(0);
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        Schema::create('site_servicio', function (Blueprint $table) {
            $table->foreignId('site_id')->constrained('sites')->cascadeOnDelete();
            $table->foreignId('servicio_id')->constrained('servicios')->cascadeOnDelete();
            $table->primary(['site_id', 'servicio_id']);
            $table->timestamps();
        });

        Schema::create('plantilla_servicio', function (Blueprint $table) {
            $table->foreignId('plantilla_id')->constrained('plantillas')->cascadeOnDelete();
            $table->foreignId('servicio_id')->constrained('servicios')->cascadeOnDelete();
            $table->primary(['plantilla_id', 'servicio_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plantilla_servicio');
        Schema::dropIfExists('site_servicio');
        Schema::dropIfExists('servicios');
    }
};
