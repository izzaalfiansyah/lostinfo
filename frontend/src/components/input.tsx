import { JSX, Show, splitProps } from "solid-js";

interface Props extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  prepend?: JSX.Element;
  append?: JSX.Element;
}

export default function (props: Props) {
  const [local, others] = splitProps(props, ["label", "hint"]);

  return (
    <div class="mb-2">
      <InputLabel {...others}>{local.label}</InputLabel>
      <div class="relative flex items-center">
        {props.prepend}
        <input
          class="grow"
          classList={{
            "focus:ring-2 focus:ring-purple-300 border-gray-200 transition py-1.5 disabled:bg-gray-100":
              others.type != "file",
          }}
          {...others}
        />
        {props.append}
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
