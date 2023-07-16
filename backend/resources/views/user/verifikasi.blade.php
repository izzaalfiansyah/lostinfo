<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Verifikasi Akun Pengguna</title>
</head>
<body>
  Halo {{ $user->nama }}! Klik di <a href="{{ url('/user/verifikasi/' . $user->id . '?token=' . $user->remember_token) }}"></a>sini untuk verifikasi akun anda ({{ '@' . $user->username }}).
</body>
</html>
