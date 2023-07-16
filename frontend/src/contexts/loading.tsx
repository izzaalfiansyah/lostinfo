import { JSX, Show, createContext, createSignal, useContext } from "solid-js";
import { LoadIcon } from "~/components/icons";

const LoadingContext = createContext();

interface ValProps {
  show: () => void;
  hide: () => void;
}

export default function LoadingProvider(props: { children: JSX.Element }) {
  const [show, setShow] = createSignal<boolean>(false);

  const value: ValProps = {
    show: () => {
      setShow(true);
    },
    hide: () => {
      setShow(false);
    },
  };

  return (
    <LoadingContext.Provider value={value}>
      {props.children}
      <Show when={show()}>
        <div class="bg-black bg-opacity-25 fixed top-0 left-0 right-0 bottom-0 z-[100001] flex items-center justify-center">
          <div class="bg-white p-3 flex items-center justify-center space-x-3 rounded-full">
            <LoadIcon class="w-6 h-6 text-purple-600 animate-spin" />
          </div>
        </div>
      </Show>
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext<ValProps>(LoadingContext as any);
}
