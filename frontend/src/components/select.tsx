import { JSX, Show, splitProps } from "solid-js";
import { InputLabel } from "./input";

interface Props extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
}

export default function (props: Props) {
  const [local, others] = splitProps(props, ["label", "hint"]);

  return (
    <div class="mb-2">
      <InputLabel {...others}>{local.label}</InputLabel>
      <select
        class="w-full h-10 focus:ring-2 focus:border-primary focus:ring-primary focus:ring-opacity-10 border-gray-100 transition p-1.5 px-3 disabled:bg-gray-100 focus:outline-none"
        {...others}
      ></select>
      <Show when={local.hint}>
        <div class="text-xs text-gray-400">{local.hint}</div>
      </Show>
    </div>
  );
}
