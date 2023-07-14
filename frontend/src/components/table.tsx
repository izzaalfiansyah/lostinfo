import { For, JSX, Show, splitProps } from "solid-js";

interface Props {
  heads?: JSX.Element[];
  items?: JSX.Element[][];
}

export default function Table(props: Props) {
  const [local, other] = splitProps(props, ["heads", "items"]);

  return (
    <>
      <div class="lg:overflow-x-auto">
        <table class="w-full border-collapse whitespace-nowrap">
          <thead class="lg:table-header-group hidden">
            <tr>
              <For each={local.heads}>
                {(item) => (
                  <th class="font-normal text-sm px-3 p-2 text-left text-gray-400">
                    {item}
                  </th>
                )}
              </For>
            </tr>
          </thead>
          <tbody class="lg:table-row-group flex flex-col">
            <Show when={!local.items?.length}>
              <tr class="lg:table-row block border-t mt-3 pt-3 lg:border-none lg:mt-0 lg:pt-0 border-b border-gray-100">
                <td
                  class="px-3 p-2 lg:table-cell block text-center text-gray-500"
                  colspan={local.heads?.length}
                >
                  Data tidak tersedia
                </td>
              </tr>
            </Show>

            <For each={local.items}>
              {(items) => (
                <tr class="lg:table-row block border-t mt-3 pt-3 lg:mt-0 lg:pt-0 border-b border-gray-100 transition hover:bg-gray-50">
                  <For each={items}>
                    {(item) => (
                      <td class="px-3 p-2.5 lg:table-cell block">{item}</td>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </>
  );
}
