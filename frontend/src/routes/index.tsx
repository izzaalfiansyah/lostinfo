import { onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { ArchiveIcon, ArchiveXIcon, UsersIcon } from "~/components/icons";
import Title from "~/components/title";
import { useAuth } from "~/contexts/auth";
import { useNotif } from "~/contexts/notif";
import http from "~/libs/http";

export default function () {
  const [total, setTotal] = createStore({
    user: 0,
    barangHilang: 0,
    barangTemu: 0,
  });

  const [auth] = useAuth();
  const notif = useNotif();

  const getData = async () => {
    try {
      const user = await http.get("/user");
      const barangHilang = await http.get("/barang/hilang");
      const barangTemu = await http.get("/barang/temu");

      setTotal("user", user.data.data.length);
      setTotal("barangHilang", barangHilang.data.data.length);
      setTotal("barangTemu", barangTemu.data.data.length);
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  onMount(async () => {
    await getData();
  });

  return (
    <>
      <Title
        title="Dashboard"
        subtitle={`Halo ${auth()?.nama}, Selamat datang di Aplikasi LostInfo`}
      />
      <div class="grid lg:grid-cols-3 grid-cols-1 gap-3 mb-3">
        <div class="bg-white rounded-lg shadow-sm flex items-center p-5 px-10">
          <div class="rounded-full bg-purple-200 h-20 w-20 flex items-center justify-center mr-6">
            <UsersIcon class="w-12 h-12 text-purple-500" />
          </div>
          <div>
            <div class="text-4xl font-semibold">
              {total.user.toLocaleString("id-ID")}
            </div>
            <div>Pengguna</div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-sm flex items-center p-5 px-10">
          <div class="rounded-full bg-purple-200 h-20 w-20 flex items-center justify-center mr-6">
            <ArchiveIcon class="w-12 h-12 text-purple-500" />
          </div>
          <div>
            <div class="text-4xl font-semibold">
              {total.barangTemu.toLocaleString("id-ID")}
            </div>
            <div>Barang Temu</div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-sm flex items-center p-5 px-10">
          <div class="rounded-full bg-purple-200 h-20 w-20 flex items-center justify-center mr-6">
            <ArchiveXIcon class="w-12 h-12 text-purple-500" />
          </div>
          <div>
            <div class="text-4xl font-semibold">
              {total.barangHilang.toLocaleString("id-ID")}
            </div>
            <div>Barang Hilang</div>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm h-[400px] p-5">
        <div class="font-semibold">
          Grafik Barang Ditemukan dan Belum Ditemukan
        </div>
      </div>
    </>
  );
}
