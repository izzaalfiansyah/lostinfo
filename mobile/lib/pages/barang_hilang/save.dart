// ignore_for_file: prefer_const_constructors, avoid_unnecessary_containers, prefer_const_literals_to_create_immutables

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:geocoding/geocoding.dart';
import 'package:get/get.dart';
import 'package:latlong2/latlong.dart';
import 'package:mobile/components/card.dart';
import 'package:mobile/components/file_picker.dart';
import 'package:mobile/components/maps.dart';
import 'package:mobile/components/skeleton.dart';
import 'package:mobile/libs/constant.dart';
import 'package:mobile/libs/format_date.dart';
import 'package:mobile/libs/notif.dart';
import 'package:mobile/models/barang_hilang.dart';
import 'package:mobile/pages/barang_hilang/detail.dart';
import 'package:mobile/pages/barang_hilang/index.dart';
import 'package:mobile/pages/beranda/index.dart';
import 'package:mobile/services/auth_service.dart';
import 'package:mobile/services/barang_hilang_service.dart';

class BarangHilangSavePage extends StatefulWidget {
  const BarangHilangSavePage({super.key, this.id});

  final String? id;

  @override
  State<BarangHilangSavePage> createState() => _BarangHilangSavePageState();
}

class _BarangHilangSavePageState extends State<BarangHilangSavePage> {
  TextEditingController tempat_hilang = TextEditingController();
  BarangHilang barang = BarangHilang(hadiah: 0);
  bool isLoading = true;

  @override
  initState() {
    super.initState();
    if (widget.id != null) {
      getBarang();
    } else {
      setState(() {
        isLoading = false;
      });
    }
  }

  getBarang() async {
    setState(() {
      isLoading = true;
    });

    try {
      final res = await BarangHilangService.find(id: widget.id);
      setState(() {
        barang = res;
        barang.foto = '';
      });
      tempat_hilang.text = barang.tempat_hilang.toString();
    } catch (e) {
      Get.back();
    }

    setState(() {
      isLoading = false;
    });
  }

  save() async {
    setState(() {
      isLoading = true;
    });
    try {
      final authId = await AuthService.get();
      barang.user_id = authId;
      dynamic barangId = '';
      if (widget.id != null) {
        final b =
            await BarangHilangService.update(params: barang, id: widget.id);
        barangId = b.id;
      } else {
        barang.ditemukan = '0';
        final b = await BarangHilangService.create(params: barang);
        barangId = b.id;
      }
      Get.offAll(() => BerandaPage());
      Get.to(() => BarangHilangPage());
      Get.to(() => BarangHilangDetailPage(id: barangId));
      notif('data barang hilang berhasil disimpan');
    } on DioException catch (e) {
      notif(e.response!.data['message'], success: false);
    } catch (e) {
      notif(e.toString(), success: false);
    }
    setState(() {
      isLoading = false;
    });
  }

