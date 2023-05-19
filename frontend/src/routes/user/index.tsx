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
      >
        <button
          q:slot="action"
          class="px-5 p-2 text-white bg-purple-600 rounded shadow-sm mt-4 lg:mt-0"
        >
          Tambah
        </button>
      </Title>
      <div class="bg-white rounded-lg shadow-sm p-5">
        <div class="overflow-x-auto">
          <table class="t-table">
            <thead>
              <tr>
                {/* <th>
                  <input
                    type="checkbox"
                    class="text-purple-600 transition rounded border-gray-300 focus:ring-purple-300"
                  />
                </th> */}
                <th>Nama</th>
                <th>Alamat</th>
                <th>Telepon</th>
                <th>Email</th>
                <th>Opsi</th>
              </tr>
            </thead>
            <tbody>
              {user.value.map((item) => (
                <tr key={item.id}>
                  {/* <td class="px-3 p-2 lg:table-cell block">
                    <input
                      type="checkbox"
                      class="text-purple-600 transition rounded border-gray-300 focus:ring-purple-300"
                      value={item.id}
                    />
                  </td> */}
                  <td>{item.nama}</td>
                  <td>{item.alamat}</td>
                  <td>{item.telepon}</td>
                  <td>{item.email}</td>
                  <td>
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
