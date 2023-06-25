import {
  $,
  component$,
  useContext,
  useSignal,
  useTask$,
} from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import Img from "~/components/img";
import Title from "~/components/title";
import { NotifContext } from "~/contexts/notif";
import type BarangHilang from "~/interfaces/barang-hilang";
import http from "~/libs/http";

export default component$(() => {
  const items = useSignal<BarangHilang[]>([]);

  const notif = useContext(NotifContext);

  const get = $(async () => {
    try {
      const res = await http.get("/barang/hilang");
      items.value = res.data.data;
    } catch (e: any) {
      notif.show(e.response.data.message, "bg-red-500");
    }
  });

  useTask$(async () => {
    await get();
  });

  return (
    <>
      <Title
        title="Data Barang Hilang"
        subtitle="Menjelajahi dan menganalisis data barang hilang"
      >
        <button
          q:slot="action"
          class="px-5 p-2 text-white bg-purple-600 rounded shadow-sm mt-4 lg:mt-0"
          onClick$={() => {}}
        >
          Tambah
        </button>
      </Title>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {items.value.map((item) => (
          <div
            class="bg-white rounded-lg shadow-sm flex items-center space-x-3 p-3"
            key={item.id}
          >
            <Img src={item.foto_url} alt={item.nama} class="w-32 h-32" />
            <div class="grow truncate">
              <div class="font-semibold truncate">{item.nama}</div>
              <div class="text-gray-500 text-sm">@{item.user?.username}</div>
              <div class="mt-4">
                <Link
                  href={"/barang-hilang/" + item.id}
                  class="text-sm text-purple-500 border inline-block border-purple-500 hover:text-white hover:bg-purple-500 transition rounded-full px-3 p-1"
                >
                  Detail Barang
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Data Barang Hilang",
};
