import 'dart:convert';
import 'package:mobile/libs/http.dart';
import 'package:mobile/model/user.dart';
import 'package:mobile/services/user_service.dart';

class AuthService {
  static Future<User> login({required username, required password}) async {
    final data = json.encode({
      'username': username,
      'password': password,
    });

    final res = await http.post('/login', data: data);
    User user = User.fromJSON(res.data['data']);
    return user;
  }

  static Future<User> register({required User params}) async {
    params.status = '0';
    params.role = '2';

    return await UserService.create(params: params);
  }
}
