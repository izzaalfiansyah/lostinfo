// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:latlong2/latlong.dart';
import 'package:mobile/components/card.dart';
import 'package:mobile/components/maps.dart';
import 'package:mobile/layouts/user.dart';
import 'package:mobile/models/barang_hilang.dart';
import 'package:mobile/models/barang_temu.dart';
import 'package:mobile/services/barang_hilang_service.dart';
import 'package:mobile/services/barang_temu_service.dart';

class BerandaPage extends StatefulWidget {
  const BerandaPage({super.key});

  @override
  State<BerandaPage> createState() => _BerandaPageState();
}

class _BerandaPageState extends State<BerandaPage> {
  List<BarangHilang> barangHilang = [];
  List<BarangTemu> barangTemu = [];

  getBarangTerdekat(LatLng val) async {
    final hilang = await BarangHilangService.get(filter: {
      'terdekat': "${val.latitude},${val.longitude}",
    });
    final temu = await BarangTemuService.get(filter: {
      'terdekat': "${val.latitude},${val.longitude}",
    });

    setState(() {
      barangHilang = hilang;
      barangTemu = temu;
    });
  }

  @override
  Widget build(BuildContext context) {
    return UserLayout(
      title: 'Beranda',
      child: SingleChildScrollView(
        child: Column(
          children: [
            CardComponent(
              title: 'Barang Terdekat',
              child: MapsComponent(
                height: Get.height / 1.5,
                barangHilang: barangHilang,
                barangTemu: barangTemu,
                onLocationFound: (val) async {
                  await getBarangTerdekat(val);
                },
              ),
            ),
            CardComponent(
                child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                RichText(
                  text: TextSpan(
                    children: [
                      TextSpan(
                        text: 'Warna merah',
                        style: TextStyle(
                            color: Colors.red, fontWeight: FontWeight.bold),
                      ),
                      TextSpan(text: ': lokasi barang hilang di sekitarmu')
                    ],
                    style: TextStyle(color: Colors.grey),
                  ),
                ),
                RichText(
                  text: TextSpan(
                    children: [
                      TextSpan(
                        text: 'Warna hijau',
                        style: TextStyle(
                            color: Colors.green, fontWeight: FontWeight.bold),
                      ),
                      TextSpan(text: ': lokasi barang hilang di sekitarmu')
                    ],
                    style: TextStyle(color: Colors.grey),
                  ),
                ),
              ],
            )),
          ],
        ),
      ),
    );
  }
}
