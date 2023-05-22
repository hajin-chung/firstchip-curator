import type { Component } from "solid-js";
import { Trash } from "./icons/Trash";

type Props = {
  artId: string;
};

export const DeleteArtButton: Component<Props> = ({ artId }) => {
  const handleClick = async () => {
    const res = await fetch("/api/art", {
      method: "DELETE",
      body: JSON.stringify({ artId }),
    });

    if (window) window.location.href = ".";
  };

  return (
    <button
      onClick={handleClick}
      class="h-8 w-8 p-1 border-[1px] rounded-lg btn-red"
    >
      <Trash />
    </button>
  );
};
