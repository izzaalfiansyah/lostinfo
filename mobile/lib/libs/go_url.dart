import 'package:mobile/libs/notif.dart';
import 'package:url_launcher/url_launcher.dart';

Future<void> goUrl(String url) async {
  try {
    if (!await launchUrl(Uri.parse(url))) {
      notif('Gagal membuka halaman', success: false);
    }
  } catch (e) {
    notif('Gagal membuka halaman', success: false);
  }
}
