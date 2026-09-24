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
        Schema::table('categorias', function (Blueprint $table) {
            if (!Schema::hasColumn('categorias', 'icono')) {
                $table->string('icono')->nullable()->after('imagen');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categorias', function (Blueprint $table) {
            if (Schema::hasColumn('categorias', 'icono')) {
                $table->dropColumn('icono');
            }
        });
    }
};
