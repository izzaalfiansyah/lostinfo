import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { DeleteIcon, EditIcon } from "~/components/icons";
import Title from "~/components/title";

export default component$(() => {
  return (
    <>
      <Title
        title="Data User"
        subtitle="Menjelajahi dan menganalisis data pengguna"
      ></Title>
      <div class="bg-white rounded-lg shadow-sm p-5">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse whitespace-nowrap">
            <thead>
              <tr>
                <th class="font-normal text-sm px-3 p-2 text-left text-gray-400">
                  <input
                    type="checkbox"
                    class="text-purple-600 transition rounded border-gray-300 focus:ring-purple-300"
                  />
                </th>
                <th class="font-normal text-sm px-3 p-2 text-left text-gray-400">
                  Nama
                </th>
                <th class="font-normal text-sm px-3 p-2 text-left text-gray-400">
                  Alamat
                </th>
                <th class="font-normal text-sm px-3 p-2 text-left text-gray-400">
                  Telepon
                </th>
                <th class="font-normal text-sm px-3 p-2 text-left text-gray-400">
                  Email
                </th>
                <th class="font-normal text-sm px-3 p-2 text-left text-gray-400">
                  Opsi
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="px-3 p-2">
                  <input
                    type="checkbox"
                    class="text-purple-600 transition rounded border-gray-300 focus:ring-purple-300"
                  />
                </td>
                <td class="px-3 p-2">Muhammad Izza Alfiansyah</td>
                <td class="px-3 p-2">Jember</td>
                <td class="px-3 p-2">081231921351</td>
                <td class="px-3 p-2">iansyah724@gmail.com</td>
                <td class="px-3 p-2">
                  <button class="mr-3">
                    <EditIcon class="w-4 h-4 text-purple-600" />
                  </button>
                  <button>
                    <DeleteIcon class="w-4 h-4 text-red-600" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Data User",
};
