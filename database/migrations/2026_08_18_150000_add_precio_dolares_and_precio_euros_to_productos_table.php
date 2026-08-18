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
        Schema::table('productos', function (Blueprint $table) {
            $table->decimal('precio_dolares', 10, 2)->nullable()->after('precio');
            $table->decimal('precio_oferta_dolares', 10, 2)->nullable()->after('precio_oferta');
            $table->decimal('precio_euros', 10, 2)->nullable()->after('precio_dolares');
            $table->decimal('precio_oferta_euros', 10, 2)->nullable()->after('precio_oferta_dolares');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->dropColumn([
                'precio_dolares',
                'precio_oferta_dolares',
                'precio_euros',
                'precio_oferta_euros',
            ]);
        });
    }
};
