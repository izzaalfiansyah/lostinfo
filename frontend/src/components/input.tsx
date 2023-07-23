import { JSX, Show, splitProps } from "solid-js";

interface Props extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  prepend?: JSX.Element;
  append?: JSX.Element;
  tel?: boolean;
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
      <InputLabel required={props.required}>{local.label}</InputLabel>
      <div class="flex flex-row">
        <div class="h-10">{local.prepend}</div>
        <input
          class="solid-input"
          classList={{ "tel-input": props.tel }}
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
