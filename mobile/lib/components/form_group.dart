// ignore_for_file: prefer_const_constructors

import 'package:flutter/material.dart';

class FormGroup extends StatelessWidget {
  const FormGroup({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(bottom: 10),
      child: child,
    );
  }
}
