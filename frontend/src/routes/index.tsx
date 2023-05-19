import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <h1>Hi 👋</h1>
      <p>
        Can't wait to see what you build with qwik!
        <br />
        Happy coding.
      </p>
    </>
  );
});

export const head: DocumentHead = {
  title: "LostInfo - Platform Informasi Pencarian dan Pelaporan Barang Hilang",
  meta: [
    {
      name: "description",
      content: "LostInfo - Platform Informasi dan Pelaporan Barang Hilang",
    },
  ],
};
