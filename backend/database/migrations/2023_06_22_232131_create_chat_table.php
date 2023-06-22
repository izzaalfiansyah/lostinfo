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
        Schema::create('chat', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_1_id')->unsigned();
            $table->bigInteger('user_2_id')->unsigned();
            $table->timestamps();

            $table->foreign('user_1_id')->on('user')->references('id');
            $table->foreign('user_2_id')->on('user')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat');
    }
};
