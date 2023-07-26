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

  User(
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
  );

  factory User.fromJSON(data) {
    return User(
      data['id'],
      data['username'],
      data['nama'],
      data['alamat'],
      data['email'],
      data['telepon'],
      data['whatsapp'],
      data['foto'],
      data['foto_url'],
      data['ktp'],
      data['ktp_url'],
      data['role'],
      data['role_detail'],
      data['status'],
      data['status_detail'],
      data['created_at'],
      data['updated_at'],
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
    });
  }
}
