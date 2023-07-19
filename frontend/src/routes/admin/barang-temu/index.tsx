import { For, Show, createEffect, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { A, useNavigate } from "solid-start";
import ModalDelete from "~/components/barang-temu/modal-delete";
import Button from "~/components/button";
import Card from "~/components/card";
import { DeleteIcon, EditIcon } from "~/components/icons";
import Img from "~/components/img";
import Input from "~/components/input";
import Pagination from "~/components/pagination";
import Skeleton from "~/components/skeleton";
import Title from "~/components/title";
import { useNotif } from "~/contexts/notif";
import BarangTemu from "~/interfaces/barang-temu";
import formatDate from "~/libs/format-date";
import http from "~/libs/http";

interface Props {
  user_id?: any;
}

export default function (props: Props) {
  const [req, setReq] = createStore<BarangTemu>({});
  const [items, setItems] = createSignal<BarangTemu[]>([]);
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [modal, setModal] = createStore({
    delete: false,
  });
  const [filter, setFilter] = createStore({
    page: 1,
    pageTotal: 0,
    recordTotal: 0,
    limit: 9,
    search: "",
    user_id: props.user_id || "",
  });

  const notif = useNotif();
  const nav = useNavigate();

  const get = async () => {
    setIsLoading(true);
    try {
      const { data } = await http.get("/barang/temu", {
        params: filter,
      });

      const pageTotal = Math.ceil(data.meta.total / filter.limit);
      setFilter("pageTotal", pageTotal);
      setFilter("recordTotal", data.data.length);
      setItems(data.data);
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
    setIsLoading(false);
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
      <Show when={!props.user_id}>
        <Title
          title="Data Barang Temu"
          subtitle="Menjelajahi dan menganalisis data barang temu"
          action={
            <Button
              onClick={() => nav("/admin/barang-temu/create")}
              variant="primary"
            >
              Tambah
            </Button>
          }
        ></Title>
      </Show>

      <div class="mb-3">
        <Input
          placeholder="Cari..."
          value={filter.search}
          onChange={(e) => setFilter("search", e.currentTarget.value)}
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Show
          when={!isLoading()}
          fallback={
            <For each={Array.from({ length: 6 })}>
              {(item) => (
                <Card class="!p-3 flex items-center space-x-3">
                  <Skeleton class="h-28 w-28 rounded-lg" />
                  <div class="grow">
                    <Skeleton class="p-2 rounded-full mb-2" />
                    <Skeleton class="p-1 rounded-full mb-1" />
                    <Skeleton class="p-1 rounded-full" />
                    <div class="mt-3 flex justify-between gap-x-3">
                      <Skeleton class="rounded-full p-3 flex-1" />
                      <Skeleton class="rounded-full p-3 flex-1" />
                    </div>
                  </div>
                </Card>
              )}
            </For>
          }
        >
          <For
            each={items()}
            fallback={
              <div class="text-center p-5 lg:col-span-3">
                Data tidak tersedia
              </div>
            }
          >
            {(item) => (
              <Card class="flex items-center space-x-3 !p-3">
                <Img src={item.foto_url} alt={item.nama} class="w-28 h-28" />
                <div class="grow truncate">
                  <div class="font-semibold truncate">{item.nama}</div>
                  <div class="text-gray-500 text-xs mt-1">
                    Oleh{" "}
                    <A
                      href={"/admin/user/" + item.user_id}
                      class="text-primary"
                    >
                      @{item.user?.username}
                    </A>
                  </div>
                  <div class="text-gray-500 text-xs">
                    {formatDate(item.created_at as string, true)}
                  </div>
                  <div class="mt-3 flex items-center">
                    <A
                      href={"/admin/barang-temu/" + item.id}
                      class="text-sm text-primary border inline-block border-primary hover:text-white hover:bg-primary transition rounded-full px-3 p-1"
                    >
                      <EditIcon class="w-4 h-4" />
                    </A>
                    <button
                      type="button"
                      class="ml-1 text-sm text-red-500 border inline-block border-red-500 hover:text-white hover:bg-red-500 transition rounded-full px-3 p-1"
                      onClick={() => {
                        setReq(item);
                        setModal("delete", true);
                      }}
                    >
                      <DeleteIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            )}
          </For>
        </Show>
      </div>

      <Card class="mt-4">
        <Pagination
          record={items().length}
          recordTotal={filter.recordTotal}
          page={filter.page}
          pageTotal={filter.pageTotal}
          onChange={(val) => {
            setFilter("page", val);
          }}
        />
      </Card>

      <ModalDelete
        show={modal.delete}
        onClose={() => setModal("delete", false)}
        callback={get}
        req={[req, setReq]}
      />
    </>
  );
}
