import { A } from "@solidjs/router";
import { createEffect, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import Accordion from "~/components/accordion";
import Autocomplete from "~/components/autocomplete";
import Button from "~/components/button";
import Card from "~/components/card";
import { DeleteIcon, EditIcon, SearchIcon } from "~/components/icons";
import Input from "~/components/input";
import Pagination from "~/components/pagination";
import Skeleton from "~/components/skeleton";
import Table from "~/components/table";
import Title from "~/components/title";
import ModalDelete from "~/components/user/modal-delete";
import ModalSave from "~/components/user/modal-save";
import { useNotif } from "~/contexts/notif";
import User from "~/interfaces/user";
import UserLapor from "~/interfaces/user-lapor";
import formatDate from "~/libs/format-date";
import http from "~/libs/http";

export default function () {
  const [items, setItems] = createSignal<UserLapor[]>([]);
  const [users, setUsers] = createSignal<User[]>([]);
  const [req, setReq] = createStore<UserLapor>({});
  const [isEdit, setIsEdit] = createSignal<boolean>(false);
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [modal, setModal] = createStore({
    save: false,
    delete: false,
  });
  const [filter, setFilter] = createStore({
    limit: 10,
    page: 1,
    search: "",
    user_id: "",
  });
  const [total, setTotal] = createStore({
    page: 0,
    record: 0,
  });

  const notif = useNotif();

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
      const { data } = await http.get("/user/lapor", {
        params: filter,
      });

      const totalPage = Math.ceil(data.meta.total / filter.limit);
      setTotal("record", data.meta.total);
      setTotal("page", totalPage);
      setItems(data.data);
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
    setIsLoading(false);
  };

  onMount(async () => {
    await get();
  });

  return (
    <>
      <Title
        title="Laporan User"
        subtitle="Menjelajahi dan menganalisis data pengguna"
      />

      <Accordion title="Filter" class="mb-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            get();
          }}
        >
          <Autocomplete
            label="User"
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
          <div class="mt-5">
            <Button type="submit" variant="primary" class="flex items-center">
              <SearchIcon class="w-4 h-4 mr-2" />
              Terapkan
            </Button>
          </div>
        </form>
      </Accordion>

      <Card>
        <Table
          heads={["Tanggal", "User", "Pelapor", "Alasan"]}
          items={
            isLoading()
              ? Array.from({ length: 5 }).map(() => [
                  <Skeleton class="rounded-full p-2" />,
                  <Skeleton class="rounded-full p-2" />,
                  <Skeleton class="rounded-full p-2" />,
                  <Skeleton class="rounded-full p-2" />,
                ])
              : items().map((item) => [
                  formatDate(item.created_at as string),
                  <A href={"/admin/user/" + item.user_id} class="text-primary">
                    @{item.user?.username}
                  </A>,
                  <A
                    href={"/admin/user/" + item.pelapor_id}
                    class="text-primary"
                  >
                    @{item.pelapor?.username}
                  </A>,
                  item.alasan,
                ])
          }
        />
        <div class="mt-3"></div>
        <Pagination
          page={filter.page}
          pageTotal={total.page}
          record={items().length}
          recordTotal={total.record}
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
