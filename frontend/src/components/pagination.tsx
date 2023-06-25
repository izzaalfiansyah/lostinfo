import { component$, useComputed$ } from "@builder.io/qwik";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

interface Props {
  data: number;
  filter: {
    total: number;
    page: number;
    limit: number;
  };
}

export default component$((props: Props) => {
  const totalPage = useComputed$(() => {
    const totalPage = Math.ceil(
      props.filter.total / (props.filter.limit || 10)
    );
    return totalPage;
  });

  return (
    <div class="flex items-center justify-between text-gray-500 text-sm mt-5">
      <div>
        Menampilkan {props.data} dari {props.filter.total} data
      </div>
      <div class="flex justify-end">
        <button
          class="w-6 h-6 rounded-full flex items-center justify-center transition hover:bg-gray-100 disabled:bg-transparent disabled:text-gray-200"
          onClick$={() => {
            if (!(props.filter.page <= 1)) {
              props.filter.page -= 1;
            }
          }}
          disabled={props.filter.page <= 1}
        >
          <ChevronLeftIcon class="w-4 h-4" />
        </button>
        <button
          class="w-6 h-6 rounded-full flex items-center justify-center transition hover:bg-gray-100 disabled:bg-transparent disabled:text-gray-200"
          onClick$={() => {
            if (!(props.filter.page >= totalPage.value)) {
              props.filter.page += 1;
            }
          }}
          disabled={props.filter.page >= totalPage.value}
        >
          <ChevronRightIcon class="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});
