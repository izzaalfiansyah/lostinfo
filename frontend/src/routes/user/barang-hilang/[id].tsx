import { createStore } from "solid-js/store";
import { A, useParams } from "solid-start";
import Title from "~/components/title";
import { useNotif } from "~/contexts/notif";
import BarangHilang from "~/interfaces/barang-hilang";
import http from "~/libs/http";
import { Save } from "./create";
import { useAuth } from "~/contexts/auth";
import { Show, createSignal, onMount } from "solid-js";
import Card from "~/components/card";
import Img from "~/components/img";
import formatMoney from "~/libs/format-money";
import formatDate from "~/libs/format-date";
import Skeleton from "~/components/skeleton";
import Map from "~/components/map";
import Button from "~/components/button";
import openWindow from "~/libs/open-window";

export default function () {
  const [req, setReq] = createStore<BarangHilang>({});
  const [isLoading, setIsLoading] = createSignal<boolean>(false);

  const notif = useNotif();
  const params = useParams();
  const [auth] = useAuth();

  const get = async () => {
    setIsLoading(true);
    try {
      const { data } = await http.get("/barang/hilang/" + params.id);
      setReq(data.data);
      setReq("foto", "");
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
    setIsLoading(false);
  };

  const update = async () => {
    try {
      await http.put("/barang/hilang/" + params.id, req);
      notif.show("data berhasil disimpan");
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  onMount(() => {
    get();
  });

  return (
    <>
      <Title
        title="Detail Barang Hilang"
        subtitle="Informasi lanjutan mengenai barang hilang"
      ></Title>
      <Show
        when={auth().id == req.user_id}
        fallback={
          <>
            <Card title="Detail Barang">
              <Show when={!isLoading()} fallback={<Skeleton class="h-72" />}>
                <table>
                  <tbody>
                    <tr>
                      <td>Nama Barang</td>
                      <td class="px-3">:</td>
                      <td>{req.nama}</td>
                    </tr>
                    <tr>
                      <td>Pemilik</td>
                      <td class="px-3">:</td>
                      <td>
                        <A
                          class="text-primary"
                          href={"/user/user/" + req.user_id}
                        >
                          @{req.user?.username}
                        </A>
                      </td>
                    </tr>
                    <tr>
                      <td>Deskripsi</td>
                      <td class="px-3">:</td>
                      <td>{req.deskripsi}</td>
                    </tr>
                    <tr>
                      <td>Tempat Hilang</td>
                      <td class="px-3">:</td>
                      <td>{req.tempat_hilang}</td>
                    </tr>
                    <tr>
                      <td>Foto</td>
                      <td class="px-3">:</td>
                      <td class="p-3">
                        <Img
                          src={req.foto_url}
                          alt={req.nama}
                          class="w-40 h-40"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Hadiah</td>
                      <td class="px-3">:</td>
                      <td>{formatMoney(req.hadiah)}</td>
                    </tr>
                    <tr>
                      <td>Ditemukan</td>
                      <td class="px-3">:</td>
                      <td>
                        <span
                          class="text-xs text-white rounded-full px-2"
                          classList={{
                            "bg-green-500": req.ditemukan == "1",
                            "bg-red-500": req.ditemukan != "1",
                          }}
                        >
                          {req.ditemukan_detail}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Tanggal Hilang</td>
                      <td class="px-3">:</td>
                      <td>{formatDate(req.created_at as any)}</td>
                    </tr>
                  </tbody>
                </table>
              </Show>
            </Card>
            <div class="mt-3"></div>
            <Card title="Tempat Hilang">
              <Show when={!isLoading()} fallback={<Skeleton class="h-80" />}>
                <Map
                  value={{
                    lat: req.maps_lat,
                    lng: req.maps_lng,
                  }}
                  class="h-80"
                  disabled
                ></Map>
                <div class="mt-4 flex items-center justify-end">
                  <Button
                    variant="primary"
                    onClick={() => {
                      openWindow(
                        `https://www.google.com/maps?saddr=My+Location&daddr=${req.maps_lat},${req.maps_lng}`
                      );
                    }}
                  >
                    Pergi ke lokasi
                  </Button>
                </div>
              </Show>
            </Card>
          </>
        }
      >
        <Save item={[req, setReq]} onMount={get} onSubmit={update}></Save>
      </Show>
    </>
  );
}