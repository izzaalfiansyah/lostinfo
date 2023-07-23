import { JSX, JSXElement, Show, splitProps } from "solid-js";

export interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  title?: string;
  action?: JSXElement;
}

export default function (props: CardProps) {
  const [local, others] = splitProps(props, [
    "class",
    "title",
    "children",
    "action",
  ]);
  return (
    <div class={"bg-white rounded-lg shadow-sm p-5 " + local.class} {...others}>
      <Show when={local.title}>
        <div class="flex items-center justify-between mb-5">
          <div class="font-semibold">{local.title}</div>
          {local.action}
        </div>
      </Show>
      {local.children}
    </div>
  );
}
