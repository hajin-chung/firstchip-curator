import { client } from "@lib/client";
import type { Exhibit, ExhibitFilter } from "@lib/type";
import { createSignal, type Component, createEffect, onMount } from "solid-js";

const exhibitFilters: readonly { mode: ExhibitFilter; name: string }[] = [
  { mode: "now", name: "진행 중인 전시" },
  { mode: "preparing", name: "준비 중인 전시" },
  { mode: "done", name: "종료된 전시" },
] as const;

export const ExhibitList: Component = () => {
  const [filter, setFilter] = createSignal<number>(0); // index of exhibitFilters
  const [exhibits, setExhibits] = createSignal<Exhibit[]>([]);
  const [filteredExhibits, setFilterExhibits] = createSignal<Exhibit[]>([]);

  onMount(async () => {
    const fetchedExhibits = await client.exhibit.getAllExhibits.query();
    setExhibits(fetchedExhibits);
  });

  createEffect(() => {
    // fetch exhibits when filter changes
    const filterMode = exhibitFilters[filter()].mode;
    const now = new Date();
    const tmpExhibits: Exhibit[] = [];
    exhibits().forEach((exhibit) => {
      if (filterMode === "done" && exhibit.endDate < now)
        tmpExhibits.push(exhibit);
      else if (
        filterMode === "now" &&
        exhibit.startDate < now &&
        now < exhibit.endDate
      )
        tmpExhibits.push(exhibit);
      else if (filterMode === "preparing" && exhibit.startDate > now)
        tmpExhibits.push(exhibit);
    });

    setFilterExhibits(tmpExhibits);
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
      <div class="flex gap-8 flex-col w-full p-4">
        {filteredExhibits().length === 0 && (
          <p class="self-center mt-8">전시 정보가 없습니다.</p>
        )}
        {filteredExhibits().map(
          ({ id, location, title, endDate, startDate }) => (
            <div class="flex flex-col gap-2">
              <p class="font-bold text-xl">{title}</p>
              <div />
              <p class="text-sm">위치: {location}</p>
              <p class="">
                기간: {startDate.toLocaleDateString()}~
                {endDate.toLocaleDateString()}
              </p>
            </div>
          )
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
