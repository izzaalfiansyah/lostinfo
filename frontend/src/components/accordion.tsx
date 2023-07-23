import { Show, createSignal, splitProps } from "solid-js";
import Card, { CardProps } from "./card";
import { ChevronLeftIcon } from "./icons";

export default function (props: CardProps) {
  const [show, setShow] = createSignal(false);
  const [local, others] = splitProps(props, ["children"]);

  return (
    <Card
      {...others}
      action={
        <button
          type="button"
          class="rounded-full p-1 hover:bg-gray-50 transition"
          classList={{ "bg-gray-50 -rotate-90": show() }}
          onClick={() => setShow(!show())}
        >
          <ChevronLeftIcon class="w-4 h-4" />
        </button>
      }
    >
      <Show when={show()}>{local.children}</Show>
    </Card>
  );
}
