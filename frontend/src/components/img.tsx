import { JSX, Show, splitProps } from "solid-js";
import { useDialogImg } from "~/contexts/dialog-img";

interface Props extends JSX.ImgHTMLAttributes<HTMLImageElement> {
  src: any;
  alt: any;
}

export default (props: Props) => {
  const [{ class: classList }, others] = splitProps(props, ["class"]);
  const dialogImg = useDialogImg();

  const handleClick = () => {
    dialogImg.show(others.src);
  };

  return (
    <Show when={others.src} fallback={<div class={classList}></div>}>
      <button
        type="button"
        onClick={handleClick}
        class={"inline-block overflow-hidden rounded " + (classList as string)}
      >
        <img
          class="w-full h-full object-cover transition hover:scale-110"
          {...others}
        />
      </button>
    </Show>
  );
};
