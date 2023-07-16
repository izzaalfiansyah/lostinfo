import { JSX, Show, splitProps } from "solid-js";

interface Props extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: JSX.Element;
}

export default function (props: Props) {
  const [{ label }, others] = splitProps(props, ["label"]);

  return (
    <div class="mb-2">
      <label class="inline-flex items-center">
        <input
          type="checkbox"
          class="rounded border-gray-200 text-purple-500 focus:ring focus:ring-purple-100 focus:border-purple-500 transition"
          {...others}
        />
        <Show when={label}>
          <span class="ml-1">{label}</span>
        </Show>
      </label>
    </div>
  );
}
