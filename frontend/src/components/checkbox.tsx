import { JSX, Show, splitProps } from "solid-js";

interface Props extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: JSX.Element;
}

export default function (props: Props) {
  const [{ label }, others] = splitProps(props, ["label"]);

  return (
    <div class="mb-2">
      <label class="inline-flex">
        <input
          type="checkbox"
          class="rounded border-gray-200 text-primary focus:ring-2 focus:ring-primary focus:ring-opacity-10 focus:border-primary transition"
          {...others}
        />
        <Show when={label}>
          <span class="ml-2 -mt-1">{label}</span>
        </Show>
      </label>
    </div>
  );
}
