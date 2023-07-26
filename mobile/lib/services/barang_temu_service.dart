import 'package:mobile/libs/http.dart';
import 'package:mobile/model/barang_temu.dart';

class BarangTemuService {
  static Future<List<BarangTemu>> get() async {
    final res = await http.get('/barang/temu');
    List<BarangTemu> items = (res.data['data'] as List)
        .map((item) => BarangTemu.fromJSON(item))
        .toList();
    return items;
  }

  static Future<BarangTemu> find({dynamic id}) async {
    final res = await http.get('/barang/temu/$id');
    BarangTemu item = BarangTemu.fromJSON(res.data['data']);
    return item;
  }

  static Future<BarangTemu> create({required BarangTemu params}) async {
    final res = await http.post('/barang/temu', data: params.toJSON());
    BarangTemu item = BarangTemu.fromJSON(res.data['data']);
    return item;
  }

  static Future<BarangTemu> update(
      {required BarangTemu params, required dynamic id}) async {
    final res = await http.put('/barang/temu/$id', data: params.toJSON());
    BarangTemu item = BarangTemu.fromJSON(res.data['data']);
    return item;
  }

  static Future<BarangTemu> destroy(
      {required BarangTemu params, required dynamic id}) async {
    final res = await http.delete('/barang/temu/$id', data: params.toJSON());
    BarangTemu item = BarangTemu.fromJSON(res.data['data']);
    return item;
  }
}