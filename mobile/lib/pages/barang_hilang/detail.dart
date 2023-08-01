// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:latlong2/latlong.dart';
import 'package:mobile/components/card.dart';
import 'package:mobile/components/maps.dart';
import 'package:mobile/components/skeleton.dart';
import 'package:mobile/libs/format_date.dart';
import 'package:mobile/libs/format_money.dart';
import 'package:mobile/libs/go_url.dart';
import 'package:mobile/libs/notif.dart';
import 'package:mobile/models/barang_hilang.dart';
import 'package:mobile/models/barang_temu.dart';
import 'package:mobile/pages/akun/index.dart';
import 'package:mobile/pages/barang_hilang/index.dart';
import 'package:mobile/pages/barang_hilang/save.dart';
import 'package:mobile/pages/barang_temu/detail.dart';
import 'package:mobile/services/auth_service.dart';
import 'package:mobile/services/barang_hilang_service.dart';
import 'package:mobile/services/barang_temu_service.dart';

class BarangHilangDetailPage extends StatefulWidget {
  const BarangHilangDetailPage({super.key, required this.id});

  final dynamic id;

  @override
  State<BarangHilangDetailPage> createState() => _BarangHilangDetailPageState();
}

class _BarangHilangDetailPageState extends State<BarangHilangDetailPage> {
  String authId = '';
  BarangHilang barang = BarangHilang();
  bool isLoading = true;
  List<BarangTemu> barangTemu = [];

  @override
  initState() {
    super.initState();
    AuthService.get().then((value) async {
      setState(() {
        authId = value.toString();
      });
      await getBarangHilangDetail();
      await getBarangTemuSerupa();
    });
  }

  Future getBarangHilangDetail() async {
    setState(() {
      isLoading = true;
    });

    try {
      final res = await BarangHilangService.find(id: widget.id);
      setState(() {
        barang = res;
      });
    } catch (e) {
      Get.back();
    }

    setState(() {
      isLoading = false;
    });
  }

  Future getBarangTemuSerupa() async {
    final res = await BarangTemuService.get(
        filter: {'barang_hilang_id': barang.id.toString()});
    setState(() {
      barangTemu = res;
    });
  }

