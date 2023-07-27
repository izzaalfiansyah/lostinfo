<?php

use App\Http\Controllers\BarangHilangController;
use App\Http\Controllers\BarangTemuController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ChatDetailController;
use App\Http\Controllers\GrafikController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserLaporController;
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

Route::prefix('/grafik')->group(function () {
    Route::get('/barang', [GrafikController::class, 'barang']);
});

Route::prefix('/user')->group(function () {
    Route::get('/{id}/md5', [UserController::class, 'showByMd5Id']);
    Route::resource('/lapor', UserLaporController::class);
    Route::get('/verifikasi/{id}', [UserController::class, 'verifikasi']);
    Route::post('/verifikasi/{id}', [UserController::class, 'sendVerifikasi']);
    Route::post('/reset-password', [UserController::class, 'sendResetPassword']);
    Route::post('/reset-password/{id}', [UserController::class, 'resetPassword']);
});

Route::post('/login', [UserController::class, 'login']);
Route::apiResource('/user', UserController::class);
Route::apiResource('/barang/hilang', BarangHilangController::class);
Route::apiResource('/barang/temu', BarangTemuController::class);
Route::apiResource('/chat/detail', ChatDetailController::class)->only(['index', 'store', 'destroy']);
Route::apiResource('/chat', ChatController::class);
Route::get('/privacy', function () {
    $data = [
        'Pengguna dengan ini menyatakan bahwa pengguna adalah orang yang
        cakap dan mampu untuk mengikatkan dirinya dalam sebuah
        perjanjian yang sah menurut hukum. Pengguna yang tidak cakap dan
        mampu mengikatkan dirinya dalam sebuah perjanjian yang sah
        menurut hukum dalam mengakses Situs, menggunakan Situs dan/atau
        melakukan pendaftaran akun melalui situs LostInfo, atau
        melakukan aktivitas lain di Situs, dengan ini menyatakan bahwa
        seluruh tindakan-tindakan tersebut dilakukan dalam
        sepengetahuan, pengawasan dan persetujuan yang sah dari orang
        tua atau wali atau pengampu pengguna bagi yang berusia dibawah
        17 tahun.',
        'Sebelum menggunakan Situs, Pengguna menyetujui Syarat &
        Ketentuan ini dan Kebijakan Privasi.',
        'Untuk dapat melakukan Pendaftaran Akun LostInfo, Pengguna harus
        melakukan pendaftaran Akun terlebih dahulu pada Situs. Untuk
        menghindari keraguan, Manajemen Pelaksana tidak bekerja sama
        dengan pihak ketiga manapun dalam penyelenggaraan Pendaftaran
        Akun LostInfo.',
        'Pendaftaran Akun harus menggunakan email Pengguna yang masih
        aktif dan dilakukan verifikasi pada saat mendaftar.',
        'Dalam melakukan pendaftaran Akun, Pengguna wajib memasukkan data
        diri Pengguna yang meliputi, paling sedikit, (i) nama lengkap,
        (ii) alamat, (iii) email, (iv) telepon, (v) foto KTP, (vi)
        username, dan (vii) password atas nama Pengguna.',
        'Pengguna wajib mengisi dan/atau memberikan data atau informasi
        pada Situs dengan benar, dan Pengguna dilarang memberikan data
        atau informasi yang tidak benar dan/atau melakukan manipulasi
        data dan/atau pemalsuan data. Pengguna memahami bahwa pemberian
        data atau informasi yang tidak benar dapat dianggap sebagai
        suatu perbuatan melawan hukum yang dapat menimbulkan konsekuensi
        hukum, baik secara perdata dan/atau pidana sebagaimana diatur
        dalam, termasuk namun tidak terbatas pada, Kitab Undang-Undang
        Hukum Pidana dan Undang-Undang Nomor 11 Tahun 2008 tentang
        Informasi dan Transaksi Elektronik.',
        'Pengguna wajib bertanggungjawab atas barang temuan dengan
        bersungguh-sungguh. Pengguna memahami bahwa pertanggungjawaban
        atas barang temuan telah di atur di sisi hukum, tindakan
        mengambil barang yang ditemukan di tengah jalan untuk dimiliki,
        bisa dijerat Pasal 372 KUHP (tindak pidana penggelapan) atau
        Pasal 362 KUHP (tindak pidana pencurian).',
    ];

    return [
        'success' => true,
        'data' => $data,
    ];
});
