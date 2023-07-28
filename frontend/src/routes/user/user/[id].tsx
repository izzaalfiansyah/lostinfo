import { For, Show, createEffect, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { useNavigate, useParams } from "solid-start";
import {
  EditIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  WarningIcon,
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
import { useDialogImg } from "~/contexts/dialog-img";
import Button from "~/components/button";
import { useAuth } from "~/contexts/auth";
import FloatingComponent from "~/components/floating-component";
import ModalReport from "~/components/user/modal-report";

interface Props {
  id?: any;
}

export default function (props: Props) {
  const [req, setReq] = createStore<User>();
  const [selectedTab, setSelectedTab] = createSignal<number>(0);
  const [modalReport, setModalReport] = createSignal<boolean>(false);
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
  const dialogImg = useDialogImg();
  const [auth] = useAuth();
  const nav = useNavigate();

  const get = async () => {
    setIsLoading(true);
    try {
      const id = props.id ? props.id : params.id;

      if (id == auth().id) {
        nav("/user/akun", { replace: true });
      }
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
                  <Show
                    when={req.id == auth().id}
                    fallback={
                      <button
                        type="button"
                        class="text-sm text-orange-500 border block border-orange-500 hover:text-white hover:bg-orange-500 transition rounded-full px-3 p-1 flex items-center mr-2"
                        onClick={() => {
                          setModalReport(true);
                        }}
                      >
                        <WarningIcon class="w-4 h-4 mr-2" /> Laporkan
                      </button>
                    }
                  >
                    {/* <button
                      type="button"
                      class="text-sm text-primary border block border-primary hover:text-white hover:bg-primary transition rounded-full px-3 p-1 flex items-center mr-2"
                      onClick={() => {
                        setModalEdit(true);
                      }}
                    >
                      <EditIcon class="w-4 h-4 mr-2" /> Edit
                    </button> */}

                    <button
                      type="button"
                      onClick={() => dialogImg.show(req.ktp_url as string)}
                      class="text-sm text-red-500 border block border-red-500 hover:text-white hover:bg-red-500 transition rounded-full px-3 p-1 flex items-center"
                    >
                      <div class="h-4" /> Lihat KTP
                    </button>
                  </Show>
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

      <Show when={req.id != auth().id && !isLoading()}>
        <FloatingComponent>
          <a
            target="_blank"
            href={"mailto:" + req.email}
            class="rounded-full block bg-red-500 h-12 w-12 flex items-center justify-center text-white shadow-lg"
          >
            <EnvelopeIcon class="w-5 h-5" />
          </a>

          <a
            target="_blank"
            href={"https://wa.me/" + req.whatsapp}
            class="rounded-full block bg-green-500 h-12 w-12 flex items-center justify-center text-white shadow-lg"
          >
            <PhoneIcon class="w-5 h-5" />
          </a>
          <a
            target="_blank"
            href={"https://www.google.com/maps/dir/My+Location/" + req.alamat}
            class="rounded-full block bg-blue-500 h-12 w-12 flex items-center justify-center text-white shadow-lg"
          >
            <MapPinIcon class="w-5 h-5" />
          </a>
        </FloatingComponent>
      </Show>

      {/* <Show when={req.id == auth().id}>
        <ModalSave
          show={modalEdit()}
          onClose={() => setModalEdit(false)}
          callback={() => {}}
          isEdit={true}
          req={[req, setReq]}
        />
      </Show> */}

      <ModalReport
        user_id={req.id as string}
        onClose={() => setModalReport(false)}
        show={modalReport()}
      />

      <Show when={req.id && !props.id}>
        <div class="mt-5"></div>
        <Card class="flex items-center justify-between !p-2 gap-x-2">
          <For each={tabs}>
            {(item, index) => (
              <Button
                variant="primary"
                class="w-full text-center"
                disabled={selectedTab() == index()}
                onClick={() => setSelectedTab(index())}
              >
                {item.title}
              </Button>
            )}
          </For>
        </Card>
        <div class="mt-5">
          <Dynamic component={tabs[selectedTab()].component} user_id={req.id} />
        </div>
      </Show>
    </>
  );
}
