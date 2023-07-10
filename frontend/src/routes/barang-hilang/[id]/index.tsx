import {
  $,
  component$,
  useContext,
  useSignal,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";
import { useLocation, type DocumentHead, Link } from "@builder.io/qwik-city";
import Img from "~/components/img";
import Title from "~/components/title";
import { NotifContext } from "~/contexts/notif";
import type BarangHilang from "~/interfaces/barang-hilang";
import type User from "~/interfaces/user";
import fileReader from "~/libs/file-reader";
import http from "~/libs/http";

export default component$(() => {
  const location = useLocation();

  const user = useSignal<User[]>([]);
  const req = useStore<BarangHilang>({});
  const notif = useContext(NotifContext);

  const getUser = $(async () => {
    const res = await http.get("/user");
    user.value = res.data.data;
  });

  const get = $(async () => {
    const res = await http.get("/barang/hilang/" + location.params.id);
    const item = res.data.data as BarangHilang;
    req.id = item.id;
    req.deskripsi = item.deskripsi;
    req.ditemukan = item.ditemukan;
    req.foto_url = item.foto_url;
    req.hadiah = item.hadiah;
    req.maps = item.maps;
    req.nama = item.nama;
    req.tempat_hilang = item.tempat_hilang;
    req.user_id = item.user_id;
  });

  const save = $(async () => {
    try {
      await http.put("/barang/hilang/" + location.params.id, req);
      notif.show("data berhasil disimpan");
    } catch (e: any) {
      notif.show(e.response.data.message, "bg-red-500");
    }
  });

  const handleFotoChange = $(async (e: any) => {
    const file = e.target.files[0];
    const value = await fileReader(file);
    req.foto = value;
    req.foto_url = value;
  });

  useVisibleTask$(async () => {
    await getUser();
    await get();
  });

  return (
    <>
      <Title
        title="Detail Barang Hilang"
        subtitle="Informasi lanjutan mengenai barang hilang"
      ></Title>
      <form
        onSubmit$={save}
        preventdefault:submit
        class="bg-white rounded-lg shadow-sm p-5"
      >
        <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
          <div>
            <div class="mb-2">
              <label for="">Nama</label>
              <input
                type="text"
                class="t-input"
                placeholder="Masukkan Nama"
                value={req.nama}
                onChange$={(e) => (req.nama = e.target.value)}
              />
            </div>
            <div class="mb-2">
              <label for="">Deskripsi</label>
              <textarea
                rows={3}
                class="t-input"
                placeholder="Masukkan Deskripsi"
                value={req.deskripsi}
                onChange$={(e) => (req.deskripsi = e.target.value)}
              ></textarea>
            </div>
            <div class="mb-2">
              <label for="">Tempat Hilang</label>
              <input
                type="text"
                class="t-input"
                placeholder="Masukkan Tempat Hilang"
                value={req.tempat_hilang}
                onChange$={(e) => (req.tempat_hilang = e.target.value)}
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
              <label for="">Pemilik</label>
              <select
                required
                class="t-input"
                value={req.user_id}
                onChange$={(e) => (req.user_id = parseInt(e.target.value))}
              >
                <option value="">Pilih Pemilik</option>
                {user.value.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.nama}
                  </option>
                ))}
              </select>
            </div>
            <div class="mb-3">
              <label for="">Foto</label>
              <input
                type="file"
                title="Pilih Foto"
                class="w-full"
                onChange$={handleFotoChange}
                accept="image/*"
              />
            </div>
            <div class="mb-2">
              <div class="bg-gray-100 rounded-lg flex items-center justify-center p-5">
                <Img src={req.foto_url} alt="Foto Barang" class="w-24 h-24" />
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
                value={req.hadiah}
                onChange$={(e) => (req.hadiah = parseInt(e.target.value))}
              />
            </div>
            <div class="mb-2">
              <label for="">Ditemukan</label>
              <select
                class="t-input"
                value={req.ditemukan}
                onChange$={(e) => (req.ditemukan = parseInt(e.target.value))}
              >
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
          <Link
            href="/barang-hilang"
            class="button px-4 p-2 bg-gray-400 text-white rounded shadow-sm"
          >
            Kembali
          </Link>
        </div>
      </form>
    </>
  );
});

export const head: DocumentHead = {
  title: "Detail Barang",
};