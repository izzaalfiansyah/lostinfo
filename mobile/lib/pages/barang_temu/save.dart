// ignore_for_file: prefer_const_constructors, avoid_unnecessary_containers, prefer_const_literals_to_create_immutables

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:latlong2/latlong.dart';
import 'package:mobile/components/card.dart';
import 'package:mobile/components/file_picker.dart';
import 'package:mobile/components/maps.dart';
import 'package:mobile/components/skeleton.dart';
import 'package:mobile/libs/constant.dart';
import 'package:mobile/libs/format_date.dart';
import 'package:mobile/libs/notif.dart';
import 'package:mobile/models/barang_temu.dart';
import 'package:mobile/pages/barang_temu/detail.dart';
import 'package:mobile/pages/barang_temu/index.dart';
import 'package:mobile/pages/beranda/index.dart';
import 'package:mobile/services/auth_service.dart';
import 'package:mobile/services/barang_temu_service.dart';

class BarangTemuSavePage extends StatefulWidget {
  const BarangTemuSavePage({super.key, this.id});

  final String? id;

  @override
  State<BarangTemuSavePage> createState() => _BarangTemuSavePageState();
}

class _BarangTemuSavePageState extends State<BarangTemuSavePage> {
  BarangTemu barang = BarangTemu();
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
      final res = await BarangTemuService.find(id: widget.id);
      setState(() {
        barang = res;
        barang.foto = '';
      });
    } catch (e) {
      Get.back();
    }

    setState(() {
      isLoading = false;
    });
  }

  save() async {
    try {
      final authId = await AuthService.get();
      barang.user_id = authId;
      dynamic barangId = '';

      if (widget.id != null) {
        final b = await BarangTemuService.update(params: barang, id: widget.id);
        barangId = b.id;
      } else {
        barang.dikembalikan = '0';
        final b = await BarangTemuService.create(params: barang);
        barangId = b.id;
      }
      Get.offAll(() => BerandaPage());
      Get.to(() => BarangTemuPage());
      Get.to(() => BarangTemuDetailPage(id: barangId));
    } on DioException catch (e) {
      notif(e.response!.data['message'], success: false);
    } catch (e) {
      notif(e.toString(), success: false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: colorPrimary,
        title: Text('${widget.id == null ? 'Tambah' : 'Edit'} Barang Temu'),
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
                              Text('Tempat Temu'),
                              Text(
                                '*',
                                style: TextStyle(color: Colors.red),
                              )
                            ],
                          ),
                        ),
                        SizedBox(height: 5),
                        TextFormField(
                          initialValue: barang.tempat_temu,
                          onChanged: (val) {
                            setState(() {
                              barang.tempat_temu = val;
                            });
                          },
                          decoration:
                              InputDecoration(hintText: 'Masukkan Lokasi Temu'),
                        ),
                        SizedBox(height: 10),
                        Container(
                          child: Row(
                            children: [
                              Text('Maps Temu'),
                            ],
                          ),
                        ),
                        SizedBox(height: 5),
                        ElevatedButton(
                          onPressed: () {
                            Get.bottomSheet(
                              SafeArea(
                                child: Container(
                                  padding: EdgeInsets.all(20),
                                  child: MapsComponent(
                                    alamat: barang.tempat_temu,
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
                                ),
                              ),
                              ignoreSafeArea: true,
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
                                      value: barang.dikembalikan != null
                                          ? barang.dikembalikan.toString()
                                          : null,
                                      decoration: InputDecoration(
                                        hintText: 'Pilih Status',
                                      ),
                                      items: [
                                        DropdownMenuItem(
                                          value: '1',
                                          child: Text('Sudah Dikembalikan'),
                                        ),
                                        DropdownMenuItem(
                                          value: '0',
                                          child: Text('Belum Dikembalikan'),
                                        ),
                                      ],
                                      onChanged: (val) {
                                        setState(() {
                                          barang.dikembalikan = val;
                                        });
                                      }),
                                  SizedBox(height: 10),
                                  Container(
                                    child: Row(
                                      children: [
                                        Text('Tanggal Temu'),
                                        Text(
                                          '*',
                                          style: TextStyle(color: Colors.red),
                                        )
                                      ],
                                    ),
                                  ),
                                  SizedBox(height: 5),
                                  TextFormField(
                                    initialValue: barang.created_at != null
                                        ? formatDate(
                                            barang.created_at.toString())
                                        : null,
                                    enabled: false,
                                    decoration: InputDecoration(
                                        hintText: 'Tanggal Temu'),
                                  ),
                                ],
                              )
                            : SizedBox(),
                        SizedBox(height: 20),
                        ElevatedButton(
                          onPressed: save,
                          child: Center(
                            child: Text('Simpan Data'),
                          ),
                        )
                      ],
                    )
                  : SkeletonComponent(
                      child: CardComponent(
                        child: Container(
                          height: 400,
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
