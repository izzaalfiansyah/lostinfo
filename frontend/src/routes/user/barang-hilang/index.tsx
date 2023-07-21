import { For, Show, createEffect, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { A } from "solid-start";
import ModalDelete from "~/components/barang-hilang/modal-delete";
import Card from "~/components/card";
import FloatingComponent from "~/components/floating-component";
import { AddIcon, DeleteIcon, EditIcon, SearchIcon } from "~/components/icons";
import Img from "~/components/img";
import Input from "~/components/input";
import Pagination from "~/components/pagination";
import Skeleton from "~/components/skeleton";
import Title from "~/components/title";
import { useAuth } from "~/contexts/auth";
import { useNotif } from "~/contexts/notif";
import BarangHilang from "~/interfaces/barang-hilang";
import formatDate from "~/libs/format-date";
import http from "~/libs/http";

interface Props {
  user_id?: any;
}

export default function (props: Props) {
  const [items, setItems] = createSignal<BarangHilang[]>([]);
  const [req, setReq] = createStore<BarangHilang>({});
  const [isLoading, setIsLoading] = createSignal(false);
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
  const [auth] = useAuth();

  const get = async () => {
    setIsLoading(true);
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
      <Title title="Barang Hilang"></Title>
      <Input
        value={filter.search}
        onChange={(e) => setFilter("search", e.currentTarget.value)}
        placeholder="Cari..."
      />
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Show
          when={!isLoading()}
          fallback={
            <For each={Array.from({ length: 6 })}>
              {(item) => (
                <Card class="!p-3 flex items-center space-x-3">
                  <Skeleton class="h-28 w-28 rounded-lg" />
                  <div class="grow">
                    <Skeleton class="p-2 rounded-full mb-5" />
                    <Skeleton class="p-1 rounded-full mb-1" />
                    <Skeleton class="p-1 rounded-full mb-1" />
                    <Skeleton class="p-1 rounded-full mb-1" />
                  </div>
                </Card>
              )}
            </For>
          }
        >
          <For
            each={items()}
            fallback={<div class="text-center p-5">Data tidak tersedia</div>}
          >
            {(item) => (
              <Card class="flex items-center space-x-3 !p-3">
                <Img src={item.foto_url} alt={item.nama} class="w-28 h-28" />
                <div class="grow truncate">
                  <div class="font-semibold truncate">{item.nama}</div>
                  <A
                    href={"/user/user/" + item.user_id}
                    class="text-gray-500 text-xs mt-1 text-primary"
                  >
                    @{item.user?.username}
                  </A>
                  <div class="text-gray-500 text-xs">
                    {formatDate(item.created_at as string, true)}
                  </div>
                  <div class="mt-3 flex items-center">
                    <Show
                      when={item.user_id == auth().id}
                      fallback={
                        <A
                          href={"/user/barang-hilang/" + item.id}
                          class="text-sm text-green-500 border inline-block border-green-500 hover:text-white hover:bg-green-500 transition rounded-full px-3 p-1"
                        >
                          <SearchIcon class="w-4 h-4" />
                        </A>
                      }
                    >
                      <A
                        href={"/user/barang-hilang/" + item.id}
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
                    </Show>
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

      <Show when={!props.user_id}>
        <FloatingComponent>
          <A
            href="/user/barang-hilang/create"
            class="rounded-full bg-primary h-14 w-14 flex items-center justify-center text-white shadow-lg"
          >
            <AddIcon class="w-7 h-7" />
          </A>
        </FloatingComponent>
      </Show>
    </>
  );
}
