import 'package:mobile/models/user.dart';

class BarangHilang {
  dynamic id;
  dynamic user_id;
  User? user;
  String? nama;
  String? deskripsi;
  String? tempat_hilang;
  double? maps_lat;
  double? maps_lng;
  String? foto;
  String? foto_url;
  int? hadiah;
  String? ditemukan;
  String? ditemukan_detail;
  String? created_at;
  String? updated_at;

  BarangHilang({
    this.id,
    this.user_id,
    this.user,
    this.nama,
    this.deskripsi,
    this.tempat_hilang,
    this.maps_lat,
    this.maps_lng,
    this.foto,
    this.foto_url,
    this.hadiah,
    this.ditemukan,
    this.ditemukan_detail,
    this.created_at,
    this.updated_at,
  });

  factory BarangHilang.fromJSON(data) {
    return BarangHilang(
      id: data['id'],
      user_id: data['user_id'],
      user: User.fromJSON(data['user']),
      nama: data['nama'],
      deskripsi: data['deskripsi'],
      tempat_hilang: data['tempat_hilang'],
      maps_lat: data['maps_lat'],
      maps_lng: data['maps_lng'],
      foto: data['foto'],
      foto_url: data['foto_url'],
      hadiah: data['hadiah'],
      ditemukan: data['ditemukan'],
      ditemukan_detail: data['ditemukan_detail'],
      created_at: data['created_at'],
      updated_at: data['updated_at'],
    );
  }

  toJSON() {
    return {
      'id': id,
      'user_id': user_id,
      'nama': nama,
      'deskripsi': deskripsi,
      'tempat_hilang': tempat_hilang,
      'maps_lat': maps_lat,
      'maps_lng': maps_lng,
      'foto': foto,
      'hadiah': hadiah,
      'ditemukan': ditemukan,
      'created_at': created_at,
      'updated_at': updated_at,
    };
  }
}
