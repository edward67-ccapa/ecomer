<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AdminNavTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_ve_plantillas_y_mis_sitios(): void
    {
        $user = User::factory()->create();
        $user->assignRole(Role::firstOrCreate(['name' => 'super_admin']));

        $response = $this->withoutExceptionHandling()->actingAs($user)->get('/admin/plantillas');

        $response->assertOk();
        $response->assertSee('Plantillas');
        $response->assertSee('Mis sitios');
    }
}
