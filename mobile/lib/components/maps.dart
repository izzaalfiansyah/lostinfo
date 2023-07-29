// ignore_for_file: prefer_const_constructors

import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_map_location_marker/flutter_map_location_marker.dart';
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
      this.barangTemu});

  final Function(LatLng)? onChange;
  final Function(LatLng)? onLocationFound;
  final List<BarangHilang>? barangHilang;
  final List<BarangTemu>? barangTemu;

  @override
  State<MapsComponent> createState() => _MapsComponentState();
}

class _MapsComponentState extends State<MapsComponent> {
  final mapController = MapController();
  List markers = [];
  bool isLoading = false;
  Position pos = Position(
      latitude: -8.168959596070266,
      longitude: 113.70214465744915,
      timestamp: DateTime.now(),
      accuracy: 0,
      altitude: 0,
      heading: 0,
      speed: 0,
      speedAccuracy: 0);

  @override
  initState() {
    super.initState();
    _determinePosition();
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
    // final position = await Geolocator.getCurrentPosition();

    setState(() {
      // pos = position;
      isLoading = false;
    });

    if (widget.onLocationFound != null) {
      widget.onLocationFound!(LatLng(pos.latitude, pos.longitude));
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
                center: LatLng(-8.168959596070266, 113.70214465744915),
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
                CurrentLocationLayer(
                  style: LocationMarkerStyle(
                    marker: const DefaultLocationMarker(
                      child: Icon(
                        Icons.navigation,
                        color: Colors.white,
                      ),
                    ),
                    markerSize: const Size(40, 40),
                    markerDirection: MarkerDirection.heading,
                  ),
                ),
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
                )
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
