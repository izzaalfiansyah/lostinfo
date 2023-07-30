// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/libs/notif.dart';
import 'package:mobile/services/auth_service.dart';

class LupaPasswordPage extends StatefulWidget {
  const LupaPasswordPage({super.key});

  @override
  State<LupaPasswordPage> createState() => _LupaPasswordPageState();
}

class _LupaPasswordPageState extends State<LupaPasswordPage> {
  String email = '';
  bool isLoading = false;

  resetPassword() async {
    setState(() {
      isLoading = true;
    });
    try {
      await AuthService.sendResetPassword(email: email);
      notif('Link reset password berhasil terkirim');
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
          child: Container(
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
                          'Reset Password',
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
                      TextFormField(
                          enabled: !isLoading,
                          cursorColor: Colors.black,
                          keyboardType: TextInputType.emailAddress,
                          decoration: InputDecoration(
                              prefixIcon: Icon(
                                Icons.email_outlined,
                                size: 30,
                                color: Colors.black,
                              ),
                              border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(10)),
                              focusedBorder: OutlineInputBorder(
                                  borderSide: BorderSide(color: Colors.black),
                                  borderRadius: BorderRadius.circular(10)),
                              enabledBorder: OutlineInputBorder(
                                  borderSide: BorderSide(color: Colors.black),
                                  borderRadius: BorderRadius.circular(10)),
                              hintText: 'Masukkan Email Anda',
                              labelText: 'Email',
                              labelStyle: TextStyle(color: Colors.black)),
                          onChanged: (val) {
                            setState(() {
                              email = val;
                            });
                          }),
                      SizedBox(height: 10),
                      Text(
                        'Kami akan mengirimkan link untuk melakukan reset password ke email aktif anda.',
                      ),
                      SizedBox(height: 20),
                      ElevatedButton(
                          onPressed: !isLoading ? resetPassword : null,
                          style: ElevatedButton.styleFrom(
                              shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30),
                          )),
                          child: Container(
                            alignment: Alignment.center,
                            width: double.infinity,
                            height: 50,
                            child:
                                Text(isLoading ? 'Memuat...' : 'Reset Password',
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
