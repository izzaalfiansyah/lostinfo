// ignore_for_file: prefer_const_constructors

import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_map_location_marker/flutter_map_location_marker.dart';
import 'package:geocoding/geocoding.dart';
import 'package:geolocator/geolocator.dart';
import 'package:latlong2/latlong.dart';
import 'package:mobile/components/skeleton.dart';
import 'package:mobile/libs/notif.dart';
import 'package:mobile/models/barang_hilang.dart';
import 'package:mobile/models/barang_temu.dart';

class MapsComponent extends StatefulWidget {
  const MapsComponent(
      {super.key,
      this.onChange,
      this.onLocationFound,
      this.barangHilang,
      this.barangTemu,
      this.alamat});

  final Function(LatLng)? onChange;
  final Function(LatLng)? onLocationFound;
  final String? alamat;
  final List<BarangHilang>? barangHilang;
  final List<BarangTemu>? barangTemu;

  @override
  State<MapsComponent> createState() => _MapsComponentState();
}

class _MapsComponentState extends State<MapsComponent> {
  final mapController = MapController();
  LatLng center = LatLng(-8.168959596070266, 113.70214465744915);
  List markers = [];
  bool isLoading = false;
  Position? pos;

  @override
  initState() {
    super.initState();
    _determinePosition();
    if (widget.alamat != null) {
      getKordinatByAlamat();
    }
  }

  getKordinatByAlamat() async {
    List<Location> locations =
        await locationFromAddress(widget.alamat.toString());
    final location = locations[0];

    setState(() {
      center = LatLng(location.latitude, location.longitude);
    });
  }

  _determinePosition() async {
    setState(() {
      isLoading = true;
    });

    bool serviceEnabled;
    LocationPermission permission;

    // Test if location services are enabled.
    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      notif('Perizinan untuk lokasi ter-disable', success: false);
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        notif('Perizinan untuk lokasi ditolak', success: false);
      }
    }

    if (permission == LocationPermission.deniedForever) {
      notif(
          'Perizinan lokasi ditolak permanen, anda dapat memberikan perizinan di pengaturan.',
          success: false);
    }

    // When we reach here, permissions are granted and we can
    // continue accessing the position of the device.

    setState(() {
      isLoading = false;
    });

    final position = await Geolocator.getCurrentPosition();

    setState(() {
      pos = position;
    });

    if (widget.onLocationFound != null) {
      widget.onLocationFound!(LatLng(pos!.latitude, pos!.longitude));
    }
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 400,
      child: !isLoading
          ? FlutterMap(
              mapController: mapController,
              options: MapOptions(
                center: center,
                zoom: 15,
                onTap: (tapPosition, point) {
                  if (widget.onChange != null) {
                    widget.onChange!(point);

                    setState(() {
                      markers.clear();
                      markers.add({
                        'point': point,
                      });
                    });
                  }
                },
              ),
              children: [
                TileLayer(
                  urlTemplate:
                      'https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png',
                  userAgentPackageName: 'com.lostinfo.polije',
                ),
                CurrentLocationLayer(),
                MarkerLayer(
                  markers: List.generate(markers.length, (index) {
                    final marker = markers[index];
                    return Marker(
                      rotate: true,
                      point: marker['point'],
                      builder: (_) => Icon(
                        Icons.pin_drop,
                        color: Colors.red,
                        shadows: [
                          BoxShadow(
                            color: Colors.black.withOpacity(.25),
                            offset: Offset(0, 5),
                            blurRadius: 5,
                          ),
                        ],
                      ),
                    );
                  }),
                ),
                MarkerLayer(
                  markers: List.generate(
                    widget.barangHilang != null
                        ? widget.barangHilang?.length as int
                        : 0,
                    (index) {
                      final item = widget.barangHilang![index];
                      return Marker(
                        width: 50,
                        height: 20,
                        point: LatLng(
                            item.maps_lat as double, item.maps_lng as double),
                        builder: (_) {
                          return ClipRRect(
                            borderRadius: BorderRadius.circular(10),
                            child: Container(
                              height: double.infinity,
                              width: double.infinity,
                              alignment: Alignment.center,
                              decoration: BoxDecoration(
                                color: Colors.red.withOpacity(.75),
                              ),
                              child: Material(
                                color: Colors.transparent,
                                child: InkWell(
                                  onTap: () {
                                    // change page
                                  },
                                  child: Container(
                                    alignment: Alignment.center,
                                    padding:
                                        EdgeInsets.symmetric(horizontal: 5),
                                    child: Text(
                                      item.nama.toString(),
                                      overflow: TextOverflow.ellipsis,
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 10,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          );
                        },
                      );
                    },
                  ),
                ),
                MarkerLayer(
                  markers: List.generate(
                    widget.barangTemu != null
                        ? widget.barangTemu?.length as int
                        : 0,
                    (index) {
                      final item = widget.barangTemu![index];
                      return Marker(
                        width: 50,
                        height: 20,
                        point: LatLng(
                            item.maps_lat as double, item.maps_lng as double),
                        builder: (_) {
                          return ClipRRect(
                            borderRadius: BorderRadius.circular(10),
                            child: Container(
                              height: double.infinity,
                              width: double.infinity,
                              alignment: Alignment.center,
                              decoration: BoxDecoration(
                                color: Colors.green.withOpacity(.75),
                              ),
                              child: Material(
                                color: Colors.transparent,
                                child: InkWell(
                                  onTap: () {
                                    // change page
                                  },
                                  child: Container(
                                    alignment: Alignment.center,
                                    padding:
                                        EdgeInsets.symmetric(horizontal: 5),
                                    child: Text(
                                      item.nama.toString(),
                                      overflow: TextOverflow.ellipsis,
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 10,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          );
                        },
                      );
                    },
                  ),
                ),
              ],
            )
          : SkeletonComponent(
              child: Container(
                height: double.infinity,
                color: Colors.white,
              ),
            ),
    );
  }
}
