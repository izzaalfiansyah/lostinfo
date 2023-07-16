import { JSX, Show, createEffect } from "solid-js";
import { useSearchParams } from "solid-start";

interface Props extends JSX.HTMLAttributes<HTMLDivElement> {
  title?: any;
  show: boolean;
  onClose?: Function;
}

export default function (props: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleClose = () => {
    props.onClose && props.onClose();
  };

  const handlePopState = (e: Event) => {
    e.preventDefault();
    handleClose();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key == "Escape") {
      window.history.back();
      handleClose();
    }
  };

  createEffect((oldVal) => {
    if (oldVal != props.show) {
      if (props.show == true) {
        setSearchParams({ m: 1 });
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("popstate", handlePopState);
      } else {
        window.removeEventListener("popstate", handlePopState);
        window.removeEventListener("keydown", handleKeyDown);
      }
    }

    return props.show;
  });

  return (
    <>
      <Show when={props.show}>
        <div class="fixed top-0 left-0 right-0 bottom-0 z-[100000] flex items-center justify-center overflow-y-auto p-5">
          <div
            class="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50"
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
              handleClose();
            }}
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
