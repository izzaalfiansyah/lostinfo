import { Slot, component$ } from "@builder.io/qwik";

interface Props {
  title: string;
  subtitle: string;
}

export default component$<Props>((props) => {
  return (
    <div class="py-3 mb-3 flex lg:items-center justify-between lg:flex-row flex-col">
      <div>
        <div class="text-xl font-bold">{props.title}</div>
        <p class="text-sm">{props.subtitle}</p>
      </div>

      <Slot name="action" />
    </div>
  );
});
