import {
  JSX,
  Show,
  createContext,
  createEffect,
  createSignal,
  useContext,
} from "solid-js";
import { XIcon } from "../components/icons";
import { useSearchParams } from "solid-start";

interface ValueProps {
  show: (img: string) => void;
}

const DialogImgContext = createContext();

export default function DialogImgProvider(props: { children: JSX.Element }) {
  const [show, setShow] = createSignal(false);
  const [img, setImg] = createSignal("");

  const [searchParams, setSearchParams] = useSearchParams();

  const handleClose = () => {
    setImg("");
    setShow(false);
  };

  const value: ValueProps = {
    show: (img: string) => {
      setImg(img);
      setShow(true);
    },
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
    if (oldVal != show()) {
      if (show() == true) {
        setSearchParams({ m: 1 });
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("popstate", handlePopState);
      } else {
        window.removeEventListener("popstate", handlePopState);
        window.removeEventListener("keydown", handleKeyDown);
      }
    }

    return show();
  });

  return (
    <DialogImgContext.Provider value={value}>
      <Show when={show()}>
        <div class="bg-black bg-opacity-50 flex items-center justify-center py-16 px-5 fixed top-0 bottom-0 left-0 right-0 z-[100003]">
          <button
            type="button"
            class="absolute top-5 right-5 p-0.5 bg-white text-gray-700 rounded hover:bg-gray-100 transition"
            onClick={(e: Event) => {
              e.preventDefault();
              window.history.back();
              handleClose();
            }}
          >
            <XIcon class="w-5 h-5" />
          </button>
          <img src={img()} alt={img()} class="max-w-full max-h-full" />
        </div>
      </Show>
      {props.children}
    </DialogImgContext.Provider>
  );
}

export function useDialogImg() {
  return useContext<ValueProps>(DialogImgContext as any);
}
