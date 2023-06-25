import {
  $,
  component$,
  useContext,
  useSignal,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { DeleteIcon, EditIcon } from "~/components/icons";
import Modal from "~/components/modal";
import Title from "~/components/title";
import { NotifContext } from "~/contexts/notif";
import type User from "~/interfaces/user";
import fileReader from "~/libs/file-reader";
import http from "~/libs/http";

export default component$(() => {
  const items = useSignal<User[]>([]);
  const isEdit = useSignal(false);
  const modal = useStore({
    save: false,
    delete: false,
  });
  const req = useStore<User>({});
  const notif = useContext(NotifContext);

  const nullable = $(() => {
    req.id = "";
    req.username = "";
    req.password = "";
    req.nama = "";
    req.alamat = "";
    req.email = "";
    req.telepon = "";
    req.foto = "";
    req.role = "";
    req.status = "";
  });

  const get = $(async () => {
    try {
      const res = await http.get("/user");
      items.value = res.data.data;
    } catch (e: any) {
      notif.show(e.response.data.message, "bg-red-500");
    }
  });

  const save = $(async () => {
    try {
      if (isEdit.value) {
        await http.put("/user/" + req.id, req);
        notif.show("data berhasil diedit");
      } else {
        await http.post("/user", req);
        notif.show("data berhasil disimpan");
      }

      modal.save = false;
      get();
    } catch (e: any) {
      notif.show(e.response.data.message, "bg-red-500");
    }
  });

  const destroy = $(async () => {
    try {
      await http.delete("/user/" + req.id);
      notif.show("data berhasil dihapus");
      modal.delete = false;
      get();
    } catch (e: any) {
      notif.show(e.response.data.message, "bg-red-500");
    }
  });

  const show = $((item: User, action: "edit" | "delete") => {
    req.id = item.id;
    req.username = item.username;
    req.password = "";
    req.nama = item.nama;
    req.alamat = item.alamat;
    req.email = item.email;
    req.telepon = item.telepon;
    req.foto = "";
    req.foto_url = item.foto_url;
    req.role = item.role;
    req.status = item.status;

    console.log(req.foto_url);

    if (action == "edit") {
      isEdit.value = true;
      modal.save = true;
    } else {
      modal.delete = true;
    }
  });

  const handleFotoChange = $(async (e: any) => {
    const file = e.target.files[0];
    const value = await fileReader(file);
    req.foto = value;
    req.foto_url = value;
  });

  useTask$(async () => {
    nullable();
    await get();
  });

  return (
    <>
      <Title
        title="Data User"
        subtitle="Menjelajahi dan menganalisis data pengguna"
      >
        <button
          q:slot="action"
          class="px-5 p-2 text-white bg-purple-600 rounded shadow-sm mt-4 lg:mt-0"
          onClick$={() => {
            nullable();
            isEdit.value = false;
            modal.save = true;
          }}
        >
          Tambah
        </button>
      </Title>
      <div class="bg-white rounded-lg shadow-sm p-5">
        <div class="overflow-x-auto">
          <table class="t-table">
            <thead>
              <tr>
                {/* <th>
                  <input
                    type="checkbox"
                    class="text-purple-600 transition rounded border-gray-300 focus:ring-purple-300"
                  />
                </th> */}
                <th>Nama</th>
                <th>Alamat</th>
                <th>Telepon</th>
                <th>Email</th>
                <th>Opsi</th>
              </tr>
            </thead>
            <tbody>
              {items.value.map((item) => (
                <tr key={item.id}>
                  {/* <td class="px-3 p-2 lg:table-cell block">
                    <input
                      type="checkbox"
                      class="text-purple-600 transition rounded border-gray-300 focus:ring-purple-300"
                      value={item.id}
                    />
                  </td> */}
                  <td>{item.nama}</td>
                  <td>{item.alamat}</td>
                  <td>{item.telepon}</td>
                  <td>{item.email}</td>
                  <td>
                    <button class="mr-3" onClick$={() => show(item, "edit")}>
                      <EditIcon class="w-4 h-4 text-purple-600" />
                    </button>
                    <button onClick$={() => show(item, "delete")}>
                      <DeleteIcon class="w-4 h-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal show={modal.save} onClose$={() => (modal.save = false)}>
        <form
          preventdefault:submit
          onSubmit$={save}
          class="w-[800px] max-w-full"
        >
          <div class="font-semibold mb-5">
            {isEdit.value ? "Edit" : "Tambah"} Pengguna
          </div>
          <div class="flex lg:flex-row justify-between flex-col gap-3">
            <div class="flex-1">
              <div class="mb-2">
                <label for="">Nama</label>
                <input
                  type="text"
                  class="t-input"
                  placeholder="Masukkan Nama"
                  required
                  maxLength={255}
                  value={req.nama}
                  onChange$={(e) => (req.nama = e.target.value)}
                />
              </div>
              <div class="mb-2">
                <label for="">Alamat</label>
                <textarea
                  rows={3}
                  class="t-input resize-none"
                  placeholder="Masukkan Alamat"
                  required
                  value={req.alamat}
                  onChange$={(e) => (req.alamat = e.target.value)}
                ></textarea>
              </div>
              <div class="mb-2">
                <label for="">Email</label>
                <input
                  type="email"
                  class="t-input"
                  placeholder="Masukkan Email"
                  required
                  value={req.email}
                  onChange$={(e) => (req.email = e.target.value)}
                />
              </div>
              <div class="mb-2">
                <label for="">Telepon</label>
                <input
                  type="tel"
                  class="t-input"
                  placeholder="Masukkan Telepon"
                  required
                  value={req.telepon}
                  onChange$={(e) => (req.telepon = e.target.value)}
                />
              </div>
              <div class="mb-2">
                <label for="">Role</label>
                <select
                  value={req.role}
                  class="t-input"
                  onChange$={(e) => (req.role = e.target.value)}
                  required
                >
                  <option value="">Pilih Role</option>
                  <option value="1">Admin</option>
                  <option value="2">Pengguna</option>
                </select>
              </div>
              <div class="mb-2">
                <label for="">Status</label>
                <select
                  value={req.status}
                  class="t-input"
                  onChange$={(e) => (req.status = e.target.value)}
                  required
                >
                  <option value="">Pilih Status</option>
                  <option value="1">Aktif</option>
                  <option value="0">Nonaktif</option>
                </select>
              </div>
            </div>
            <div class="flex-1">
              <div class="mb-2">
                <label for="">Foto</label>
                <input
                  type="file"
                  class="w-full"
                  placeholder="Masukkan Foto"
                  onChange$={handleFotoChange}
                />
                {isEdit.value && (
                  <div class="text-xs">
                    Kosongkan jika tidak ingin mengganti foto
                  </div>
                )}
              </div>
              <div class="mb-2">
                <div class="bg-gray-50 rounded p-4 flex items-center justify-center">
                  <img
                    src={req.foto_url}
                    alt=""
                    height={80}
                    width={80}
                    class="object-cover w-40 h-40"
                  />
                </div>
              </div>
              <div class="mb-2">
                <label for="">Username</label>
                <input
                  type="text"
                  class="t-input"
                  placeholder="Masukkan Username"
                  required
                  value={req.username}
                  onChange$={(e) => (req.username = e.target.value)}
                />
              </div>
              <div class="mb-2">
                <label for="">Password</label>
                <input
                  type="password"
                  class="t-input"
                  placeholder="Masukkan Password"
                  required={!isEdit.value}
                  value={req.password}
                  onChange$={(e) => (req.password = e.target.value)}
                />
                {isEdit.value && (
                  <div class="text-xs">
                    Kosongkan jika tidak ingin mengganti password
                  </div>
                )}
              </div>
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
      <Modal show={modal.delete} onClose$={() => (modal.delete = false)}>
        <form
          preventdefault:submit
          onSubmit$={destroy}
          class="max-w-full w-[500px]"
        >
          <div class="font-semibold mb-5">Hapus Pengguna</div>
          <p>
            Anda yakin menghapus pengguna? Data akan dihapus secara permanen!
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
});

export const head: DocumentHead = {
  title: "Data User",
};
