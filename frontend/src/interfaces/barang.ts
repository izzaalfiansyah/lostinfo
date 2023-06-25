import type User from "./user";

interface Barang {
  id: number;
  user_id: number;
  user: User;
  nama: string;
  deskripsi: string;
  maps: {
    lat: string;
    lng: string;
  };
  foto: string;
  foto_url: string;
}

export default Barang;
