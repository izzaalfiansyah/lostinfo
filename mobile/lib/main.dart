// ignore_for_file: prefer_const_constructors
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/libs/constant.dart';
import 'package:mobile/pages/akun/index.dart';
import 'package:mobile/pages/beranda/index.dart';
// import 'package:shared_preferences/shared_preferences.dart';

void main() {
  // SharedPreferences.setMockInitialValues({'id': '5'});
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
          textTheme: GoogleFonts.poppinsTextTheme(),
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(seedColor: colorPrimary),
          inputDecorationTheme: InputDecorationTheme(
            floatingLabelBehavior: FloatingLabelBehavior.always,
            isDense: true,
            fillColor: Colors.grey.shade50,
            filled: true,
            contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
            border: UnderlineInputBorder(
              borderSide: BorderSide(width: 1),
            ),
            enabledBorder: UnderlineInputBorder(
              borderSide: BorderSide(color: Colors.grey.shade300),
            ),
            focusedBorder: UnderlineInputBorder(
              borderSide: BorderSide(color: colorPrimary),
            ),
            alignLabelWithHint: true,
          ),
          elevatedButtonTheme: ElevatedButtonThemeData(
              style: ElevatedButton.styleFrom(
            backgroundColor: colorPrimary,
            foregroundColor: Colors.white,
          ))),
      home: AkunPage(userId: '3'),
    );
  }
}