  sesuaikanAlamat() async {
    setState(() {
      isLoading = true;
    });
    final places = await placemarkFromCoordinates(
        barang.maps_lat!.toDouble(), barang.maps_lng!.toDouble());
    final place = places[0];

    setState(() {
      barang.tempat_hilang =
          "${place.subLocality}, ${place.locality}, ${place.subAdministrativeArea}";
      tempat_hilang.text = barang.tempat_hilang.toString();
      isLoading = false;
    });

    Get.back();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: colorPrimary,
        foregroundColor: Colors.white,
        title: Text(
          '${widget.id == null ? 'Tambah' : 'Edit'} Barang Hilang',
        ),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(10),
        scrollDirection: Axis.vertical,
        child: Column(
          children: [
            CardComponent(
              child: !isLoading
                  ? Column(
                      children: [
                        Container(
                          child: Row(
                            children: [
                              Text('Nama Barang'),
                              Text(
                                '*',
                                style: TextStyle(color: Colors.red),
                              )
                            ],
                          ),
                        ),
                        SizedBox(height: 5),
                        TextFormField(
                          enabled: !isLoading,
                          initialValue: barang.nama,
                          onChanged: (val) {
                            setState(() {
                              barang.nama = val;
                            });
                          },
                          decoration: InputDecoration(
                            hintText: 'Masukkan Nama Barang',
                          ),
                        ),
                        SizedBox(height: 10),
                        Container(
                          child: Row(
                            children: [
                              Text('Deskripsi Barang'),
                              Text(
                                '*',
                                style: TextStyle(color: Colors.red),
                              )
                            ],
                          ),
                        ),
                        SizedBox(height: 5),
                        TextFormField(
                          enabled: !isLoading,
                          initialValue: barang.deskripsi,
                          onChanged: (val) {
                            setState(() {
                              barang.deskripsi = val;
                            });
                          },
                          decoration:
                              InputDecoration(hintText: 'Ciri-ciri barang'),
                          maxLines: 3,
                        ),
                        SizedBox(height: 10),
                        Container(
                          child: Row(
                            children: [
                              Text('Tempat Hilang'),
                              Text(
                                '*',
                                style: TextStyle(color: Colors.red),
                              )
                            ],
                          ),
                        ),
                        SizedBox(height: 5),
                        TextFormField(
                          enabled: !isLoading,
                          maxLines: 3,
                          controller: tempat_hilang,
                          // initialValue: barang.tempat_hilang,
                          onChanged: (val) {
                            setState(() {
                              barang.tempat_hilang = val;
                            });
                          },
                          decoration: InputDecoration(
                              hintText: 'Masukkan Lokasi Hilang'),
                        ),
                        SizedBox(height: 10),
                        Container(
                          child: Row(
                            children: [
                              Text('Maps Hilang'),
                            ],
                          ),
                        ),
                        SizedBox(height: 5),
                        ElevatedButton(
                          onPressed: () {
                            Get.bottomSheet(
                              Container(
                                padding: EdgeInsets.all(20),
                                child: Column(
                                  children: [
                                    MapsComponent(
                                      height: 350,
                                      alamat: barang.tempat_hilang,
                                      initialValue: barang.maps_lat != null
                                          ? LatLng(barang.maps_lat!.toDouble(),
                                              barang.maps_lng!.toDouble())
                                          : null,
                                      onChange: (val) {
                                        setState(() {
                                          barang.maps_lat = val.latitude;
                                          barang.maps_lng = val.longitude;
                                        });
                                      },
                                    ),
                                    SizedBox(height: 20),
                                    ElevatedButton(
                                      onPressed: sesuaikanAlamat,
                                      child: Center(
                                        child: Text('Sesuaikan Alamat'),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              backgroundColor: Colors.white,
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blue.shade50,
                            foregroundColor: Colors.blue,
                          ),
                          child: Center(
                            child: Text('Cari Koordinat Maps'),
                          ),
                        ),
                        SizedBox(height: 10),
                        Container(
                          child: Row(
                            children: [
                              Text('Foto'),
                            ],
                          ),
                        ),
                        SizedBox(height: 5),
                        FilePicker(
                          onChange: (val) {
                            setState(() {
                              barang.foto = val;
                            });
                          },
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.file_upload_outlined),
                              SizedBox(width: 3),
                              Text(
                                  '${widget.id != null ? 'Ganti' : 'Pilih'} Foto')
                            ],
                          ),
                        ),
                        SizedBox(height: 10),
                        Container(
                          child: Row(
                            children: [
                              Text('Hadiah'),
                              Text(
                                '*',
                                style: TextStyle(color: Colors.red),
                              )
                            ],
                          ),
                        ),
                        SizedBox(height: 10),
                        TextFormField(
                          enabled: !isLoading,
                          initialValue: barang.hadiah.toString(),
                          onChanged: (val) {
                            setState(() {
                              barang.hadiah = int.parse(val);
                            });
                          },
                          keyboardType: TextInputType.number,
                          decoration: InputDecoration(
                            hintText: '0',
                            prefixText: 'Rp ',
                          ),
                        ),
                        widget.id != null
                            ? Column(
                                children: [
                                  SizedBox(height: 10),
                                  Container(
                                    child: Row(
                                      children: [
                                        Text('Status'),
                                        Text(
                                          '*',
                                          style: TextStyle(color: Colors.red),
                                        )
                                      ],
                                    ),
                                  ),
                                  SizedBox(height: 5),
                                  DropdownButtonFormField(
                                      // ignore: prefer_null_aware_operators
                                      value: barang.ditemukan != null
                                          ? barang.ditemukan.toString()
                                          : null,
                                      items: [
                                        DropdownMenuItem(
                                          value: '1',
                                          child: Text('Sudah Ditemukan'),
                                        ),
                                        DropdownMenuItem(
                                          value: '0',
                                          child: Text('Belum Ditemukan'),
                                        ),
                                      ],
                                      onChanged: (val) {
                                        setState(() {
                                          barang.ditemukan = val;
                                        });
                                      }),
                                  SizedBox(height: 10),
                                  Container(
                                    child: Row(
                                      children: [
                                        Text('Tanggal Hilang'),
                                        Text(
                                          '*',
                                          style: TextStyle(color: Colors.red),
                                        )
                                      ],
                                    ),
                                  ),
                                  SizedBox(height: 5),
                                  TextFormField(
                                    enabled: false,
                                    initialValue: barang.created_at != null
                                        ? formatDate(
                                            barang.created_at.toString())
                                        : null,
                                    decoration: InputDecoration(
                                        hintText: 'Tanggal Hilang'),
                                  ),
                                ],
                              )
                            : SizedBox(),
                        SizedBox(height: 20),
                        ElevatedButton(
                          onPressed: isLoading ? null : save,
                          child: Center(
                            child:
                                Text(isLoading ? 'Memuat...' : 'Simpan Data'),
                          ),
                        )
                      ],
                    )
                  : SkeletonComponent(
                      child: CardComponent(
                        child: Container(
                          height: Get.height / 1.4,
                        ),
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
