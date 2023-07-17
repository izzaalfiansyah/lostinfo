import { For, Show, createSignal, onMount } from "solid-js";
import Img from "~/components/img";
import Input from "~/components/input";
import Skeleton from "~/components/skeleton";
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
      <div class="bg-primary rounded-b-xl p-2.5 shadow"></div>
      <div class="mt-5">
        <Input placeholder="Ketik di sini untuk mulai mencari" />
      </div>
      <div class="mt-5 text-sm">
        <div class="font-semibold mb-3">Kehilangan Terbaru</div>
        <Show
          when={!isLoading()}
          fallback={
            <Skeleton class="rounded-lg p-3">
              <div class="h-28"></div>
            </Skeleton>
          }
        >
          <For each={barangHilangTerbaru()}>
            {(item) => (
              <div class="bg-primary p-3 rounded-lg flex gap-x-3 text-white">
                <Img class="h-28 w-28" src={item.foto_url} alt={item.nama} />
                <div class="grow">
                  <div class="text-base font-semibold">{item.nama}</div>
                  <div class="flex items-center text-xs">
                    @{item.user?.username}
                  </div>
                  <div class="mt-3 text-xs">{item.deskripsi}</div>
                </div>
              </div>
            )}
          </For>
        </Show>
      </div>
    </>
  );
}
