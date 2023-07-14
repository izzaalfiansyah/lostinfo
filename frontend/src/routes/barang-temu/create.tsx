import { For, Show, createSignal, onMount } from "solid-js";
import { SetStoreFunction, createStore } from "solid-js/store";
import { A, useNavigate } from "solid-start";
import { SearchIcon } from "~/components/icons";
import Img from "~/components/img";
import Input from "~/components/input";
import Map, { getLatLngByAddress } from "~/components/map";
import Select from "~/components/select";
import Textarea from "~/components/textarea";
import Title from "~/components/title";
import { useNotif } from "~/contexts/notif";
import BarangTemu from "~/interfaces/barang-temu";
import User from "~/interfaces/user";
import fileReader from "~/libs/file-reader";
import formatDate from "~/libs/format-date";
import http from "~/libs/http";

export default function () {
  const [req, setReq] = createStore<BarangTemu>({});

  const notif = useNotif();
  const nav = useNavigate();

  const save = async (e: SubmitEvent) => {
    e.preventDefault();
    try {
      await http.post("/barang/temu", req);
      notif.show("data berhasil disimpan");
      nav("/barang-temu");
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  return (
    <>
      <Title
        title="Tambah Barang Temu"
        subtitle="Menambahkan data barang temu"
      ></Title>
      <Save item={[req, setReq]} onSubmit={save}></Save>
    </>
  );
}

interface SaveProps {
  item: [BarangTemu, SetStoreFunction<BarangTemu>];
  onSubmit: (e: SubmitEvent) => void;
  onMount?: () => void;
}

export function Save(props: SaveProps) {
  const [users, setUsers] = createSignal<User[]>([]);
  const [req, setReq] = props.item;

  const notif = useNotif();

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

  const handleCariTempat = async () => {
    try {
      const data = await getLatLngByAddress(req.tempat_temu as string);
      setReq("maps", {
        lat: data[0].lat,
        lng: data[0].lon,
      });
    } catch (e) {
      notif.show("tempat tidak ditemukan", false);
    }
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
            value={req.tempat_temu}
            onChange={(e) => setReq("tempat_temu", e.currentTarget.value)}
            append={
              <button
                class="p-3 bg-purple-500 text-white"
                type="button"
                onClick={handleCariTempat}
              >
                <SearchIcon class="w-4 h-4" />
              </button>
            }
          />
          <div class="mb-2">
            <label for="">Lokasi Maps</label>
            <Input
              value={[req.maps?.lat, req.maps?.lng].toString()}
              placeholder="[lat,lng]"
              disabled
            />
            <Map
              value={req.maps}
              onChange={(e) => {
                setReq("maps", {
                  lat: e.lat as any,
                  lng: e.lng as any,
                });
              }}
            ></Map>
          </div>
        </div>
        <div>
          <Select
            label="Penemu"
            value={req.user_id}
            onChange={(e) => setReq("user_id", e.currentTarget.value)}
          >
            <option value="">Pilih Penemu</option>
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
          <Show when={req.id}>
            <Select
              label="Dikembalikan"
              value={req.dikembalikan}
              onChange={(e) => setReq("dikembalikan", e.currentTarget.value)}
            >
              <option value="">Pilih Status</option>
              <option value={"1"}>Sudah Dikembalikan</option>
              <option value={"0"}>Belum Dikembalikan</option>
            </Select>
            <Input
              label="Tanggal Temu"
              value={formatDate(req.created_at as string)}
              disabled
            />
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
          href="/barang-temu"
          class="button px-4 p-2 bg-gray-400 text-white rounded shadow-sm"
        >
          Kembali
        </A>
      </div>
    </form>
  );
}
