import { For, createEffect, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { A } from "solid-start";
import { DeleteIcon } from "~/components/icons";
import Img from "~/components/img";
import Input from "~/components/input";
import Modal from "~/components/modal";
import Pagination from "~/components/pagination";
import Title from "~/components/title";
import { useNotif } from "~/contexts/notif";
import BarangHilang from "~/interfaces/barang-hilang";
import http from "~/libs/http";

export default function () {
  const [req, setReq] = createStore<BarangHilang>({});
  const [items, setItems] = createSignal<BarangHilang[]>([]);
  const [modal, setModal] = createStore({
    delete: false,
  });
  const [filter, setFilter] = createStore({
    page: 1,
    pageTotal: 0,
    recordTotal: 0,
    limit: 9,
    search: "",
  });

  const notif = useNotif();

  const get = async () => {
    try {
      const { data } = await http.get("/barang/hilang", {
        params: filter,
      });

      const pageTotal = Math.ceil(data.meta.total / filter.limit);
      setFilter("pageTotal", pageTotal);
      setFilter("recordTotal", data.data.length);
      setItems(data.data);
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  const destroy = async (e: SubmitEvent) => {
    e.preventDefault();
    try {
      await http.delete("/barang/hilang/" + req.id);
      notif.show("data berhasil dihapus");
      setModal("delete", false);
      get();
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  createEffect((oldVal) => {
    if (oldVal) {
      get();
    }

    return {
      page: filter.page,
      search: filter.search,
    };
  });

  onMount(async () => {
    await get();
  });

  return (
    <>
      <Title
        title="Data Barang Hilang"
        subtitle="Menjelajahi dan menganalisis data barang hilang"
        action={
          <A
            href="/barang-hilang/create"
            class="px-5 p-2 text-white bg-purple-600 rounded shadow-sm mt-4 lg:mt-0"
          >
            Tambah
          </A>
        }
      ></Title>

      <div class="mb-3">
        <Input
          placeholder="Cari..."
          value={filter.search}
          onChange={(e) => setFilter("search", e.currentTarget.value)}
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <For each={items()}>
          {(item) => (
            <div class="bg-white rounded-lg shadow-sm flex items-center space-x-3 p-3">
              <Img src={item.foto_url} alt={item.nama} class="w-28 h-28" />
              <div class="grow truncate">
                <div class="font-semibold truncate">{item.nama}</div>
                <div class="text-gray-500 text-sm">@{item.user?.username}</div>
                <div class="mt-4 flex items-center">
                  <A
                    href={"/barang-hilang/" + item.id}
                    class="text-sm text-purple-500 border inline-block border-purple-500 hover:text-white hover:bg-purple-500 transition rounded-full px-3 p-1"
                  >
                    Detail Barang
                  </A>
                  <button
                    type="button"
                    class="border border-red-500 rounded-full text-red-500 px-3 p-1.5 ml-1 outline-none hover:bg-red-500 hover:text-white transition"
                    onClick={() => {
                      setReq(item);
                      setModal("delete", true);
                    }}
                  >
                    <DeleteIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </For>
      </div>

      <div class="mt-4 bg-white rounded-lg shadow-sm p-5">
        <Pagination
          record={items().length}
          recordTotal={filter.recordTotal}
          page={filter.page}
          pageTotal={filter.pageTotal}
          onChange={(val) => {
            setFilter("page", val);
          }}
        />
      </div>

      <Modal
        show={modal.delete}
        onClose={() => setModal("delete", false)}
        title="Hapus Barang Hilang"
      >
        <form onSubmit={destroy} class="max-w-full w-[500px]">
          <p>
            Anda yakin menghapus barang <strong>{req.nama}</strong>?
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
}
