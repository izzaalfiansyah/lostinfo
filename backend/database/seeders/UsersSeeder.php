<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('id_ID');

        for ($i = 0; $i < 111; $i++) {
            $data[] = [
                'username' => $faker->userName(),
                'password' => Hash::make('12345678'),
                'nama' => $faker->name(),
                'alamat' => $faker->address(),
                'email' => $faker->email(),
                'telepon' => '081234876564',
                'role' => '2',
                'status' => ['0', '1', '9'][random_int(0, 2)],
                'remember_token' => '12345678',
                'ktp' => '/assets/user-ktp/5oc47bq6yf2b1mml3a3f.png',
            ];
        }

        User::insert($data);
    }
}
