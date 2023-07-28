import Title from "~/components/title";
import UserDetail from "../../user/user/[id]";
import { useAuth } from "~/contexts/auth";
import { Show, createEffect, createSignal, onMount } from "solid-js";
import Card from "~/components/card";
import Input from "~/components/input";
import Textarea from "~/components/textarea";
import FileInput from "~/components/file-input";
import Img from "~/components/img";
import { createStore } from "solid-js/store";
import User from "~/interfaces/user";
import { useNotif } from "~/contexts/notif";
import http from "~/libs/http";
import fileReader from "~/libs/file-reader";
import Button from "~/components/button";

export default function () {
  const [req, setReq] = createStore<User>();
  const [isLoading, setIsLoading] = createSignal(false);

  const [auth, setAuth] = useAuth();
  const notif = useNotif();

  const get = async () => {
    setIsLoading(true);
    try {
      const { data } = await http.get("/user/" + auth().id);
      setReq(data.data);
      setReq("foto", "");
      setReq("password", "");
      setAuth.login(data.data, false);
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
    setIsLoading(false);
  };

  const update = async (e: SubmitEvent) => {
    e.preventDefault();
    try {
      await http.put("/user/" + auth().id, req);
      get();
      notif.show("data berhasil disimpan");
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

  const handleKTPChange = async (e: any) => {
    const file = e.target.files[0];
    const value = await fileReader(file);
    setReq("ktp", value);
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
          <div class="flex lg:flex-row justify-between flex-col gap-3">
            <div class="flex-1">
              <Input
                disabled={isLoading()}
                label="Nama"
                placeholder="Masukkan Nama"
                required
                maxLength={255}
                value={req.nama}
                onChange={(e) => setReq("nama", e.currentTarget.value)}
              />
              <Textarea
                disabled={isLoading()}
                label="Alamat"
                placeholder="Masukkan Alamat"
                required
                rows={3}
                value={req.alamat}
                onChange={(e) => setReq("alamat", e.currentTarget.value)}
              />
              <Input
                disabled={isLoading()}
                label="Email"
                type="email"
                placeholder="Masukkan Email"
                required
                value={req.email}
                onChange={(e) => setReq("email", e.currentTarget.value)}
              />
              <Input
                disabled={isLoading()}
                label="Telepon"
                type="tel"
                placeholder="Masukkan Telepon"
                required
                value={req.telepon}
                onChange={(e) => setReq("telepon", e.currentTarget.value)}
              />
              {/* <Select
                disabled={isLoading()}
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
                disabled={isLoading()}
                label="Status"
                value={req.status}
                onChange={(e) => setReq("status", e.currentTarget.value)}
              >
                <option value="">Pilih Status</option>
                <option value="1">Aktif</option>
                <option value="0">Nonaktif</option>
              </Select> */}
            </div>
            <div class="flex-1">
              <FileInput
                disabled={isLoading()}
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
              <FileInput
                label="Foto KTP"
                title="Pilih Foto KTP"
                onChange={handleKTPChange}
                accept="image/*"
                hint={"Kosongkan jika tidak ingin mengganti foto KTP"}
              />
            </div>
          </div>
          <div class="border-b border-gray-200 my-5"></div>
          <div class="font-semibold mb-5">Autentikasi Akun</div>
          <div class="flex lg:flex-row justify-between flex-col gap-3">
            <div class="flex-1">
              <Input
                disabled={isLoading()}
                label="Username"
                placeholder="Masukkan Username"
                required
                value={req.username}
                onChange={(e) => setReq("username", e.currentTarget.value)}
              />
            </div>
            <div class="flex-1">
              <Input
                disabled={isLoading()}
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
            <Button variant="primary" type="submit">
              Simpan
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}
