<?php

use Illuminate\Database\Migrations\Migration;

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
