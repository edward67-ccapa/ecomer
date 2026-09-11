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
        Schema::table('preguntas', function (Blueprint $table) {
            $table->integer('orden')->default(0)->change();
        });

        Schema::table('secciones', function (Blueprint $table) {
            $table->integer('orden')->default(0)->change();
        });
    }

    /**
     * Reverse the migrations.W
     */
    public function down(): void
    {
        Schema::table('preguntas', function (Blueprint $table) {
            $table->unsignedSmallInteger('orden')->default(0)->change();
        });

        Schema::table('secciones', function (Blueprint $table) {
            $table->unsignedSmallInteger('orden')->default(0)->change();
        });
    }
};
