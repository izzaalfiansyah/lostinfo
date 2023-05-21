import { Slot, component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <div class="bg-purple-100 min-h-screen overflow-x-hidden flex items-center justify-center p-5">
      <div class="max-w-full w-[500px]">
        <div class="text-3xl font-semibold mb-8 text-center">
          LostInfo<span class="text-purple-500">.</span>
        </div>
        <Slot />
      </div>
    </div>
  );
});
