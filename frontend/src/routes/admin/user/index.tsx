import { createEffect, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { A } from "solid-start";
import Accordion from "~/components/accordion";
import Autocomplete from "~/components/autocomplete";
import Button from "~/components/button";
import Card from "~/components/card";
import {
  ChevronLeftIcon,
  DeleteIcon,
  EditIcon,
  SearchIcon,
} from "~/components/icons";
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
    limit: 10,
    page: 1,
    search: "",
    status: "",
    role: "",
  });
  const [total, setTotal] = createStore({
    page: 0,
    record: 0,
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
        title="Data User"
        subtitle="Menjelajahi dan menganalisis data pengguna"
        action={
          <Button
            variant="primary"
            onClick={() => {
              nullable();
              setIsEdit(false);
              setModal("save", true);
            }}
          >
            Tambah
          </Button>
        }
      />

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
            onChange={(e) => {
              setFilter("search", e.currentTarget.value);
              setFilter("page", 1);
            }}
          />
          <div class="grid lg:grid-cols-2 grid-cols-1 gap-x-3">
            <Autocomplete
              label="Status"
              placeholder="Pilih Status"
              options={[
                {
                  value: "",
                  text: "Semua Status",
                },
                {
                  value: "1",
                  text: "Aktif",
                },
                {
                  value: "0",
                  text: "Nonaktif",
                },
                {
                  value: "9",
                  text: "Banned",
                },
              ]}
              value={filter.status}
              onChange={(val) => setFilter("status", val)}
            />
            <Autocomplete
              label="Role"
              placeholder="Pilih Role"
              options={[
                {
                  value: "",
                  text: "Semua Role",
                },
                {
                  value: "1",
                  text: "Admin",
                },
                {
                  value: "2",
                  text: "Pengguna",
                },
              ]}
              value={filter.role}
              onChange={(val) => setFilter("role", val)}
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

      <Card>
        <Table
          heads={["Nama", "Alamat", "Telepon", "Email", "Status", "Opsi"]}
          items={
            isLoading()
              ? Array.from({ length: 5 }).map(() => [
                  <Skeleton class="rounded-full p-2" />,
                  <Skeleton class="rounded-full p-2" />,
                  <Skeleton class="rounded-full p-2" />,
                  <Skeleton class="rounded-full p-2" />,
                  <Skeleton class="rounded-full p-2" />,
                  <Skeleton class="rounded-full p-2" />,
                ])
              : items().map((item) => [
                  <>
                    <A href={"/admin/user/" + item.id} class="text-primary">
                      {item.nama}
                    </A>
                  </>,
                  item.alamat,
                  item.telepon,
                  item.email,
                  <>
                    <span
                      class={
                        "rounded-full text-xs text-white px-2 " +
                        {
                          "1": "bg-green-500",
                          "0": "bg-red-500",
                          "9": "bg-orange-500",
                        }[item.status as "1"]
                      }
                    >
                      {item.status_detail}
                    </span>
                  </>,
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
                      <EditIcon class="w-4 h-4 text-primary" />
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
