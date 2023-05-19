import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { ArchiveIcon, ArchiveXIcon, UsersIcon } from "~/components/icons";
import Title from "~/components/title";

export default component$(() => {
  return (
    <>
      <Title
        title="Dashboard"
        subtitle="Halo Superadmin, Selamat datang di Aplikasi LostInfo"
      />
      <div class="grid lg:grid-cols-3 grid-cols-1 gap-3 mb-3">
        <div class="bg-white rounded-lg shadow-sm flex items-center p-5 px-10">
          <div class="rounded-full bg-purple-200 h-20 w-20 flex items-center justify-center mr-6">
            <UsersIcon class="w-12 h-12 text-purple-500" />
          </div>
          <div>
            <div class="text-4xl font-semibold">75</div>
            <div>Pengguna</div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-sm flex items-center p-5 px-10">
          <div class="rounded-full bg-purple-200 h-20 w-20 flex items-center justify-center mr-6">
            <ArchiveIcon class="w-12 h-12 text-purple-500" />
          </div>
          <div>
            <div class="text-4xl font-semibold">357</div>
            <div>Barang Temu</div>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-sm flex items-center p-5 px-10">
          <div class="rounded-full bg-purple-200 h-20 w-20 flex items-center justify-center mr-6">
            <ArchiveXIcon class="w-12 h-12 text-purple-500" />
          </div>
          <div>
            <div class="text-4xl font-semibold">65</div>
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
