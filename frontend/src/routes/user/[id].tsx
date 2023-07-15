import { For, Show, createSignal, onMount } from "solid-js";
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

export default function () {
  const [req, setReq] = createStore<User>();
  const [selectedTab, setSelectedTab] = createSignal<number>(0);
  const [modalEdit, setModalEdit] = createSignal<boolean>(false);

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
    try {
      const { data } = await http.get("/user/" + params.id);
      setReq(data.data);
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  onMount(async () => {
    await get();
  });

  return (
    <>
      <Title
        title="Detail User"
        subtitle="Data lanjutan mengenai data user"
      ></Title>
      <div class="bg-white rounded-lg shadow-sm p-5">
        <div class="flex lg:items-center gap-5 lg:flex-row flex-col">
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
                <button
                  type="button"
                  class="text-sm text-purple-500 border block border-purple-500 hover:text-white hover:bg-purple-500 transition rounded-full px-3 p-1 flex items-center"
                  onClick={() => {
                    setModalEdit(true);
                  }}
                >
                  <EditIcon class="w-4 h-4 mr-2" /> Edit
                </button>
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
        </div>
      </div>

      <ModalSave
        show={modalEdit()}
        onClose={() => setModalEdit(false)}
        callback={() => {}}
        isEdit={true}
        req={[req, setReq]}
      />

      <Show when={req.id}>
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
