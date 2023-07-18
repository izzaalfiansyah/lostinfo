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
          class="w-full h-10 border border-gray-100 file:h-10 file:w-10 file:mr-3 file:opacity-0 focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary focus:ring-opacity-10 border-gray-100 transition disabled:bg-gray-100 cursor-pointer"
          {...others}
        />
      </div>
      <Show when={local.hint}>
        <div class="text-xs text-gray-400">{local.hint}</div>
      </Show>
    </div>
  );
}
