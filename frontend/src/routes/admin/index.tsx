import { For, Show, createEffect, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import Card from "~/components/card";
import { ArchiveIcon, ArchiveXIcon, UsersIcon } from "~/components/icons";
import Skeleton from "~/components/skeleton";
import Title from "~/components/title";
import { useAuth } from "~/contexts/auth";
import { useNotif } from "~/contexts/notif";
import http from "~/libs/http";
import { Chart, registerables } from "chart.js";
import Input from "~/components/input";

export default function () {
  const [total, setTotal] = createStore({
    user: 0,
    barangHilang: 0,
    barangTemu: 0,
  });
  const [isLoading, setIsLoading] = createSignal(false);
  const [tahun, setTahun] = createSignal(new Date().getFullYear());
  const [chart, setChart] = createSignal<Chart>();
  let canvasChart: HTMLCanvasElement | any;

  const [auth] = useAuth();
  const notif = useNotif();

  const getData = async () => {
    try {
      const user = await http.get("/user");
      const barangHilang = await http.get("/barang/hilang");
      const barangTemu = await http.get("/barang/temu");

      setTotal("user", user.data.data.length);
      setTotal("barangHilang", barangHilang.data.data.length);
      setTotal("barangTemu", barangTemu.data.data.length);
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  const getChart = async () => {
    try {
      const { data } = await http.get("/grafik/barang", {
        params: {
          tahun: tahun(),
        },
      });

      let bulan: any[] = [];
      let barang_hilang: any[] = [];
      let barang_temu: any[] = [];

      data.data.barang_hilang.forEach((item: any) => {
        bulan.push(item.bulan.slice(0, 3));
        barang_hilang.push(item.jumlah);
      });

      data.data.barang_temu.forEach((item: any) => {
        barang_temu.push(item.jumlah);
      });

      if (chart()) {
        chart()?.destroy();
      }

      Chart.register(...registerables);
      const ctx = new Chart(canvasChart, {
        type: "line",
        data: {
          labels: bulan,
          datasets: [
            {
              label: "Temuan",
              data: barang_temu,
              borderWidth: 1,
              backgroundColor: "#a855f7",
              borderColor: "#a855f7",
            },
            {
              label: "Hilang",
              data: barang_hilang,
              borderWidth: 1,
              backgroundColor: "#ef4444",
              borderColor: "#ef4444",
            },
          ],
        },
        options: {
          responsive: true,
          interaction: {
            intersect: false,
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      setChart(ctx);
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  createEffect(() => {
    getChart();
  });

  onMount(async () => {
    setIsLoading(true);
    await getData();
    await getChart();
    setIsLoading(false);
  });

  return (
    <>
      <Title
        title="Dashboard"
        subtitle={`Halo ${auth()?.nama}, Selamat datang di Aplikasi LostInfo`}
      />
      <div class="grid lg:grid-cols-3 grid-cols-1 gap-3 mb-3">
        <Show
          when={!isLoading()}
          fallback={
            <For each={Array.from({ length: 3 })}>
              {(item) => (
                <Card class="flex items-center px-10">
                  <Skeleton class="rounded-full h-20 w-20 mr-6" />
                  <div class="grow">
                    <Skeleton class="text-4xl font-semibold rounded-full mb-2">
                      0
                    </Skeleton>
                    <Skeleton class="rounded-full">-</Skeleton>
                  </div>
                </Card>
              )}
            </For>
          }
        >
          <Card class="flex items-center px-10">
            <div class="rounded-full bg-purple-200 h-20 w-20 flex items-center justify-center mr-6">
              <UsersIcon class="w-12 h-12 text-purple-500" />
            </div>
            <div>
              <div class="text-4xl font-semibold">
                {total.user.toLocaleString("id-ID")}
              </div>
              <div>Pengguna</div>
            </div>
          </Card>
          <Card class="flex items-center px-10">
            <div class="rounded-full bg-purple-200 h-20 w-20 flex items-center justify-center mr-6">
              <ArchiveIcon class="w-12 h-12 text-purple-500" />
            </div>
            <div>
              <div class="text-4xl font-semibold">
                {total.barangTemu.toLocaleString("id-ID")}
              </div>
              <div>Barang Temu</div>
            </div>
          </Card>
          <Card class="flex items-center px-10">
            <div class="rounded-full bg-purple-200 h-20 w-20 flex items-center justify-center mr-6">
              <ArchiveXIcon class="w-12 h-12 text-purple-500" />
            </div>
            <div>
              <div class="text-4xl font-semibold">
                {total.barangHilang.toLocaleString("id-ID")}
              </div>
              <div>Barang Hilang</div>
            </div>
          </Card>
        </Show>
      </div>
      <Card title="Grafik Barang Hilang dan Temuan">
        <div class="flex lg:flex-row flex-col items-center gap-x-5 mb-5">
          <div>Filter Tahun :</div>
          <div class="grow">
            <Input
              type="number"
              value={tahun()}
              onChange={(e) => setTahun(parseInt(e.currentTarget.value))}
              max={new Date().getFullYear()}
            />
          </div>
        </div>
        <Show when={isLoading()}>
          <Skeleton class="h-80 rounded-lg" />
        </Show>
        <canvas classList={{ "!w-0": isLoading() }} ref={canvasChart}></canvas>
      </Card>
    </>
  );
}
