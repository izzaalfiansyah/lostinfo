import {
  splitProps,
  JSX,
  Show,
  Component,
  createSignal,
  createEffect,
} from "solid-js";
import { InputLabel } from "./input";
import { Select } from "@thisbeyond/solid-select";
import { CreateSelectProps } from "@thisbeyond/solid-select/dist/types/create-select";

type Value = { value: any; text: any };

interface Props extends CreateSelectProps {
  label?: string;
  hint?: string;
  options: Value[];
  value?: any;
  onChange?: (item: any) => any;
  placeholder?: string;
}

export default function (props: Props) {
  const [local, others] = splitProps(props, [
    "label",
    "hint",
    "onChange",
    "value",
  ]);
  const [initialValue, setInitialValue] = createSignal<any>(null);

  createEffect(() => {
    if (local.value) {
      if (initialValue()?.value != local.value) {
        const item = props.options.filter(
          (item) => item.value == local.value
        )[0];
        setInitialValue(item);
      }
    }
  });

  return (
    <div class="mb-2">
      <InputLabel {...others}>{local.label}</InputLabel>
      <Select
        {...others}
        format={(item) => item.text}
        initialValue={initialValue()}
        onChange={(item: Value) => {
          if (item && local.onChange) {
            local.onChange(item?.value);
          }
        }}
      />
      <Show when={local.hint}>
        <div class="text-xs text-gray-400">{local.hint}</div>
      </Show>
    </div>
  );
}
