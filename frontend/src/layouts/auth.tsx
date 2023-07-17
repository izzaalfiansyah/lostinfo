import { JSX } from "solid-js";

export default function (props: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div class="bg-gray-100 min-h-screen overflow-x-hidden flex flex-col items-center justify-center p-5 py-10">
      <div class="text-3xl font-semibold mb-8 text-center">
        LostInfo<span class="text-primary">.</span>
      </div>
      {props.children}
    </div>
  );
}
