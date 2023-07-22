import { JSX } from "solid-js/jsx-runtime";

export default function (props: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div class="flex fixed bottom-10 justify-end left-10 right-10 z-[99998] pointer-events-none">
      <div class="flex flex-col gap-2 pointer-events-auto" {...props}></div>
    </div>
  );
}
