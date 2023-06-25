import {
  $,
  component$,
  useContext,
  useSignal,
  useTask$,
} from "@builder.io/qwik";
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
      const data = res.data;
      items.value = data.data;
      console.log(items.value);
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
    </>
  );
});
