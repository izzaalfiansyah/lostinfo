import 'package:mobile/models/user.dart';

class BarangTemu {
  dynamic id;
  dynamic user_id;
  User? user;
  String? nama;
  String? deskripsi;
  String? tempat_temu;
  double? maps_lat;
  double? maps_lng;
  String? foto;
  String? foto_url;
  String? dikembalikan;
  String? dikembalikan_detail;
  String? created_at;
  String? updated_at;

  BarangTemu({
    this.id,
    this.user_id,
    this.user,
    this.nama,
    this.deskripsi,
    this.tempat_temu,
    this.maps_lat,
    this.maps_lng,
    this.foto,
    this.foto_url,
    this.dikembalikan,
    this.dikembalikan_detail,
    this.created_at,
    this.updated_at,
  });

  factory BarangTemu.fromJSON(data) {
    return BarangTemu(
      id: data['id'],
      user_id: data['user_id'],
      user: User.fromJSON(data['user']),
      nama: data['nama'],
      deskripsi: data['deskripsi'],
      tempat_temu: data['tempat_temu'],
      maps_lat: data['maps_lat'],
      maps_lng: data['maps_lng'],
      foto: data['foto'],
      foto_url: data['foto_url'],
      dikembalikan: data['dikembalikan'],
      dikembalikan_detail: data['dikembalikan_detail'],
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
      'tempat_temu': tempat_temu,
      'maps_lat': maps_lat,
      'maps_lng': maps_lng,
      'foto': foto,
      'dikembalikan': dikembalikan,
      'created_at': created_at,
      'updated_at': updated_at,
    };
  }
}
