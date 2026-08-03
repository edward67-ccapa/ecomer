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
        Schema::create('colores', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('slug');
            $table->string('hex')->nullable();
            $table->unsignedSmallInteger('orden')->default(0);
            $table->boolean('activa')->default(true);
            $table->timestamps();

            $table->unique('slug');
        });

        Schema::create('tallas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('slug');
            $table->unsignedSmallInteger('orden')->default(0);
            $table->boolean('activa')->default(true);
            $table->timestamps();

            $table->unique('slug');
        });

        Schema::table('variantes', function (Blueprint $table) {
            $table->dropColumn(['color', 'talla']);
        });

        Schema::table('variantes', function (Blueprint $table) {
            $table->foreignId('color_id')
                ->nullable()
                ->after('producto_id')
                ->constrained('colores')
                ->nullOnDelete();
            $table->foreignId('talla_id')
                ->nullable()
                ->after('color_id')
                ->constrained('tallas')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('variantes', function (Blueprint $table) {
            $table->dropConstrainedForeignId('color_id');
            $table->dropConstrainedForeignId('talla_id');
        });

        Schema::table('variantes', function (Blueprint $table) {
            $table->string('color')->nullable();
            $table->string('talla')->nullable();
        });

        Schema::dropIfExists('tallas');
        Schema::dropIfExists('colores');
    }
};
