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
      <InputLabel required={props.required}>{local.label}</InputLabel>
      <textarea class="solid-input resize-none !h-auto" {...others} />
      <Show when={local.hint}>
        <div class="text-xs text-gray-400">{local.hint}</div>
      </Show>
    </div>
  );
}
