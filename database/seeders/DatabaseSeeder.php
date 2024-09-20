<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        for ($i = 1; $i <= 20; $i++) {
            $user = new User();
            $user->name = 'user ' . $i;
            $user->email = 'user' . $i . '@test.com';
            $user->password = Hash::make('password');
            $user->email_verified_at = now();
            $user->remember_token = Str::random(10);
            $user->avatar = 'https://avatar.iran.liara.run/public';
            $user->save();
        }
    }
}
