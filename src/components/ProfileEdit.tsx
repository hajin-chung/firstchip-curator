import { createSignal, type Component } from "solid-js";
import type { Art, Artist } from "@lib/type";
import { Pencil } from "./icons/Pencil";
import type { DOMElement } from "solid-js/jsx-runtime";
import { Check } from "./icons/Check";
import { Loading } from "./icons/Loading";
import { client } from "@lib/client";

type Props = {
  artist: Pick<Artist, "id" | "name" | "picture" | "description">;
};

export const ProfileEdit: Component<Props> = ({ artist }) => {
  const [name, setName] = createSignal(artist.name);
  const [picture, setPicture] = createSignal(artist.picture);
  const [description, setDescription] = createSignal(artist.description ?? "");
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
    try {
      const signedUrl = await client.me.updateProfile.mutate({
        name: name(),
        description: description(),
        didPictureUpdate,
      });

      if (signedUrl) {
        await fetch(signedUrl, {
          method: "PUT",
          body: imageFile(),
          mode: "cors",
        });
      }

      setSuccess(true);
    } catch (e) {
      setSuccess(false);
    }
    setLoading(false);
  };

  return (
    <form
      class="flex flex-col items-start gap-4 w-full"
      onSubmit={handleSubmit}
    >
      <div class="grid grid-cols-2 w-full">
        <p class="mt-4">프로필 사진</p>
        <div class="relative h-20 w-20 rounded-full border-2 border-black dark:border-white p-[1px] group">
          <label
            for="pictureInput"
            class="absolute z-10 top-0 left-0 w-full h-full bg-opacity-80 bg-white hidden group-hover:flex justify-center items-center rounded-full p-6 hover:cursor-pointer"
          >
            <Pencil />
          </label>
          <img
            src={picture() ?? ""} // TODO: set defualt image url
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
          class="p-1 border-[1px] border-black dark:border-white dark:bg-neutral-900 rounded-lg"
          type="text"
          value={name()}
          onInput={(e) => setName(e.currentTarget.value)}
          placeholder={name()}
        />
      </div>
      <div class="grid grid-cols-2 w-full">
        <p>소개</p>
        <textarea
          class="p-1 border-[1px] border-black dark:border-white dark:bg-neutral-900 rounded-lg"
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
            btn: didUpdate(),
            "btn-disabled": !didUpdate(),
          }}
          type="submit"
          onClick={handleSubmit}
        >
          저장하기
        </button>
      </div>
    </form>
  );
};
