import { createSignal, type Component, onMount } from "solid-js";
import { RouterOutput, client } from "@lib/client";

type Props = {
  artistId: string;
};

export const ArtList: Component<Props> = ({ artistId }) => {
  const [isLoading, setLoading] = createSignal(true);
  const [arts, setArts] = createSignal<
    RouterOutput["art"]["getArtsByArtistId"]
  >([]);

  onMount(async () => {
    const arts = await client.art.getArtsByArtistId.query(artistId);
    setArts(arts);
    setLoading(false);
  });

  return (
    <div class="w-full relative">
      <p class="text-lg font-bold mt-10">작품 목록</p>
      <div class="flex flex-col gap-40 items-center mt-20">
        {isLoading() && <LoadingArtCard />}
        {!isLoading() &&
          arts().map((art) => (
            <>
              <ArtCard {...art} artistId={artistId} />
              <div class="w-[20vw] bg-gray-500 h-[2px]" />
            </>
          ))}
      </div>
      {arts().length === 0 && (
        <div class="self-center text-gray-500 mt-10">작품 없음</div>
      )}
    </div>
  );
};

const ArtCard: Component<
  RouterOutput["art"]["getArtsByArtistId"][number] & { artistId: string }
> = ({ id, description, name, price, status, thumbnail, artistId }) => {
  return (
    <div class="flex gap-10 flex-col justify-center">
      <img
        src={`/image?id=${thumbnail}`}
        class="max-h-[80vh] object-contain group-hover:blur-sm transition drop-shadow-2xl"
      />
      <div class="flex flex-col items-center">
        <a href={`/art/${artistId}/${id}`} class="font-extrabold text-xl">
          {name}
        </a>
        <p />
        {price ? <p>{price} &#8361; </p> : <p>가격 미정</p>}
        <p class="text-sm whitespace-pre-wrap">{description}</p>
      </div>
    </div>
  );
};

const LoadingArtCard: Component = () => {
  return (
    <div class="flex gap-10 flex-col justify-center items-center h-[50vh] w-[40vw]">
      <div class="skeleton rounded-lg" />
      <div class="flex flex-col items-center w-[10vw] h-[5vh] rounded-lg overflow-clip">
        <div class="skeleton" />
        <p />
        <p class="text-sm whitespace-pre-wrap skeleton" />
      </div>
    </div>
  );
};
