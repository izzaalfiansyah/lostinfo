// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobile/components/card.dart';
import 'package:mobile/components/form_group.dart';
import 'package:mobile/components/skeleton.dart';
import 'package:mobile/layouts/user.dart';
import 'package:mobile/libs/constant.dart';
import 'package:mobile/libs/format_date.dart';
import 'package:mobile/libs/notif.dart';
import 'package:mobile/models/barang_hilang.dart';
import 'package:mobile/pages/akun/index.dart';
import 'package:mobile/services/auth_service.dart';
import 'package:mobile/services/barang_hilang_service.dart';

class BarangHilangPage extends StatefulWidget {
  const BarangHilangPage({super.key});

  @override
  State<BarangHilangPage> createState() => _BarangHilangPageState();
}

class _BarangHilangPageState extends State<BarangHilangPage> {
  Map<String, dynamic> filter = {
    'limit': 10,
    'ditemukan': '0',
    'page': 1,
  };
  List<BarangHilang> barangHilang = [];
  bool isLoading = true;
  String authId = '';

  @override
  void initState() {
    super.initState();
    getBarangHilang();
  }

  Future getUser() async {
    final auth = await AuthService.get();
    setState(() {
      authId = auth;
    });
    return auth;
  }

  Future getBarangHilang() async {
    setState(() {
      isLoading = true;
    });

    try {
      if (filter['page'] == 1) {
        setState(() {
          barangHilang.clear();
        });
      }

      final res = await BarangHilangService.get(filter: filter);
      final oldBarangHilangLength = barangHilang.length;
      setState(() {
        barangHilang.addAll(res);
      });

      if (barangHilang.length == oldBarangHilangLength) {
        notif('semua data telah ditampilkan');
      }
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
          Row(
            children: [
              Expanded(
                child: FormGroup(
                  child: TextFormField(
                    initialValue: filter['hadiah_min'],
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      prefixText: 'Rp ',
                      hintText: '0',
                      labelText: 'Hadiah Min',
                    ),
                    onChanged: (val) {
                      setState(() {
                        filter['hadiah_min'] = val;
                      });
                    },
                  ),
                ),
              ),
              SizedBox(width: 10),
              Expanded(
                child: FormGroup(
                  child: TextFormField(
                    initialValue: filter['hadiah_max'],
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      prefixText: 'Rp ',
                      hintText: '0',
                      labelText: 'Hadiah Max',
                    ),
                    onChanged: (val) {
                      setState(() {
                        filter['hadiah_max'] = val;
                      });
                    },
                  ),
                ),
              ),
            ],
          ),
          SizedBox(height: 20),
          ElevatedButton(
            onPressed: () {
              setState(() {
                filter['page'] = 1;
              });
              getBarangHilang();
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

  handleDelete(BarangHilang item) {
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
                await BarangHilangService.destroy(id: item.id);
                Get.back();
                notif('barang berhasil dihapus');
                getBarangHilang();
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

  @override
  Widget build(BuildContext context) {
    return UserLayout(
      title: 'Barang Hilang',
      floatingActionButton: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          FloatingActionButton(
            backgroundColor: Colors.white,
            onPressed: showFilterModal,
            child: Icon(
              Icons.filter_alt,
              color: colorPrimary,
            ),
          ),
          SizedBox(height: 10),
          FloatingActionButton(
            onPressed: () {},
            child: Icon(
              Icons.add,
            ),
          ),
        ],
      ),
      child: SingleChildScrollView(
        child: Column(
          children: [
            !isLoading && barangHilang.isEmpty
                ? CardComponent(
                    child: Center(
                      child: Text('data barang tidak tersedia'),
                    ),
                  )
                : SizedBox(),
            Column(
              mainAxisSize: MainAxisSize.min,
              children: List.generate(barangHilang.length, (index) {
                final item = barangHilang[index];

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
                              child: Text(
                                "@${item.user!.nama}",
                                style: TextStyle(
                                  color: Colors.blue,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                            Text(
                              'Hilang ${formatDate(item.created_at.toString(), short: true)}',
                              style: TextStyle(
                                color: Colors.grey,
                                fontSize: 12,
                              ),
                            ),
                            Row(
                              children: [
                                TextButton(
                                  onPressed: () {
                                    //
                                  },
                                  style: TextButton.styleFrom(
                                    padding: EdgeInsets.zero,
                                    shape: RoundedRectangleBorder(
                                        borderRadius:
                                            BorderRadius.circular(50)),
                                    minimumSize: Size(60, 24),
                                    backgroundColor: Colors.green.shade100,
                                  ),
                                  child: Text(
                                    'Detail',
                                    style: TextStyle(
                                      color: Colors.green,
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
                                          backgroundColor: Colors.red.shade100,
                                        ),
                                        child: Icon(
                                          Icons.delete,
                                          color: Colors.red,
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
            // SizedBox(height: 10),
            barangHilang.isEmpty
                ? SizedBox()
                : ElevatedButton(
                    onPressed: () {
                      setState(() {
                        filter['page'] = filter['page'] + 1;
                        getBarangHilang();
                      });
                    },
                    child: Text('Tampilkan Lainnya'),
                  ),
          ],
        ),
      ),
    );
  }
}
