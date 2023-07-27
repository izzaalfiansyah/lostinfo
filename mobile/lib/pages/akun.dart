// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables

import 'package:flutter/material.dart';

class AkunPage extends StatefulWidget {
  const AkunPage({super.key});

  @override
  State<AkunPage> createState() => _AkunPageState();
}

class _AkunPageState extends State<AkunPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Akun'),
        actions: [
          TextButton(
            style: TextButton.styleFrom(iconColor: Colors.white),
            onPressed: () {},
            child: Icon(
              Icons.account_circle,
            ),
          )
        ],
      ),
      drawer: Drawer(),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(5),
        child: Column(
          children: [
            CardComponent(
              children: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Image.network(
                    'https://www.pngkey.com/png/detail/121-1219231_user-default-profile.png',
                    height: 200,
                    width: 200,
                    fit: BoxFit.cover,
                  ),
                  SizedBox(height: 20),
                  Text(
                    'Muhammad Izza Alfiansyah',
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 18,
                    ),
                  ),
                  SizedBox(height: 5),
                  Text('@superadmin'),
                  SizedBox(height: 5),
                  OutlinedButton(
                    onPressed: () {},
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.red,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(100),
                      ),
                    ),
                    child: Text(
                      'Lihat KTP',
                      style: TextStyle(
                        color: Colors.red,
                        fontSize: 12,
                      ),
                    ),
                  ),
                  SizedBox(height: 20),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.pin_drop,
                        color: Colors.grey,
                      ),
                      SizedBox(width: 10),
                      Text('Gumukmas, Jember'),
                    ],
                  ),
                  SizedBox(height: 5),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.email,
                        color: Colors.grey,
                      ),
                      SizedBox(width: 10),
                      Text('iansyah724@gmail.com'),
                    ],
                  ),
                  SizedBox(height: 5),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.phone,
                        color: Colors.grey,
                      ),
                      SizedBox(width: 10),
                      Text('081231921351'),
                    ],
                  ),
                  SizedBox(height: 20),
                  Row(
                    children: [
                      Text('Bergabung ada 20 Mei 2023'),
                    ],
                  )
                ],
              ),
            ),
            CardComponent(
              title: 'Edit Akun',
              children: Spacer(),
            )
          ],
        ),
      ),
    );
  }
}

class CardComponent extends StatelessWidget {
  const CardComponent({
    super.key,
    required this.children,
    this.title,
  });

  final Widget children;
  final String? title;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(20),
        child: SizedBox(
            width: double.infinity,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                title != null
                    ? Text(
                        title.toString(),
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 15,
                        ),
                      )
                    : SizedBox(),
                children,
              ],
            )),
      ),
    );
  }
}
