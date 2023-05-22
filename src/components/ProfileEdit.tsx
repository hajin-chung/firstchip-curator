import { createSignal, type Component, createEffect } from "solid-js";
import type { Art, Artist } from "@lib/type";
import { Pencil } from "./icons/Pencil";
import type { DOMElement } from "solid-js/jsx-runtime";
import { Check } from "./icons/Check";
import { Loading } from "./icons/Loading";

type Props = {
  artist: Artist;
  arts: Pick<Art, "id" | "name">[];
};

export const ProfileEdit: Component<Props> = ({ artist, arts }) => {
  const [name, setName] = createSignal(artist.name);
  const [picture, setPicture] = createSignal(artist.picture);
  const [description, setDescription] = createSignal(artist.description);
  const [imageFile, setImageFile] = createSignal<File>();
  const [success, setSuccess] = createSignal<boolean | undefined>();
  const [isLoading, setLoading] = createSignal(false);
  const didUpdate = () =>
    name() !== artist.name ||
    picture() !== artist.picture ||
    description() !== artist.description;

  const handlePictureInput = (evt: {
    currentTarget: HTMLInputElement;
    target: DOMElement;
  }) => {
    if (!evt.currentTarget.files) return;

    const file = evt.currentTarget.files[0];
    setPicture(URL.createObjectURL(file));
    setImageFile(() => file);
  };

  const handleSubmit = async () => {
    if (isLoading()) return;

    setLoading(true);
    const didPictureUpdate = picture() !== artist.picture;
    const body = {
      name: name(),
      description: description(),
      didPictureUpdate,
    };

    const res = await fetch("/api/me", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const { error, signedUrl } = (await res.json()) as {
      error: boolean;
      signedUrl: string | undefined;
    };
    setLoading(false);
    setSuccess(!error);

    if (!error && signedUrl) {
      setLoading(true);
      const res = await fetch(signedUrl, {
        method: "PUT",
        body: imageFile(),
        mode: "cors",
      });
      setLoading(false);
    }
  };

  return (
    <div class="flex flex-col items-start gap-4 w-full">
      <div class="grid grid-cols-2 w-full">
        <p class="mt-4">프로필 사진</p>
        <div class="relative h-20 w-20 rounded-full border-2 border-black p-[1px] group">
          <label
            for="pictureInput"
            class="absolute z-10 top-0 left-0 w-full h-full bg-opacity-80 bg-white hidden group-hover:flex justify-center items-center rounded-full p-6 hover:cursor-pointer"
          >
            <Pencil />
          </label>
          <img
            src={picture()}
            class="overflow-hidden rounded-full w-full h-full"
          />
          <input
            class="hidden"
            id="pictureInput"
            type="file"
            onInput={handlePictureInput}
          />
        </div>
      </div>
      <div class="grid grid-cols-2 w-full">
        <p>이름</p>
        <input
          class="p-1 border-[1px] border-black rounded-lg"
          type="text"
          value={name()}
          onInput={(e) => setName(e.currentTarget.value)}
          placeholder={name()}
        />
      </div>
      <div class="grid grid-cols-2 w-full">
        <p>소개</p>
        <textarea
          class="p-1 border-[1px] border-black rounded-lg"
          value={description()}
          onInput={(e) => setDescription(e.currentTarget.value)}
          placeholder={description()}
        />
      </div>
      <div class="self-end gap-2 flex items-center">
        {success() && (
          <div class="w-8 h-8 text-green-500">
            <Check />
          </div>
        )}
        {isLoading() && (
          <div class="w-8 h-8">
            <Loading />
          </div>
        )}
        <button
          class="border-[1px] py-1 px-2 rounded-full transition self-end"
          classList={{
            "border-black hover:bg-black hover:text-white": didUpdate(),
            "border-gray-400 text-gray-400": !didUpdate(),
          }}
          onClick={handleSubmit}
        >
          저장하기
        </button>
      </div>
    </div>
  );
};
