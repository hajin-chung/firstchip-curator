import { client } from "@lib/client";
import type { Exhibit } from "@lib/type";
import { toISOLocal } from "@lib/utils";
import { createSignal, type Component } from "solid-js";
import { createStore } from "solid-js/store";

type Props = Exhibit;

export const ExhibitCard: Component<Props> = (props) => {
  const [exhibit, setExhibit] = createStore(props);
  const [isLoading, setLoading] = createSignal(false);

  const handleSubmit = async () => {
    setLoading(true);
    await client.exhibit.updateExhibit.mutate(exhibit);
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    await client.exhibit.deleteExhibitById.mutate(exhibit.id);
    setLoading(false);
  }

  return (
    <div class="flex flex-col w-full gap-1">
      <div class="flex w-full justify-between">
        <p>image</p>
        <input
          class="w-1/2 bg-transparent border-2 rounded-lg p-1"
          type="file"
        />
      </div>
      <div class="flex w-full justify-between">
        <p>id</p>
        <input
          class="w-1/2 bg-transparent border-2 rounded-lg p-1"
          value={exhibit.id}
          onInput={(e) => setExhibit({ ...exhibit, id: e.target.value })}
        />
      </div>
      <div class="flex w-full justify-between">
        <p>location</p>
        <input
          class="w-1/2 bg-transparent border-2 rounded-lg p-1"
          value={exhibit.location}
          onInput={(e) => setExhibit({ ...exhibit, location: e.target.value })}
        />
      </div>
      <div class="flex w-full justify-between">
        <p>startDate</p>
        <input
          class="w-1/2 bg-transparent border-2 rounded-lg p-1"
          value={toISOLocal(exhibit.startDate)}
          type="datetime-local"
          onInput={(e) => {
            setExhibit({ ...exhibit, startDate: new Date(e.target.value) });
          }}
        />
      </div>
      <div class="flex w-full justify-between">
        <p>endDate</p>
        <input
          class="w-1/2 bg-transparent border-2 rounded-lg p-1"
          type="datetime-local"
          value={toISOLocal(exhibit.endDate)}
          onInput={(e) =>
            setExhibit({ ...exhibit, endDate: new Date(e.target.value) })
          }
        />
      </div>
      <div class="w-full flex justify-end">
        {isLoading() && <p>loading...</p>}
        <button
          class="btn-red p-1 border-2 self-end rounded-lg"
          onClick={handleDelete}
        >
          삭제
        </button>
        <button
          class="btn p-1 border-2 self-end rounded-lg"
          onClick={handleSubmit}
        >
          저장
        </button>
      </div>
    </div>
  );
};
