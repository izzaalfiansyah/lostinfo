import { JSX, Show } from "solid-js";

interface Props extends JSX.HTMLAttributes<HTMLDivElement> {
  title?: any;
  show: boolean;
  onClose?: Function;
}

export default function (props: Props) {
  const handleClick = () => {
    props.onClose && props.onClose();
  };

  return (
    <>
      <Show when={props.show}>
        <div class="fixed top-0 left-0 right-0 bottom-0 z-40 flex items-center justify-center overflow-y-auto p-5">
          <div
            class="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-25"
            onClick={handleClick}
          ></div>
          <div class="bg-white rounded-lg shadow-sm p-5 max-w-full relative max-h-full overflow-y-auto">
            <Show when={props.title}>
              <div class="font-semibold mb-5">{props.title}</div>
            </Show>
            {props.children}
          </div>
        </div>
      </Show>
    </>
  );
}
