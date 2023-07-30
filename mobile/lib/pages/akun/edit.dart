// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables

import 'package:flutter/material.dart';
import 'package:mobile/components/card.dart';
import 'package:mobile/components/file_picker.dart';
import 'package:mobile/components/form_group.dart';
import 'package:mobile/libs/constant.dart';
import 'package:mobile/libs/notif.dart';
import 'package:mobile/models/user.dart';
import 'package:mobile/services/auth_service.dart';
import 'package:mobile/services/user_service.dart';

class AkunEditPage extends StatefulWidget {
  const AkunEditPage({super.key});

  @override
  State<AkunEditPage> createState() => _AkunEditPageState();
}

class _AkunEditPageState extends State<AkunEditPage> {
  @override
  void initState() {
    getUser();
    super.initState();
  }

  final nama = TextEditingController();
  final alamat = TextEditingController();
  final email = TextEditingController();
  final telepon = TextEditingController();
  final username = TextEditingController();
  final password = TextEditingController();
  String foto = '';
  String id = '';
  String role = '';
  String status = '';

  bool isLoading = true;

  getUser() async {
    setState(() {
      isLoading = true;
    });

    final userId = await AuthService.get();
    final res = await UserService.find(id: userId);

    nama.text = res.nama.toString();
    alamat.text = res.alamat.toString();
    email.text = res.email.toString();
    telepon.text = res.telepon.toString();
    username.text = res.username.toString();

    setState(() {
      id = userId;
      status = res.status.toString();
      role = res.status.toString();
      isLoading = false;
    });
  }

  handleSave() async {
    User user = User(
      id: id,
      username: username.text,
      nama: nama.text,
      alamat: alamat.text,
      email: email.text,
      telepon: telepon.text,
      foto: foto,
      role: role,
      status: status,
    );

    setState(() {
      isLoading = true;
    });

    try {
      await UserService.update(params: user, id: id);
      notif('Berhasil menyimpan data');
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
      appBar: AppBar(
        backgroundColor: colorPrimary,
        title: Text('Edit Akun'),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(5),
        child: Column(
          children: [
            CardComponent(
              title: 'Pengaturan Akun',
              child: Column(
                children: [
                  FormGroup(
                    child: TextFormField(
                      enabled: !isLoading,
                      controller: nama,
                      decoration: InputDecoration(
                        hintText: 'Masukkan Nama',
                        labelText: 'Nama',
                      ),
                    ),
                  ),
                  FormGroup(
                    child: TextFormField(
                      enabled: !isLoading,
                      maxLines: 2,
                      controller: alamat,
                      decoration: InputDecoration(
                        hintText: 'Masukkan Alamat',
                        labelText: 'Alamat',
                      ),
                    ),
                  ),
                  FormGroup(
                    child: TextFormField(
                      enabled: !isLoading,
                      controller: email,
                      decoration: InputDecoration(
                        suffixIcon: Icon(Icons.email),
                        hintText: 'Masukkan Email',
                        labelText: 'Email',
                      ),
                    ),
                  ),
                  FormGroup(
                    child: TextFormField(
                      enabled: !isLoading,
                      controller: telepon,
                      decoration: InputDecoration(
                        suffixIcon: Icon(Icons.phone),
                        hintText: 'Masukkan Nomor Telepon',
                        labelText: 'Nomor Telepon',
                      ),
                    ),
                  ),
                  FormGroup(
                    child: Column(
                      children: [
                        FilePicker(
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.file_upload_outlined),
                              SizedBox(width: 8),
                              Text('Ganti Foto Profil'),
                            ],
                          ),
                          onChange: (res) {
                            setState(() {
                              foto = res;
                            });
                          },
                        ),
                        // FilePicker(
                        //   child: Row(
                        //     mainAxisAlignment: MainAxisAlignment.center,
                        //     children: [
                        //       Icon(Icons.fileuploadoutlined),
                        //       SizedBox(width: 8),
                        //       Text('Ganti Foto KTP'),
                        //     ],
                        //   ),
                        // )
                      ],
                    ),
                  ),
                  SizedBox(height: 10),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: colorPrimary,
                      foregroundColor: Colors.white,
                    ),
                    onPressed: !isLoading ? handleSave : null,
                    child: Container(
                      width: double.infinity,
                      alignment: Alignment.center,
                      child: Text('Simpan'),
                    ),
                  ),
                ],
              ),
            ),
            CardComponent(
              title: 'Autentikasi Akun',
              child: Column(
                children: [
                  FormGroup(
                    child: TextFormField(
                      enabled: !isLoading,
                      controller: username,
                      decoration: InputDecoration(
                        labelText: 'Username',
                        hintText: 'Masukkan Username',
                      ),
                    ),
                  ),
                  FormGroup(
                    child: TextFormField(
                      enabled: !isLoading,
                      controller: password,
                      obscureText: true,
                      decoration: InputDecoration(
                        labelText: 'Password',
                        hintText: '********',
                      ),
                    ),
                  ),
                  SizedBox(height: 10),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: colorPrimary,
                      foregroundColor: Colors.white,
                    ),
                    onPressed: !isLoading ? handleSave : null,
                    child: Container(
                      width: double.infinity,
                      alignment: Alignment.center,
                      child: Text('Simpan'),
                    ),
                  )
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
