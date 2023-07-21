import { JSX } from "solid-js/jsx-runtime";

export default function (props: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      class="flex flex-col gap-2 fixed bottom-10 right-10 z-[99999]"
      {...props}
    ></div>
  );
}
