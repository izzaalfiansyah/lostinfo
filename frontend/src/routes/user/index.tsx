import { Show, createEffect, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { DeleteIcon, EditIcon } from "~/components/icons";
import Img from "~/components/img";
import Input from "~/components/input";
import Modal from "~/components/modal";
import Pagination from "~/components/pagination";
import Select from "~/components/select";
import Table from "~/components/table";
import Textarea from "~/components/textarea";
import Title from "~/components/title";
import { useNotif } from "~/contexts/notif";
import User from "~/interfaces/user";
import fileReader from "~/libs/file-reader";
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
    pageTotal: 0,
    recordTotal: 0,
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
      setFilter("recordTotal", data.meta.total);
      setFilter("pageTotal", totalPage);
      setItems(data.data);
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  const save = async (e: SubmitEvent) => {
    e.preventDefault();
    try {
      if (isEdit()) {
        await http.put("/user/" + req.id, req);
        notif.show("data berhasil diedit");
      } else {
        await http.post("/user", req);
        notif.show("data berhasil disimpan");
      }

      setModal("save", false);
      get();
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  const destroy = async (e: SubmitEvent) => {
    e.preventDefault();
    try {
      await http.delete("/user/" + req.id);
      notif.show("data berhasil dihapus");
      setModal("delete", false);
      get();
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  const handleFotoChange = async (e: any) => {
    const file = e.target.files[0];
    const value = await fileReader(file);
    setReq("foto", value);
    setReq("foto_url", value);
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

      <div class="bg-white rounded-lg shadow-sm p-5">
        <div class="mb-3">
          <Input
            placeholder="Cari..."
            value={filter.search}
            onChange={(e) => setFilter("search", e.currentTarget.value)}
          />
        </div>
        <Table
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
                  setReq("foto", "");
                  setReq("password", "");
                  setIsEdit(true);
                  setModal("save", true);
                }}
              >
                <EditIcon class="w-4 h-4 text-purple-600" />
              </button>
              <button
                onClick={() => {
                  nullable();
                  setReq(item);
                  setModal("delete", true);
                }}
              >
                <DeleteIcon class="w-4 h-4 text-red-600" />
              </button>
            </>,
          ])}
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
      </div>

      <Modal
        show={modal.save}
        onClose={() => setModal("save", false)}
        title={(isEdit() ? "Edit" : "Tambah") + " Pengguna"}
      >
        <form onSubmit={save} class="w-[800px] max-w-full">
          <div class="font-semibold mb-5"></div>
          <div class="flex lg:flex-row justify-between flex-col gap-3">
            <div class="flex-1">
              <Input
                label="Nama"
                placeholder="Masukkan Nama"
                required
                maxLength={255}
                value={req.nama}
                onChange={(e) => setReq("nama", e.currentTarget.value)}
              />
              <Textarea
                label="Alamat"
                placeholder="Masukkan Alamat"
                required
                rows={3}
                value={req.alamat}
                onChange={(e) => setReq("alamat", e.currentTarget.value)}
              />
              <Input
                label="Email"
                type="email"
                placeholder="Masukkan Email"
                required
                value={req.email}
                onChange={(e) => setReq("email", e.currentTarget.value)}
              />
              <Input
                label="Telepon"
                type="tel"
                placeholder="Masukkan Telepon"
                required
                value={req.telepon}
                onChange={(e) => setReq("telepon", e.currentTarget.value)}
              />
              <Select
                label="Role"
                value={req.role}
                onChange={(e) => setReq("role", e.currentTarget.value)}
              >
                <option value="">Pilih Role</option>
                <option value="1">Admin</option>
                <option value="2">Pengguna</option>
              </Select>
              <Select
                label="Status"
                value={req.status}
                onChange={(e) => setReq("status", e.currentTarget.value)}
              >
                <option value="">Pilih Status</option>
                <option value="1">Aktif</option>
                <option value="0">Nonaktif</option>
              </Select>
            </div>
            <div class="flex-1">
              <Input
                label="Foto"
                type="file"
                title="Pilih Foto"
                required={!isEdit()}
                onChange={handleFotoChange}
                hint={
                  isEdit() ? "Kosongkan jika tidak ingin mengganti foto" : ""
                }
              />
              <div class="mb-2">
                <div class="bg-gray-50 rounded p-4 flex items-center justify-center">
                  <Img
                    src={req.foto_url}
                    alt="Foto User"
                    class="object-cover w-40 h-40 !rounded"
                  />
                </div>
              </div>
              <Input
                label="Username"
                placeholder="Masukkan Username"
                required
                value={req.username}
                onChange={(e) => setReq("username", e.currentTarget.value)}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Masukkan Password"
                required={!isEdit()}
                value={req.password}
                onChange={(e) => setReq("password", e.currentTarget.value)}
                hint={
                  isEdit()
                    ? "Kosongkan jika tidak ingin mengganti password"
                    : ""
                }
              />
            </div>
          </div>

          <div class="mt-8 flex justify-end">
            <button
              type="submit"
              class="px-4 py-2 bg-purple-600 rounded shadow-sm text-white"
            >
              Simpan
            </button>
          </div>
        </form>
      </Modal>

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
