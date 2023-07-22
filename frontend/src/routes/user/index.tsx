import { Show, createSignal } from "solid-js";
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

  const nav = useNavigate();
  const notif = useNotif();

  const getBarangTerdekat = async () => {
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
        <Map
          disabled={true}
          onLocationFound={(e) => {
            setMyLocation({
              lat: e.lat,
              lng: e.lng,
            });
            getBarangTerdekat();
          }}
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
      <FloatingComponent>
        <Card class="mt-4 !shadow-lg inline bg-opacity-75">
          <ul class="list-disc pl-4">
            <li>
              <span class="text-[dodgerblue]">warna biru</span> adalah lokasi
              anda saat ini.
            </li>
            <li>
              <span class="text-[red]">warna merah</span> adalah barang hilang
              di sekitar anda.
            </li>
            <li>
              <span class="text-[lime]">warna hijau</span> adalah barang temuan
              di sekitar anda.
            </li>
          </ul>
        </Card>
      </FloatingComponent>
    </>
  );
}
