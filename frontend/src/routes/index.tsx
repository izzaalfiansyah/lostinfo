import {
  $,
  component$,
  useContext,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { ArchiveIcon, ArchiveXIcon, UsersIcon } from "~/components/icons";
import Title from "~/components/title";
import { AuthContext } from "~/contexts/auth";
import { NotifContext } from "~/contexts/notif";
import http from "~/libs/http";

export default component$(() => {
  const auth = useContext(AuthContext);
  const total = useStore({
    user: 0,
    barangHilang: 0,
    barangTemu: 0,
  });

  const notif = useContext(NotifContext);

  const getData = $(async () => {
    try {
      const user = await http.get("/user");
      const barangHilang = await http.get("/barang/hilang");
      const barangTemu = await http.get("/barang/temu");

      total.user = user.data.data.length;
      total.barangHilang = barangHilang.data.data.length;
      total.barangTemu = barangTemu.data.data.length;
    } catch (e: any) {
      notif.show(e.response.data.message, "bg-red-500");
    }
  });

  useTask$(async () => {
    await getData();
  });

  return (
    <>
      <Title
        title="Dashboard"
        subtitle={`Halo ${
          (auth.value as any)?.nama
        }, Selamat datang di Aplikasi LostInfo`}
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
});

export const head: DocumentHead = {
  title: "Dashboard",
};
