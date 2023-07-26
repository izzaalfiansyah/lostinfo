import { For, Show, createEffect, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { A, useNavigate } from "solid-start";
import Accordion from "~/components/accordion";
import Autocomplete from "~/components/autocomplete";
import ModalDelete from "~/components/barang-hilang/modal-delete";
import Button from "~/components/button";
import Card from "~/components/card";
import { DeleteIcon, EditIcon, SearchIcon } from "~/components/icons";
import Img from "~/components/img";
import Input from "~/components/input";
import Pagination from "~/components/pagination";
import Skeleton from "~/components/skeleton";
import Title from "~/components/title";
import { useNotif } from "~/contexts/notif";
import BarangHilang from "~/interfaces/barang-hilang";
import User from "~/interfaces/user";
import formatDate from "~/libs/format-date";
import http from "~/libs/http";

interface Props {
  user_id?: any;
}

export default function (props: Props) {
  const [req, setReq] = createStore<BarangHilang>({});
  const [items, setItems] = createSignal<BarangHilang[]>([]);
  const [users, setUsers] = createSignal<User[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [modal, setModal] = createStore({
    delete: false,
  });
  const [filter, setFilter] = createStore({
    page: 1,
    limit: 9,
    search: "",
    user_id: props.user_id || "",
    ditemukan: "0",
    hadiah_min: "",
    hadiah_max: "",
  });
  const [total, setTotal] = createStore({
    page: 0,
    record: 0,
  });

  const notif = useNotif();
  const nav = useNavigate();

  const getUser = async (search: string = "") => {
    const { data } = await http.get("/user", {
      params: {
        search,
      },
    });
    setUsers(data.data);
  };

  const get = async () => {
    setIsLoading(true);
    try {
      const { data } = await http.get("/barang/hilang", {
        params: filter,
      });

      const pageTotal = Math.ceil(data.meta.total / filter.limit);
      setTotal("page", pageTotal);
      setTotal("record", data.data.length);
      setItems(data.data);
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
    setIsLoading(false);
  };

  onMount(async () => {
    await get();
  });

  createEffect(() => {
    if (filter) {
      get();
    }
  });

  return (
    <>
      <Show when={!props.user_id}>
        <Title
          title="Data Barang Hilang"
          subtitle="Menjelajahi dan menganalisis data barang hilang"
          action={
            <Button
              onClick={() => nav("/admin/barang-hilang/create")}
              variant="primary"
            >
              Tambah
            </Button>
          }
        ></Title>
      </Show>

      <Accordion title="Filter" class="mb-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            get();
          }}
        >
          <Input
            placeholder="Cari..."
            value={filter.search}
            onChange={(e) => setFilter("search", e.currentTarget.value)}
          />
          <Show when={!props.user_id}>
            <div class="grid lg:grid-cols-2 grid-cols-1 gap-x-3">
              <Autocomplete
                label="Pemilik"
                value={filter.user_id}
                onChange={(val) => setFilter("user_id", val)}
                options={[
                  {
                    text: "Semua",
                    value: "",
                  },
                  ...users().map((item) => ({
                    text: item.nama,
                    value: item.id,
                  })),
                ]}
                onAsync={getUser}
                placeholder="Pilih Pemilik"
              />
              <Autocomplete
                label="Status"
                value={filter.ditemukan}
                onChange={(val) => setFilter("ditemukan", val)}
                placeholder="Pilih Status"
                options={[
                  {
                    text: "Semua",
                    value: "",
                  },
                  {
                    text: "Sudah Ditemukan",
                    value: "1",
                  },
                  {
                    text: "Belum Ditemukan",
                    value: "0",
                  },
                ]}
              />
            </div>
          </Show>
          <div class="grid grid-cols-2 items-end gap-x-3">
            <Input
              type="number"
              label="Rentang Hadiah"
              value={filter.hadiah_min}
              onChange={(e) => setFilter("hadiah_min", e.currentTarget.value)}
              placeholder="Minimum"
            />
            <Input
              type="number"
              placeholder="Maksimal"
              value={filter.hadiah_max}
              onChange={(e) => setFilter("hadiah_max", e.currentTarget.value)}
            />
          </div>
          <div class="mt-5">
            <Button type="submit" variant="primary" class="flex items-center">
              <SearchIcon class="w-4 h-4 mr-2" />
              Terapkan
            </Button>
          </div>
        </form>
      </Accordion>

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
                  <A
                    href={"/admin/user/" + item.user_id}
                    class="text-gray-500 text-xs text-primary"
                  >
                    @{item.user?.username}
                  </A>
                  <div class="text-gray-500 text-xs">
                    Hilang {formatDate(item.created_at as string, true)}
                  </div>
                  <div class="mt-2 flex items-center">
                    <A
                      href={"/admin/barang-hilang/" + item.id}
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
          recordTotal={total.record}
          page={filter.page}
          pageTotal={total.page}
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
