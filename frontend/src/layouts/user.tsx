import { JSX } from "solid-js";

export default function (props: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div class="min-h-screen flex justify-center">
      <div class="sm:w-[360px] bg-gray-50 h-full shadow min-h-screen max-w-full">
        {props.children}
      </div>
    </div>
  );
}
