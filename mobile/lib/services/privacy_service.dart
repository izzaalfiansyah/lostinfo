import 'package:mobile/libs/http.dart';

class PrivacyService {
  static Future<List<String>> get() async {
    final res = await http.get('/privacy');
    List<String> items =
        (res.data['data'] as List).map(((item) => item.toString())).toList();

    return items;
  }
}
