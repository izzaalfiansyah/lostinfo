import { component$ } from "@builder.io/qwik";

interface Props {
  title: string;
  subtitle: string;
}

export default component$<Props>((props) => {
  return (
    <div class="py-3 mb-3">
      <div class="text-xl font-bold">{props.title}</div>
      <p>{props.subtitle}</p>
    </div>
  );
});
