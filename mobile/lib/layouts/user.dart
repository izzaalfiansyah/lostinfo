// ignore_for_file: prefer_const_constructors

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/libs/constant.dart';
import 'package:mobile/pages/akun/index.dart';
import 'package:mobile/services/auth_service.dart';

class UserLayout extends StatefulWidget {
  const UserLayout(
      {super.key, required this.child, required this.title, this.bottomNavBar});

  final Widget child;
  final String title;
  final Widget? bottomNavBar;

  @override
  State<UserLayout> createState() => _UserLayoutState();
}

class _UserLayoutState extends State<UserLayout> {
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    getAuthUser();
  }

  getAuthUser() async {
    setState(() {
      isLoading = true;
    });
    await AuthService.set('5');
    setState(() {
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: colorPrimary,
        foregroundColor: Colors.white,
        title: Text(widget.title),
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
      body: widget.child,
      bottomNavigationBar: widget.bottomNavBar,
    );
  }
}
