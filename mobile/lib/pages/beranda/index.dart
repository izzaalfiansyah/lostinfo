// ignore_for_file: prefer_const_constructors

import 'package:flutter/material.dart';
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

    print(barangHilang);
    print(barangTemu);
  }

  @override
  Widget build(BuildContext context) {
    return UserLayout(
      title: 'Beranda',
      child: SingleChildScrollView(
        child: CardComponent(
          title: 'Barang Terdekat',
          child: MapsComponent(
            barangHilang: barangHilang,
            barangTemu: barangTemu,
            onLocationFound: (val) async {
              await getBarangTerdekat(val);
            },
          ),
        ),
      ),
    );
  }
}
