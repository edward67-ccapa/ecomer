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
            $table->foreignId('parent_id')->nullable()->constrained('preguntas')->cascadeOnDelete()->after('seccion_id');
            $table->string('estructura')->default('objeto')->after('tipo');
            $table->unsignedInteger('max_items')->nullable()->after('estructura');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('preguntas', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropColumn(['parent_id', 'estructura', 'max_items']);
        });
    }
};
