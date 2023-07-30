// ignore_for_file: prefer_const_constructors

import 'package:flutter/material.dart';
import 'package:get/get.dart';

class Img extends StatelessWidget {
  const Img(
      {super.key,
      required this.src,
      required this.width,
      required this.height});

  final String src;
  final double width;
  final double height;

  void showImage() {
    Get.bottomSheet(
      Container(
        padding: EdgeInsets.all(20),
        width: double.infinity,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Image.network(
              src,
              // width: 100,
              height: 200,
              fit: BoxFit.cover,
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => Get.back(),
              child: Center(child: Text('Tutup')),
            )
          ],
        ),
      ),
      backgroundColor: Colors.white,
    );
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: showImage,
      child: Image.network(
        src,
        width: width,
        height: height,
      ),
    );
  }
}
