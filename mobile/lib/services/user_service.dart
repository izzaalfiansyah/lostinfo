import 'package:mobile/libs/http.dart';
import 'package:mobile/models/user.dart';

class UserService {
  static Future<List<User>> get({Map<String, dynamic>? filter}) async {
    final res = await http.get('/user', queryParameters: filter);
    List<User> items =
        (res.data['data'] as List).map((item) => User.fromJSON(item)).toList();
    return items;
  }

  static Future<User> find({dynamic id}) async {
    final res = await http.get('/user/$id');
    User item = User.fromJSON(res.data['data']);
    return item;
  }

  static Future<User> create({required User params}) async {
    final res = await http.post('/user', data: params.toJSON());
    User item = User.fromJSON(res.data['data']);
    return item;
  }

  static Future<User> update(
      {required User params, required dynamic id}) async {
    final res = await http.put('/user/$id', data: params.toJSON());
    User item = User.fromJSON(res.data['data']);
    return item;
  }

  static Future<User> destroy({required dynamic id}) async {
    final res = await http.delete('/user/$id');
    User item = User.fromJSON(res.data['data']);
    return item;
  }
}
