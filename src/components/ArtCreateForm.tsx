import { createSignal, type Component, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import type { DOMElement } from "solid-js/jsx-runtime";
import { Trash } from "./icons/Trash";
import { Plus } from "./icons/Plus";

export const ArtCreateForm: Component = () => {
  const [name, setName] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [images, setImages] = createSignal<File[]>([]);
  const [selected, setSelected] = createSignal<File | undefined>();
  let imageInputRef!: HTMLInputElement;

  const handleFileInput = (evt: {
    currentTarget: HTMLInputElement;
    target: DOMElement;
  }) => {
    if (!evt.currentTarget.files) return;
    if (!imageInputRef) return;

    const file = evt.currentTarget.files[0];
    if (file) {
      setImages((i) => [...i, file]);
    }

		imageInputRef.files = null;
		imageInputRef.value = "";
  };

  const handleRemove = () => {
    setImages((images) => images.filter((img) => img !== selected()));
    setSelected(undefined);
  };

  const handleSubmit = async () => {
    const createArtBody = {
      name: name(),
      description: description(),
      imageCount: images().length,
    };

    const res = await fetch("/api/art", {
      method: "POST",
      body: JSON.stringify(createArtBody),
    });

    const { error, signedUrls, artId, artistId } = (await res.json()) as {
      error: boolean;
      signedUrls: { imageId: string; signedUrl: string }[];
      artId: string;
      artistId: string;
    };
    // TODO: handle error

    await Promise.all(
      signedUrls.map(async ({ imageId, signedUrl }, idx) => {
        const res = await fetch(signedUrl, {
          method: "PUT",
          body: images()[idx],
          mode: "cors",
        });
        // handle res
      })
    );

    if (window) {
      window.location.href = `/art/${artistId}/${artId}`;
    }
  };

  return (
    <div class="flex flex-col w-full">
      <div class="flex flex-row gap-2 w-full bg-gray-100 rounded-lg h-[400px]">
        <div class="w-full flex h-full items-center justify-center">
          <img
            src={selected() && URL.createObjectURL(selected()!)}
            class="h-full"
          />
        </div>
        <div class="relative p-2 flex flex-col gap-2">
          <div>
            <label
              class="w-8 h-8 rounded-lg border-[1px] p-1 text-xl border-black flex justify-center items-center cursor-pointer hover:bg-black hover:text-white"
              for="imageInput"
            >
              <Plus />
            </label>
            <input
              type="file"
              id="imageInput"
              class="hidden"
              onInput={handleFileInput}
              ref={imageInputRef}
            />
          </div>
          {images().map((image) => (
            <img
              src={URL.createObjectURL(image)}
              class="w-8 h-8 rounded-lg cursor-pointer"
              onClick={() => setSelected(() => image)}
            />
          ))}
          {selected() && (
            <div class="absolute bottom-2 right-2">
              <button
                class="w-8 h-8 p-1 rounded-lg border-[1px] text-xl border-red-400 text-red-400 flex justify-center items-center cursor-pointer hover:bg-red-400 hover:border-red-400 hover:text-white"
                onClick={handleRemove}
              >
                <Trash />
              </button>
            </div>
          )}
        </div>
      </div>

      <div class="h-6" />
      <div class="flex gap-2 w-full items-center">
        <p class="font-xl font-bold">제목</p>
        <input
          value={name()}
          onInput={(evt) => setName(evt.currentTarget.value)}
          class="border-[1px] p-1 border-black rounded-lg flex-1"
        />
      </div>
      <div class="h-2" />
      <div class="flex flex-col gap-2 w-full">
        <p class="font-lg font-bold">설명</p>
        <textarea
          value={description()}
          onInput={(evt) => setDescription(evt.currentTarget.value)}
          class="border-[1px] p-1 border-black rounded-lg flex-1"
        />
      </div>
      <div class="h-4" />
      <button
        class="self-end rounded-full border-[1px] px-2 py-1 border-black hover:bg-black hover:text-white transition"
        type="submit"
        onClick={handleSubmit}
      >
        추가하기
      </button>
    </div>
  );
};
