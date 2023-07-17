import { For, JSX } from "solid-js";
import { A, useLocation } from "solid-start";
import { AccountIcon, ArchiveIcon, HomeIcon } from "~/components/icons";

export default function (props: JSX.HTMLAttributes<HTMLDivElement>) {
  const menus = [
    {
      path: "/user",
      title: "Home",
      icon: <HomeIcon class="w-5 h-5" />,
    },
    {
      path: "/user/barang",
      title: "Barang",
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
    <div class="min-h-screen flex justify-center">
      <div class="sm:w-[360px] bg-gray-50 h-full shadow min-h-screen max-w-full relative">
        <div class="px-5 w-full">{props.children}</div>
        <div class="absolute bottom-0 left-0 right-0 flex justify-evenly bg-white p-1 rounded-t-lg shadow">
          <For each={menus}>
            {(item) => (
              <A
                href={item.path}
                class="block p-4 rounded-full text-gray-700 hover:bg-gray-50 transition hover:text-purple-600"
                classList={{ "text-primary": checkActive(item.path) }}
              >
                {item.icon}
              </A>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
