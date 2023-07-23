import { JSX, Show, splitProps } from "solid-js";

interface Props extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  prepend?: JSX.Element;
  append?: JSX.Element;
}

export default function (props: Props) {
  const [local, others] = splitProps(props, [
    "label",
    "hint",
    "prepend",
    "append",
  ]);

  return (
    <div class="mb-2">
      <InputLabel {...others}>{local.label}</InputLabel>
      <div class="flex flex-row">
        <div class="h-10">{local.prepend}</div>
        <input
          class="w-full h-10 focus:ring-2 focus:border-primary focus:ring-primary focus:ring-opacity-10 border-gray-100 transition py-1.5 disabled:bg-gray-100 focus:outline-none"
          {...others}
        />
        <div class="h-10">{local.append}</div>
      </div>
      <Show when={local.hint}>
        <div class="text-xs text-gray-400">{local.hint}</div>
      </Show>
    </div>
  );
}

export function InputLabel(props: any) {
  return (
    <Show when={props.children}>
      <label for="">
        {props.children}
        <Show when={props.required}>
          <span class="text-red-500 ml-0.5">*</span>
        </Show>
      </label>
    </Show>
  );
}
