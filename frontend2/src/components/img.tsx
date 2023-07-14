import { JSX, Show, splitProps } from "solid-js";

interface Props extends JSX.ImgHTMLAttributes<HTMLImageElement> {
  src: any;
  alt: any;
}

export default (props: Props) => {
  const [{ class: classList }, others] = splitProps(props, ["class"]);

  return (
    <Show when={others.src} fallback={<div class={classList}></div>}>
      <a
        href={others.src}
        target="_blank"
        class={
          "inline-block overflow-hidden rounded-lg " + (classList as string)
        }
      >
        <img
          class="w-full h-full object-cover transition hover:scale-110"
          {...others}
        />
      </a>
    </Show>
  );
};
