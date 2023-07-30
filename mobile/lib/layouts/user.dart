// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/libs/constant.dart';
import 'package:mobile/pages/akun/index.dart';
import 'package:mobile/pages/barang_hilang/index.dart';
import 'package:mobile/pages/barang_temu/index.dart';
import 'package:mobile/pages/beranda/index.dart';
import 'package:mobile/pages/login/index.dart';
import 'package:mobile/services/auth_service.dart';

class UserLayout extends StatefulWidget {
  const UserLayout(
      {super.key,
      required this.child,
      required this.title,
      this.bottomNavBar,
      this.floatingActionButton});

  final Widget child;
  final String title;
  final Widget? bottomNavBar;
  final Widget? floatingActionButton;

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

    final id = await AuthService.get();

    setState(() {
      isLoading = false;
    });

    if (id == null) {
      Get.offAll(() => LoginPage());
    }
  }

  logout() async {
    Get.bottomSheet(Container(
      color: Colors.white,
      width: double.infinity,
      padding: EdgeInsets.all(20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text('Anda yakin akan logout? Sesi anda akan terhapus permanen'),
          SizedBox(height: 20),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () async {
              await AuthService.logout();
              Get.offAll(() => LoginPage());
            },
            child: Center(
              child: Text('Logout'),
            ),
          ),
        ],
      ),
    ));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: colorPrimary,
        // foregroundColor: Colors.white,
        title: Text(widget.title),
        actions: [
          TextButton(
            style: TextButton.styleFrom(iconColor: Colors.white),
            onPressed: () {
              Get.to(() => AkunPage());
            },
            child: Icon(
              Icons.account_circle,
            ),
          )
        ],
      ),
      drawer: Drawer(
        child: Column(
          children: [
            Container(
              width: double.infinity,
              height: 180,
              color: colorPrimary,
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      mainAxisSize: MainAxisSize.max,
                      children: [
                        Image.network(
                          'https://polije.ac.id/wp-content/uploads/elementor/thumbs/LOGO-POLITEKNIK-NEGERI-JEMBER-200x200-p501e8qsx93hro564g7wmlj5f1d6bn1idluqt46f2o.png',
                          height: 80,
                          width: 80,
                        ),
                        SizedBox(
                          width: 10,
                        ),
                        Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Lost Info',
                              style: TextStyle(
                                  fontSize: 22,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.white),
                            ),
                            Text(
                              'Platform Informasi \nBarang Hilang',
                              style: TextStyle(
                                fontSize: 13,
                                color: Colors.white,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            Expanded(
                child: ListView(
              padding: EdgeInsets.only(top: 10),
              children: [
                ListTile(
                  dense: true,
                  leading: Icon(Icons.home),
                  title: Text(
                    'Beranda',
                    style: TextStyle(fontSize: 17),
                  ),
                  onTap: () {
                    Get.to(() => BerandaPage());
                  },
                ),
                ListTile(
                  dense: true,
                  leading: Icon(Icons.do_not_disturb_alt),
                  title: Text(
                    'Barang Hilang',
                    style: TextStyle(fontSize: 17),
                  ),
                  onTap: () {
                    Get.to(() => BarangHilangPage());
                  },
                ),
                ListTile(
                  dense: true,
                  leading: Icon(Icons.archive_outlined),
                  title: Text(
                    'Barang Temuan',
                    style: TextStyle(fontSize: 17),
                  ),
                  onTap: () {
                    Get.to(() => BarangTemuPage());
                  },
                ),
                ListTile(
                  dense: true,
                  leading: Icon(Icons.person_outline),
                  title: Text(
                    'Pengaturan Akun',
                    style: TextStyle(fontSize: 17),
                  ),
                  onTap: () {
                    Get.to(() => AkunPage());
                  },
                ),
                ListTile(
                  dense: true,
                  leading: Icon(Icons.logout),
                  title: Text(
                    'Keluar',
                    style: TextStyle(fontSize: 17),
                  ),
                  onTap: logout,
                ),
              ],
            ))
          ],
        ),
      ),
      body: widget.child,
      bottomNavigationBar: widget.bottomNavBar,
      floatingActionButton: widget.floatingActionButton,
    );
  }
}
