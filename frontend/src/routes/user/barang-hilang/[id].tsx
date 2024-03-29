import { createStore } from "solid-js/store";
import {
  A,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "solid-start";
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
import { EnvelopeIcon, PhoneIcon } from "~/components/icons";
import FloatingComponent from "~/components/floating-component";
import PremiumButton from "~/components/premium-button";
import BarangTemu from "../barang-temu";

export default function () {
  const [req, setReq] = createStore<BarangHilang>({});
  const [isLoading, setIsLoading] = createSignal<boolean>(false);

  const notif = useNotif();
  const params = useParams();
  const [auth] = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

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
        title={`${
          auth().id == req.user_id && searchParams.edit ? "Edit" : "Detail"
        } Barang Hilang`}
        subtitle="Informasi lanjutan mengenai barang hilang"
        action={
          auth().id == req.user_id && !searchParams.edit ? (
            <Button
              onClick={() => setSearchParams({ edit: true })}
              variant="primary"
            >
              Edit
            </Button>
          ) : null
        }
      ></Title>
      <Show
        when={auth().id == req.user_id && searchParams.edit}
        fallback={
          <>
            <Card title="Detail Barang">
              <Show when={!isLoading()} fallback={<Skeleton class="h-72" />}>
                <table class="w-full">
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
                      <td>Status</td>
                      <td class="px-3">:</td>
                      <td>
                        <span
                          class="text-sm text-white rounded px-3"
                          classList={{
                            "bg-green-500": req.ditemukan == "1",
                            "bg-red-500": req.ditemukan != "1",
                          }}
                        >
                          {req.ditemukan_detail} ditemukan
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

            <Show when={req.user_id == auth().id}>
              <div class="mt-3"></div>
              <Show
                when={auth().premium == "1"}
                fallback={
                  <Card title="Barang Temuan yang Serupa">
                    <div class="bg-gray-50 p-5 text-center">
                      <div class="text-red-500 text-lg ">
                        Fitur tersedia hanya pada akun premium {auth().premium}
                      </div>
                      <div class="mt-3">
                        <PremiumButton text="Coba Premium" />
                      </div>
                    </div>
                  </Card>
                }
              >
                <Card title="Barang Temuan yang Serupa">
                  <BarangTemu barang_hilang_id={req.id} />
                </Card>
              </Show>
            </Show>

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
                        req.maps_lat
                          ? `http://www.google.com/maps/dir/My+Location/${req.maps_lat},${req.maps_lng}`
                          : `http://www.google.com/maps/dir/My+Location/${req.tempat_hilang}`
                      );
                    }}
                  >
                    Pergi ke lokasi
                  </Button>
                </div>
              </Show>
            </Card>

            <Show when={!isLoading()}>
              <FloatingComponent>
                <a
                  target="_blank"
                  href={
                    "mailto:" +
                    req.user?.email +
                    "?subject=Saya menemukan " +
                    req.nama +
                    " milik anda!"
                  }
                  class="rounded-full block bg-red-500 h-12 w-12 flex items-center justify-center text-white shadow-lg"
                >
                  <EnvelopeIcon class="w-5 h-5" />
                </a>

                <a
                  target="_blank"
                  href={
                    "https://wa.me/" +
                    req.user?.whatsapp +
                    "?text=Saya menemukan " +
                    req.nama +
                    " milik anda!"
                  }
                  class="rounded-full block bg-green-500 h-12 w-12 flex items-center justify-center text-white shadow-lg"
                >
                  <PhoneIcon class="w-5 h-5" />
                </a>
              </FloatingComponent>
            </Show>
          </>
        }
      >
        <Save item={[req, setReq]} onMount={get} onSubmit={update}></Save>
      </Show>
    </>
  );
}
