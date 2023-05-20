import { type PropFunction, Slot, component$, $ } from "@builder.io/qwik";

interface Props {
  show: boolean;
  onClose$?: PropFunction;
}

export default component$<Props>((props) => {
  const handleClick = $(() => {
    props.onClose$ && props.onClose$();
  });

  return (
    <>
      {props.show && (
        <div class="fixed top-0 left-0 right-0 bottom-0 z-40 flex items-center justify-center overflow-y-auto p-5">
          <div
            class="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-25"
            onClick$={handleClick}
          ></div>
          <div class="bg-white rounded-lg shadow-sm p-5 max-w-full relative max-h-full overflow-y-auto">
            <Slot />
          </div>
        </div>
      )}
    </>
  );
});