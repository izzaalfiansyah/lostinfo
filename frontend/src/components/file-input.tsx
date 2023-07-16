import { JSX, Show, splitProps } from "solid-js";
import { InputLabel } from "./input";

interface Props extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export default function (props: Props) {
  const [local, others] = splitProps(props, ["label", "hint"]);

  return (
    <div class="mb-2">
      <InputLabel {...others}>{local.label}</InputLabel>
      <input
        type="file"
        class="w-full h-10 border border-gray-200 file:border-none file:text-white file:h-10 file:px-3 file:bg-purple-500 file:mr-3 focus:outline-none focus:ring-2 focus:ring-purple-300 transition disabled:bg-gray-100 focus:border-purple-500"
        {...others}
      />
      <Show when={local.hint}>
        <div class="text-xs text-gray-400">{local.hint}</div>
      </Show>
    </div>
  );
}
