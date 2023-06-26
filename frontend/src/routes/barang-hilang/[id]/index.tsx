import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import Img from "~/components/img";
import Title from "~/components/title";

export default component$(() => {
  return (
    <>
      <Title
        title="Detail Barang Hilang"
        subtitle="Informasi lanjutan mengenai barang hilang"
      ></Title>
      <div class="bg-white rounded-lg shadow-sm p-5">
        <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
          <div>
            <div class="mb-2">
              <label for="">Nama</label>
              <input type="text" class="t-input" placeholder="Masukkan Nama" />
            </div>
            <div class="mb-2">
              <label for="">Deskripsi</label>
              <textarea
                rows={3}
                class="t-input"
                placeholder="Masukkan Deskripsi"
              ></textarea>
            </div>
            <div class="mb-2">
              <label for="">Tempat Hilang</label>
              <input
                type="text"
                class="t-input"
                placeholder="Masukkan Tempat Hilang"
              />
              <div class="text-xs text-gray-400">
                Perkiraan tempat hilang atau tempat terakhir melihat barang
              </div>
            </div>
            <div class="mb-2">
              <label for="">Lokasi Maps</label>
              <div class="bg-gray-100 h-64"></div>
            </div>
          </div>
          <div>
            <div class="mb-3">
              <label for="">Foto</label>
              <input type="file" title="Pilih Foto" class="w-full" />
            </div>
            <div class="mb-2">
              <div class="bg-gray-100 rounded-lg flex items-center justify-center p-5">
                <Img src="" alt="Foto Barang" class="w-24 h-24" />
              </div>
            </div>
            <div class="mb-2">
              <label for="">Hadiah</label>
              <input
                type="number"
                name=""
                id=""
                class="t-input"
                placeholder="Masukkan Hadiah"
              />
            </div>
            <div class="mb-2">
              <label for="">Ditemukan</label>
              <select class="t-input">
                <option value="">Pilih status</option>
                <option value="0">Belum</option>
                <option value="1">Sudah</option>
              </select>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <button
            type="submit"
            class="px-4 p-2 bg-purple-500 rounded shadow-sm text-white mr-2"
          >
            Simpan Data
          </button>
          <button
            type="button"
            class="button px-4 p-2 bg-gray-400 text-white rounded shadow-sm"
          >
            Kembali
          </button>
        </div>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Detail Barang",
};
