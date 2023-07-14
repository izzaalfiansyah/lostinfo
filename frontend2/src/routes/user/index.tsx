import { createEffect, createResource, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { DeleteIcon, EditIcon } from "~/components/icons";
import Input from "~/components/input";
import Modal from "~/components/modal";
import Table from "~/components/table";
import Title from "~/components/title";
import { useNotif } from "~/contexts/notif";
import User from "~/interfaces/user";
import http from "~/libs/http";

export default function () {
  const [items, setItems] = createSignal<User[]>([]);
  const [req, setReq] = createStore<User>({});
  const [isEdit, setIsEdit] = createSignal<boolean>(false);
  const [modal, setModal] = createStore({
    save: false,
    delete: false,
  });
  const [filter, setFilter] = createStore({
    totalPage: 0,
    limit: 10,
    page: 1,
    search: "",
  });

  const notif = useNotif();

  const nullable = () => {
    setReq({});
  };

  const get = async () => {
    try {
      const { data } = await http.get("/user", {
        params: filter,
      });

      const totalPage = Math.ceil(data.meta.total / filter.limit);
      setFilter("totalPage", totalPage);
      setItems(data.data);
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  const destroy = async () => {
    try {
      await http.delete("/user/" + req.id);
      notif.show("data berhasil dihapus");
      setModal("delete", false);
      get();
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  createEffect(() => {
    filter.search;
    get();
  });

  onMount(async () => {
    await get();
  });

  return (
    <>
      <Title
        title="Data User"
        subtitle="Menjelajahi dan menganalisis data pengguna"
        action={
          <button
            class="px-5 p-2 text-white bg-purple-600 rounded shadow-sm mt-4 lg:mt-0"
            onClick={() => {
              nullable();
              setIsEdit(false);
              setModal("save", false);
            }}
          >
            Tambah
          </button>
        }
      />

      <div class="mb-3">
        <Input
          placeholder="Cari..."
          value={filter.search}
          onChange={(e) => setFilter("search", e.currentTarget.value)}
        />
      </div>

      <div class="bg-white rounded-lg shadow-sm p-5">
        <Table
          page={filter.page}
          totalPage={filter.totalPage}
          heads={["Nama", "Alamat", "Telepon", "Email", "Opsi"]}
          items={items().map((item) => [
            item.nama,
            item.alamat,
            item.telepon,
            item.email,
            <>
              <button
                class="mr-3"
                onClick={() => {
                  setReq(item);
                  setIsEdit(true);
                  setModal("save", true);
                }}
              >
                <EditIcon class="w-4 h-4 text-purple-600" />
              </button>
              <button
                onClick={() => {
                  setReq(item);
                  setModal("delete", true);
                }}
              >
                <DeleteIcon class="w-4 h-4 text-red-600" />
              </button>
            </>,
          ])}
        />
      </div>

      <Modal
        show={modal.delete}
        onClose={() => setModal("delete", false)}
        title="Hapus Pengguna"
      >
        <form onSubmit={destroy} class="max-w-full w-[500px]">
          <p>
            Anda yakin menghapus <strong>{req.nama}</strong>? Data akan dihapus
            secara permanen!
          </p>
          <div class="mt-8 flex justify-end">
            <button
              type="submit"
              class="bg-red-500 text-white py-2 px-4 rounded shadow-sm"
            >
              Hapus
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
