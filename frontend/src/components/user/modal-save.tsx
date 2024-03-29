import http from "~/libs/http";
import Modal from "../modal";
import User from "~/interfaces/user";
import { SetStoreFunction } from "solid-js/store";
import { useNotif } from "~/contexts/notif";
import Input from "../input";
import Textarea from "../textarea";
import Select from "../select";
import fileReader from "~/libs/file-reader";
import Img from "../img";
import FileInput from "../file-input";
import Button from "../button";
import Autocomplete from "../autocomplete";

interface Props {
  show: boolean;
  onClose: () => void;
  isEdit: boolean;
  req: [User, SetStoreFunction<User>];
  callback: () => void;
}

export default function (props: Props) {
  const [req, setReq] = props.req;

  const notif = useNotif();

  const save = async (e: SubmitEvent) => {
    e.preventDefault();
    try {
      if (props.isEdit) {
        await http.put("/user/" + req.id, req);
        notif.show("data berhasil diedit");
      } else {
        await http.post("/user", req);
        notif.show("data berhasil disimpan");
      }

      props.onClose();
      props.callback();
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

  return (
    <Modal
      show={props.show}
      onClose={props.onClose}
      title={(props.isEdit ? "Edit" : "Tambah") + " Pengguna"}
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
              tel
              label="Telepon"
              type="number"
              placeholder="Masukkan Telepon"
              required
              value={req.telepon}
              onChange={(e) => setReq("telepon", e.currentTarget.value)}
            />
            <Autocomplete
              options={[
                {
                  value: "1",
                  text: "Admin",
                },
                {
                  value: "2",
                  text: "Pengguna",
                },
              ]}
              label="Role"
              placeholder="Pilih Role"
              value={req.role}
              required
              onChange={(val) => setReq("role", val)}
            />
            <Autocomplete
              options={[
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
              label="Status"
              placeholder="Pilih Status"
              value={req.status}
              required
              onChange={(val) => setReq("status", val)}
            />
          </div>
          <div class="flex-1">
            <FileInput
              label="Foto"
              title="Pilih Foto"
              onChange={handleFotoChange}
              accept="image/*"
              hint={
                props.isEdit ? "Kosongkan jika tidak ingin mengganti foto" : ""
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
            <FileInput
              label="Foto KTP"
              title="Pilih Foto KTP"
              required={!props.isEdit}
              onChange={handleKTPChange}
              accept="image/*"
              hint={
                props.isEdit
                  ? "Kosongkan jika tidak ingin mengganti foto KTP"
                  : ""
              }
            />
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
              required={!props.isEdit}
              value={req.password}
              onChange={(e) => setReq("password", e.currentTarget.value)}
              hint={
                props.isEdit
                  ? "Kosongkan jika tidak ingin mengganti password"
                  : ""
              }
            />
          </div>
        </div>

        <div class="mt-8 flex justify-end">
          <Button type="submit" variant="primary">
            Simpan
          </Button>
          <Button onClick={props.onClose} class="ml-2">
            Batal
          </Button>
        </div>
      </form>
    </Modal>
  );
}
