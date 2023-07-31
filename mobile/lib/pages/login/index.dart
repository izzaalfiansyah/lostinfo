// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/libs/notif.dart';
import 'package:mobile/pages/beranda/index.dart';
import 'package:mobile/pages/lupa_password/index.dart';
import 'package:mobile/pages/register.dart/index.dart';
import 'package:mobile/pages/verifikasi/index.dart';
import 'package:mobile/services/auth_service.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  String username = '';
  String password = '';
  bool showPassword = false;
  bool isLoading = false;

  @override
  void initState() {
    super.initState();
    getAuthUser();
  }

  getAuthUser() async {
    setState(() {
      isLoading = true;
    });

    final id = await AuthService.get();

    setState(() {
      isLoading = false;
    });

    if (id != null) {
      final status = await AuthService.getStatus();
      if (status == '0') {
        Get.offAll(() => VerifikasiPage());
      } else {
        Get.offAll(() => BerandaPage());
      }
    }
  }

  login() async {
    setState(() {
      isLoading = true;
    });
    try {
      final res =
          await AuthService.login(username: username, password: password);
      // if (res.role.toString() == '2') {
      AuthService.set(id: res.id.toString(), status: res.status.toString());
      if (res.status.toString() == '1') {
        notif('berhasil login', success: true);
        Get.to(() => BerandaPage());
      } else if (res.status.toString() == '9') {
        notif('Upss.. akun anda ter-banned, Silahkan hubungi admin',
            success: false);
      } else {
        Get.to(() => VerifikasiPage());
      }
      // }
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
                          'Login',
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
                          // keyboardType: TextInputType.emailAddress,
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
                              hintText: 'Username atau Email Anda',
                              labelText: 'Username atau Email',
                              labelStyle: TextStyle(color: Colors.black)),
                          onChanged: (val) {
                            setState(() {
                              username = val;
                            });
                          }),
                      SizedBox(height: 20),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          TextFormField(
                              enabled: !isLoading,
                              cursorColor: Colors.black,
                              obscureText: !showPassword,
                              obscuringCharacter: '*',
                              decoration: InputDecoration(
                                  suffixIcon: IconButton(
                                    onPressed: () {
                                      setState(() {
                                        showPassword = !showPassword;
                                      });
                                    },
                                    icon: Icon(
                                      showPassword
                                          ? Icons.remove_red_eye_outlined
                                          : Icons.lock_outline,
                                      color: Colors.black,
                                    ),
                                  ),
                                  prefixIcon: Icon(
                                    Icons.lock_outline,
                                    size: 30,
                                    color: Colors.black,
                                  ),
                                  border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(10)),
                                  focusedBorder: OutlineInputBorder(
                                      borderSide:
                                          BorderSide(color: Colors.black),
                                      borderRadius: BorderRadius.circular(10)),
                                  enabledBorder: OutlineInputBorder(
                                      borderSide:
                                          BorderSide(color: Colors.black),
                                      borderRadius: BorderRadius.circular(10)),
                                  hintText: 'Masukkan password anda',
                                  labelText: 'Password',
                                  labelStyle: TextStyle(color: Colors.black)),
                              onChanged: (val) {
                                setState(() {
                                  password = val;
                                });
                              }),
                          TextButton(
                              onPressed: () {
                                Get.to(() => LupaPasswordPage());
                              },
                              child: Text("Lupa password?")),
                        ],
                      ),
                      ElevatedButton(
                          onPressed: !isLoading ? login : null,
                          style: ElevatedButton.styleFrom(
                              shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30),
                          )),
                          child: Container(
                            alignment: Alignment.center,
                            width: double.infinity,
                            height: 50,
                            child: Text(isLoading ? 'Memuat...' : 'Masuk',
                                style: TextStyle(
                                  fontWeight: FontWeight.w500,
                                  fontSize: 20,
                                  color: Colors.white,
                                )),
                          )),
                      SizedBox(height: 20),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Expanded(
                            child: Divider(
                              color: Colors.black,
                              height: 1.5,
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 8),
                            child: Text(
                              "atau",
                              style: TextStyle(color: Colors.black),
                            ),
                          ),
                          Expanded(
                            child: Divider(
                              color: Colors.black,
                              height: 1.5,
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 20),
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton(
                          onPressed: () {},
                          style: ElevatedButton.styleFrom(
                            foregroundColor: Colors.black,
                            backgroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(30),
                            ),
                          ),
                          // icon: Image.asset(
                          //   'asset/google.png',
                          // ),
                          child: Text('Masuk dengan Google'),
                        ),
                      ),
                      SizedBox(height: 10),
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton(
                          onPressed: () {},
                          style: ElevatedButton.styleFrom(
                            foregroundColor: Colors.black,
                            backgroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(30),
                            ),
                          ),
                          // icon: Image.asset(
                          //   'asset/fb.png',
                          // ),
                          child: Text('Masuk dengan Facebook'),
                        ),
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Tidak punya akun?',
                            style: TextStyle(color: Colors.black),
                          ),
                          TextButton(
                            onPressed: () {
                              Get.to(() => RegisterPage());
                            },
                            child: Text(
                              'Daftar disini',
                              style: TextStyle(fontWeight: FontWeight.w500),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ));
  }
}
