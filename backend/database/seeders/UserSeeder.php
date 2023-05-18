<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::create([
            'username' => 'superadmin',
            'password' => Hash::make('superadmin'),
            'alamat' => 'Jember',
            'email' => 'superadmin@admin.com',
            'telepon' => '000000000000',
            'role' => '1',
            'status' => '1',
        ]);
    }
}
