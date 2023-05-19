import { $, component$, useSignal, useTask$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { DeleteIcon, EditIcon } from "~/components/icons";
import Title from "~/components/title";
import type User from "~/interfaces/user";
import http from "~/libs/http";

export default component$(() => {
  const user = useSignal<User[]>([]);

  const get = $(async () => {
    const res = await http.get("/user");
    user.value = res.data.data;
  });

  useTask$(async () => {
    await get();
  });

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
              {user.value.map((item) => (
                <tr key={item.id}>
                  <td class="px-3 p-2">
                    <input
                      type="checkbox"
                      class="text-purple-600 transition rounded border-gray-300 focus:ring-purple-300"
                      value={item.id}
                    />
                  </td>
                  <td class="px-3 p-2">{item.nama}</td>
                  <td class="px-3 p-2">{item.alamat}</td>
                  <td class="px-3 p-2">{item.telepon}</td>
                  <td class="px-3 p-2">{item.email}</td>
                  <td class="px-3 p-2">
                    <button class="mr-3">
                      <EditIcon class="w-4 h-4 text-purple-600" />
                    </button>
                    <button>
                      <DeleteIcon class="w-4 h-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
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
