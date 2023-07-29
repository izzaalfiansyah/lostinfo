// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/components/card.dart';
import 'package:mobile/components/file_picker.dart';
import 'package:mobile/components/form_group.dart';
import 'package:mobile/layouts/user.dart';
import 'package:mobile/libs/base64_image.dart';
import 'package:mobile/libs/constant.dart';
import 'package:mobile/libs/file_reader.dart';

class AkunEditPage extends StatefulWidget {
  const AkunEditPage({super.key});

  @override
  State<AkunEditPage> createState() => _AkunEditPageState();
}

class _AkunEditPageState extends State<AkunEditPage> {
  @override
  Widget build(BuildContext context) {
    return UserLayout(
      title: 'Edit Akun',
      children: SingleChildScrollView(
        padding: EdgeInsets.all(5),
        child: Column(
          children: [
            CardComponent(
              title: 'Pengaturan Akun',
              child: Column(
                children: [
                  FormGroup(
                    child: TextFormField(
                      decoration: InputDecoration(
                        hintText: 'Masukkan Nama',
                        labelText: 'Nama',
                      ),
                    ),
                  ),
                  FormGroup(
                    child: TextFormField(
                      maxLines: 2,
                      decoration: InputDecoration(
                        hintText: 'Masukkan Alamat',
                        labelText: 'Alamat',
                      ),
                    ),
                  ),
                  FormGroup(
                    child: TextFormField(
                      decoration: InputDecoration(
                        suffixIcon: Icon(Icons.email),
                        hintText: 'Masukkan Email',
                        labelText: 'Email',
                      ),
                    ),
                  ),
                  FormGroup(
                    child: TextFormField(
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
                        ),
                        // FilePicker(
                        //   child: Row(
                        //     mainAxisAlignment: MainAxisAlignment.center,
                        //     children: [
                        //       Icon(Icons.file_upload_outlined),
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
                    onPressed: () {},
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
                      decoration: InputDecoration(
                        labelText: 'Username',
                        hintText: 'Masukkan Username',
                      ),
                    ),
                  ),
                  FormGroup(
                    child: TextFormField(
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
                    onPressed: () {},
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

class FileInput extends StatelessWidget {
  const FileInput({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.blue.shade50,
        foregroundColor: Colors.blue,
      ),
      child: Container(
        width: double.infinity,
        alignment: Alignment.center,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.file_upload_outlined),
            SizedBox(width: 8),
            Text('Ganti Foto Profil'),
          ],
        ),
      ),
      onPressed: () async {
        final res = await fileReader();
        if (res != null) {
          Get.bottomSheet(
            Container(
              padding: EdgeInsets.all(20),
              width: double.infinity,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(5),
                    child: Base64Image(res),
                  ),
                  SizedBox(height: 10),
                  ElevatedButton(
                    onPressed: () {
                      // change photo
                      Get.back();
                    },
                    child: Container(
                      width: double.infinity,
                      alignment: Alignment.center,
                      child: Text('Ganti Foto'),
                    ),
                  )
                ],
              ),
            ),
            backgroundColor: Colors.white,
          );
        }
      },
    );
  }
}
