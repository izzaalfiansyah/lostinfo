import { JSX, Show, splitProps } from "solid-js";
import { InputLabel } from "./input";

interface Props extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
}

export default function (props: Props) {
  const [local, others] = splitProps(props, ["label", "hint"]);

  return (
    <div class="mb-2">
      <InputLabel {...others}>{local.label}</InputLabel>
      <textarea
        class="w-full focus:ring-2 focus:border-primary focus:ring-primary focus:ring-opacity-10 border-gray-100 transition resize-none p-1.5 px-3  focus:outline-none disabled:bg-gray-100"
        {...others}
      />
      <Show when={local.hint}>
        <div class="text-xs text-gray-400">{local.hint}</div>
      </Show>
    </div>
  );
}
