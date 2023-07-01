import { client } from "@lib/client";
import { createSignal, type Component } from "solid-js";

export const ExhibitAddButton: Component = () => {
  const [isLoading, setLoading] = createSignal(false);

  const handleNew = async () => {
    setLoading(true);
    await client.exhibit.createExhibit.mutate({
      location: "",
      startDate: new Date(),
      endDate: new Date(),
    });
    setLoading(false);
  };

  return (
    <button class="btn p-1 border-2 rounded-lg" onClick={handleNew}>
      {isLoading() ? "loading..." : "New"}
    </button>
  );
};
