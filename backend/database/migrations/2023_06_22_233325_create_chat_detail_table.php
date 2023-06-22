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
        Schema::create('chat_detail', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('chat_id')->unsigned();
            $table->text('pesan')->nullable();
            $table->text('maps')->nullable();
            $table->text('foto')->nullable();
            $table->enum('pengirim', ['1', '2']);
            $table->enum('dibaca', [0, 1])->comment('0: belum, 1: sudah');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_detail');
    }
};
