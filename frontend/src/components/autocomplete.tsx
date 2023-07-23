import {
  splitProps,
  Show,
  JSX,
  For,
  createSignal,
  createEffect,
  onMount,
  onCleanup,
} from "solid-js";
import { InputLabel } from "./input";
import { createStore } from "solid-js/store";

type Value = { value: any; text: any; content?: (item: Value) => JSX.Element };

interface Props extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  onChange?: (val: any) => any;
  onInput?: (e: HTMLInputElement | any) => any;
  options: Value[];
  onAsync?: (text: string) => Promise<any>;
  text?: string;
}

export default function (props: Props) {
  const [local, others] = splitProps(props, [
    "label",
    "hint",
    "onChange",
    "value",
    "options",
    "text",
  ]);

  let inputEl: HTMLInputElement | undefined;

  const [showOption, setShowOption] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [text, setText] = createSignal("");
  const [val, setVal] = createStore({
    text: "",
    value: "",
  });

  const selectOption = (item: Value) => {
    setText(item.text);
    setVal("text", item.text);
    setVal("value", item.value);

    if (props.onChange) {
      props.onChange(item.value);
    }
  };

  const items = () => {
    if (props.onAsync) {
      return props.options;
    }

    return props.options.filter((item) =>
      item.text.toLowerCase().includes(val.text.toLowerCase())
    );
  };

  const getText = (value: any) => {
    const item = props.options.filter((item) => item.value == value)[0];

    if (item) {
      setVal("text", item?.text || "");
      console.log(val.text);
    } else if (text()) {
      setVal("text", text());
    }
  };

  createEffect((oldVal) => {
    const val = props.value;

    if (val != null && oldVal != val) {
      setVal("value", val as any);
      getText(props.value);
    }

    return val;
  });

  createEffect(() => {
    if (props.text) {
      setText(props.text);
      setVal("text", props.text);
    }
  });

  const handleWindowClick = (e: MouseEvent) => {
    if (showOption()) {
      const path = e.composedPath();
      if (!path.includes(inputEl as any)) {
        setShowOption(false);
        getText(val.value);
      }
    }
  };

  const handleAsync = async (text: string = "") => {
    if (props.onAsync) {
      if (!isLoading()) {
        setIsLoading(true);
        await (props.onAsync as any)(text);
        setIsLoading(false);
      }
    }
  };

  onMount(() => {
    document.addEventListener("click", handleWindowClick);
  });

  onCleanup(() => {
    document.removeEventListener("click", handleWindowClick);
  });

  return (
    <div class="mb-2 relative">
      <InputLabel required={props.required}>{local.label}</InputLabel>
      <input
        type="text"
        class="solid-input"
        {...others}
        value={val.text}
        onFocus={async () => {
          setVal("text", "");
          handleAsync();
          setShowOption(true);
        }}
        ref={inputEl}
        onInput={async (e) => {
          setVal("text", e.currentTarget.value);
          handleAsync(e.currentTarget.value);
        }}
      />
      <Show when={showOption()}>
        <div class="bg-white shadow absolute bottom-0 left-0 right-0 z-[20] translate-y-full">
          <ul>
            <Show
              when={!isLoading()}
              fallback={<li class="p-2 text-center">Memuat...</li>}
            >
              <For each={items()}>
                {(item) => (
                  <li
                    class="p-2 hover:bg-gray-50 transition cursor-pointer"
                    classList={{
                      "!bg-primary text-white": val.value == item.value,
                    }}
                    onClick={() => selectOption(item)}
                  >
                    <Show when={item.content} fallback={item.text}>
                      {(item.content as any)(item)}
                    </Show>
                  </li>
                )}
              </For>
            </Show>
          </ul>
        </div>
      </Show>
      <Show when={local.hint}>
        <div class="text-xs text-gray-400">{local.hint}</div>
      </Show>
    </div>
  );
}
