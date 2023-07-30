// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/libs/notif.dart';
import 'package:mobile/models/user.dart';
import 'package:mobile/pages/login/index.dart';
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

  showPrivacy(context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(
            'Syarat, Ketentuan, dan Kebijakan',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          content: Column(
            children: [
              Column(
                children: List.generate(privacy.length, (index) {
                  return Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Icon(Icons.minimize),
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
              )
            ],
          ),
          actions: [
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('OK'),
            ),
          ],
        );
      },
    );
  }

  register() {}

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
        backgroundColor: Colors.grey[100],
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.only(right: 30, left: 30),
            child: SingleChildScrollView(
              scrollDirection: Axis.vertical,
              child: Column(
                children: [
                  SizedBox(height: 90),
                  TextFormField(
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
                  TextFormField(
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
                      });
                    },
                  ),
                  SizedBox(height: 20),
                  TextFormField(
                    cursorColor: Colors.black,
                    obscureText: true,
                    obscuringCharacter: '*',
                    decoration: InputDecoration(
                        contentPadding: EdgeInsets.all(10),
                        suffixIcon: IconButton(
                          onPressed: () {},
                          icon: Icon(
                            Icons.remove_red_eye_outlined,
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
                    cursorColor: Colors.black,
                    obscureText: true,
                    obscuringCharacter: '*',
                    decoration: InputDecoration(
                        contentPadding: EdgeInsets.all(10),
                        suffixIcon: IconButton(
                          onPressed: () {},
                          icon: Icon(
                            Icons.remove_red_eye_outlined,
                            color: Colors.black,
                          ),
                        ),
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
                                'Syarat & Ketentuan',
                                style: TextStyle(
                                    color: Colors.blue,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 17),
                              ),
                              onTap: () => showPrivacy(context),
                            ),
                            Text(
                              'dan',
                              style: TextStyle(fontSize: 17),
                            ),
                            InkWell(
                              child: Text(
                                'Kebijakan Privasi',
                                style: TextStyle(
                                    color: Colors.blue,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 17),
                              ),
                              onTap: () => showPrivacy(context),
                            ),
                            Text(
                              'yang berlaku',
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
                    onPressed: () {
                      if (_isChekced) {
                        register();
                      } else {
                        showDialog(
                          context: context,
                          builder: (BuildContext context) {
                            return AlertDialog(
                              title: Text(
                                'Pendaftaran Gagal!',
                                style: TextStyle(
                                    fontSize: 20, fontWeight: FontWeight.bold),
                              ),
                              content: Text(
                                  'Anda harus menyetujui Syarat & Ketentuan serta Kebijakan Privasi untuk melanjutkan.'),
                              actions: [
                                ElevatedButton(
                                  onPressed: () {
                                    Navigator.of(context).pop();
                                  },
                                  child: Text('OK'),
                                ),
                              ],
                            );
                          },
                        );
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
                      child: Text('Daftar',
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
