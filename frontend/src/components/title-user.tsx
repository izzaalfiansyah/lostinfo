import { JSX } from "solid-js";

export default function (props: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      class="bg-white rounded shadow-sm p-3 mb-3 text-center text-lg font-semibold border-t-4 border-primary"
      {...props}
    ></div>
  );
}
