import { component$ } from "@builder.io/qwik";
import Title from "~/components/title";

export default component$(() => {
  return (
    <>
      <Title
        title="Data Barang Hilang"
        subtitle="Menjelajahi dan menganalisis data barang hilang"
      >
        <button
          q:slot="action"
          class="px-5 p-2 text-white bg-purple-600 rounded shadow-sm mt-4 lg:mt-0"
          onClick$={() => {}}
        >
          Tambah
        </button>
      </Title>
    </>
  );
});
