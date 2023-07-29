import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

class SkeletonComponent extends StatelessWidget {
  const SkeletonComponent({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: Colors.grey.shade300,
      highlightColor: Colors.white,
      child: child,
    );
  }
}
