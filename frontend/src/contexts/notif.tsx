import { JSX, createContext, createSignal, useContext } from "solid-js";

interface Props {
  children: JSX.Element;
}

interface ValProps {
  show: (message: string, success?: boolean) => void;
}

const NotifContext = createContext();

export default function NotifProvider(props: Props) {
  const [show, setShow] = createSignal<boolean>(false);
  const [color, setColor] = createSignal<string>("");
  const [message, setMessage] = createSignal<string>("");

  const value: ValProps = {
    show: (message: string, success: boolean = true) => {
      setShow(true);
      setColor(success ? "bg-green-500" : "bg-red-500");
      setMessage(message);

      setTimeout(() => {
        setMessage(""), setShow(false);
      }, 3000);
    },
  };

  return (
    <NotifContext.Provider value={value}>
      {props.children}
      <div
        class="fixed bottom-5 left-5 right-5 z-[100000] flex justify-center transform transition duration-500"
        classList={{
          "translate-y-0": show(),
          "translate-y-[100px]": !show(),
        }}
      >
        <div
          class={`rounded-lg text-white p-4 px-5 max-w-full w-[800px] ${color()}`}
        >
          {message()}
        </div>
      </div>
    </NotifContext.Provider>
  );
}

export function useNotif() {
  return useContext<ValProps>(NotifContext as any);
}
