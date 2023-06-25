import { type HTMLAttributes, component$ } from "@builder.io/qwik";

interface Props extends HTMLAttributes<HTMLDivElement> {
  src: any;
  alt: any;
}

export default component$((props: Props) => {
  const { src, alt, class: classList, ...other } = props;

  return (
    <a
      href={src}
      target="_blank"
      class={["inline-block overflow-hidden rounded-lg", classList as string]}
    >
      <img
        src={src}
        alt={alt}
        class="w-full h-full object-cover transition transform hover:scale-110"
        {...(other as any)}
      />
    </a>
  );
});
