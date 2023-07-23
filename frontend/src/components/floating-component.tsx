import { splitProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

export default function (props: JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <div
      class={
        "flex fixed bottom-10 justify-end left-10 right-10 z-[99998] pointer-events-none " +
        local.class
      }
    >
      <div class="flex flex-col gap-2 pointer-events-auto" {...others}></div>
    </div>
  );
}
