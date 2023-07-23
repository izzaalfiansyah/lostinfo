import { JSX, Show, splitProps } from "solid-js";
import { InputLabel } from "./input";
import { LinkIcon } from "./icons";

interface Props extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export default function (props: Props) {
  const [local, others] = splitProps(props, ["label", "hint"]);

  return (
    <div class="mb-2">
      <InputLabel {...others}>{local.label}</InputLabel>
      <div class="relative">
        <div class="absolute top-0 left-0 w-10 h-10 pointer-events-none bg-primary text-white flex items-center justify-center cursor-pointer">
          <LinkIcon class="w-5 h-5" />
        </div>
        <input
          type="file"
          class="solid-input file:h-10 file:w-10 file:mr-3 file:opacity-0 cursor-pointer !py-0 !px-0"
          {...others}
        />
      </div>
      <Show when={local.hint}>
        <div class="text-xs text-gray-400">{local.hint}</div>
      </Show>
    </div>
  );
}
