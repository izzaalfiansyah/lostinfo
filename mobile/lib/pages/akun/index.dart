// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/layouts/user.dart';
import 'package:mobile/libs/base64_image.dart';
import 'package:mobile/libs/format_date.dart';
import 'package:mobile/services/auth_service.dart';
import 'package:mobile/pages/akun/edit.dart';
import 'package:mobile/services/user_service.dart';
import '../../components/card.dart';
import '../../components/skeleton.dart';

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
  RxBool isLoading = true.obs;

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
            FutureBuilder(
              future: () async {
                final userId = await AuthService.get();
                return await UserService.find(id: userId);
              }(),
              builder: (context, snapshot) {
                final item = snapshot.data;

                return CardComponent(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(5),
                        ),
                        padding: EdgeInsets.all(10),
                        child: item != null
                            ? Image.network(
                                item.foto_url.toString(),
                                height: 200,
                                width: 200,
                                fit: BoxFit.cover,
                              )
                            : SkeletonComponent(
                                child: Container(
                                  height: 200,
                                  width: 200,
                                  color: Colors.white,
                                ),
                              ),
                      ),
                      SizedBox(height: 20),
                      item != null
                          ? Text(
                              item.nama.toString(),
                              style: TextStyle(
                                fontWeight: FontWeight.w600,
                                fontSize: 18,
                              ),
                            )
                          : SkeletonComponent(
                              child: Container(
                                width: double.infinity,
                                color: Colors.white,
                                height: 20,
                              ),
                            ),
                      SizedBox(height: 5),
                      item != null
                          ? Text("@${item.username.toString()}")
                          : SkeletonComponent(
                              child: Container(
                                width: Get.width / 3,
                                height: 10,
                                color: Colors.white,
                              ),
                            ),
                      SizedBox(height: 5),
                      item != null
                          ? Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                TextButton(
                                  onPressed: () {
                                    Get.to(AkunEditPage());
                                  },
                                  style: TextButton.styleFrom(
                                    padding:
                                        EdgeInsets.symmetric(horizontal: 20),
                                    backgroundColor: Colors.blue.shade100,
                                  ),
                                  child: Text(
                                    'Edit Akun',
                                  ),
                                ),
                                SizedBox(width: 8),
                                TextButton(
                                  onPressed: () {
                                    Get.bottomSheet(
                                      Container(
                                        padding: EdgeInsets.all(20),
                                        width: double.infinity,
                                        child: Column(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Base64Image(
                                                item.ktp_url.toString()),
                                            SizedBox(height: 20),
                                            ElevatedButton(
                                              onPressed: () => Get.back(),
                                              child:
                                                  Center(child: Text('Tutup')),
                                            )
                                          ],
                                        ),
                                      ),
                                      backgroundColor: Colors.white,
                                    );
                                  },
                                  style: OutlinedButton.styleFrom(
                                    foregroundColor: Colors.red,
                                    backgroundColor: Colors.red.shade100,
                                    padding:
                                        EdgeInsets.symmetric(horizontal: 20),
                                  ),
                                  child: Text(
                                    'Lihat KTP',
                                    style: TextStyle(
                                      color: Colors.red,
                                    ),
                                  ),
                                ),
                              ],
                            )
                          : SkeletonComponent(
                              child: Container(
                                height: 30,
                                color: Colors.white,
                              ),
                            ),
                      SizedBox(height: 20),
                      item != null
                          ? Column(
                              children: [
                                Row(
                                  crossAxisAlignment: CrossAxisAlignment.center,
                                  children: [
                                    Icon(
                                      Icons.pin_drop,
                                      color: Colors.grey,
                                    ),
                                    SizedBox(width: 10),
                                    Text(item.alamat.toString()),
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
                                    Text(item.email.toString()),
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
                                    Text(item.telepon.toString()),
                                  ],
                                ),
                              ],
                            )
                          : SkeletonComponent(
                              child: Container(
                                width: double.infinity,
                                height: 100,
                                color: Colors.white,
                              ),
                            ),
                      SizedBox(height: 20),
                      item != null
                          ? Row(
                              children: [
                                Text(
                                    'Bergabung pada ${formatDate(item.created_at.toString())}'),
                              ],
                            )
                          : SkeletonComponent(
                              child: Container(
                                height: 10,
                                width: double.infinity,
                                color: Colors.white,
                              ),
                            )
                    ],
                  ),
                );
              },
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
