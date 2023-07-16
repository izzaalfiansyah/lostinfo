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
        Schema::create('user', function (Blueprint $table) {
            $table->id();
            $table->string('username');
            $table->string('password');
            $table->string('nama');
            $table->text('alamat');
            $table->string('email');
            $table->string('telepon');
            $table->string('foto')->nullable();
            $table->enum('role', [1, 2])->comment('1: admin, 2: user');
            $table->enum('status', [1, 0, 9])->comment('1: aktif, 0: nonaktif, 9: banned')->default('0');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user');
    }
};
