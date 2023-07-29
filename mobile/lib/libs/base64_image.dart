// ignore_for_file: non_constant_identifier_names

import 'dart:convert';
import 'package:flutter/material.dart';

Base64Image(String base64) {
  String b64 = base64.split(';base64,')[1];
  final bytesImage = const Base64Decoder().convert(b64);
  return Image.memory(bytesImage);
}
