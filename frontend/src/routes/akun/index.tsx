import Title from "~/components/title";
import UserDetail from "../user/[id]";
import { useAuth } from "~/contexts/auth";
import { Show, createEffect, onMount } from "solid-js";
import Card from "~/components/card";
import Input from "~/components/input";
import Textarea from "~/components/textarea";
import Select from "~/components/select";
import FileInput from "~/components/file-input";
import Img from "~/components/img";
import { createStore } from "solid-js/store";
import User from "~/interfaces/user";
import { useNotif } from "~/contexts/notif";
import http from "~/libs/http";
import fileReader from "~/libs/file-reader";

export default function () {
  const [req, setReq] = createStore<User>();

  const [auth, setAuth] = useAuth();
  const notif = useNotif();

  const get = async () => {
    try {
      const { data } = await http.get("/user/" + auth().id);
      setReq(data.data);
      setReq("foto", "");
      setReq("password", "");
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  const update = async (e: SubmitEvent) => {
    e.preventDefault();
    try {
      await http.put("/user/" + auth().id);
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

  createEffect((oldId) => {
    const id = auth().id;

    if (oldId != id) {
      if (id) {
        get();
      }
    }

    return id;
  });

  return (
    <>
      <Title
        title="Akun"
        subtitle="Sesuaikan pengaturan akun atau profil anda"
      />
      <Show when={auth()?.id}>
        <UserDetail id={auth().id} />
      </Show>
      <div class="mt-3"></div>
      <Card title="Edit Akun">
        <form onSubmit={update}>
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
                required
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
              <FileInput
                label="Foto"
                title="Pilih Foto"
                onChange={handleFotoChange}
                accept="iamge/*"
                hint={"Kosongkan jika tidak ingin mengganti foto"}
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
                value={req.password}
                onChange={(e) => setReq("password", e.currentTarget.value)}
                hint={"Kosongkan jika tidak ingin mengganti password"}
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
      </Card>
    </>
  );
}
