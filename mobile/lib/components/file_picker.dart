// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/libs/base64_image.dart';
import 'package:mobile/libs/file_reader.dart';

class FilePicker extends StatelessWidget {
  const FilePicker({
    super.key,
    required this.child,
    this.onChange,
  });

  final Widget child;
  final Function(dynamic)? onChange;

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
        child: child,
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
                      if (onChange != null) {
                        onChange!(res);
                      }
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
