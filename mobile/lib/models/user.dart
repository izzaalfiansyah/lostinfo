import 'dart:convert';

class User {
  dynamic id;
  String? username;
  String? nama;
  String? alamat;
  String? email;
  String? telepon;
  String? whatsapp;
  String? foto;
  String? foto_url;
  String? ktp;
  String? ktp_url;
  String? role;
  String? role_detail;
  String? status;
  String? status_detail;
  String? created_at;
  String? updated_at;
  String? password;
  String? konfirmasi_password;

  User({
    this.id,
    this.username,
    this.nama,
    this.alamat,
    this.email,
    this.telepon,
    this.whatsapp,
    this.foto,
    this.foto_url,
    this.ktp,
    this.ktp_url,
    this.role,
    this.role_detail,
    this.status,
    this.status_detail,
    this.created_at,
    this.updated_at,
    this.password,
    this.konfirmasi_password,
  });

  factory User.fromJSON(data) {
    return User(
      id: data['id'],
      username: data['username'],
      nama: data['nama'],
      alamat: data['alamat'],
      email: data['email'],
      telepon: data['telepon'],
      whatsapp: data['whatsapp'],
      foto: data['foto'],
      foto_url: data['foto_url'],
      ktp: data['ktp'],
      ktp_url: data['ktp_url'],
      role: data['role'],
      role_detail: data['role_detail'],
      status: data['status'],
      status_detail: data['status_detail'],
      created_at: data['created_at'],
      updated_at: data['updated_at'],
    );
  }

  toJSON() {
    return json.encode({
      'id': id,
      'username': username,
      'nama': nama,
      'alamat': alamat,
      'email': email,
      'telepon': telepon,
      'whatsapp': whatsapp,
      'foto': foto,
      'ktp': ktp,
      'role': role,
      'status': status,
      'password': password,
    });
  }
}
