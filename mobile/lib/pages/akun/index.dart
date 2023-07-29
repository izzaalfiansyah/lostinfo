// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/layouts/user.dart';
import 'package:mobile/libs/constant.dart';
import 'package:mobile/pages/akun/edit.dart';
import '../../components/card.dart';

class AkunPage extends StatefulWidget {
  const AkunPage({super.key});

  @override
  State<AkunPage> createState() => _AkunPageState();
}

class _AkunPageState extends State<AkunPage> {
  List tabs = [
    {
      'title': 'Barang Hilang',
      'component': Center(
        child: Text('Data Barang Hilang'),
      ),
    },
    {
      'title': 'Barang Temu',
      'component': Center(
        child: Text('Data Barang Temu'),
      ),
    }
  ];

  RxInt selectedTab = 0.obs;

  changeTab(int index) {
    selectedTab.value = index;
  }

  @override
  Widget build(BuildContext context) {
    return UserLayout(
      title: 'Akun',
      children: SingleChildScrollView(
        padding: EdgeInsets.all(5),
        child: Column(
          children: [
            CardComponent(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(5),
                    ),
                    padding: EdgeInsets.all(10),
                    child: Image.network(
                      'https://www.pngkey.com/png/detail/121-1219231_user-default-profile.png',
                      height: 200,
                      width: 200,
                      fit: BoxFit.cover,
                    ),
                  ),
                  SizedBox(height: 20),
                  Text(
                    'Muhammad Izza Alfiansyah',
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 18,
                    ),
                  ),
                  SizedBox(height: 5),
                  Text('@superadmin'),
                  SizedBox(height: 5),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      TextButton(
                        onPressed: () {
                          Get.to(AkunEditPage());
                        },
                        style: TextButton.styleFrom(
                          padding: EdgeInsets.symmetric(horizontal: 20),
                          backgroundColor: Colors.blue.shade100,
                        ),
                        child: Text(
                          'Edit Akun',
                        ),
                      ),
                      SizedBox(width: 8),
                      TextButton(
                        onPressed: () {},
                        style: OutlinedButton.styleFrom(
                          foregroundColor: Colors.red,
                          backgroundColor: Colors.red.shade100,
                          padding: EdgeInsets.symmetric(horizontal: 20),
                        ),
                        child: Text(
                          'Lihat KTP',
                          style: TextStyle(
                            color: Colors.red,
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 20),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.pin_drop,
                        color: Colors.grey,
                      ),
                      SizedBox(width: 10),
                      Text('Gumukmas, Jember'),
                    ],
                  ),
                  SizedBox(height: 5),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.email,
                        color: Colors.grey,
                      ),
                      SizedBox(width: 10),
                      Text('iansyah724@gmail.com'),
                    ],
                  ),
                  SizedBox(height: 5),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.phone,
                        color: Colors.grey,
                      ),
                      SizedBox(width: 10),
                      Text('081231921351'),
                    ],
                  ),
                  SizedBox(height: 20),
                  Row(
                    children: [
                      Text('Bergabung ada 20 Mei 2023'),
                    ],
                  )
                ],
              ),
            ),
            Card(
              child: GridView(
                padding: EdgeInsets.all(8),
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 8,
                  childAspectRatio: ((Get.width / 2) / 40),
                ),
                children: List.generate(
                  tabs.length,
                  (index) => Obx(
                    () => ElevatedButton(
                      onPressed: index != selectedTab.value
                          ? () {
                              changeTab(index);
                            }
                          : null,
                      child: Text(tabs[index]['title']),
                    ),
                  ),
                ),
              ),
            ),
            Obx(() =>
                CardComponent(child: tabs[selectedTab.value]['component'])),
          ],
        ),
      ),
    );
  }
}
