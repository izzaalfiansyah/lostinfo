import 'package:mobile/models/user.dart';

class UserLapor {
  dynamic id;
  dynamic user_id;
  dynamic pelapor_id;
  String? alasan;
  User? user;
  User? pelapor;
  String? created_at;
  String? updated_at;

  UserLapor({
    this.id,
    this.user_id,
    this.pelapor_id,
    this.alasan,
    this.user,
    this.pelapor,
    this.created_at,
    this.updated_at,
  });

  factory UserLapor.fromJSON(data) {
    return UserLapor(
      id: data['id'],
      user_id: data['user_id'],
      pelapor_id: data['pelapor_id'],
      alasan: data['alasan'],
      user: User.fromJSON(data['user']),
      pelapor: User.fromJSON(data['pelapor']),
      created_at: data['created_at'],
      updated_at: data['updated_at'],
    );
  }

  toJSON() {
    return {
      'id': id,
      'user_id': user_id,
      'pelapor_id': pelapor_id,
      'alasan': alasan,
    };
  }
}
