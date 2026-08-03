<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('respuestas', function (Blueprint $table) {
            $table->foreignId('site_id')->nullable()->change();
            $table->unique(['plantilla_id', 'pregunta_id']);
        });
    }

    public function down(): void
    {
        Schema::table('respuestas', function (Blueprint $table) {
            $table->dropUnique(['plantilla_id', 'pregunta_id']);
            $table->foreignId('site_id')->nullable(false)->change();
        });
    }
};
