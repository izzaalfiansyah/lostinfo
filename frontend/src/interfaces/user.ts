interface User {
  id?: number;
  username?: string;
  password?: string;
  nama?: string;
  alamat?: string;
  email?: string;
  telepon?: string | number;
  foto?: string;
  foto_url?: string;
  role?: string;
  role_detail?: string;
  status?: string;
  status_detail?: string;
}

export default User;
