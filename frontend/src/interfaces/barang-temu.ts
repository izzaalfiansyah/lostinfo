import Barang from "./barang";

interface BarangTemu extends Barang {
  tempat_temu?: string;
  dikembalikan?: string;
  dikembalikan_detail?: string;
}

export default BarangTemu;
