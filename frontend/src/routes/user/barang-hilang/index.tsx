import { For, Show, createSignal, onMount } from "solid-js";
import { A } from "solid-start";
import Card from "~/components/card";
import Img from "~/components/img";
import Input from "~/components/input";
import Skeleton from "~/components/skeleton";
import TitleUser from "~/components/title-user";
import { useNotif } from "~/contexts/notif";
import BarangHilang from "~/interfaces/barang-hilang";
import formatDate from "~/libs/format-date";
import http from "~/libs/http";

export default function () {
  const [items, setItems] = createSignal<BarangHilang[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);

  const notif = useNotif();

  const get = async () => {
    setIsLoading(true);
    try {
      const { data } = await http.get("/barang/hilang");
      setItems(data.data);
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
    setIsLoading(false);
  };

  onMount(async () => {
    await get();
  });

  return (
    <>
      <TitleUser>Barang Hilang</TitleUser>
      <Input placeholder="Cari..." />
      <div class="flex flex-col gap-3">
        <Show when={isLoading()}>
          <For each={Array.from({ length: 6 })}>
            {(item) => (
              <Card class="!p-3 flex items-center space-x-3">
                <Skeleton class="h-28 w-28 rounded-lg" />
                <div class="grow">
                  <Skeleton class="p-2 rounded-full mb-5" />
                  <Skeleton class="p-1 rounded-full mb-1" />
                  <Skeleton class="p-1 rounded-full mb-1" />
                  <Skeleton class="p-1 rounded-full mb-1" />
                </div>
              </Card>
            )}
          </For>
        </Show>

        <For
          each={items()}
          fallback={<div class="text-center p-5">Data tidak tersedia</div>}
        >
          {(item) => (
            <A href={"/barang-hilang/" + item.id}>
              <Card class="flex items-center space-x-3 !p-3">
                <Img src={item.foto_url} alt={item.nama} class="w-28 h-28" />
                <div class="grow truncate">
                  <div class="font-semibold truncate">{item.nama}</div>
                  <A
                    href={"/user/user/" + item.user_id}
                    class="text-gray-500 text-xs mt-1 text-primary"
                  >
                    @{item.user?.username}
                  </A>
                  <div class="text-gray-500 text-xs">
                    {formatDate(item.created_at as string, true)}
                  </div>
                </div>
              </Card>
            </A>
          )}
        </For>
      </div>
    </>
  );
}
