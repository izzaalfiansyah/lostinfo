import { $, component$, Slot, useContext, useSignal } from "@builder.io/qwik";
import { Link, useLocation, useNavigate } from "@builder.io/qwik-city";
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
import { AuthContext } from "~/contexts/auth";
import { NotifContext } from "~/contexts/notif";

export default component$(() => {
  const location = useLocation();
  const modalLogout = useSignal<boolean>(false);
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
      path: "/user/",
    },
    {
      icon: ArchiveXIcon,
      title: "Data Barang Hilang",
      path: "/barang-hilang/",
    },
    {
      icon: ArchiveIcon,
      title: "Data Barang Temuan",
      path: "/barang-temuan/",
    },
    {
      icon: StackIcon,
      title: "Testimoni",
      path: "/testimoni/",
    },
    {
      icon: AccountIcon,
      title: "Akun",
      path: "/akun/",
    },
  ];

  const showSidebar = useSignal<boolean>(false);

  const auth = useContext(AuthContext);
  const notif = useContext(NotifContext);

  const nav = useNavigate();

  const toggleSidebar = $(() => {
    showSidebar.value = !showSidebar.value;
  });

  const logout = $(() => {
    auth.value = 0;
    notif.show("berhasil logout");
    nav("/login");
  });

  return (
    <>
      <div class="bg-gray-100 min-h-screen text-gray-700 overflow-x-hidden">
        <div
          class={[
            "z-5 bg-black bg-opacity-25 fixed top-0 left-0 right-0 bottom-0 lg:hidden",
            showSidebar.value ? "" : "hidden",
          ]}
          preventdefault:click
          onClick$={toggleSidebar}
        ></div>
        <div
          class={[
            "fixed top-0 bottom-0 left-0 w-80 bg-white z-5 p-10 px-8 flex flex-col justify-between transform transition lg:translate-x-0",
            showSidebar.value ? "" : "-translate-x-full",
          ]}
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
                {menus.map((item, index) => (
                  <li class="mb-1 relative px-8" key={"menu" + index}>
                    <Link
                      href={item.path}
                      class={[
                        "p-2 px-3 block rounded flex items-center transition",
                        item.path == location.url.pathname
                          ? "text-purple-600 mb-1 bg-purple-200"
                          : "",
                      ]}
                      onClick$={toggleSidebar}
                    >
                      <item.icon class="w-5 h-5 mr-3" />
                      {item.title}
                    </Link>
                    <div
                      class={[
                        "h-full w-1 bg-purple-500 rounded-r absolute top-0 left-0 bottom-0 transform origin-left transition",
                        item.path == location.url.pathname
                          ? "scale-100"
                          : "scale-0",
                      ]}
                    ></div>
                  </li>
                ))}
                <li class="mb-1 relative px-8">
                  <a
                    href="#"
                    class="p-2 px-3 block rounded flex items-center space-x-3"
                    preventdefault:click
                    onClick$={() => (modalLogout.value = true)}
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
            <button class="lg:hidden mr-4" onClick$={toggleSidebar}>
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
                <div class="lg:block hidden">
                  Hello, {(auth.value as any).username}
                </div>
                <div class="rounded-full w-12 h-12 bg-gray-200"></div>
              </div>
            </div>
          </div>
          <Modal
            show={modalLogout.value}
            onClose$={() => (modalLogout.value = false)}
          >
            <form
              preventdefault:submit
              onSubmit$={logout}
              class="max-w-full w-[500px]"
            >
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
          <Slot />
        </div>
      </div>
    </>
  );
});