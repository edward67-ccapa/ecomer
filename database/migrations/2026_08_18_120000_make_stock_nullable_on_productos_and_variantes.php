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
            $table->unsignedInteger('stock')->nullable()->default(null)->change();
        });

        Schema::table('variantes', function (Blueprint $table) {
            $table->unsignedInteger('stock')->nullable()->default(null)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->unsignedInteger('stock')->default(0)->change();
        });

        Schema::table('variantes', function (Blueprint $table) {
            $table->unsignedInteger('stock')->default(0)->change();
        });
    }
};
