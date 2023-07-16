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
            'nama' => "Muhammad Izza alfiansyah",
            'alamat' => 'Jember',
            'email' => 'superadmin@admin.com',
            'telepon' => '081231921351',
            'ktp' => '-',
            'role' => '1',
            'status' => '1',
        ]);
    }
}
