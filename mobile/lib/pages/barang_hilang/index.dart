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
import 'package:mobile/models/barang_hilang.dart';
import 'package:mobile/pages/akun/index.dart';
import 'package:mobile/pages/barang_hilang/detail.dart';
import 'package:mobile/pages/barang_hilang/save.dart';
import 'package:mobile/services/auth_service.dart';
import 'package:mobile/services/barang_hilang_service.dart';

class BarangHilangPage extends StatefulWidget {
  const BarangHilangPage({super.key, this.userId});

  final String? userId;

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
    getUser().then((value) {
      getBarangHilang();
    });
  }

  Future getUser() async {
    if (widget.userId != null) {
      setState(() {
        filter['ditemukan'] = '';
        filter['user_id'] = widget.userId;
      });
    }

    final auth = await AuthService.get();
    setState(() {
      authId = auth.toString();
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

      if (barangHilang.length == oldBarangHilangLength &&
          barangHilang.isNotEmpty) {
        notif('semua data telah ditampilkan');
      }
    } on DioException catch (e) {
      notif(e.response!.data['message'], success: false);
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

  dataBarang() {
    return Column(
      children: [
        !isLoading && barangHilang.isEmpty
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
          children: List.generate(barangHilang.length, (index) {
            final item = barangHilang[index];

            return Container(
              decoration: BoxDecoration(
                color: Colors.white,
              ),
              child: InkWell(
                onTap: () {
                  Get.to(() => BarangHilangDetailPage(id: item.id.toString()));
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
                                      overflow: TextOverflow.ellipsis,
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
        barangHilang.isEmpty
            ? SizedBox()
            : Container(
                margin: EdgeInsets.symmetric(vertical: 10),
                child: ElevatedButton(
                  onPressed: () {
                    setState(() {
                      filter['page'] = filter['page'] + 1;
                      getBarangHilang();
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
            title: 'Barang Hilang',
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
                    Get.to(() => BarangHilangSavePage());
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
