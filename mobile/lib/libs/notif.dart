// ignore_for_file: prefer_const_constructors

import 'package:flutter/material.dart';
import 'package:get/get.dart';

void notif(String message, {bool success = true}) {
  Get.showSnackbar(
    GetSnackBar(
      message: message,
      icon: Icon(
        success ? Icons.check_circle_outlined : Icons.warning_outlined,
        color: Colors.white,
      ),
      backgroundColor: success ? Colors.green : Colors.red,
      duration: Duration(seconds: 2),
    ),
  );
}
