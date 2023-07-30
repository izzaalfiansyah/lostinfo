import 'package:mobile/libs/http.dart';
import 'package:mobile/models/user_lapor.dart';

class UserLaporService {
  static Future<List<UserLapor>> get({Map<String, dynamic>? filter}) async {
    final res = await http.get('/user/lapor', queryParameters: filter);
    List<UserLapor> items = (res.data['data'] as List)
        .map((item) => UserLapor.fromJSON(item))
        .toList();
    return items;
  }

  static Future<UserLapor> find({dynamic id}) async {
    final res = await http.get('/user/lapor/$id');
    UserLapor item = UserLapor.fromJSON(res.data['data']);
    return item;
  }

  static Future<UserLapor> create({required UserLapor params}) async {
    final res = await http.post('/user/lapor', data: params.toJSON());
    UserLapor item = UserLapor.fromJSON(res.data['data']);
    return item;
  }

  static Future<UserLapor> update(
      {required UserLapor params, required dynamic id}) async {
    final res = await http.put('/user/lapor/$id', data: params.toJSON());
    UserLapor item = UserLapor.fromJSON(res.data['data']);
    return item;
  }

  static Future<UserLapor> destroy({required dynamic id}) async {
    final res = await http.delete('/user/lapor/$id');
    UserLapor item = UserLapor.fromJSON(res.data['data']);
    return item;
  }
}
