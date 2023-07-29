import 'package:get/get.dart';

class AuthContext extends GetxController {
  var id = '5'.obs;

  set(String val) {
    id.value = val;
  }

  get() {
    return id.value;
  }
}
