<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Crear tabla monedas
        Schema::create('monedas', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->unique(); // PEN, USD, EUR
            $table->string('nombre');          // Soles Peruanos, Dólares Estadounidenses
            $table->string('simbolo');         // S/, $, €
            $table->boolean('activa')->default(true);
            $table->timestamps();
        });

        // 2. Insertar monedas por defecto
        DB::table('monedas')->insert([
            [
                'codigo' => 'PEN',
                'nombre' => 'Soles Peruanos',
                'simbolo' => 'S/',
                'activa' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'codigo' => 'USD',
                'nombre' => 'Dólares Estadounidenses',
                'simbolo' => '$',
                'activa' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'codigo' => 'EUR',
                'nombre' => 'Euros',
                'simbolo' => '€',
                'activa' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // 3. Agregar moneda_id a tiendas
        Schema::table('tiendas', function (Blueprint $table) {
            $table->foreignId('moneda_id')->nullable()->after('estado')->constrained('monedas')->nullOnDelete();
        });

        // 4. Agregar moneda_id a sites
        Schema::table('sites', function (Blueprint $table) {
            $table->foreignId('moneda_id')->nullable()->after('tienda_id')->constrained('monedas')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sites', function (Blueprint $table) {
            $table->dropForeign(['moneda_id']);
            $table->dropColumn('moneda_id');
        });

        Schema::table('tiendas', function (Blueprint $table) {
            $table->dropForeign(['moneda_id']);
            $table->dropColumn('moneda_id');
        });

        Schema::dropIfExists('monedas');
    }
};
