import type User from "./user";

interface Barang {
  id?: number;
  user_id?: number | string;
  user?: User;
  nama?: string;
  deskripsi?: string;
  maps_lat?: number;
  maps_lng?: number;
  foto?: string;
  foto_url?: string;
  created_at?: string;
  updated_at?: string;
}

export default Barang;
