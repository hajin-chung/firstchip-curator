import { createSignal, type Component } from "solid-js";
import { createStore } from "solid-js/store";
import type { DOMElement } from "solid-js/jsx-runtime";
import { Trash } from "./icons/Trash";
import { Plus } from "./icons/Plus";
import { ChevronLeft, ChevronRight } from "./icons/Chevron";
import { Loading } from "./icons/Loading";

export const ArtCreateForm: Component = () => {
  const [name, setName] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [images, setImages] = createStore<File[]>([]);
  const [selected, setSelected] = createSignal<number | undefined>();
  const [isLoading, setLoading] = createSignal(false);
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

    imageInputRef.value = "";
    setSelected(images.length - 1);
  };

  const handleRemove = () => {
    const idx = selected();
    if (idx === undefined) return;

    setSelected(() => {
      if (images.length === 1) return undefined;
      if (idx === 0) return 0;
      else return idx - 1;
    });

    setImages((oldImages) => {
      const newImages = [...oldImages];
      newImages.splice(idx, 1);
      return newImages;
    });
  };

  const handleLeft = () => {
    const idx = selected();
    if (idx !== undefined && idx > 0) setSelected(idx - 1);
  };

  const handleRight = () => {
    const idx = selected();
    if (idx !== undefined && idx < images.length - 1) setSelected(idx + 1);
  };

  const handleSubmit = async () => {
    if (isLoading()) return;
    setLoading(true);

    const createArtBody = {
      name: name(),
      description: description(),
      imageCount: images.length,
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
          body: images[idx],
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
      <div class="flex flex-col gap-4 items-center">
        <div class="px-10 w-full h-[400px] flex flex-row overflow-visible">
          <input
            type="file"
            id="imageInput"
            class="hidden"
            onInput={handleFileInput}
            ref={imageInputRef}
          />
          {selected() === undefined && (
            <label
              class="bg-gray-100 dark:bg-neutral-900 dark:border-gray-100 dark:border-2 w-full h-full rounded-lg shadow-lg flex justify-center items-center group border-black transition cursor-pointer"
              for="imageInput"
            >
              <label
                class="text-xl flex justify-center items-center cursor-pointer text-gray-300 dark:group-hover:text-white group-hover:text-gray-700 border-black w-20 h-20 transition"
                for="imageInput"
              >
                <Plus />
              </label>
            </label>
          )}
          {selected() !== undefined && (
            <img
              src={URL.createObjectURL(images[selected()!])}
              class="w-full h-full rounded-lg shadow-lg object-contain"
            />
          )}
        </div>
        <div class="flex w-4/5 justify-between">
          <div class="flex items-center">
            <button
              class="h-8 w-8 p-1 border-[1px] rounded-lg"
              classList={{
                "btn-red": selected() !== undefined,
                "btn-disabled": selected() === undefined,
              }}
              onClick={handleRemove}
            >
              <Trash />
            </button>
            <div class="w-4" />
            <label
              class="h-8 w-8 p-1 border-[1px] rounded-lg btn"
              for="imageInput"
            >
              <Plus />
            </label>
          </div>

          <div class="flex items-center">
            <button
              class={`h-8 w-8 p-1 border-[1px] rounded-lg ${
                selected() !== undefined && selected()! > 0
                  ? "btn"
                  : "btn-disabled"
              }`}
              onClick={handleLeft}
            >
              <ChevronLeft />
            </button>
            <div class="mx-4">
              {selected() !== undefined && (
                <p>
                  {selected()! + 1}/{images.length}
                </p>
              )}
            </div>
            <button
              class={`h-8 w-8 p-1 border-[1px] rounded-lg ${
                selected() !== undefined && selected()! < images.length - 1
                  ? "btn"
                  : "btn-disabled"
              }`}
              onClick={handleRight}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
      <div class="h-6" />
      <div class="flex gap-2 w-full items-center">
        <p class="font-xl font-bold">제목</p>
        <input
          value={name()}
          onInput={(evt) => setName(evt.currentTarget.value)}
          class="border-[1px] p-1 border-black dark:border-white dark:bg-neutral-900 rounded-lg flex-1"
        />
      </div>
      <div class="h-2" />
      <div class="flex flex-col gap-1 w-full">
        <p class="font-lg font-bold">설명</p>
        <textarea
          value={description()}
          onInput={(evt) => setDescription(evt.currentTarget.value)}
          class="border-[1px] p-1 border-black dark:border-white dark:bg-neutral-900 rounded-lg flex-1"
        />
      </div>
      <div class="h-4" />
      <div class="flex self-end gap-4 items-center">
        {isLoading() && (
          <div class="w-8 h-8">
            <Loading />
          </div>
        )}
        <button
          class="rounded-full border-[1px] px-2 py-1 btn"
          classList={{
            btn: !isLoading(),
            "btn-disabled": isLoading(),
          }}
          type="submit"
          onClick={handleSubmit}
        >
          추가하기
        </button>
      </div>
    </div>
  );
};
