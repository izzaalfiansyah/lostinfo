import { For, Show, createSignal, onMount } from "solid-js";
import Img from "~/components/img";
import Input from "~/components/input";
import Map from "~/components/map";
import Skeleton from "~/components/skeleton";
import TitleUser from "~/components/title-user";
import { useNotif } from "~/contexts/notif";
import BarangHilang from "~/interfaces/barang-hilang";
import http from "~/libs/http";

export default function () {
  const [barangHilangTerbaru, setBarangHilangTerbaru] =
    createSignal<BarangHilang[]>();
  const [isLoading, setIsLoading] = createSignal(false);

  const notif = useNotif();

  const getBarangHilangTerbaru = async () => {
    try {
      const { data } = await http.get("/barang/hilang", {
        params: { limit: 1 },
      });
      setBarangHilangTerbaru(data.data);
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  onMount(async () => {
    setIsLoading(true);
    await getBarangHilangTerbaru();
    setIsLoading(false);
  });

  return (
    <>
      <TitleUser>LostInfo.</TitleUser>
      <Map disabled={true} class="!h-full grow"></Map>
    </>
  );
}
