import { For, JSX } from "solid-js";
import { A, useLocation } from "solid-start";
import {
  AccountIcon,
  ArchiveIcon,
  ArchiveXIcon,
  HomeIcon,
  LogoutIcon,
} from "~/components/icons";

export default function (props: JSX.HTMLAttributes<HTMLDivElement>) {
  const menus = [
    {
      path: "/user",
      title: "Home",
      icon: <HomeIcon class="w-5 h-5" />,
    },
    {
      path: "/user/barang-hilang",
      title: "Barang Hilang",
      icon: <ArchiveXIcon class="w-5 h-5" />,
    },
    {
      path: "/user/barang-temu",
      title: "Barang Temuan",
      icon: <ArchiveIcon class="w-5 h-5" />,
    },
    {
      path: "/user/akun",
      title: "Akun",
      icon: <AccountIcon class="w-5 h-5" />,
    },
  ];

  const loc = useLocation();

  const checkActive = (path: string) => {
    if (path == "/user") {
      if (loc.pathname == "/user") {
        return true;
      }
    } else {
      return loc.pathname.includes(path);
    }
  };

  return (
    <div class="min-h-screen bg-gray-50 bg-opacity-25">
      <div class="p-3 w-full min-h-screen flex flex-col">
        <div class="grow h-full pb-20 flex flex-col relative">
          {props.children}
        </div>
      </div>
      <div class="fixed bottom-0 left-0 right-0 flex justify-evenly bg-white h-20 rounded-t-lg shadow z-[99999] fixed items-center">
        <For each={menus}>
          {(item) => (
            <A
              href={item.path}
              class="block p-4 rounded-full text-gray-700 hover:bg-gray-50 transition hover:bg-primary hover:bg-opacity-10 hover:bg-opacity-10 origin-center ease-in"
              classList={{ "!bg-primary !text-white": checkActive(item.path) }}
            >
              {item.icon}
            </A>
          )}
        </For>
      </div>
    </div>
  );
}
