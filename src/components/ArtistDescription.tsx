import { createSignal, type Component } from "solid-js";

type Props = {
  description: string | null;
  history: string | null;
};

export const ArtistDescription: Component<Props> = ({
  description,
  history,
}) => {
  const [showDescription, setShowDescription] = createSignal(true);

  return (
    <div class="flex flex-col gap-2">
      <div class="flex gap-4">
        <button
          onClick={() => setShowDescription(true)}
          classList={{
            "text-gray-500": !showDescription(),
          }}
        >
          소개
        </button>
        <button
          onClick={() => setShowDescription(false)}
          classList={{
            "text-gray-500": showDescription(),
          }}
        >
          연혁
        </button>
      </div>
      <p class="whitespace-pre">{showDescription() ? description : history}</p>
    </div>
  );
};
