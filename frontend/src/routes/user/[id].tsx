import { For, Show, createEffect, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { useParams } from "solid-start";
import {
  EditIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "~/components/icons";
import Img from "~/components/img";
import Title from "~/components/title";
import { useNotif } from "~/contexts/notif";
import User from "~/interfaces/user";
import formatDate from "~/libs/format-date";
import http from "~/libs/http";
import BarangHilang from "../barang-hilang";
import BarangTemu from "../barang-temu";
import { Dynamic } from "solid-js/web";
import ModalSave from "~/components/user/modal-save";
import Card from "~/components/card";
import Skeleton from "~/components/skeleton";

interface Props {
  id?: any;
}

export default function (props: Props) {
  const [req, setReq] = createStore<User>();
  const [selectedTab, setSelectedTab] = createSignal<number>(0);
  const [modalEdit, setModalEdit] = createSignal<boolean>(false);
  const [isLoading, setIsLoading] = createSignal(false);

  const tabs = [
    {
      title: "Barang Hilang",
      component: BarangHilang,
    },
    {
      title: "Barang Temu",
      component: BarangTemu,
    },
  ];

  const notif = useNotif();
  const params = useParams();

  const get = async () => {
    setIsLoading(true);
    try {
      const id = props.id ? props.id : params.id;
      const { data } = await http.get("/user/" + id);
      setReq(data.data);
      setReq("password", "");
      setReq("foto", "");
      setReq("ktp", "");
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
    setIsLoading(false);
  };

  createEffect(() => {
    get();
  });

  onMount(async () => {
    await get();
  });

  return (
    <>
      <Show when={!props.id}>
        <Title
          title="Detail User"
          subtitle="Data lanjutan mengenai data user"
        ></Title>
      </Show>
      <Card>
        <div class="flex lg:items-center gap-5 lg:flex-row flex-col">
          <Show
            when={!isLoading()}
            fallback={
              <>
                <div class="flex items-center justify-center">
                  <Skeleton class="rounded-lg w-64 h-64" />
                </div>
                <div class="grow">
                  <Skeleton class="p-4 rounded-full mb-2" />
                  <Skeleton class="p-2 rounded-full mb-2" />
                  <div class="mt-6">
                    <Skeleton class="p-2 rounded-full mb-1" />
                    <Skeleton class="p-2 rounded-full mb-1" />
                    <Skeleton class="p-2 rounded-full mb-1" />
                  </div>
                  <div class="mt-5">
                    <Skeleton class="p-2 rounded-full" />
                  </div>
                </div>
              </>
            }
          >
            <div class="flex items-center justify-center">
              <Img
                src={req.foto_url}
                alt={req.nama}
                class="rounded-lg w-64 h-64 object-cover"
              />
            </div>
            <div class="grow">
              <div class="text-center lg:text-left">
                <div class="text-2xl font-semibold">{req.nama}</div>
                <div>@{req.username}</div>
                <div class="mt-2 flex lg:justify-start justify-center">
                  <Show when={!props.id}>
                    <button
                      type="button"
                      class="text-sm text-purple-500 border block border-purple-500 hover:text-white hover:bg-purple-500 transition rounded-full px-3 p-1 flex items-center mr-2"
                      onClick={() => {
                        setModalEdit(true);
                      }}
                    >
                      <EditIcon class="w-4 h-4 mr-2" /> Edit
                    </button>
                  </Show>

                  <a
                    href={req.ktp_url}
                    class="text-sm text-red-500 border block border-red-500 hover:text-white hover:bg-red-500 transition rounded-full px-3 p-1 flex items-center"
                    target="_blank"
                  >
                    <div class="h-4" /> Lihat KTP
                  </a>
                </div>
              </div>
              <div class="mt-5">
                <table>
                  <tbody>
                    <tr>
                      <td class="pr-4">
                        <MapPinIcon class="w-5 h-5" />
                      </td>
                      <td>{req.alamat}</td>
                    </tr>
                    <tr>
                      <td>
                        <EnvelopeIcon class="w-5 h-5" />
                      </td>
                      <td>{req.email}</td>
                    </tr>
                    <tr>
                      <td>
                        <PhoneIcon class="w-5 h-5" />
                      </td>
                      <td>{req.telepon}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="mt-5">
                Bergabung pada {formatDate(req.created_at as string)}
              </div>
            </div>
          </Show>
        </div>
      </Card>

      <Show when={!props.id}>
        <ModalSave
          show={modalEdit()}
          onClose={() => setModalEdit(false)}
          callback={() => {}}
          isEdit={true}
          req={[req, setReq]}
        />
      </Show>

      <Show when={req.id && !props.id}>
        <div class="mt-5"></div>
        <div class="flex space-x-3 lg:justify-start justify-center">
          <For each={tabs}>
            {(item, index) => (
              <button
                class="bg-purple-500 text-white rounded px-4 p-2 disabled:bg-purple-400 hover:bg-purple-400 transition"
                disabled={selectedTab() == index()}
                onClick={() => setSelectedTab(index())}
              >
                {item.title}
              </button>
            )}
          </For>
        </div>
        <div class="mt-5">
          <Dynamic component={tabs[selectedTab()].component} user_id={req.id} />
        </div>
      </Show>
    </>
  );
}