  handleDelete() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Hapus Barang'),
          content: Text('Anda yakin untuk menghapus ${barang.nama}?'),
          actions: [
            TextButton(
                onPressed: () async {
                  Get.back();
                },
                child: Text('Batal')),
            TextButton(
                onPressed: () async {
                  try {
                    await BarangHilangService.destroy(id: barang.id);
                    Get.back();
                    Get.off(BarangHilangPage());
                    notif('barang berhasil dihapus');
                  } on DioException catch (e) {
                    notif(e.response!.data['message'], success: false);
                  } catch (e) {
                    notif(e.toString(), success: false);
                  }
                },
                child: Text('Hapus')),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade100,
      appBar: AppBar(
        centerTitle: true,
        title: Text(
          isLoading ? 'Memuat...' : barang.nama.toString(),
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
      body: !isLoading
          ? SingleChildScrollView(
              child: Column(
                children: [
                  GestureDetector(
                    child: Image.network(
                      barang.foto_url.toString(),
                      width: Get.width,
                      height: Get.width,
                      fit: BoxFit.cover,
                    ),
                    onTap: () {
                      Get.bottomSheet(
                        Container(
                          padding: EdgeInsets.all(20),
                          width: double.infinity,
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Image.network(
                                barang.foto_url.toString(),
                                height: 200,
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
                    },
                  ),
                  SizedBox(height: 10),
                  Container(
                    width: double.infinity,
                    padding: EdgeInsets.all(20),
                    color: Colors.white,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            GestureDetector(
                              onTap: () {
                                Get.to(() => AkunPage(
                                    userId: barang.user_id.toString()));
                              },
                              child: CircleAvatar(
                                backgroundImage: NetworkImage(
                                    barang.user!.foto_url.toString()),
                              ),
                            ),
                            SizedBox(width: 10),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    barang.nama.toString(),
                                    style: TextStyle(
                                        fontSize: 22,
                                        fontWeight: FontWeight.bold,
                                        overflow: TextOverflow.ellipsis),
                                  ),
                                  GestureDetector(
                                    child: Text(
                                      barang.user!.nama.toString(),
                                      style: TextStyle(
                                        color: Colors.blue,
                                      ),
                                    ),
                                    onTap: () {
                                      Get.to(() => AkunPage(
                                          userId: barang.user_id.toString()));
                                    },
                                  ),
                                ],
                              ),
                            ),
                            barang.user_id.toString() == authId
                                ? GestureDetector(
                                    onTap: handleDelete,
                                    child: Icon(
                                      Icons.delete,
                                      color: Colors.red,
                                    ),
                                  )
                                : SizedBox(),
                          ],
                        ),
                        SizedBox(
                          height: 20,
                        ),
                        Container(
                          decoration: BoxDecoration(
                              color: barang.ditemukan.toString() == '1'
                                  ? Colors.green
                                  : Colors.red,
                              borderRadius: BorderRadius.circular(50)),
                          padding: EdgeInsets.symmetric(horizontal: 10),
                          child: Text(
                            '${barang.ditemukan_detail} ditemukan',
                            style: TextStyle(
                              color: Colors.white,
                            ),
                          ),
                        ),
                        SizedBox(height: 10),
                        Divider(color: Colors.grey.shade100),
                        SizedBox(height: 10),
                        Text(
                            'Hilang di ${barang.tempat_hilang} pada ${formatDate(barang.created_at.toString())}'),
                        SizedBox(height: 10),
                        Divider(color: Colors.grey.shade100),
                        SizedBox(height: 10),
                        Text(
                          'Deskripsi',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 15,
                          ),
                        ),
                        SizedBox(height: 10),
                        Text(barang.deskripsi.toString()),
                        SizedBox(height: 20),
                        Divider(color: Colors.grey.shade100),
                        SizedBox(height: 10),
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Reward',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 15,
                              ),
                            ),
                            Text(
                              formatMoney(barang.hadiah),
                              style: TextStyle(
                                  color: Colors.blue,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 15),
                            ),
                          ],
                        )
                      ],
                    ),
                  ),
                  SizedBox(height: 10),
                  barang.user_id.toString() == authId
                      ? Container(
                          padding: EdgeInsets.all(20),
                          color: Colors.white,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Barang Temuan Serupa',
                                style: TextStyle(
                                    fontWeight: FontWeight.bold, fontSize: 17),
                              ),
                              SizedBox(height: 20),
                              barangTemu.isNotEmpty
                                  ? Column(
                                      children: List.generate(barangTemu.length,
                                          (index) {
                                        final item = barangTemu[index];
                                        return InkWell(
                                          onTap: () {
                                            Get.to(BarangTemuDetailPage(
                                                id: item.id));
                                          },
                                          child: Container(
                                            color: Colors.white,
                                            child: Column(
                                              children: [
                                                ListTile(
                                                  leading: GestureDetector(
                                                    onTap: () {
                                                      Get.to(() => AkunPage(
                                                          userId: barang.user_id
                                                              .toString()));
                                                    },
                                                    child: CircleAvatar(
                                                      backgroundImage:
                                                          NetworkImage(barang
                                                              .user!.foto_url
                                                              .toString()),
                                                    ),
                                                  ),
                                                  title: Text(
                                                      item.nama.toString()),
                                                  subtitle: GestureDetector(
                                                    child: Text(
                                                        '@${item.user!.username.toString()}'),
                                                    onTap: () {
                                                      Get.to(() => AkunPage(
                                                            userId: item.user_id
                                                                .toString(),
                                                          ));
                                                    },
                                                  ),
                                                ),
                                                Image.network(
                                                    item.foto_url.toString(),
                                                    width: double.infinity),
                                                Divider(
                                                  color: Colors.grey.shade100,
                                                )
                                              ],
                                            ),
                                          ),
                                        );
                                      }),
                                    )
                                  : Center(
                                      child: Text(
                                          'barang temuan serupa tidak tersedia'),
                                    ),
                            ],
                          ))
                      : Container(
                          decoration: BoxDecoration(
                            color: Colors.white,
                          ),
                          padding: EdgeInsets.all(20),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              MapsComponent(
                                initialValue: barang.maps_lat != null
                                    ? LatLng(barang.maps_lat!.toDouble(),
                                        barang.maps_lng!.toDouble())
                                    : null,
                              ),
                              SizedBox(height: 20),
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  ElevatedButton(
                                    onPressed: () {
                                      goUrl(barang.maps_lat != null
                                          ? 'http://www.google.com/maps/dir/My+Location/${barang.maps_lat},${barang.maps_lng}'
                                          : 'http://www.google.com/maps/dir/My+Location/${barang.tempat_hilang}');
                                    },
                                    child: Center(child: Text('Bantu Mencari')),
                                  )
                                ],
                              ),
                            ],
                          ),
                        ),
                  SizedBox(height: 10),
                ],
              ),
            )
          : SkeletonComponent(
              child: CardComponent(
                child: Container(
                  height: 400,
                ),
              ),
            ),
      floatingActionButton: barang.user_id.toString() == authId
          ? FloatingActionButton(
              onPressed: () {
                Get.to(() => BarangHilangSavePage(id: barang.id.toString()));
              },
              child: Icon(
                Icons.edit,
              ),
            )
          : null,
      bottomNavigationBar: barang.user_id.toString() != authId
          ? BottomNavigationBar(
              onTap: (index) async {
                if (index == 0) {
                  goUrl('tel:${barang.user!.telepon}');
                } else if (index == 1) {
                  goUrl(
                      'mailto:${barang.user!.email}?text=Saya menemukan ${barang.nama} milik anda!');
                } else if (index == 2) {
                  goUrl(
                      'https://wa.me/${barang.user!.whatsapp}?text=Saya menemukan ${barang.nama} milik anda!');
                }
              },
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
    );
  }
}
