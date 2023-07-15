import { client } from "@lib/client";
import type { Exhibit, ExhibitFilter } from "@lib/type";
import { createSignal, type Component, createEffect, onMount } from "solid-js";
import { ChevronRight } from "./icons/Chevron";

const exhibitFilters: readonly { mode: ExhibitFilter; name: string }[] = [
  { mode: "now", name: "진행 중인 전시" },
  { mode: "preparing", name: "준비 중인 전시" },
  { mode: "done", name: "종료된 전시" },
] as const;

export const ExhibitList: Component = () => {
  const [filter, setFilter] = createSignal<number>(0); // index of exhibitFilters
  const [exhibits, setExhibits] = createSignal<Exhibit[]>([]);
  const [filteredExhibits, setFilterExhibits] = createSignal<Exhibit[]>([]);
  const [isLoading, setLoading] = createSignal(false);

  onMount(async () => {
    setLoading(true);
    const fetchedExhibits = await client.exhibit.getAllExhibits.query();
    setExhibits(fetchedExhibits);
    setLoading(false);
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
            <a
              class="rounded-xl filter h-[180px] w-full overflow-hidden relative group"
              href={`/exhibit/${id}`}
            >
              <div class="w-8 h-8 absolute z-20 bottom-4 right-4 text-gray-500 group-hover:text-white transition">
                <ChevronRight />
              </div>
              <div class="flex flex-col justify-end gap-2 z-10 absolute w-full h-full bg-black rounded-xl p-4 bg-opacity-50 transition text-white">
                <p class="font-bold text-2xl mb-10">{title}</p>
                <p class="text-sm">위치: {location}</p>
                <p class="">
                  기간: {startDate.toLocaleDateString()}~
                  {endDate.toLocaleDateString()}
                </p>
              </div>
              <img
                class="w-full h-full object-cover absolute top-0 left-0 blur-sm z-0 group-hover:blur-none transition"
                src={`/image?id=${id}`}
              />
            </a>
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
