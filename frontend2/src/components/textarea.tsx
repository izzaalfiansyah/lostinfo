import { JSX, Show, splitProps } from "solid-js";

interface Props extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
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
      <textarea
        class="w-full rounded focus:ring-2 focus:ring-purple-300 border-gray-200 transition resize-none p-1.5 px-3"
        {...others}
      />
      <Show when={local.hint}>
        <div class="text-xs text-gray-400">{local.hint}</div>
      </Show>
    </div>
  );
}
