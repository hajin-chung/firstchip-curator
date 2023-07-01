import { createSignal, type Component } from "solid-js";
import { Trash } from "./icons/Trash";
import { client } from "@lib/client";

type Props = {
  artId: string;
};

export const ArtDeleteButton: Component<Props> = ({ artId }) => {
  const [error, setError] = createSignal(false);

  const handleClick = async () => {
    try {
      await client.art.deleteById.mutate(artId);
      if (window) window.location.href = ".";
    } catch (e) {
      setError(true);
    }
  };

  return (
    <button
      onClick={handleClick}
      classList={{
        "h-8 w-8 p-1 border-[1px] rounded-lg btn-red": true,
        "bg-red": error(),
      }}
    >
      <Trash />
    </button>
  );
};
