import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

export interface Props {
  page: number;
  totalPage: number;
  onChange?: (val: number) => void;
}

export default function (props: Props) {
  const handleChange = (page: number) => {
    props.page = page;
    props.onChange && props.onChange(page);
  };

  return (
    <div class="flex justify-end">
      <button
        class="w-6 h-6 rounded-full flex items-center justify-center transition hover:bg-gray-100 disabled:bg-transparent disabled:text-gray-200"
        onClick={() => {
          if (!(props.page <= 1)) {
            handleChange(props.page - 1);
          }
        }}
        disabled={props.page <= 1}
      >
        <ChevronLeftIcon class="w-4 h-4" />
      </button>
      <button
        class="w-6 h-6 rounded-full flex items-center justify-center transition hover:bg-gray-100 disabled:bg-transparent disabled:text-gray-200"
        onClick={() => {
          if (!(props.page >= props.totalPage)) {
            handleChange(props.page + 1);
          }
        }}
        disabled={props.page >= props.totalPage}
      >
        <ChevronRightIcon class="w-4 h-4" />
      </button>
    </div>
  );
}
