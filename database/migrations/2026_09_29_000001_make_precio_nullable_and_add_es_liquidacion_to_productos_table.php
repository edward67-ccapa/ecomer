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
            $table->decimal('precio', 10, 2)->nullable()->change();
            if (! Schema::hasColumn('productos', 'es_liquidacion')) {
                $table->boolean('es_liquidacion')->default(false)->after('destacado');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->decimal('precio', 10, 2)->nullable(false)->change();
            if (Schema::hasColumn('productos', 'es_liquidacion')) {
                $table->dropColumn('es_liquidacion');
            }
        });
    }
};
