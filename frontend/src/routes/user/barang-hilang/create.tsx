import { For, Show, createSignal, onMount } from "solid-js";
import { SetStoreFunction, createStore } from "solid-js/store";
import { useNavigate } from "solid-start";
import Button from "~/components/button";
import Card from "~/components/card";
import FileInput from "~/components/file-input";
import { SearchIcon } from "~/components/icons";
import Img from "~/components/img";
import Input from "~/components/input";
import Map, { getLatLngByAddress } from "~/components/map";
import Select from "~/components/select";
import Textarea from "~/components/textarea";
import Title from "~/components/title";
import { useAuth } from "~/contexts/auth";
import { useNotif } from "~/contexts/notif";
import BarangHilang from "~/interfaces/barang-hilang";
import User from "~/interfaces/user";
import fileReader from "~/libs/file-reader";
import formatDate from "~/libs/format-date";
import http from "~/libs/http";

export default function () {
  const [req, setReq] = createStore<BarangHilang>({});

  const notif = useNotif();
  const nav = useNavigate();
  const [auth] = useAuth();

  const save = async () => {
    try {
      setReq("user_id", auth().id);
      await http.post("/barang/hilang", req);
      notif.show("data berhasil disimpan");
      nav("/user/barang-hilang");
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
  onSubmit: () => Promise<void>;
  onMount?: () => void;
}

export function Save(props: SaveProps) {
  const [users, setUsers] = createSignal<User[]>([]);
  const [req, setReq] = props.item;
  const [isLoading, setIsLoading] = createSignal(false);

  const notif = useNotif();

  const getUser = async () => {
    const { data } = await http.get("/user");
    setUsers(data.data);
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await props.onSubmit();
    setIsLoading(false);
  };

  const handleFotoChange = async (e: any) => {
    const file = e.target.files[0];
    const value = await fileReader(file);
    setReq("foto", value);
    setReq("foto_url", value);
  };

  const handleCariTempat = async () => {
    setIsLoading(true);
    try {
      const data = await getLatLngByAddress(req.tempat_hilang as string);
      setReq("maps_lat", data[0].lat);
      setReq("maps_lng", data[0].lon);
    } catch (e: any) {
      notif.show(`Tempat tidak ditemukan. Error: ${e.message}`, false);
    }
    setIsLoading(false);
  };

  onMount(async () => {
    setIsLoading(true);
    await getUser();

    if (props.onMount) {
      props.onMount();
    }

    setIsLoading(false);
  });

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <div class="grid lg:grid-cols-2 grid-cols-1 gap-5">
          <div>
            <Input
              label="Nama"
              required
              placeholder="Masukkan Nama"
              disabled={isLoading()}
              value={req.nama}
              onChange={(e) => setReq("nama", e.currentTarget.value)}
            />
            <Textarea
              label="Deskripsi"
              placeholder="Masukkan Deskripsi"
              disabled={isLoading()}
              value={req.deskripsi}
              rows={3}
              onChange={(e) => setReq("deskripsi", e.currentTarget.value)}
            />
            <Input
              label="Tempat Hilang"
              required
              placeholder="Masukkan Tempat Hilang"
              disabled={isLoading()}
              value={req.tempat_hilang}
              onChange={(e) => setReq("tempat_hilang", e.currentTarget.value)}
              append={
                <button
                  class="p-3 bg-primary text-white h-full flex items-center justify-center"
                  type="button"
                  onClick={handleCariTempat}
                >
                  <SearchIcon class="w-4 h-4" />
                </button>
              }
            />
            <div class="mb-2">
              <label for="">Lokasi Maps</label>
              <Map
                value={{
                  lat: req.maps_lat,
                  lng: req.maps_lng,
                }}
                onChange={(e) => {
                  setReq("maps_lat", e.lat);
                  setReq("maps_lng", e.lng);
                }}
              ></Map>
            </div>
          </div>
          <div>
            <FileInput
              label="Foto"
              title="Pilih Foto"
              accept="image/*"
              disabled={isLoading()}
              onChange={handleFotoChange}
            />
            <div class="mb-2">
              <div class="bg-gray-50 rounded flex items-center justify-center p-3">
                <Img src={req.foto_url} alt="Foto Barang" class="w-24 h-24" />
              </div>
            </div>
            <Input
              type="number"
              label="Hadiah"
              required
              placeholder="Masukkan Hadiah"
              disabled={isLoading()}
              value={req.hadiah}
              prepend={
                <div class="p-3 bg-gray-200 h-full flex items-center justify-center">
                  Rp
                </div>
              }
              onChange={(e) =>
                setReq("hadiah", parseInt(e.currentTarget.value))
              }
            />
            <Show when={req.id}>
              <Select
                label="Ditemukan"
                value={req.ditemukan}
                onChange={(e) => setReq("ditemukan", e.currentTarget.value)}
                disabled={isLoading()}
              >
                <option value="">Pilih Status</option>
                <option value={"1"}>Sudah Ditemukan</option>
                <option value={"0"}>Belum Ditemukan</option>
              </Select>
              <Input
                label="Tanggal Hilang"
                value={formatDate(req.created_at as string)}
                disabled
              />
            </Show>
          </div>
        </div>
        <div class="mt-5">
          <Button type="submit" variant="primary" disabled={isLoading()}>
            {isLoading() ? "Memuat..." : "Simpan Data"}
          </Button>
          <Button class="ml-3" onClick={() => window.history.back()}>
            Kembali
          </Button>
        </div>
      </form>
    </Card>
  );
}
