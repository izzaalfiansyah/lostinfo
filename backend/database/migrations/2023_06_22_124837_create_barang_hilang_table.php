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
        Schema::create('barang_hilang', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->unsigned();
            $table->string('nama');
            $table->text('deskripsi');
            $table->string('tempat_hilang')->coment('kemungkinan');
            $table->string('maps')->nullable();
            $table->string('foto')->nullable();
            $table->integer('hadiah');
            $table->enum('ditemukan', [0, 1])->comment('0: belum, 1: sudah');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barang_hilang');
    }
};
