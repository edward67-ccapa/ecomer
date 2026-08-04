<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('respuestas', function (Blueprint $table) {
            $table->string('enlace')->nullable()->after('valor');
        });
    }

    public function down(): void
    {
        Schema::table('respuestas', function (Blueprint $table) {
            $table->dropColumn('enlace');
        });
    }
};
