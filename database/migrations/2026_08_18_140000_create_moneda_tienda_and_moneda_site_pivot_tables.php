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
        // 1. Tabla pivote moneda_tienda
        Schema::create('moneda_tienda', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tienda_id')->constrained()->cascadeOnDelete();
            $table->foreignId('moneda_id')->constrained()->cascadeOnDelete();
            $table->unique(['tienda_id', 'moneda_id']);
            $table->timestamps();
        });

        // 2. Tabla pivote moneda_site
        Schema::create('moneda_site', function (Blueprint $table) {
            $table->id();
            $table->foreignId('site_id')->constrained()->cascadeOnDelete();
            $table->foreignId('moneda_id')->constrained()->cascadeOnDelete();
            $table->unique(['site_id', 'moneda_id']);
            $table->timestamps();
        });

        // 3. Columna moneda_id en productos (opcional para especificar moneda del producto)
        Schema::table('productos', function (Blueprint $table) {
            $table->foreignId('moneda_id')->nullable()->after('categoria_id')->constrained('monedas')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->dropForeign(['moneda_id']);
            $table->dropColumn('moneda_id');
        });

        Schema::dropIfExists('moneda_site');
        Schema::dropIfExists('moneda_tienda');
    }
};
