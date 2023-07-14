import type Barang from "./barang";

interface BarangHilang extends Barang {
  tempat_hilang?: string;
  hadiah?: number;
  ditemukan?: string;
  ditemukan_detail?: string;
}

export default BarangHilang;
