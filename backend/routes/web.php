<?php

use App\Http\Controllers\BarangHilangController;
use App\Http\Controllers\BarangTemuController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ChatDetailController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::post('/login', [UserController::class, 'login']);
Route::apiResource('/user', UserController::class);
Route::apiResource('/barang/hilang', BarangHilangController::class);
Route::apiResource('/barang/temu', BarangTemuController::class);
Route::apiResource('/chat/detail', ChatDetailController::class)->only(['index', 'store', 'destroy']);
Route::apiResource('/chat', ChatController::class);
