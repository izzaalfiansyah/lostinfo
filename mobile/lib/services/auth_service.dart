import 'dart:convert';
import 'dart:io';
import 'package:mobile/libs/http.dart';
import 'package:mobile/models/user.dart';
import 'package:mobile/services/user_service.dart';
import 'package:path_provider/path_provider.dart';
// import 'package:shared_preferences/shared_preferences.dart';

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

  static Future sendVerify({required dynamic userId}) async {
    return await http.post('/user/verifikasi/$userId');
  }

  static Future sendResetPassword({required String email}) async {
    return await http.post('/user/reset-password', data: {
      'email': email,
    });
  }

  static Future<void> set({required dynamic id, required String status}) async {
    final dir = await getApplicationDocumentsDirectory();
    final path = dir.path;

    final fileId = File("$path/authid.txt");
    final fileStatus = File("$path/authstatus.txt");

    await fileId.writeAsString(id);
    await fileStatus.writeAsString(status);
  }

  static Future<String?> get() async {
    // return '5';
    final dir = await getApplicationDocumentsDirectory();
    final path = dir.path;
    try {
      final fileId = File("$path/authid.txt");
      final id = await fileId.readAsString();

      return id;
    } catch (e) {
      return null;
    }
  }

  static Future<String?> getStatus() async {
    // return '1';
    final dir = await getApplicationDocumentsDirectory();
    final path = dir.path;
    try {
      final fileStatus = File("$path/authstatus.txt");
      final status = await fileStatus.readAsString();

      return status;
    } catch (e) {
      return null;
    }
  }

  static Future logout() async {
    final dir = await getApplicationDocumentsDirectory();
    final path = dir.path;

    final fileId = File("$path/authid.txt");
    final fileStatus = File("$path/authstatus.txt");

    await fileId.delete();
    await fileStatus.delete();
  }
}
