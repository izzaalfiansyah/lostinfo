import { Accessor, For, Setter, Show, createSignal, onMount } from "solid-js";
import { SetStoreFunction, createStore } from "solid-js/store";
import { A, useNavigate, useParams } from "solid-start";
import Img from "~/components/img";
import Input from "~/components/input";
import Select from "~/components/select";
import Textarea from "~/components/textarea";
import Title from "~/components/title";
import { useNotif } from "~/contexts/notif";
import BarangHilang from "~/interfaces/barang-hilang";
import User from "~/interfaces/user";
import fileReader from "~/libs/file-reader";
import http from "~/libs/http";

export default function () {
  const [req, setReq] = createStore<BarangHilang>({});

  const notif = useNotif();
  const nav = useNavigate();

  const save = async (e: SubmitEvent) => {
    e.preventDefault();
    try {
      await http.post("/barang/hilang", req);
      notif.show("data berhasil disimpan");
      nav("/barang-hilang");
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  return (
    <>
      <Title
        title="Tambah Barang Hilang"
        subtitle="Menambahkan data barang hilang"
      ></Title>
      <Save item={[req, setReq]} onSubmit={save}></Save>
    </>
  );
}

interface SaveProps {
  item: [BarangHilang, SetStoreFunction<BarangHilang>];
  onSubmit: (e: SubmitEvent) => void;
  onMount?: () => void;
}

export function Save(props: SaveProps) {
  const [users, setUsers] = createSignal<User[]>([]);
  const [req, setReq] = props.item;

  const getUser = async () => {
    const { data } = await http.get("/user");
    setUsers(data.data);
  };

  const handleFotoChange = async (e: any) => {
    const file = e.target.files[0];
    const value = await fileReader(file);
    setReq("foto", value);
    setReq("foto_url", value);
  };

  onMount(async () => {
    await getUser();

    if (props.onMount) {
      props.onMount();
    }
  });

  return (
    <form onSubmit={props.onSubmit} class="bg-white rounded-lg shadow-sm p-5">
      <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
        <div>
          <Input
            label="Nama"
            required
            placeholder="Masukkan Nama"
            value={req.nama}
            onChange={(e) => setReq("nama", e.currentTarget.value)}
          />
          <Textarea
            label="Deskripsi"
            placeholder="Masukkan Deskripsi"
            value={req.deskripsi}
            rows={3}
            onChange={(e) => setReq("deskripsi", e.currentTarget.value)}
          />
          <Input
            label="Tempat Hilang"
            required
            placeholder="Masukkan Tempat Hilang"
            value={req.tempat_hilang}
            onChange={(e) => setReq("tempat_hilang", e.currentTarget.value)}
          />
          <div class="mb-2">
            <label for="">Lokasi Maps</label>
            <div class="bg-gray-100 h-64"></div>
          </div>
        </div>
        <div>
          <Select
            label="Pemilik"
            value={req.user_id}
            onChange={(e) => setReq("user_id", e.currentTarget.value)}
          >
            <option value="">Pilih Pemilik</option>
            <For each={users()}>
              {(item) => <option value={item.id as any}>{item.nama}</option>}
            </For>
          </Select>
          <Input
            type="file"
            label="Foto"
            title="Pilih Foto"
            onChange={handleFotoChange}
            accept="image/*"
          />
          <div class="mb-2">
            <div class="bg-gray-100 rounded-lg flex items-center justify-center p-5">
              <Img src={req.foto_url} alt="Foto Barang" class="w-24 h-24" />
            </div>
          </div>
          <Input
            type="number"
            label="Hadiah"
            required
            placeholder="Masukkan Hadiah"
            value={req.hadiah}
            onChange={(e) => setReq("hadiah", parseInt(e.currentTarget.value))}
          />
          <Show when={req.id}>
            <Select
              label="Ditemukan"
              value={req.ditemukan}
              onChange={(e) => setReq("ditemukan", e.currentTarget.value)}
            >
              <option value="">Pilih Status</option>
              <option value={"1"}>Sudah Ditemukan</option>
              <option value={"0"}>Belum Ditemukan</option>
            </Select>
          </Show>
        </div>
      </div>
      <div class="mt-4">
        <button
          type="submit"
          class="px-4 p-2 bg-purple-500 rounded shadow-sm text-white mr-2"
        >
          Simpan Data
        </button>
        <A
          href="/barang-hilang"
          class="button px-4 p-2 bg-gray-400 text-white rounded shadow-sm"
        >
          Kembali
        </A>
      </div>
    </form>
  );
}
