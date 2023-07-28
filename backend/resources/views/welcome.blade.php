<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ env('APP_NAME') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="antialiased">
    <div
        class="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
        @if (Route::has('login'))
            <div class="sm:fixed sm:top-0 sm:right-0 p-6 text-right z-10">
                @auth
                    <a href="{{ url('/home') }}"
                        class="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500">Home</a>
                @else
                    <a href="{{ route('login') }}"
                        class="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500">Log
                        in</a>

                    @if (Route::has('register'))
                        <a href="{{ route('register') }}"
                            class="ml-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500">Register</a>
                    @endif
                @endauth
            </div>
        @endif

        <div class="max-w-7xl w-full mx-auto p-6 lg:p-8">

            <div class="mt-16">
                <div
                    class=" scale-100 p-6 bg-white dark:bg-gray-800/50 dark:bg-gradient-to-bl from-gray-700/50 via-transparent dark:ring-1 dark:ring-inset dark:ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 dark:shadow-none flex motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2 focus:outline-red-500">
                    <div class="w-full">
                        <div class="flex items-center space-x-5">
                            <div
                                class="h-16 w-16 bg-red-50 dark:bg-red-800/20 flex items-center justify-center rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" class="w-7 h-7 stroke-red-500">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                </svg>
                            </div>

                            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Dokumentasi API</h2>
                        </div>

                        <div class="mt-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            <div class="overflow-auto">
                                @php
                                    $routes = [
                                        [
                                            'path' => '/',
                                            'method' => 'GET',
                                            'parameter' => 'null',
                                            'deskripsi' => 'Menampilkan dokumentasi untuk penggunaan REST API',
                                        ],
                                        [
                                            'path' => '/privacy',
                                            'method' => 'GET',
                                            'parameter' => 'null',
                                            'deskripsi' => 'Menampilkan data-data privasi',
                                        ],
                                        [
                                            'path' => '/login',
                                            'method' => 'POST',
                                            'parameter' => 'username: string; password: string',
                                            'deskripsi' => 'Login ke akun user',
                                        ],
                                        [
                                            'path' => '/user',
                                            'method' => 'GET',
                                            'parameter' => "role?: '1' | '2' | '9'; status?: '1' | '0'; search?: string; limit: number; page: number",
                                            'deskripsi' => 'Menampilkan data user',
                                        ],
                                        [
                                            'path' => '/user',
                                            'method' => 'POST',
                                            'parameter' => "username: string; password: string; nama: string; alamat: string; email: string; telepon: string; foto: numeric; ktp: data_uri; role: '1' | '2'; status: '1' | '0' | '9'",
                                            'deskripsi' => 'Menambah data user',
                                        ],
                                        [
                                            'path' => '/user/{id}',
                                            'method' => 'PUT',
                                            'parameter' => "username: string; password?: string; nama: string; alamat: string; email: string; telepon: string; foto?: numeric; ktp?: data_uri; role: '1' | '2'; status: '1' | '0' | '9'",
                                            'deskripsi' => 'Mengedit data user',
                                        ],
                                        [
                                            'path' => '/user/{id}',
                                            'method' => 'DELETE',
                                            'parameter' => 'null',
                                            'deskripsi' => 'Menghapus data user',
                                        ],
                                        [
                                            'path' => '/user/{id}',
                                            'method' => 'GET',
                                            'parameter' => 'null',
                                            'deskripsi' => 'Menampilkan detail user',
                                        ],
                                        [
                                            'path' => '/user/{encrypt(md5(id))}/md5',
                                            'method' => 'GET',
                                            'parameter' => 'null',
                                            'deskripsi' => 'Menampilkan detail user menggunakan enkripsi md5',
                                        ],
                                        [
                                            'path' => '/user/lapor',
                                            'method' => 'POST',
                                            'parameter' => 'user_id: number; alasan: string',
                                            'deskripsi' => 'Melakukan lapor untuk user',
                                        ],
                                        [
                                            'path' => '/user/verifikasi/{encrypt(md5(id))}',
                                            'method' => 'GET',
                                            'parameter' => 'null',
                                            'deskripsi' => 'Memverifikasi akun user',
                                        ],
                                        [
                                            'path' => '/user/verifikasi/{id}',
                                            'method' => 'POST',
                                            'parameter' => 'null',
                                            'deskripsi' => 'Mengirimkan email untuk verifikasi akun',
                                        ],
                                        [
                                            'path' => '/user/reset-password',
                                            'method' => 'POST',
                                            'parameter' => 'username: string',
                                            'deskripsi' => 'Mengirimkan email untuk link reset password',
                                        ],
                                        [
                                            'path' => '/user/reset-password/{encrypt(md5(id))}',
                                            'method' => '{POST}',
                                            'parameter' => 'password: string',
                                            'deskripsi' => 'Mereset password akunn user',
                                        ],
                                        [
                                            'path' => '/barang/hilang',
                                            'method' => 'GET',
                                            'parameter' => "user_id?: number; ditemukan?: '1' | '0'; hadiah_min: number; hadiah_max: number; terdekat: maps_lat,maps_lng; search?: string; limit: number; page: number; orderBy?: string,'asc' | 'desc'",
                                            'deskripsi' => 'Menampilkan data barang hilang',
                                        ],
                                        [
                                            'path' => '/barang/hilang',
                                            'method' => 'POST',
                                            'parameter' => "user_id: integer; nama: string; deskripsi?: string; tempat_hilang: string; maps_lat?: float; maps_lng?: float; foto: data_uri; hadiah: number; ditemukan?: '1' | '0'",
                                            'deskripsi' => 'Menambah data barang hilang',
                                        ],
                                        [
                                            'path' => '/barang/hilang/{id}',
                                            'method' => 'PUT',
                                            'parameter' => "user_id: integer; nama: string; deskripsi?: string; tempat_hilang: string; maps_lat?: float; maps_lng?: float; foto: data_uri; hadiah: number; ditemukan?: '1' | '0'",
                                            'deskripsi' => 'Mengedit data barang hilang',
                                        ],
                                        [
                                            'path' => '/barang/hilang/{id}',
                                            'method' => 'DELETE',
                                            'parameter' => 'null',
                                            'deskripsi' => 'Menghapus data barang hilang',
                                        ],
                                        [
                                            'path' => '/barang/temu',
                                            'method' => 'GET',
                                            'parameter' => "user_id?: number; dikembalikan?: '1' | '0'; terdekat: maps_lat,maps_lng; search?: string; limit: number; page: number",
                                            'deskripsi' => 'Menampilkan data barang temu',
                                        ],
                                        [
                                            'path' => '/barang/temu',
                                            'method' => 'POST',
                                            'parameter' => "user_id: integer; nama: string; deskripsi?: string; tempat_temu: string; maps_lat?: float; maps_lng?: float; foto: data_uri; dikembalikan?: '1' | '0'",
                                            'deskripsi' => 'Menambah data barang temu',
                                        ],
                                        [
                                            'path' => '/barang/temu/{id}',
                                            'method' => 'PUT',
                                            'parameter' => "user_id: integer; nama: string; deskripsi?: string; tempat_temu: string; maps_lat?: float; maps_lng?: float; foto: data_uri; dikembalikan?: '1' | '0'",
                                            'deskripsi' => 'Mengedit data barang temu',
                                        ],
                                        [
                                            'path' => '/barang/temu/{id}',
                                            'method' => 'DELETE',
                                            'parameter' => 'null',
                                            'deskripsi' => 'Menghapus data barang temu',
                                        ],
                                        [
                                            'path' => '/grafik/barang',
                                            'method' => 'GET',
                                            'parameter' => 'tahun?: year',
                                            'deskripsi' => 'Menampilkan grafik data barang hilang dan temuan per tahun',
                                        ],
                                        [
                                            'path' => '/total/user',
                                            'method' => 'GET',
                                            'parameter' => 'tahun?: year',
                                            'deskripsi' => 'Menampilkan total pengguna',
                                        ],
                                        [
                                            'path' => '/total/barang/hilang',
                                            'method' => 'GET',
                                            'parameter' => 'tahun?: year',
                                            'deskripsi' => 'Menampilkan total barang hilang',
                                        ],
                                        [
                                            'path' => '/total/barang/temu',
                                            'method' => 'GET',
                                            'parameter' => 'tahun?: year',
                                            'deskripsi' => 'Menampilkan total barang temu',
                                        ],
                                    ];
                                @endphp
                                <table class="w-full">
                                    <thead>
                                        <tr>
                                            <td class="px-4 p-2">Path</td>
                                            <td class="px-4 p-2">Method</td>
                                            <td class="px-4 p-2">Parameter</td>
                                            <td class="px-4 p-2">Deskripsi</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach ($routes as $item)
                                            <tr class="border-t border-gray-600">
                                                <td class="px-4 p-2 text-red-700">{{ $item['path'] }}</td>
                                                <td class="px-4 p-2">{{ $item['method'] }}</td>
                                                <td class="px-4 p-2">{{ $item['parameter'] }}</td>
                                                <td class="px-4 p-2">{{ $item['deskripsi'] }}</td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-center mt-16 px-0 sm:items-center sm:justify-between">
                <div class="text-center text-sm text-gray-500 dark:text-gray-400 sm:text-left">
                    <div class="flex items-center gap-4">
                        <a href="https://github.com/sponsors/taylorotwell"
                            class="group inline-flex items-center hover:text-gray-700 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke-width="1.5"
                                class="-mt-px mr-1 w-5 h-5 stroke-gray-400 dark:stroke-gray-600 group-hover:stroke-gray-600 dark:group-hover:stroke-gray-400">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                            LostInfo
                        </a>
                    </div>
                </div>

                <div class="ml-4 text-center text-sm text-gray-500 dark:text-gray-400 sm:text-right sm:ml-0">
                    Politeknik Negeri Jember &copy; 2023
                </div>
            </div>
        </div>
    </div>
</body>

</html>
