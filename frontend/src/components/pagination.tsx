import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

export interface Props {
  record: number;
  recordTotal: number;
  page: number;
  pageTotal: number;
  onChange?: (val: number) => void;
}

export default function (props: Props) {
  const handleChange = (page: number) => {
    props.onChange && props.onChange(page);
  };

  return (
    <div class="flex lg:flex-row flex-col items-center justify-between text-gray-500 text-sm">
      <div>
        Menampilkan {props.record} dari {props.recordTotal} data
      </div>
      <div class="flex justify-end space-x-2 items-center lg:mt-0 mt-2">
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
        <div class="text-sm text-gray-500">
          {props.page} - {props.pageTotal}
        </div>
        <button
          class="w-6 h-6 rounded-full flex items-center justify-center transition hover:bg-gray-100 disabled:bg-transparent disabled:text-gray-200"
          onClick={() => {
            if (!(props.page >= props.pageTotal)) {
              handleChange(props.page + 1);
            }
          }}
          disabled={props.page >= props.pageTotal}
        >
          <ChevronRightIcon class="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
