import { For, JSX, createSignal, onMount } from "solid-js";
import { A, useLocation, useNavigate } from "solid-start";
import {
  AccountIcon,
  ArchiveIcon,
  ArchiveXIcon,
  HomeIcon,
  LogoutIcon,
  LoveIcon,
  MenuIcon,
  StackIcon,
  UsersIcon,
} from "~/components/icons";
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
      title: "Dashboard",
      path: "/",
    },
    {
      icon: UsersIcon,
      title: "Data User",
      path: "/user",
    },
    {
      icon: ArchiveXIcon,
      title: "Data Barang Hilang",
      path: "/barang-hilang",
    },
    {
      icon: ArchiveIcon,
      title: "Data Barang Temu",
      path: "/barang-temu",
    },
    {
      icon: StackIcon,
      title: "Testimoni",
      path: "/testimoni",
    },
    {
      icon: AccountIcon,
      title: "Akun",
      path: "/akun",
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
    if (path == "/") {
      if (path == "/" && loc.pathname == "/") {
        return true;
      }
    } else {
      return loc.pathname.includes(path);
    }
  };

  const logout = () => {
    authFn.logout();
    nav("/login");
  };

  onMount(() => {
    if (!auth()) {
      nav("/login");
    }
  });

  return (
    <>
      <div class="bg-gray-100 min-h-screen text-gray-700 overflow-x-hidden">
        <div
          class="z-[99999] bg-black bg-opacity-25 fixed top-0 left-0 right-0 bottom-0 lg:hidden"
          classList={{
            hidden: !showSidebar(),
          }}
          onClick={toggleSidebar}
        ></div>
        <div
          class="fixed top-0 bottom-0 left-0 w-80 bg-white z-[99999] p-10 px-8 flex flex-col justify-between transform transition lg:translate-x-0"
          classList={{
            "-translate-x-full": !showSidebar(),
          }}
        >
          <div>
            <div class="text-4xl font-extrabold">
              LostInfo<span class="text-purple-500">.</span>
            </div>
            <div class="text-sm text-gray-300">
              Platform Informasi Barang Hilang
            </div>
            <div class="mt-10 -mx-8">
              <ul>
                <For each={menus}>
                  {(item) => (
                    <li class="mb-1 relative px-8">
                      <A
                        href={item.path}
                        class="p-2 px-3 block rounded flex items-center transition"
                        classList={{
                          "text-purple-600 mb-1 bg-purple-200": checkActive(
                            item.path
                          ),
                        }}
                        onClick={toggleSidebar}
                      >
                        <item.icon class="w-5 h-5 mr-3" />
                        {item.title}
                      </A>
                      <div
                        class="h-full w-1 bg-purple-500 rounded-r absolute top-0 left-0 bottom-0 transform origin-left transition"
                        classList={{
                          "scale-100": checkActive(item.path),
                          "scale-0": !checkActive(item.path),
                        }}
                      ></div>
                    </li>
                  )}
                </For>
                <li class="mb-1 relative px-8">
                  <a
                    href="#"
                    class="p-2 px-3 block rounded flex items-center space-x-3"
                    onClick={() => setModalLogout(true)}
                  >
                    <LogoutIcon class="w-5 h-5 mr-3" />
                    Logout
                  </a>
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
        <div class="lg:ml-80 p-5">
          <div class="flex justify-between mb-5 items-center">
            <button class="lg:hidden mr-4" onClick={toggleSidebar}>
              <MenuIcon class="w-6 h-6" />
            </button>
            <input
              type="text"
              class="bg-white rounded p-2.5 px-4 outline-none flex-1 border-gray-200 transition focus:ring-purple-300 focus:ring-2 mr-5"
              placeholder="Cari Sesuatu..."
            />
            <div class="flex-1 flex justify-between items-center">
              <div class="flex-1"></div>
              <div class="flex-1 items-center flex justify-end space-x-4 border-l-2">
                <div class="lg:block hidden">Hello, {auth()?.username}</div>
                <img
                  src={auth().foto_url}
                  alt={auth().nama}
                  class="block rounded-full w-12 h-12 bg-gray-200"
                />
              </div>
            </div>
          </div>
          <Modal show={modalLogout()} onClose={() => setModalLogout(false)}>
            <form onSubmit={logout} class="max-w-full w-[500px]">
              <div class="font-semibold mb-3">Logout</div>
              <p>Anda yakin akan logout? Sesi anda akan berakhir!</p>
              <div class="mt-8 flex items-center justify-end">
                <button
                  type="submit"
                  class="px-4 py-2 bg-red-500 rounded shadow-sm text-white"
                >
                  Keluar
                </button>
              </div>
            </form>
          </Modal>
          {props.children}
        </div>
      </div>
    </>
  );
}
