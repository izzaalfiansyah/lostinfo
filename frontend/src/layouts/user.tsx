import { For, JSX, createSignal, onMount } from "solid-js";
import { A, useLocation, useNavigate } from "solid-start";
import Autocomplete from "~/components/autocomplete";
import Button from "~/components/button";
import {
  AccountIcon,
  ArchiveIcon,
  ArchiveXIcon,
  HomeIcon,
  LogoutIcon,
  LoveIcon,
  MenuIcon,
  UsersIcon,
} from "~/components/icons";
import Img from "~/components/img";
import Modal from "~/components/modal";
import { useAuth } from "~/contexts/auth";

interface Props extends JSX.HTMLAttributes<HTMLDivElement> {}

export default function (props: Props) {
  const menus: Array<{
    icon: any;
    title: string;
    path: string;
  }> = [
    {
      icon: HomeIcon,
      title: "Home",
      path: "/user",
    },
    {
      icon: ArchiveXIcon,
      title: "Barang Hilang",
      path: "/user/barang-hilang",
    },
    {
      icon: ArchiveIcon,
      title: "Barang Temu",
      path: "/user/barang-temu",
    },
    {
      icon: AccountIcon,
      title: "Akun",
      path: "/user/akun",
    },
  ];

  const nav = useNavigate();
  const loc = useLocation();
  const [auth, authFn] = useAuth();

  const [modalLogout, setModalLogout] = createSignal<boolean>(false);
  const [showSidebar, setShowSidebar] = createSignal<boolean>(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar());
  };

  const checkActive = (path: string) => {
    if (path == "/user") {
      if (loc.pathname == "/user") {
        return true;
      }
    } else {
      return loc.pathname.includes(path);
    }
  };

  const logout = (e: SubmitEvent) => {
    authFn.logout();
    nav("/login");
    e.preventDefault();
  };

  onMount(() => {
    const snapSrcUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const myMidtransClientKey = "your-client-key-goes-here"; //change this according to your client-key

    const script = document.createElement("script");
    script.src = snapSrcUrl;
    script.setAttribute("data-client-key", myMidtransClientKey);
    script.async = true;

    document.body.appendChild(script);
  });

  return (
    <>
      <div class="bg-gray-50 bg-opacity-25 min-h-screen text-gray-700 overflow-x-hidden">
        <div
          class="z-[99999] bg-black bg-opacity-25 fixed top-0 left-0 right-0 bottom-0 lg:hidden"
          classList={{
            hidden: !showSidebar(),
          }}
          onClick={toggleSidebar}
        ></div>
        <div
          class="fixed top-0 bottom-0 left-0 w-80 bg-primary rounded-r-lg text-white z-[99999] p-10 px-8 flex flex-col justify-between transform transition lg:translate-x-0"
          classList={{
            "-translate-x-full": !showSidebar(),
          }}
        >
          <div>
            <div class="inline-flex items-center gap-x-3 bg-white text-gray-800 rounded-full px-5 p-2 shadow">
              <img
                src="https://polije.ac.id/wp-content/uploads/elementor/thumbs/LOGO-POLITEKNIK-NEGERI-JEMBER-200x200-p501e8qsx93hro564g7wmlj5f1d6bn1idluqt46f2o.png"
                class="w-12 h-12"
              />
              <div class="border-l pl-3 flex-1 truncate">
                <div class="text-lg font-extrabold">LostInfo.</div>
                <div class="text-xs truncate">
                  Platform Informasi Barang Hilang
                </div>
              </div>
            </div>
            <div class="mt-10 -mx-8">
              <ul>
                <For each={menus}>
                  {(item) => (
                    <li class="mb-1 relative px-8">
                      <A
                        href={item.path}
                        class="p-2 px-3 block rounded flex items-center hover:bg-white hover:bg-opacity-25 transition"
                        classList={{
                          "text-primary mb-1 bg-white !bg-opacity-100":
                            checkActive(item.path),
                        }}
                        onClick={toggleSidebar}
                      >
                        <item.icon class="w-5 h-5 mr-3" />
                        {item.title}
                      </A>
                      <div
                        class="h-full w-1 bg-white rounded-r absolute top-0 left-0 bottom-0 transform origin-left transition"
                        classList={{
                          "scale-100": checkActive(item.path),
                          "scale-0": !checkActive(item.path),
                        }}
                      ></div>
                    </li>
                  )}
                </For>
                <li class="mb-1 relative px-8">
                  <button
                    type="button"
                    class="p-2 px-3 block rounded flex items-center hover:bg-white hover:bg-opacity-25 space-x-3 w-full"
                    onClick={() => setModalLogout(true)}
                  >
                    <LogoutIcon class="w-5 h-5 mr-3" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <div class="text-sm">
              Made with <LoveIcon class="w-4 h-4 text-red-500 inline" /> by
              HockGuan
            </div>
            <div class="font-semibold mt-2 text-sm">
              LostInfo - 2023 &copy; All rights reserved.
            </div>
          </div>
        </div>
        <div class="lg:ml-80 p-3 min-h-screen flex flex-col">
          <div class="flex justify-between mb-5 items-center">
            <button
              class="lg:hidden mr-4 bg-white p-2 rounded shadow-sm"
              onClick={toggleSidebar}
            >
              <MenuIcon class="w-6 h-6" />
            </button>
            <div class="lg:flex-1 w-2/3">
              <Autocomplete
                placeholder="Cari Sesuatu..."
                classList={{ "mt-2 rounded": true }}
                options={menus.map((item) => ({
                  text: item.title,
                  value: item.path,
                  onClick: () => {
                    nav(item.path);
                  },
                }))}
              />
            </div>
            <div class="flex-1 flex justify-between items-center">
              <div class="lg:grow"></div>
              <A
                href="/user/akun"
                class="block items-center inline-flex justify-end space-x-4 lg:bg-white lg:p-2 rounded lg:px-6 lg:shadow-sm"
              >
                <div class="lg:block hidden">{auth()?.username}</div>
                <img
                  src={auth().foto_url}
                  alt={auth().nama}
                  class="block rounded-full !w-10 !h-10 bg-gray-200"
                />
              </A>
            </div>
          </div>
          <Modal show={modalLogout()} onClose={() => setModalLogout(false)}>
            <form onSubmit={logout} class="max-w-full w-[500px]">
              <div class="font-semibold mb-3">Logout</div>
              <p>Anda yakin akan logout? Sesi anda akan berakhir!</p>
              <div class="mt-8 flex items-center justify-end">
                <Button type="submit" variant="red">
                  Keluar
                </Button>
              </div>
            </form>
          </Modal>
          <div class="grow flex flex-col content-yield">{props.children}</div>
        </div>
      </div>
    </>
  );
}
