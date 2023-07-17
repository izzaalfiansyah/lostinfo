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
              required={!props.isEdit}
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
          <button
            type="submit"
            class="px-4 py-2 bg-primary rounded shadow-sm text-white"
          >
            Simpan
          </button>
        </div>
      </form>
    </Modal>
  );
}
