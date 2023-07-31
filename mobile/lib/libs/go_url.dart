// ignore_for_file: prefer_const_constructors

import 'dart:io';

import 'package:mobile/libs/notif.dart';
import 'package:android_intent_plus/android_intent.dart';

Future<void> goUrl(String url) async {
  try {
    final uri = Uri.encodeFull(url);
    print(uri);
    if (Platform.isAndroid) {
      AndroidIntent intent = AndroidIntent(
        action: 'action_view',
        data: uri,
      );
      await intent.launch();
    } else {
      notif('Fitur untuk perangkat ini belum tersedia', success: false);
    }
  } catch (e) {
    notif('Gagal membuka halaman', success: false);
  }
}
