import { JSX, splitProps } from "solid-js";

interface Props extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "red";
}

export default function (props: Props) {
  const [{ class: classList }, others] = splitProps(props, ["class"]);

  return (
    <button
      type="button"
      class={
        "text-white hover:bg-opacity-80 focus:ring-4 focus:ring-opacity-10 rounded px-6 py-2 focus:outline-none disabled:!bg-opacity-50 " +
        classList
      }
      classList={{
        "!text-gray-900 bg-white border border-gray-200 focus:ring-gray-500 hover:bg-gray-100 hover:!bg-opacity-100":
          !others.variant,
        "bg-primary focus:ring-primary": others.variant == "primary",
        "bg-red-500 focus:ring-red-500": others.variant == "red",
      }}
      {...others}
    ></button>
  );
}
