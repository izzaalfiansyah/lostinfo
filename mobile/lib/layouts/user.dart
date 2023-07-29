// ignore_for_file: prefer_const_constructors

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/libs/constant.dart';
import 'package:mobile/pages/akun/index.dart';

class UserLayout extends StatelessWidget {
  const UserLayout({super.key, required this.children, required this.title});

  final Widget children;
  final String title;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: colorPrimary,
        foregroundColor: Colors.white,
        title: Text(title),
        actions: [
          TextButton(
            style: TextButton.styleFrom(iconColor: Colors.white),
            onPressed: () {
              Get.to(AkunPage());
            },
            child: Icon(
              Icons.account_circle,
            ),
          )
        ],
      ),
      drawer: Drawer(),
      body: children,
    );
  }
}
