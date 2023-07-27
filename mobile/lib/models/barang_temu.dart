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

  BarangTemu(
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
  );

  factory BarangTemu.fromJSON(data) {
    return BarangTemu(
      data['id'],
      data['user_id'],
      User.fromJSON(data['user']),
      data['nama'],
      data['deskripsi'],
      data['tempat_temu'],
      data['maps_lat'],
      data['maps_lng'],
      data['foto'],
      data['foto_url'],
      data['dikembalikan'],
      data['dikembalikan_detail'],
      data['created_at'],
      data['updated_at'],
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
