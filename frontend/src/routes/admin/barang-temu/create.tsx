import { For, Show, createSignal, onMount } from "solid-js";
import { SetStoreFunction, createStore } from "solid-js/store";
import { useNavigate } from "solid-start";
import Autocomplete from "~/components/autocomplete";
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

  const save = async () => {
    try {
      await http.post("/barang/temu", req);
      notif.show("data berhasil disimpan");
      nav("/admin/barang-temu");
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
  onSubmit: () => Promise<void>;
  onMount?: () => void;
}

export function Save(props: SaveProps) {
  const [users, setUsers] = createSignal<User[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [req, setReq] = props.item;

  const notif = useNotif();

  const getUser = async (search: string = "") => {
    const { data } = await http.get("/user", { params: { search } });
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
      const data = await getLatLngByAddress(req.tempat_temu as string);
      setReq("maps_lat", data[0].lat);
      setReq("maps_lng", data[0].lon);
    } catch (e) {
      notif.show("tempat tidak ditemukan", false);
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
              value={req.tempat_temu}
              onChange={(e) => {
                setReq("tempat_temu", e.currentTarget.value);
                handleCariTempat();
              }}
              append={
                <button
                  class="p-3 bg-primary text-white"
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
            <Autocomplete
              label="Pemilik"
              value={req.user_id}
              text={req.user?.nama}
              onChange={(val) => setReq("user_id", val)}
              options={users().map((item) => ({
                text: item.nama,
                value: item.id,
              }))}
              onAsync={getUser}
              placeholder="Pilih Pemilik"
              disabled={isLoading()}
            />
            <FileInput
              label="Foto"
              title="Pilih Foto"
              onChange={handleFotoChange}
              accept="image/*"
            />
            <div class="mb-2">
              <div class="bg-gray-50 rounded flex items-center justify-center p-3">
                <Img src={req.foto_url} alt="Foto Barang" class="w-24 h-24" />
              </div>
            </div>
            <Show when={req.id}>
              <Autocomplete
                label="Status"
                value={req.dikembalikan}
                onChange={(val) => setReq("dikembalikan", val)}
                disabled={isLoading()}
                placeholder="Pilih Status"
                options={[
                  {
                    text: "Sudah Dikembalikan",
                    value: "1",
                  },
                  {
                    text: "Belum Dikembalikan",
                    value: "0",
                  },
                ]}
              />
              <Input
                label="Tanggal Temu"
                value={formatDate(req.created_at as string)}
                disabled
              />
            </Show>
          </div>
        </div>
        <div class="mt-4">
          <Button type="submit" variant="primary">
            Simpan Data
          </Button>
          <Button class="ml-3" onClick={() => window.history.back()}>
            Kembali
          </Button>
        </div>
      </form>
    </Card>
  );
}
