import { type QRL, component$, createContextId } from "@builder.io/qwik";

export const NotifContext = createContextId<{
  show: QRL<(message: string, color: string) => any>;
}>("alert-context");

export default component$<{
  show: boolean;
  message: string;
  color: string;
}>((props) => {
  return (
    <div class={["fixed bottom-5 left-5 right-5 z-40 flex justify-center"]}>
      <div
        class={[
          "rounded-lg text-white p-4 px-5 max-w-full w-[800px] transform translate-y-[100px] transition",
          props.color,
          props.show && "translate-y-0",
        ]}
      >
        {props.message}
      </div>
    </div>
  );
});
