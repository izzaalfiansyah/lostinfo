import { A } from "@solidjs/router";
import { createEffect, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
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
import UserLapor from "~/interfaces/user-lapor";
import formatDate from "~/libs/format-date";
import http from "~/libs/http";

export default function () {
  const [items, setItems] = createSignal<UserLapor[]>([]);
  const [req, setReq] = createStore<UserLapor>({});
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

  const get = async () => {
    setIsLoading(true);
    try {
      const { data } = await http.get("/user/lapor", {
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
        title="Laporan User"
        subtitle="Menjelajahi dan menganalisis data pengguna"
      />

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
