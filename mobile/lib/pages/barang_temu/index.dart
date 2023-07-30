// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/components/card.dart';
import 'package:mobile/components/form_group.dart';
import 'package:mobile/components/skeleton.dart';
import 'package:mobile/layouts/user.dart';
import 'package:mobile/libs/constant.dart';
import 'package:mobile/libs/format_date.dart';
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
      authId = auth;
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
      mainAxisSize: MainAxisSize.min,
      children: [
        !isLoading && barangTemu.isEmpty
            ? CardComponent(
                child: Center(
                  child: Text('data barang tidak tersedia'),
                ),
              )
            : SizedBox(),
        Column(
          mainAxisSize: MainAxisSize.min,
          children: List.generate(barangTemu.length, (index) {
            final item = barangTemu[index];

            return CardComponent(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Image.network(
                    item.foto_url.toString(),
                    width: 90,
                    height: 90,
                    fit: BoxFit.cover,
                  ),
                  SizedBox(width: 20),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          item.nama.toString(),
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        GestureDetector(
                          onTap: () {
                            Get.to(() => AkunPage(
                                  userId: item.user_id.toString(),
                                ));
                          },
                          child: widget.userId != null
                              ? Text(
                                  widget.userId != null
                                      ? "${item.dikembalikan_detail} Dikembalikan"
                                      : "@${item.user!.username}",
                                )
                              : RichText(
                                  text: TextSpan(
                                    style: TextStyle(fontSize: 12),
                                    children: [
                                      TextSpan(
                                        text: 'Oleh ',
                                        style: TextStyle(
                                          color: Colors.grey,
                                        ),
                                      ),
                                      TextSpan(
                                        text: "@${item.user!.username}",
                                        style: TextStyle(
                                          color: Colors.blue,
                                        ),
                                      )
                                    ],
                                  ),
                                ),
                        ),
                        Text(
                          'Ditemukan ${formatDate(item.created_at.toString(), short: true)}',
                          style: TextStyle(
                            color: Colors.grey,
                            fontSize: 12,
                          ),
                        ),
                        Row(
                          children: [
                            TextButton(
                              onPressed: () {
                                Get.to(() => BarangTemuDetailPage(id: item.id));
                              },
                              style: TextButton.styleFrom(
                                padding: EdgeInsets.zero,
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(50)),
                                minimumSize: Size(60, 24),
                                backgroundColor: Colors.blue,
                              ),
                              child: Text(
                                'Detail',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                            authId == item.user_id.toString()
                                ? TextButton(
                                    onPressed: () => handleDelete(item),
                                    style: TextButton.styleFrom(
                                      padding: EdgeInsets.zero,
                                      shape: RoundedRectangleBorder(
                                          borderRadius:
                                              BorderRadius.circular(50)),
                                      minimumSize: Size(30, 24),
                                      backgroundColor: Colors.red,
                                    ),
                                    child: Icon(
                                      Icons.delete,
                                      color: Colors.white,
                                      size: 12,
                                    ),
                                  )
                                : SizedBox(),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          }).toList(),
        ),
        isLoading
            ? Column(
                mainAxisSize: MainAxisSize.min,
                children: List.generate(5, (index) {
                  return CardComponent(
                    child: SkeletonComponent(
                      child: Container(color: Colors.white, height: 90),
                    ),
                  );
                }),
              )
            : SizedBox(),
        // SizedBox(height: 5),
        barangTemu.isEmpty
            ? SizedBox()
            : ElevatedButton(
                onPressed: () {
                  setState(() {
                    filter['page'] = filter['page'] + 1;
                    getBarangTemu();
                  });
                },
                child: Text('Tampilkan Lainnya'),
              ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return widget.userId != null
        ? dataBarang()
        : UserLayout(
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
