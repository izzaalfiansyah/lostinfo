// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/libs/notif.dart';
import 'package:mobile/services/auth_service.dart';

class VerifikasiPage extends StatefulWidget {
  const VerifikasiPage({super.key});

  @override
  State<VerifikasiPage> createState() => _VerifikasiPageState();
}

class _VerifikasiPageState extends State<VerifikasiPage> {
  String userId = '';
  bool isLoading = true;

  @override
  initState() {
    super.initState();
    getAuth();
  }

  Future getAuth() async {
    setState(() {
      isLoading = true;
    });

    final id = await AuthService.get();

    setState(() {
      userId = id.toString();
      isLoading = false;
    });
  }

  sendVerification() async {
    setState(() {
      isLoading = true;
    });
    try {
      await AuthService.sendVerify(userId: userId);
      notif('Email verifikasi terkirim. Periksa Email anda!');
    } on DioException catch (e) {
      notif(e.response!.data['message'], success: false);
    } catch (e) {
      notif(e.toString(), success: false);
    }
    setState(() {
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.blue[500],
        body: SingleChildScrollView(
          child: SizedBox(
            height: Get.height,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                SizedBox(
                  // height: size.height * 0.4,
                  child: Column(
                    children: [
                      SizedBox(height: 50),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            height: 150,
                            width: 150,
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(100),
                              // color: Colors.white,
                            ),
                            child: Image.network(
                              'https://polije.ac.id/wp-content/uploads/elementor/thumbs/LOGO-POLITEKNIK-NEGERI-JEMBER-200x200-p501e8qsx93hro564g7wmlj5f1d6bn1idluqt46f2o.png',
                              fit: BoxFit.cover,
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 30),
                      Container(
                        child: Text(
                          'Verifikasi Akun',
                          style: TextStyle(
                              fontSize: 30,
                              fontWeight: FontWeight.bold,
                              color: Colors.white),
                        ),
                      ),
                      SizedBox(height: 10),
                    ],
                  ),
                ),
                Container(
                  // width: 1000,
                  // height: size.height * .6,
                  padding: EdgeInsets.symmetric(horizontal: 30),
                  decoration: BoxDecoration(
                      boxShadow: [
                        BoxShadow(
                            color: Colors.black.withOpacity(.25),
                            blurRadius: 10)
                      ],
                      borderRadius:
                          BorderRadius.vertical(top: Radius.circular(50)),
                      color: Colors.white),
                  child: Column(
                    children: [
                      SizedBox(
                        height: 50,
                      ),
                      Text(
                          'Kami telah mengirimkan link verifikasi akun. Periksa email anda! Klik tombol di bawah untuk kirim ulang verifikasi apabila tidak ada email terbaru dari kami.'),
                      SizedBox(height: 20),
                      ElevatedButton(
                          onPressed: isLoading ? null : sendVerification,
                          style: ElevatedButton.styleFrom(
                              shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30),
                          )),
                          child: Container(
                            alignment: Alignment.center,
                            width: double.infinity,
                            height: 50,
                            child: Text(isLoading ? 'Memuat...' : 'Kirim Ulang',
                                style: TextStyle(
                                  fontWeight: FontWeight.w500,
                                  fontSize: 20,
                                  color: Colors.white,
                                )),
                          )),
                      SizedBox(height: 20),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ));
  }
}
