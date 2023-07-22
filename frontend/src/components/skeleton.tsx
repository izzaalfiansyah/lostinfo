import { JSX, splitProps } from "solid-js";

export default function (props: JSX.HTMLAttributes<HTMLDivElement>) {
  const [{ class: classList }, others] = splitProps(props, ["class"]);

  return (
    <div class={"bg-white overflow-hidden relative " + classList}>
      <div
        class="animate-pulse bg-gray-100 text-transparent absolute top-0 left-0 right-0 bottom-0"
        {...others}
      ></div>
    </div>
  );
}
