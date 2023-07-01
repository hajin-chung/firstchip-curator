import type { Component } from "solid-js";
import { Trash } from "./icons/Trash";
import { Pencil } from "./icons/Pencil";

type Props = {
  artId: string;
};

export const ArtEditButton : Component<Props> = ({ artId }) => {
  const handleClick = async () => {
		if (window) window.location.href = `/me/art/${artId}`;
  };

  return (
    <button
      onClick={handleClick}
      class="h-8 w-8 p-1 border-[1px] rounded-lg btn"
    >
      <Pencil />
    </button>
  );
};
