import Card from "~/components/card";
import User from "./user";
import { For, Show, createSignal, onMount } from "solid-js";
import BarangHilang from "~/interfaces/barang-hilang";
import BarangTemu from "~/interfaces/barang-temu";
import { useNotif } from "~/contexts/notif";
import http from "~/libs/http";
import Img from "~/components/img";
import formatMoney from "~/libs/format-money";
import { A } from "@solidjs/router";
import Skeleton from "~/components/skeleton";

export default function () {
  const notif = useNotif();

  const [barangHilang, setBarangHilang] = createSignal<BarangHilang[]>([]);
  const [barangTemu, setBarangTemu] = createSignal<BarangTemu[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);

  const get = async () => {
    setIsLoading(true);
    try {
      const { data: barang_hilang } = await http.get("/barang/hilang?limit=4");
      const { data: barang_temu } = await http.get("/barang/temu?limit=4");

      setBarangHilang(barang_hilang.data);
      setBarangTemu(barang_temu.data);
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
    setIsLoading(false);
  };

  onMount(() => {
    get();
  });

  return (
    <div class="grow flex flex-col gap-y-4">
      <Card title="Temukan Sesuatu di Sekitar Anda">
        <div class="relative min-h-[50vh] flex flex=col">
          <User />
        </div>
      </Card>
      <div class="grid lg:grid-cols-2 grid-cols-1 gap-3">
        <Card title="Barang Hilang">
          <div class="grid lg:grid-cols-4 grid-cols-2 gap-3">
            <Show
              when={!isLoading()}
              fallback={
                <For each={Array.from({ length: 4 })}>
                  {(item) => (
                    <A href="/login">
                      <Card class="!p-3 hover:bg-gray-50 transition">
                        <div class="flex flex-col text-sm">
                          <Skeleton class="h-24 rounded" />
                          <Skeleton class="p-2 mt-3 rounded-full" />
                          <Skeleton class="p-1 mt-1 rounded-full" />
                        </div>
                      </Card>
                    </A>
                  )}
                </For>
              }
            >
              <For
                each={barangHilang()}
                fallback={
                  <div class="lg:col-span-4 col-span-2 text-center p-3">
                    Tidak tersedia
                  </div>
                }
              >
                {(item) => (
                  <A href="/login">
                    <Card class="!p-3 hover:bg-gray-50 transition">
                      <div class="flex flex-col text-sm">
                        <Img src={item.foto_url} alt={item.nama} class="h-24" />
                        <div class="font-semibold truncate mt-3">
                          {item.nama}
                        </div>
                        <div class="text-primary text-xs">
                          {formatMoney(item.hadiah)}
                        </div>
                      </div>
                    </Card>
                  </A>
                )}
              </For>
            </Show>
          </div>
        </Card>
        <Card title="Barang Temuan">
          <div class="grid lg:grid-cols-4 grid-cols-2 gap-3">
            <Show
              when={!isLoading()}
              fallback={
                <For each={Array.from({ length: 4 })}>
                  {(item) => (
                    <A href="/login">
                      <Card class="!p-3 hover:bg-gray-50 transition">
                        <div class="flex flex-col text-sm">
                          <Skeleton class="h-24 rounded" />
                          <Skeleton class="p-2 mt-3 rounded-full" />
                          <Skeleton class="p-1 mt-1 rounded-full" />
                        </div>
                      </Card>
                    </A>
                  )}
                </For>
              }
            >
              <For
                each={barangTemu()}
                fallback={
                  <div class="lg:col-span-4 col-span-2 text-center p-3">
                    Tidak tersedia
                  </div>
                }
              >
                {(item) => (
                  <A href="/login">
                    <Card class="!p-3 hover:bg-gray-50 transition">
                      <div class="flex flex-col text-sm">
                        <Img src={item.foto_url} alt={item.nama} class="h-24" />
                        <div class="font-semibold truncate mt-3">
                          {item.nama}
                        </div>
                        <div class="text-xs">
                          Oleh{" "}
                          <span class="text-primary">
                            @{item.user?.username}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </A>
                )}
              </For>
            </Show>
          </div>
        </Card>
      </div>
    </div>
  );
}
