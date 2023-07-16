import { createEffect, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { A } from "solid-start";
import Card from "~/components/card";
import { DeleteIcon, EditIcon } from "~/components/icons";
import Input from "~/components/input";
import Pagination from "~/components/pagination";
import Skeleton from "~/components/skeleton";
import Table from "~/components/table";
import Title from "~/components/title";
import ModalDelete from "~/components/user/modal-delete";
import ModalSave from "~/components/user/modal-save";
import { useNotif } from "~/contexts/notif";
import User from "~/interfaces/user";
import http from "~/libs/http";

export default function () {
  const [items, setItems] = createSignal<User[]>([]);
  const [req, setReq] = createStore<User>({});
  const [isEdit, setIsEdit] = createSignal<boolean>(false);
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [modal, setModal] = createStore({
    save: false,
    delete: false,
  });
  const [filter, setFilter] = createStore({
    pageTotal: 0,
    recordTotal: 0,
    limit: 10,
    page: 1,
    search: "",
  });

  const notif = useNotif();

  const nullable = () => {
    setReq({
      id: "",
      nama: "",
      alamat: "",
      email: "",
      foto: "",
      foto_url: "",
      password: "",
      role: "",
      status: "",
      telepon: "",
      username: "",
    });
  };

  const get = async () => {
    setIsLoading(true);
    try {
      const { data } = await http.get("/user", {
        params: filter,
      });

      const totalPage = Math.ceil(data.meta.total / filter.limit);
      setFilter("recordTotal", data.meta.total);
      setFilter("pageTotal", totalPage);
      setItems(data.data);
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
    setIsLoading(false);
  };

  createEffect((oldVal: any) => {
    const val = {
      page: filter.page,
      search: filter.search,
    };

    if (oldVal) {
      get();
    }

    return val;
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
              setModal("save", true);
            }}
          >
            Tambah
          </button>
        }
      />

      <Card>
        <div class="mb-3">
          <Input
            placeholder="Cari..."
            value={filter.search}
            onChange={(e) => {
              setFilter("search", e.currentTarget.value);
              setFilter("page", 1);
            }}
          />
        </div>
        <Table
          heads={["Nama", "Alamat", "Telepon", "Email", "Opsi"]}
          items={
            isLoading()
              ? Array.from({ length: 5 }).map(() => [
                  <Skeleton class="rounded-full p-2" />,
                  <Skeleton class="rounded-full p-2" />,
                  <Skeleton class="rounded-full p-2" />,
                  <Skeleton class="rounded-full p-2" />,
                  <Skeleton class="rounded-full p-2" />,
                ])
              : items().map((item) => [
                  <>
                    <A href={"/admin/user/" + item.id} class="text-purple-600">
                      {item.nama}
                    </A>
                  </>,
                  item.alamat,
                  item.telepon,
                  item.email,
                  <>
                    <button
                      class="mr-3"
                      onClick={() => {
                        setReq(item);
                        setReq("foto", "");
                        setReq("ktp", "");
                        setReq("password", "");
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
                ])
          }
        />
        <div class="mt-3"></div>
        <Pagination
          page={filter.page}
          pageTotal={filter.pageTotal}
          record={items().length}
          recordTotal={filter.recordTotal}
          onChange={(val) => {
            setFilter("page", val);
          }}
        />
      </Card>

      <ModalSave
        show={modal.save}
        onClose={() => setModal("save", false)}
        callback={get}
        isEdit={isEdit()}
        req={[req, setReq]}
      />

      <ModalDelete
        show={modal.delete}
        onClose={() => setModal("delete", false)}
        callback={get}
        req={[req, setReq]}
      />
    </>
  );
}
