import {
  $,
  component$,
  useContext,
  useSignal,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { DeleteIcon } from "~/components/icons";
import Img from "~/components/img";
import Modal from "~/components/modal";
import Pagination from "~/components/pagination";
import Title from "~/components/title";
import { NotifContext } from "~/contexts/notif";
import type BarangHilang from "~/interfaces/barang-hilang";
import http from "~/libs/http";

export default component$(() => {
  const items = useSignal<BarangHilang[]>([]);
  const filter = useStore({
    total: 0,
    page: 1,
    search: "",
  });
  const notif = useContext(NotifContext);
  const deleteData = useStore({
    id: "",
    nama: "",
  });
  const modal = useStore({
    delete: false,
  });

  const get = $(async () => {
    try {
      const res = await http.get("/barang/hilang");
      items.value = res.data.data;
      filter.total = res.data.meta.total;
    } catch (e: any) {
      notif.show(e.response.data.message, "bg-red-500");
    }
  });

  const destroy = $(async () => {
    try {
      await http.delete("/barang/hilang/" + deleteData.id);
      notif.show("data berhasil dihapus");
      modal.delete = false;
    } catch (e: any) {
      notif.show(e.response.data.message, "bg-red-500");
    }
  });

  useVisibleTask$(async ({ track }) => {
    track(() => filter.page && filter.search);

    await get();
  });

  return (
    <>
      <Title
        title="Data Barang Hilang"
        subtitle="Menjelajahi dan menganalisis data barang hilang"
      >
        <Link
          q:slot="action"
          class="px-5 p-2 text-white bg-purple-600 rounded shadow-sm mt-4 lg:mt-0"
          href="/barang-hilang/create"
        >
          Tambah
        </Link>
      </Title>
      <div class="mb-3">
        <input
          type="text"
          class="rounded-lg outline-none bg-white border-gray-200 transition focus:ring-purple-300 w-full"
          placeholder="Cari..."
          value={filter.search}
          onChange$={(e) => (filter.search = e.target.value)}
        />
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {items.value.map((item) => (
          <div
            class="bg-white rounded-lg shadow-sm flex items-center space-x-3 p-3"
            key={item.id}
          >
            <Img src={item.foto_url} alt={item.nama} class="w-28 h-28" />
            <div class="grow truncate">
              <div class="font-semibold truncate">{item.nama}</div>
              <div class="text-gray-500 text-sm">@{item.user?.username}</div>
              <div class="mt-4 flex items-center">
                <Link
                  href={"/barang-hilang/" + item.id}
                  class="text-sm text-purple-500 border inline-block border-purple-500 hover:text-white hover:bg-purple-500 transition rounded-full px-3 p-1"
                >
                  Detail Barang
                </Link>
                <button
                  type="button"
                  class="border border-red-500 rounded-full text-red-500 px-3 p-1.5 ml-1 outline-none hover:bg-red-500 hover:text-white transition"
                  onClick$={() => {
                    modal.delete = true;
                    deleteData.id = item.id as any;
                    deleteData.nama = item.nama as any;
                  }}
                >
                  <DeleteIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination data={items.value.length} filter={filter as any} />
      <Modal
        show={modal.delete}
        onClose$={() => (modal.delete = false)}
        title="Hapus Barang Hilang"
      >
        <form
          onSubmit$={destroy}
          preventdefault:submit
          class="max-w-full w-[500px]"
        >
          <p>
            Anda yakin menghapus barang <strong>{deleteData.nama}</strong>?
          </p>
          <div class="mt-8 justify-end flex">
            <button class="bg-red-500 text-white px-4 p-2 rounded">
              Hapus
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
});

export const head: DocumentHead = {
  title: "Data Barang Hilang",
};
