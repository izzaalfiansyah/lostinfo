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
        Schema::create('barang_temu', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->unsigned();
            $table->string('nama');
            $table->text('deskripsi')->nullable();
            $table->string('tempat_temu');
            $table->double('maps_lat')->nullable();
            $table->double('maps_lng')->nullable();
            $table->text('foto')->nullable();
            $table->enum('dikembalikan', [0, 1])->default('0')->comment('0: belum, 1: sudah');

            $table->foreign('user_id')->on('user')->references('id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barang_temu');
    }
};
