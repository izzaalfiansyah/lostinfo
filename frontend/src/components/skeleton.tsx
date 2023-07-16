import { JSX, splitProps } from "solid-js";

export default function (props: JSX.HTMLAttributes<HTMLDivElement>) {
  const [{ class: classList }, others] = splitProps(props, ["class"]);

  return (
    <div
      class={"animate-pulse bg-gray-100 text-transparent " + classList}
      {...others}
    ></div>
  );
}
