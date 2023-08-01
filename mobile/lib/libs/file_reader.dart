import 'dart:convert';
import 'dart:io';

import 'package:file_picker/file_picker.dart';
import 'package:mobile/libs/notif.dart';

fileReader({bool isImage = true}) async {
  final res = await FilePicker.platform.pickFiles(
    type: FileType.custom,
    allowedExtensions: ['jpg', 'png', 'jpeg'],
  );

  if (res != null) {
    File file = File(res.files.single.path.toString());

    final platformFile = res.files.first;
    print(platformFile.size);

    if (platformFile.size > 2000000) {
      notif('Gambar yang diupload maximal 2mb', success: false);
      return null;
    }

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
