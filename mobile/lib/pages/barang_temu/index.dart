// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/components/card.dart';
import 'package:mobile/components/form_group.dart';
import 'package:mobile/components/skeleton.dart';
import 'package:mobile/layouts/user.dart';
import 'package:mobile/libs/constant.dart';
import 'package:mobile/libs/notif.dart';
import 'package:mobile/models/barang_temu.dart';
import 'package:mobile/pages/akun/index.dart';
import 'package:mobile/pages/barang_temu/detail.dart';
import 'package:mobile/pages/barang_temu/save.dart';
import 'package:mobile/services/auth_service.dart';
import 'package:mobile/services/barang_temu_service.dart';

class BarangTemuPage extends StatefulWidget {
  const BarangTemuPage({super.key, this.userId});
  final String? userId;

  @override
  State<BarangTemuPage> createState() => _BarangTemuPageState();
}

class _BarangTemuPageState extends State<BarangTemuPage> {
  Map<String, dynamic> filter = {
    'limit': 10,
    'dikembalikan': '0',
    'page': 1,
  };
  List<BarangTemu> barangTemu = [];
  bool isLoading = true;
  String authId = '';

  @override
  void initState() {
    super.initState();

    getUser().then((value) {
      getBarangTemu();
    });
  }

  Future getUser() async {
    if (widget.userId != null) {
      setState(() {
        filter['dikembalikan'] = '';
        filter['user_id'] = widget.userId;
      });
    }

    final auth = await AuthService.get();
    setState(() {
      authId = auth.toString();
    });
    return auth;
  }

  Future getBarangTemu() async {
    setState(() {
      isLoading = true;
    });

    try {
      if (filter['page'] == 1) {
        setState(() {
          barangTemu.clear();
        });
      }

      final res = await BarangTemuService.get(filter: filter);
      final oldBarangTemuLength = barangTemu.length;
      setState(() {
        barangTemu.addAll(res);
      });

      if (barangTemu.length == oldBarangTemuLength && barangTemu.isNotEmpty) {
        notif('semua data telah ditampilkan');
      }
    } on DioException catch (e) {
      notif(e.response!.data['message'], success: false);
    } catch (e) {
      notif(e.toString(), success: false);
    }

    setState(() {
      isLoading = false;
    });
  }

