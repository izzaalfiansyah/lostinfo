import type Barang from "./barang";

interface BarangHilang extends Barang {
  tempat_hilang: string;
  hadiah: number;
  ditemukan: number;
  ditemukan_detail: string;
}

export default BarangHilang;
