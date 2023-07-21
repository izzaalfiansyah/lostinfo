import { createSignal } from "solid-js";
import { useNavigate } from "solid-start";
import Card from "~/components/card";
import Map from "~/components/map";
import Title from "~/components/title";
import { useNotif } from "~/contexts/notif";
import BarangHilang from "~/interfaces/barang-hilang";
import http from "~/libs/http";

export default function () {
  const [barangHilangTerdekat, setBarangHilangTerdekat] =
    createSignal<BarangHilang[]>();
  const [isLoading, setIsLoading] = createSignal(false);
  const [myLocation, setMyLocation] = createSignal<any>();

  const nav = useNavigate();
  const notif = useNotif();

  const getBarangHilangTerdekat = async () => {
    try {
      if (myLocation().lat && myLocation().lng) {
        const { data } = await http.get("/barang/hilang", {
          params: {
            terdekat: myLocation().lat + "," + myLocation().lng,
          },
        });

        setBarangHilangTerdekat(data.data);
      }
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  return (
    <>
      <Title title="Home"></Title>
      <Map
        disabled={true}
        onLocationFound={(e) => {
          setMyLocation({
            lat: e.lat,
            lng: e.lng,
          });
          getBarangHilangTerdekat();
        }}
        marks={barangHilangTerdekat()?.map((item) => ({
          lat: item.maps_lat,
          lng: item.maps_lng,
          text: item.nama,
          onClick: () => {
            nav("/user/barang-hilang/" + item.id);
          },
        }))}
        class="!h-full grow"
      ></Map>
      <Card class="mt-4">
        <ul class="list-disc pl-4">
          <li>
            <span class="text-[dodgerblue]">warna biru</span> adalah lokasi anda
            saat ini.
          </li>
          <li>
            <span class="text-[red]">warna merah</span> adalah barang hilang di
            sekitar anda.
          </li>
        </ul>
      </Card>
    </>
  );
}
