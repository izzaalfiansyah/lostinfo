interface User {
  id?: number | string;
  username?: string;
  password?: string;
  nama?: string;
  alamat?: string;
  email?: string;
  telepon?: string | number;
  whatsapp?: string | number;
  foto?: string;
  foto_url?: string;
  ktp?: string;
  ktp_url?: string;
  role?: string;
  role_detail?: string;
  status?: string;
  status_detail?: string;
  created_at?: string;
  updated_at?: string;
  premium?: string;
  premium_date?: string;
}

export default User;
