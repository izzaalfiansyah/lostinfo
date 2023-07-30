// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:latlong2/latlong.dart';
import 'package:mobile/components/card.dart';
import 'package:mobile/components/img.dart';
import 'package:mobile/components/maps.dart';
import 'package:mobile/components/skeleton.dart';
import 'package:mobile/libs/constant.dart';
import 'package:mobile/libs/format_date.dart';
import 'package:mobile/libs/go_url.dart';
import 'package:mobile/models/barang_hilang.dart';
import 'package:mobile/models/barang_temu.dart';
import 'package:mobile/pages/akun/index.dart';
import 'package:mobile/pages/barang_temu/save.dart';
import 'package:mobile/services/auth_service.dart';
import 'package:mobile/services/barang_hilang_service.dart';
import 'package:mobile/services/barang_temu_service.dart';

class BarangTemuDetailPage extends StatefulWidget {
  const BarangTemuDetailPage({super.key, required this.id});

  final dynamic id;

  @override
  State<BarangTemuDetailPage> createState() => _BarangTemuDetailPageState();
}

class _BarangTemuDetailPageState extends State<BarangTemuDetailPage> {
  String authId = '';
  BarangTemu barang = BarangTemu();
  bool isLoading = true;
  List<BarangHilang> barangHilang = [];

  @override
  initState() {
    super.initState();
    AuthService.get().then((value) async {
      setState(() {
        authId = value.toString();
      });
      await getBarangTemuDetail();
      await getBarangHilangSerupa();
    });
  }

  Future getBarangTemuDetail() async {
    setState(() {
      isLoading = true;
    });

    try {
      final res = await BarangTemuService.find(id: widget.id);
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

  Future getBarangHilangSerupa() async {
    final res = await BarangHilangService.get(
        filter: {'barang_hilang_id': barang.id.toString()});
    setState(() {
      barangHilang = res;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: colorPrimary,
        title: Text(
            'Detail Barang ${barang.user_id.toString() == authId ? 'Saya' : ''}'),
      ),
      body: !isLoading
          ? Stack(
              fit: StackFit.expand,
              children: [
                SingleChildScrollView(
                  padding: EdgeInsets.all(10),
                  scrollDirection: Axis.vertical,
                  child: Column(
                    children: [
                      CardComponent(
                        child: Column(
                          children: [
                            Row(
                              children: [
                                Expanded(child: Text('Nama Barang')),
                                Text(':'),
                                SizedBox(
                                  width: 10,
                                ),
                                Expanded(child: Text(barang.nama.toString()))
                              ],
                            ),
                            SizedBox(height: 10),
                            Row(
                              children: [
                                Expanded(child: Text('Nama Pemilik')),
                                Text(':'),
                                SizedBox(
                                  width: 10,
                                ),
                                Expanded(
                                  child: GestureDetector(
                                    child: Text(
                                      '@${barang.user!.username}',
                                      style: TextStyle(
                                          color: Colors.blue,
                                          fontWeight: FontWeight.bold),
                                    ),
                                    onTap: () {
                                      Get.to(() => AkunPage(
                                          userId: barang.user_id.toString()));
                                    },
                                  ),
                                )
                              ],
                            ),
                            SizedBox(height: 10),
                            Row(
                              children: [
                                Expanded(
                                  child: Text('Foto Pendukung'),
                                ),
                                Text(':'),
                                SizedBox(
                                  width: 10,
                                ),
                                Expanded(
                                  child: Img(
                                      src: barang.foto_url.toString(),
                                      width: 100,
                                      height: 100),
                                )
                              ],
                            ),
                            SizedBox(
                              height: 10,
                            ),
                            Row(
                              children: [
                                Expanded(child: Text('Status')),
                                Text(':'),
                                SizedBox(
                                  width: 10,
                                ),
                                Expanded(
                                  child: Text(
                                    "${barang.dikembalikan_detail} dikembalikan",
                                    style: TextStyle(
                                      color: barang.dikembalikan == '1'
                                          ? Colors.green
                                          : Colors.red,
                                    ),
                                  ),
                                )
                              ],
                            ),
                            SizedBox(
                              height: 10,
                            ),
                            Row(
                              children: [
                                Expanded(child: Text('Tempat Temu')),
                                Text(':'),
                                SizedBox(
                                  width: 10,
                                ),
                                Expanded(
                                  child: Text(
                                    barang.tempat_temu.toString(),
                                  ),
                                )
                              ],
                            ),
                            Row(
                              children: [
                                Expanded(child: Text('Tanggal Hilang')),
                                Text(':'),
                                SizedBox(
                                  width: 10,
                                ),
                                Expanded(
                                  child: Text(
                                    formatDate(
                                      barang.created_at.toString(),
                                    ),
                                  ),
                                )
                              ],
                            ),
                          ],
                        ),
                      ),
                      CardComponent(
                        title: 'Deskripsi Barang',
                        child: Text(
                          barang.deskripsi.toString(),
                        ),
                      ),
                      barang.user_id.toString() == authId
                          ? CardComponent(
                              title: 'Barang Temuan yang Serupa',
                              child: barangHilang.isNotEmpty
                                  ? GridView(
                                      gridDelegate:
                                          SliverGridDelegateWithFixedCrossAxisCount(
                                        crossAxisCount: 2,
                                        mainAxisSpacing: 5,
                                        crossAxisSpacing: 5,
                                      ),
                                      shrinkWrap: true,
                                      physics: NeverScrollableScrollPhysics(),
                                      children: List.generate(
                                          barangHilang.length, (index) {
                                        final item = barangHilang[index];
                                        return Card(
                                          child: InkWell(
                                            onTap: () {
                                              Get.to(() => BarangTemuDetailPage(
                                                  id: item.id));
                                            },
                                            child: Column(
                                              children: [
                                                SizedBox(height: 4),
                                                Image.network(
                                                  item.foto_url.toString(),
                                                  height: 100,
                                                  width: 100,
                                                  fit: BoxFit.cover,
                                                ),
                                                Text(
                                                  item.nama.toString(),
                                                  overflow:
                                                      TextOverflow.ellipsis,
                                                ),
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
                            )
                          : SizedBox(),
                      CardComponent(
                        title: 'Tempat Hilang',
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
                                        : 'http://www.google.com/maps/dir/My+Location/${barang.tempat_temu}');
                                  },
                                  child: Text('Pergi ke lokasi'),
                                )
                              ],
                            )
                          ],
                        ),
                      )
                    ],
                  ),
                ),
              ],
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
                Get.to(() => BarangTemuSavePage(id: barang.id.toString()));
              },
              child: Icon(
                Icons.edit,
                color: Colors.white,
              ),
            )
          : null,
      bottomNavigationBar: barang.user_id.toString() != authId
          ? BottomNavigationBar(
              onTap: (index) async {
                if (index == 0) {
                  goUrl('tel:${barang.user!.telepon}');
                } else if (index == 1) {
                  goUrl('mailto:${barang.user!.email}');
                } else if (index == 2) {
                  goUrl('https://wa.me/${barang.user!.whatsapp}');
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
