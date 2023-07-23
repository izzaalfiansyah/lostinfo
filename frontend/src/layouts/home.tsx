import { A } from "@solidjs/router";
import { JSX } from "solid-js";
import { LogoutIcon } from "~/components/icons";

export default function (props: { children: JSX.Element }) {
  return (
    <div class="bg-primary min-h-screen overflow-x-hidden">
      <div class="px-5 flex items-center justify-between bg-primary fixed top-0 left-0 right-0 h-28 z-[99999]">
        <div class="inline-flex items-center gap-x-3 bg-white text-gray-800 rounded-full px-6 p-2 shadow">
          <img
            src="https://polije.ac.id/wp-content/uploads/elementor/thumbs/LOGO-POLITEKNIK-NEGERI-JEMBER-200x200-p501e8qsx93hro564g7wmlj5f1d6bn1idluqt46f2o.png"
            class="w-12 h-12"
          />
          <div class="border-l pl-3 flex-1 truncate lg:block hidden">
            <div class="text-lg font-extrabold">LostInfo.</div>
            <div class="text-xs truncate">Platform Informasi Barang Hilang</div>
          </div>
        </div>
        <A href="/login" class="text-white">
          <LogoutIcon class="w-10 h-10" />
        </A>
      </div>
      {/* <div class="lg:px-2 pb-2 px-1 grow flex flex-col"> */}
      <div class="min-h-screen flex flex-col bg-gray-50 rounded-t-2xl p-5 mt-28">
        {props.children}
      </div>
      {/* </div> */}
    </div>
  );
}