  void showFilterModal() {
    Get.bottomSheet(Container(
      color: Colors.white,
      width: double.infinity,
      padding: EdgeInsets.all(20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          FormGroup(
            child: TextFormField(
              initialValue: filter['search'],
              decoration: InputDecoration(
                hintText: 'Ketikkan sesuatu..',
                labelText: 'Pencarian',
              ),
              onChanged: (val) {
                setState(() {
                  filter['search'] = val;
                });
              },
            ),
          ),
          SizedBox(height: 20),
          ElevatedButton(
            onPressed: () {
              setState(() {
                filter['page'] = 1;
              });
              getBarangTemu();
              Get.back();
            },
            child: Center(
              child: Text('Terapkan'),
            ),
          ),
        ],
      ),
    ));
  }

  handleDelete(BarangTemu item) {
    Get.bottomSheet(Container(
      color: Colors.white,
      padding: EdgeInsets.all(20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Anda yakin untuk menghapus ${item.nama}?'),
          SizedBox(height: 10),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
            ),
            onPressed: () async {
              try {
                await BarangTemuService.destroy(id: item.id);
                Get.back();
                notif('barang berhasil dihapus');
                getBarangTemu();
              } on DioException catch (e) {
                notif(e.response!.data['message'], success: false);
              } catch (e) {
                notif(e.toString(), success: false);
              }
            },
            child: Center(
              child: Text('Hapus'),
            ),
          ),
        ],
      ),
    ));
  }

  dataBarang() {
    return Column(
      children: [
        !isLoading && barangTemu.isEmpty
            ? CardComponent(
                child: Center(
                  child: Text('data barang tidak tersedia'),
                ),
              )
            : SizedBox(),
        GridView.count(
          padding: EdgeInsets.all(5),
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: NeverScrollableScrollPhysics(),
          mainAxisSpacing: 5,
          crossAxisSpacing: 5,
          childAspectRatio: (Get.width / (520)),
          children: List.generate(barangTemu.length, (index) {
            final item = barangTemu[index];

            return Container(
              decoration: BoxDecoration(
                color: Colors.white,
              ),
              child: InkWell(
                onTap: () {
                  Get.to(() => BarangTemuDetailPage(id: item.id.toString()));
                },
                child: Column(
                  children: [
                    Image.network(
                      item.foto_url.toString(),
                      width: Get.width / 2 - 10,
                      height: Get.width / 2 - 10,
                      fit: BoxFit.cover,
                    ),
                    Expanded(
                      child: Center(
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.start,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            SizedBox(width: 10),
                            GestureDetector(
                              onTap: () {
                                Get.to(() =>
                                    AkunPage(userId: item.user_id.toString()));
                              },
                              child: CircleAvatar(
                                backgroundImage: NetworkImage(
                                    item.user!.foto_url.toString()),
                              ),
                            ),
                            SizedBox(width: 10),
                            Expanded(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    item.nama.toString(),
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      overflow: TextOverflow.ellipsis,
                                      fontSize: 15,
                                    ),
                                  ),
                                  Text(
                                    '@${item.user!.username}',
                                    style: TextStyle(
                                      fontSize: 13,
                                      color: Colors.grey,
                                    ),
                                  )
                                ],
                              ),
                            ),
                            SizedBox(width: 10),
                          ],
                        ),
                      ),
                    )
                  ],
                ),
              ),
            );
          }).toList(),
        ),
        isLoading
            ? GridView.count(
                padding: EdgeInsets.all(5),
                crossAxisCount: 2,
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                mainAxisSpacing: 5,
                crossAxisSpacing: 5,
                childAspectRatio: (Get.width / (520)),
                children: List.generate(6, (index) {
                  return Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                    ),
                    child: Column(
                      children: [
                        SkeletonComponent(
                          child: Container(
                            width: Get.width / 2 - 10,
                            height: Get.width / 2 - 10,
                            color: Colors.white,
                          ),
                        ),
                        Expanded(
                          child: Center(
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.start,
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                Expanded(
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      SkeletonComponent(
                                          child: Container(height: 10)),
                                      SizedBox(height: 3),
                                      SkeletonComponent(
                                          child: Container(height: 5)),
                                    ],
                                  ),
                                ),
                                SizedBox(width: 10),
                              ],
                            ),
                          ),
                        )
                      ],
                    ),
                  );
                }).toList(),
              )
            : SizedBox(),
        // SizedBox(height: 10),
        barangTemu.isEmpty
            ? SizedBox()
            : Container(
                margin: EdgeInsets.symmetric(vertical: 10),
                child: ElevatedButton(
                  onPressed: () {
                    setState(() {
                      filter['page'] = filter['page'] + 1;
                      getBarangTemu();
                    });
                  },
                  child: Text('Tampilkan Lainnya'),
                ),
              ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return widget.userId != null
        ? dataBarang()
        : UserLayout(
            backgroundColor: Colors.grey.shade100,
            title: 'Barang Temu',
            floatingActionButton: Column(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                FloatingActionButton(
                  heroTag: 'btn1',
                  backgroundColor: Colors.white,
                  onPressed: showFilterModal,
                  child: Icon(
                    Icons.filter_alt,
                    color: colorPrimary,
                  ),
                ),
                SizedBox(height: 10),
                FloatingActionButton(
                  heroTag: 'btn2',
                  onPressed: () {
                    Get.to(() => BarangTemuSavePage());
                  },
                  child: Icon(
                    Icons.add,
                  ),
                ),
              ],
            ),
            child: SingleChildScrollView(
              child: dataBarang(),
            ),
          );
  }
}
