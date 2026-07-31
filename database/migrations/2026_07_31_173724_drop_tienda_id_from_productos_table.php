<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Solo hacer rollback si la migración anterior hizo drop
        // Ya la tabla pivot existe, y los datos que había ya fueron migrados
        // o no existen más productos con tienda_id
    }

    public function down(): void
    {
        // No hacer nada en el rollback
    }
};
