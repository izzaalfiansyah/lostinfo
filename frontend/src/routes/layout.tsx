import { $, component$, Slot, useSignal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
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

export default component$(() => {
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
      title: "Data Barang Temuan",
      path: "/barang-temuan",
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

  const showSidebar = useSignal<boolean>(false);

  const toggleSidebar = $(() => {
    showSidebar.value = !showSidebar.value;
  });

  return (
    <div class="bg-gray-100 min-h-screen text-gray-700">
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
            LostInfo<span class="text-green-500">.</span>
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
                      "p-2 px-3 block rounded flex items-center",
                      item.path == "/"
                        ? "text-green-600 mb-1 bg-green-200"
                        : "",
                    ]}
                  >
                    <item.icon class="w-5 h-5 mr-3" />
                    {item.title}
                  </Link>
                  {item.path == "/" && (
                    <div class="h-full w-1 bg-green-500 rounded-r absolute top-0 left-0 bottom-0"></div>
                  )}
                </li>
              ))}
              <li class="mb-1 relative px-8">
                <a
                  href="#"
                  class="p-2 px-3 block rounded flex items-center space-x-3"
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
            class="bg-white rounded p-2.5 px-4 outline-none flex-1"
            placeholder="Cari..."
          />
          <div class="flex-1 flex justify-between items-center">
            <div class="flex-1"></div>
            <div class="flex-1 items-center flex justify-end space-x-4 border-l-2">
              <div class="lg:block hidden">Hello, Superadmin</div>
              <div class="rounded-full w-12 h-12 bg-gray-200"></div>
            </div>
          </div>
        </div>
        <Slot />
      </div>
    </div>
  );
});
