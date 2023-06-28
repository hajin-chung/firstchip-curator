import type { Exhibit } from "@lib/type";
import { createSignal, type Component, createEffect } from "solid-js";

const exhibitFilters = [
  { mode: "now", name: "진행 중인 전시" },
  { mode: "preparing", name: "준비 중인 전시" },
  { mode: "done", name: "종료된 전시" },
] as const;

export const ExhibitList: Component = () => {
  const [filter, setFilter] = createSignal<number>(0); // index of exhibitFilters
  const [exhibits, setExhibits] = createSignal<Exhibit[]>([]);

  createEffect(() => {
    // fetch exhibits when filter changes
  });

  return (
    <div class="w-full flex flex-col gap-4">
      <div class="flex gap-4 flex-wrap">
        {exhibitFilters.map(({ name }, idx) => (
          <FilterButton
            name={name}
            isActive={() => idx === filter()}
            onClick={() => setFilter(idx)}
          />
        ))}
      </div>
      <div class="flex gap-4 flex-col w-full">
        {exhibits().length === 0 && (
          <p class="self-center mt-8">전시 정보가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

type FilterButtonProps = {
  name: string;
  onClick: () => void;
  isActive: () => boolean;
};

export const FilterButton: Component<FilterButtonProps> = (props) => {
  return (
    <button
      class="p-1 rounded-lg  transition"
      classList={{
        "bg-orange-200 dark:bg-orange-400": props.isActive(),
        "bg-gray-100 dark:bg-gray-600": !props.isActive(),
      }}
      onClick={props.onClick}
    >
      {props.name}
    </button>
  );
};
