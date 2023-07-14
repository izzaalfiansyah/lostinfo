import { JSX, Show, splitProps } from "solid-js";

interface Props extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export default function (props: Props) {
  const [local, others] = splitProps(props, ["label", "hint"]);

  return (
    <div class="mb-2">
      <Show when={local.label}>
        <label for="">{local.label}</label>
      </Show>
      <input
        class="w-full"
        classList={{
          "rounded focus:ring-2 focus:ring-purple-300 border-gray-200 transition py-1.5":
            others.type != "file",
        }}
        {...others}
      />
      <Show when={local.hint}>
        <div class="text-xs text-gray-400">{local.hint}</div>
      </Show>
    </div>
  );
}
