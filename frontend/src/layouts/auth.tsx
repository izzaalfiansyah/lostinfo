import { JSX } from "solid-js";

export default function (props: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div class="bg-primary min-h-screen overflow-x-hidden flex flex-col items-center lg:justify-center justify-end lg:p-5 py-10 lg:pb-10 pb-0">
      {/* <div class="text-3xl font-semibold mb-8 text-center text-white">
        LostInfo<span class="">.</span>
      </div> */}
      <div class="mb-8 inline-flex items-center gap-x-3 bg-white text-gray-800 rounded-full px-6 p-2 shadow">
        <img
          src="https://polije.ac.id/wp-content/uploads/elementor/thumbs/LOGO-POLITEKNIK-NEGERI-JEMBER-200x200-p501e8qsx93hro564g7wmlj5f1d6bn1idluqt46f2o.png"
          class="w-12 h-12"
        />
        <div class="border-l pl-3 flex-1 truncate">
          <div class="text-lg font-extrabold">LostInfo.</div>
          <div class="text-xs truncate">Platform Informasi Barang Hilang</div>
        </div>
      </div>
      {props.children}
    </div>
  );
}
