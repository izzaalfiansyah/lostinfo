import 'package:mobile/libs/http.dart';
import 'package:mobile/model/barang_hilang.dart';

class BarangHilangService {
  static Future<List<BarangHilang>> get({Map<String, dynamic>? filter}) async {
    final res = await http.get('/barang/hilang', queryParameters: filter);
    List<BarangHilang> items = (res.data['data'] as List)
        .map((item) => BarangHilang.fromJSON(item))
        .toList();
    return items;
  }

  static Future<BarangHilang> find({dynamic id}) async {
    final res = await http.get('/barang/hilang/$id');
    BarangHilang item = BarangHilang.fromJSON(res.data['data']);
    return item;
  }

  static Future<BarangHilang> create({required BarangHilang params}) async {
    final res = await http.post('/barang/hilang', data: params.toJSON());
    BarangHilang item = BarangHilang.fromJSON(res.data['data']);
    return item;
  }

  static Future<BarangHilang> update(
      {required BarangHilang params, required dynamic id}) async {
    final res = await http.put('/barang/hilang/$id', data: params.toJSON());
    BarangHilang item = BarangHilang.fromJSON(res.data['data']);
    return item;
  }

  static Future<BarangHilang> destroy(
      {required BarangHilang params, required dynamic id}) async {
    final res = await http.delete('/barang/hilang/$id', data: params.toJSON());
    BarangHilang item = BarangHilang.fromJSON(res.data['data']);
    return item;
  }
}
