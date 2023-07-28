import { Show, createSignal, onMount } from "solid-js";
import { useNavigate } from "solid-start";
import Card from "~/components/card";
import FloatingComponent from "~/components/floating-component";
import Map from "~/components/map";
import Skeleton from "~/components/skeleton";
import Title from "~/components/title";
import { useNotif } from "~/contexts/notif";
import BarangHilang from "~/interfaces/barang-hilang";
import BarangTemu from "~/interfaces/barang-temu";
import http from "~/libs/http";

export default function () {
  const [barangHilangTerdekat, setBarangHilangTerdekat] = createSignal<
    BarangHilang[]
  >([]);
  const [barangTemuTerdekat, setBarangTemuTerdekat] = createSignal<
    BarangTemu[]
  >([]);
  const [myLocation, setMyLocation] = createSignal<any>();
  const [isLoading, setIsLoading] = createSignal(true);

  const nav = useNavigate();
  const notif = useNotif();

  const getBarangTerdekat = async () => {
    setIsLoading(true);
    try {
      if (myLocation().lat && myLocation().lng) {
        const { data: barang_hilang } = await http.get("/barang/hilang", {
          params: {
            terdekat: myLocation().lat + "," + myLocation().lng,
          },
        });

        const { data: barang_temu } = await http.get("/barang/temu", {
          params: {
            terdekat: myLocation().lat + "," + myLocation().lng,
          },
        });

        setBarangHilangTerdekat(barang_hilang.data);
        setBarangTemuTerdekat(barang_temu.data);
      }
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
    setIsLoading(false);
  };

  const barangTerdekat = () => {
    const barang = [...barangHilangTerdekat(), ...barangTemuTerdekat()];
    return barang;
  };

  return (
    <>
      <Title title="Home"></Title>
      {/* <div class="relative"> */}
      <div class="relative grow flex flex-col">
        <Show when={isLoading()}>
          <Skeleton class="!absolute top-0 left-0 right-0 bottom-0 z-[99998] rounded" />
        </Show>
        <Map
          disabled={true}
          onLocationFound={(e) => {
            setMyLocation({
              lat: e.lat,
              lng: e.lng,
            });
            getBarangTerdekat();
          }}
          toMyLocation
          marks={barangTerdekat().map((item) => ({
            lat: item.maps_lat,
            lng: item.maps_lng,
            text: item.nama,
            color: (item as any).hadiah ? "red" : "lime",
            onClick: () => {
              nav(
                "/user/" +
                  ((item as any).hadiah ? "barang-hilang/" : "barang-temu/") +
                  item.id
              );
            },
          }))}
          class="!h-full grow"
        ></Map>
      </div>
      {/* </div> */}
      <FloatingComponent class="!absolute">
        <Card class="mt-4 !shadow-lg inline bg-opacity-75">
          <ul class="list-disc pl-4 text-sm">
            <li>
              <span class="text-[dodgerblue]">warna biru</span> adalah lokasi
              anda saat ini.
            </li>
            <li>
              <span class="text-[red]">warna merah</span> adalah lokasi barang
              hilang di sekitar anda.
            </li>
            <li>
              <span class="text-[lime]">warna hijau</span> adalah lokasi barang
              temuan di sekitar anda.
            </li>
          </ul>
        </Card>
      </FloatingComponent>
    </>
  );
}
