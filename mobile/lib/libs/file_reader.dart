import 'dart:convert';
import 'dart:io';

import 'package:file_picker/file_picker.dart';

fileReader({bool isImage = true}) async {
  final res = await FilePicker.platform.pickFiles();

  if (res != null) {
    File file = File(res.files.single.path.toString());

    List<int> imageBytes = file.readAsBytesSync();
    String ext = res.files.single.extension.toString();
    String base64File = base64Encode(imageBytes);

    if (isImage) {
      return "data:image/$ext;base64,$base64File";
    }

    return base64File;
  } else {
    return null;
  }
}
