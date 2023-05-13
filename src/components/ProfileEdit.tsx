import { createSignal, type Component, createEffect } from "solid-js";
import type { Art, Artist } from "@lib/type";
import { Pencil } from "./icons/Pencil";
import type { DOMElement } from "solid-js/jsx-runtime";

type Props = {
  artist: Artist;
  arts: Pick<Art, "id" | "name">[];
};

export const ProfileEdit: Component<Props> = ({ artist, arts }) => {
  const [name, setName] = createSignal(artist.name);
  const [picture, setPicture] = createSignal(artist.picture);
  const [imageFile, setImageFile] = createSignal<File>();
  const didUpdate = () =>
    name() !== artist.name || picture() !== artist.picture;

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
    const body = {
      name: name(),
      didPictureUpdate: picture() !== artist.picture,
    };

    const res = await fetch("/api/me", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const { error, signedUrl } = (await res.json()) as {
      error: boolean;
      signedUrl: string | undefined;
    };

    if (!error && signedUrl) {
      const res = await fetch(signedUrl, {
        method: "PUT",
        body: imageFile(),
        mode: "cors",
      });
    }
  };

  createEffect(() => {
    didUpdate();
  });

  return (
    <div class="flex flex-col items-start">
      <div class="flex gap-2 items-center">
        <p>이름</p>
        <input
          class="p-1 border-[1px] border-black rounded-lg"
          type="text"
          value={name()}
          onInput={(e) => setName(e.currentTarget.value)}
          placeholder={name()}
        />
      </div>
      <div class="flex gap-2 items-center">
        <p>프로필 사진</p>
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
      <button
        class="border-[1px] py-1 px-2 rounded-full transition "
        classList={{
          "border-black hover:bg-black hover:text-white": didUpdate(),
          "border-gray-400 text-gray-400": !didUpdate(),
        }}
        onClick={handleSubmit}
      >
        저장하기
      </button>
    </div>
  );
};
