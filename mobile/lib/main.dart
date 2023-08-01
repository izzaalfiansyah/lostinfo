// ignore_for_file: prefer_const_constructors
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/libs/constant.dart';
import 'package:mobile/pages/beranda/index.dart';
import 'package:midtrans_sdk/midtrans_sdk.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
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
        // primarySwatch: Colors.blue,
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
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(100),
            ),
          ),
        ),
      ),
      home: BerandaPage(),
    );
  }
}

class TesMidtrans extends StatefulWidget {
  const TesMidtrans({super.key});

  @override
  State<TesMidtrans> createState() => _TesMidtransState();
}

class _TesMidtransState extends State<TesMidtrans> {
  dynamic config = MidtransConfig(
    clientKey: "SB-Mid-client-R55gV11PW3-iDDAx",
    merchantBaseUrl: "https://app.sandbox.midtrans.com/",
    colorTheme: ColorTheme(
      colorPrimary: Colors.blue,
      colorPrimaryDark: Colors.blue,
      colorSecondary: Colors.blue,
    ),
  );

  dynamic bayar() async {
    final midtrans = await MidtransSDK.init(
      config: config,
    );

    midtrans.startPaymentUiFlow(token: '56b1fafe-e52a-4101-8aaa-b46202a313cd');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: ElevatedButton(
          onPressed: bayar,
          child: Text('TEST'),
        ),
      ),
    );
  }
}
