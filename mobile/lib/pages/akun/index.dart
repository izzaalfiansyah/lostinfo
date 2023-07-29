// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/contexts/auth_context.dart';
import 'package:mobile/layouts/user.dart';
import 'package:mobile/libs/base64_image.dart';
import 'package:mobile/libs/format_date.dart';
import 'package:mobile/libs/notif.dart';
import 'package:mobile/models/user.dart';
import 'package:mobile/models/user_lapor.dart';
import 'package:mobile/services/auth_service.dart';
import 'package:mobile/pages/akun/edit.dart';
import 'package:mobile/services/user_lapor_service.dart';
import 'package:mobile/services/user_service.dart';
import '../../components/card.dart';
import '../../components/skeleton.dart';

class AkunPage extends StatefulWidget {
  const AkunPage({super.key, this.userId});

  final String? userId;

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

  UserLapor userLapor = UserLapor();
  User user = User();
  RxInt selectedTab = 0.obs;

  bool isLoading = true;
  bool isMe = false;

  @override
  initState() {
    super.initState();
    getUser();
  }

  getUser() async {
    setState(() {
      isLoading = true;
    });

    try {
      final auth = Get.put(AuthContext());
      String? userId = auth.get();

      if (widget.userId != null) {
        userId = widget.userId;
      }

      final res = await UserService.find(id: userId);

      if (res.id.toString() == auth.get()) {
        setState(() {
          isMe = true;
        });
      }

      setState(() {
        user = res;
      });
    } catch (e) {
      notif(e.toString(), success: false);
    }

    setState(() {
      isLoading = false;
    });
  }

  changeTab(int index) {
    selectedTab.value = index;
  }

  handleLaporkan() async {
    setState(() {
      isLoading = true;
    });

    try {
      await UserLaporService.create(params: userLapor);
      Get.back();
      notif('pengguna telah dilaporkan');
    } catch (e) {
      notif(e.toString(), success: false);
    }

    setState(() {
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return UserLayout(
      title: isMe ? 'Akun' : 'Detail User',
      bottomNavBar: !isMe
          ? BottomNavigationBar(
              items: [
                BottomNavigationBarItem(
                    icon: Icon(
                      Icons.phone,
                      color: Colors.blue,
                    ),
                    label: 'Telepon'),
                BottomNavigationBarItem(
                    icon: Icon(
                      Icons.email,
                      color: Colors.red,
                    ),
                    label: 'Email'),
                BottomNavigationBarItem(
                    icon: Icon(
                      Icons.chat,
                      color: Colors.green,
                    ),
                    label: 'Whatsapp'),
              ],
              showSelectedLabels: false,
              showUnselectedLabels: false,
            )
          : null,
      child: SingleChildScrollView(
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
                    child: !isLoading
                        ? Image.network(
                            user.foto_url.toString(),
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
                  !isLoading
                      ? Text(
                          user.nama.toString(),
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
                  !isLoading
                      ? Text("@${user.username.toString()}")
                      : SkeletonComponent(
                          child: Container(
                            width: Get.width / 3,
                            height: 10,
                            color: Colors.white,
                          ),
                        ),
                  SizedBox(height: 5),
                  !isLoading
                      ? isMe
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
                                                user.ktp_url.toString()),
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
                          : Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                TextButton(
                                  onPressed: () async {
                                    userLapor.alasan = '';
                                    final userId = await AuthService.get();
                                    userLapor.pelapor_id = userId;
                                    userLapor.user_id = user.id;

                                    Get.bottomSheet(
                                      Container(
                                        padding: EdgeInsets.all(20),
                                        width: double.infinity,
                                        child: Column(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Text(
                                              'Laporkan Pengguna',
                                              style: TextStyle(
                                                  fontWeight: FontWeight.w600),
                                            ),
                                            SizedBox(height: 20),
                                            TextFormField(
                                              maxLines: 3,
                                              initialValue: userLapor.alasan,
                                              decoration: InputDecoration(
                                                labelText: 'Alasan',
                                                hintText:
                                                    'Berikan alasan seperti penipuan, pemalsuan data, dan lain-lain',
                                              ),
                                              onChanged: (val) {
                                                userLapor.alasan = val;
                                              },
                                            ),
                                            SizedBox(height: 20),
                                            ElevatedButton(
                                              style: ElevatedButton.styleFrom(
                                                backgroundColor: Colors.red,
                                              ),
                                              onPressed: isLoading
                                                  ? null
                                                  : handleLaporkan,
                                              child: Center(
                                                  child: Text(isLoading
                                                      ? 'Memuat...'
                                                      : 'Kirim Laporan')),
                                            )
                                          ],
                                        ),
                                      ),
                                      backgroundColor: Colors.white,
                                    );
                                  },
                                  style: OutlinedButton.styleFrom(
                                    foregroundColor: Colors.orange,
                                    backgroundColor: Colors.orange.shade100,
                                    padding:
                                        EdgeInsets.symmetric(horizontal: 20),
                                  ),
                                  child: Text(
                                    'Laporkan',
                                    style: TextStyle(
                                      color: Colors.orange,
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
                  !isLoading
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
                                Text(user.alamat.toString()),
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
                                Text(user.email.toString()),
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
                                Text(user.telepon.toString()),
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
                  !isLoading
                      ? Row(
                          children: [
                            Text(
                                'Bergabung pada ${formatDate(user.created_at.toString())}'),
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
