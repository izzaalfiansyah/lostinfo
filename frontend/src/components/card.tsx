import { JSX, Show, splitProps } from "solid-js";

interface Props extends JSX.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export default function (props: Props) {
  const [{ class: classList, title, children }, others] = splitProps(props, [
    "class",
    "title",
    "children",
  ]);
  return (
    <div class={"bg-white rounded-lg shadow-sm p-5 " + classList} {...others}>
      <Show when={title}>
        <div class="font-semibold mb-5">{title}</div>
      </Show>
      {children}
    </div>
  );
}
