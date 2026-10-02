<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('producto_tienda')) {
            Schema::table('producto_tienda', function (Blueprint $table) {
                if (! Schema::hasColumn('producto_tienda', 'stock')) {
                    $table->integer('stock')->nullable()->after('tienda_id');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('producto_tienda')) {
            Schema::table('producto_tienda', function (Blueprint $table) {
                if (Schema::hasColumn('producto_tienda', 'stock')) {
                    $table->dropColumn('stock');
                }
            });
        }
    }
};
