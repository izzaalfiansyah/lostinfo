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
import 'package:mobile/models/barang_hilang.dart';
import 'package:mobile/pages/barang_hilang/detail.dart';
import 'package:mobile/services/auth_service.dart';
import 'package:mobile/services/barang_hilang_service.dart';

class BarangHilangSavePage extends StatefulWidget {
  const BarangHilangSavePage({super.key, this.id});

  final String? id;

  @override
  State<BarangHilangSavePage> createState() => _BarangHilangSavePageState();
}

class _BarangHilangSavePageState extends State<BarangHilangSavePage> {
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
        final b =
            await BarangHilangService.update(params: barang, id: widget.id);
        barangId = b.id;
      } else {
        barang.ditemukan = '0';
        final b = await BarangHilangService.create(params: barang);
        barangId = b.id;
      }
      Get.off(() => BarangHilangDetailPage(id: barangId));
      notif('data barang hilang berhasil disimpan');
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
        title: Text('${widget.id == null ? 'Tambah' : 'Edit'} Barang Hilang'),
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
                          initialValue: barang.tempat_hilang,
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
                                child: MapsComponent(
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
                                    initialValue: barang.created_at != null
                                        ? formatDate(
                                            barang.created_at.toString())
                                        : null,
                                    enabled: false,
                                    decoration: InputDecoration(
                                        hintText: 'Tanggal Hilang'),
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
