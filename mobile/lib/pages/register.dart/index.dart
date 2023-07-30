// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/components/file_picker.dart';
import 'package:mobile/libs/notif.dart';
import 'package:mobile/models/user.dart';
import 'package:mobile/pages/login/index.dart';
import 'package:mobile/services/auth_service.dart';
import 'package:mobile/services/privacy_service.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _DaftarPageState();
}

class _DaftarPageState extends State<RegisterPage> {
  bool _isChekced = false;
  User user = User();
  List<String> privacy = [];
  bool isLoading = false;

  @override
  initState() {
    super.initState();
    getPrivacy();
  }

  getPrivacy() async {
    try {
      final data = await PrivacyService.get();
      setState(() {
        privacy = data;
      });
    } catch (e) {
      notif(e.toString(), success: false);
    }
  }

  register() async {
    setState(() {
      isLoading = true;
    });
    try {
      await AuthService.register(params: user);
      notif(
          'Akun berhasil terdafar. Periksa email anda untuk verifikasi akun!');
      Get.offAll(() => LoginPage());
    } on DioException catch (e) {
      notif(e.response!.data['message'], success: false);
    } catch (e) {
      notif(e.toString(), success: false);
    }
    setState(() {
      isLoading = false;
    });
  }

  showPrivacy() {
    final test = Get.to(
      () => Scaffold(
        body: SingleChildScrollView(
          padding: EdgeInsets.all(20),
          child: Column(
            children: [
              Column(
                children: List.generate(privacy.length, (index) {
                  return Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      Text('-'),
                      SizedBox(width: 5),
                      Expanded(
                        child: Text(
                          privacy[index],
                          style: TextStyle(
                            color: Colors.black,
                          ),
                        ),
                      ),
                    ],
                  );
                }),
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    _isChekced = true;
                  });
                  Get.back();
                },
                child: Center(
                  child: Text('Saya Setuju'),
                ),
              )
            ],
          ),
        ),
      ),
      fullscreenDialog: true,
    );

    return test;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          shadowColor: Colors.transparent,
          title: Text(
            'Register',
            style: TextStyle(fontSize: 30, fontWeight: FontWeight.bold),
          ),
          centerTitle: true,
        ),
        backgroundColor: Colors.white,
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.only(right: 30, left: 30),
            child: SingleChildScrollView(
              scrollDirection: Axis.vertical,
              child: Column(
                children: [
                  SizedBox(height: 90),
                  TextFormField(
                    enabled: !isLoading,
                    cursorColor: Colors.black,
                    decoration: InputDecoration(
                        contentPadding: EdgeInsets.all(10),
                        prefixIcon: Icon(
                          Icons.person_add_alt_1_outlined,
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
                        hintText: 'Masukkan nama anda',
                        labelText: 'Nama',
                        labelStyle: TextStyle(color: Colors.black)),
                    onChanged: (val) {
                      setState(() {
                        user.nama = val;
                      });
                    },
                  ),
                  SizedBox(height: 20),
                  TextFormField(
                    enabled: !isLoading,
                    maxLines: null,
                    cursorColor: Colors.black,
                    decoration: InputDecoration(
                        prefixIcon: Icon(
                          Icons.add_location_alt_outlined,
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
                        hintText: 'Masukkan alamat anda',
                        labelText: 'Alamat',
                        labelStyle: TextStyle(color: Colors.black)),
                    onChanged: (val) {
                      setState(() {
                        user.alamat = val;
                      });
                    },
                  ),
                  SizedBox(
                    height: 20,
                  ),
                  TextFormField(
                    enabled: !isLoading,
                    maxLength: 13,
                    cursorColor: Colors.black,
                    keyboardType: TextInputType.phone,
                    decoration: InputDecoration(
                        contentPadding: EdgeInsets.all(10),
                        prefixIcon: Icon(
                          Icons.phone_android_outlined,
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
                        hintText: 'Masukkan nomor anda yang aktif',
                        labelText: 'No. Handphone',
                        labelStyle: TextStyle(color: Colors.black)),
                    onChanged: (val) {
                      setState(() {
                        user.telepon = val;
                      });
                    },
                  ),
                  SizedBox(height: 20),
                  FilePicker(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.file_upload_outlined),
                        SizedBox(width: 5),
                        Text('Upload KTP'),
                      ],
                    ),
                    onChange: (val) {
                      setState(() {
                        user.ktp = val;
                      });
                    },
                  ),
                  SizedBox(height: 20),
                  TextFormField(
                    enabled: !isLoading,
                    cursorColor: Colors.black,
                    keyboardType: TextInputType.emailAddress,
                    decoration: InputDecoration(
                        contentPadding: EdgeInsets.all(10),
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
                        hintText: 'Masukkan e-mail anda',
                        labelText: 'E-mail',
                        labelStyle: TextStyle(color: Colors.black)),
                    onChanged: (val) {
                      setState(() {
                        user.email = val;
                        user.username = val;
                      });
                    },
                  ),
                  SizedBox(height: 20),
                  TextFormField(
                    enabled: !isLoading,
                    cursorColor: Colors.black,
                    obscureText: true,
                    obscuringCharacter: '*',
                    decoration: InputDecoration(
                        contentPadding: EdgeInsets.all(10),
                        prefixIcon: Icon(
                          Icons.lock_outline,
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
                        hintText: 'Masukkan password anda',
                        labelText: 'Password',
                        labelStyle: TextStyle(color: Colors.black)),
                    onChanged: (val) {
                      setState(() {
                        user.password = val;
                      });
                    },
                  ),
                  SizedBox(height: 20),
                  TextFormField(
                    enabled: !isLoading,
                    cursorColor: Colors.black,
                    obscureText: true,
                    obscuringCharacter: '*',
                    decoration: InputDecoration(
                        contentPadding: EdgeInsets.all(10),
                        prefixIcon: Icon(
                          Icons.lock_open_outlined,
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
                        hintText: 'Konfirmasi password anda',
                        labelText: 'Konfirmasi password',
                        labelStyle: TextStyle(color: Colors.black)),
                    onChanged: (val) {
                      setState(() {
                        user.konfirmasi_password = val;
                      });
                    },
                  ),
                  SizedBox(height: 110),
                  Row(
                    children: [
                      Checkbox(
                        value: _isChekced,
                        onChanged: (value) {
                          setState(() {
                            _isChekced = value ?? false;
                          });
                        },
                      ),
                      Expanded(
                        child: Wrap(
                          spacing: 5,
                          children: [
                            Text(
                              'Saya menyetujui',
                              style: TextStyle(fontSize: 17),
                            ),
                            InkWell(
                              child: Text(
                                'Syarat, Ketentuan & Kebijakan',
                                style: TextStyle(
                                    color: Colors.blue,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 17),
                              ),
                              onTap: () => showPrivacy(),
                            ),
                            Text(
                              ' yang berlaku',
                              style: TextStyle(fontSize: 17),
                            )
                          ],
                        ),
                      ),
                    ],
                  ),
                  SizedBox(
                    height: 10,
                  ),
                  ElevatedButton(
                    onPressed: isLoading
                        ? null
                        : () {
                            if (_isChekced) {
                              register();
                            } else {
                              showPrivacy();
                            }
                          },
                    style: ElevatedButton.styleFrom(
                        shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    )),
                    child: Container(
                      alignment: Alignment.center,
                      width: double.infinity,
                      height: 50,
                      child: Text(isLoading ? 'Memuat...' : 'Daftar',
                          style: TextStyle(
                            fontWeight: FontWeight.w500,
                            fontSize: 20,
                            color: Colors.white,
                          )),
                    ),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Sudah punya akun?',
                        style: TextStyle(color: Colors.black),
                      ),
                      TextButton(
                          onPressed: () {
                            Get.offAll(() => LoginPage());
                          },
                          child: Text(
                            'Masuk disini',
                            style: TextStyle(fontWeight: FontWeight.w500),
                          ))
                    ],
                  ),
                ],
              ),
            ),
          ),
        ));
  }
}
