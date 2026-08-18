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
        // 1. Agregar tienda_id a la tabla sites
        Schema::table('sites', function (Blueprint $table) {
            $table->foreignId('tienda_id')->nullable()->after('plantilla_id')->constrained('tiendas')->nullOnDelete();
        });

        // 2. Hacer site_id nullable en productos
        Schema::table('productos', function (Blueprint $table) {
            $table->foreignId('site_id')->nullable()->change();
        });

        // 3. Agregar tienda_id y hacer site_id nullable en categorias
        Schema::table('categorias', function (Blueprint $table) {
            $table->foreignId('tienda_id')->nullable()->after('site_id')->constrained('tiendas')->nullOnDelete();
            $table->foreignId('site_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categorias', function (Blueprint $table) {
            $table->dropForeign(['tienda_id']);
            $table->dropColumn('tienda_id');
        });

        Schema::table('sites', function (Blueprint $table) {
            $table->dropForeign(['tienda_id']);
            $table->dropColumn('tienda_id');
        });
    }
};
