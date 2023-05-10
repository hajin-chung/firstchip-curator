import { createSignal, type Component } from "solid-js";

export const ArtCreateForm: Component = () => {
  const [name, setName] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [images, setImages] = createSignal<File[]>([]);
  const [selected, setSelected] = createSignal("");
  let imageInputRef: HTMLInputElement;

  const handleFileInput = (
    evt: Event & { currentTarget: HTMLInputElement; target: HTMLInputElement }
  ) => {
    if (!evt.currentTarget.files) return;
    if (!imageInputRef) return;

    const file = evt.currentTarget.files[0];
    if (file) {
      setImages((i) => [...i, file]);
    }

    imageInputRef.value = "";
  };

  const handleSubmit = async () => {
		console.log("hi");
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
		console.log({error, signedUrls});

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
    <div class="flex flex-col gap-2 w-full">
      <div class="flex gap-2 w-full">
        <p>제목</p>
        <input
          value={name()}
          onInput={(evt) => setName(evt.currentTarget.value)}
        />
      </div>
      <div class="flex flex-col gap-2 w-full">
        <p>설명</p>
        <textarea
          value={description()}
          onInput={(evt) => setDescription(evt.currentTarget.value)}
        />
      </div>
      <div class="flex gap-2 w-full bg-pink-50 h-[640px]">
        <div class="p-2 flex flex-col gap-2">
          <div>
            <label
              class="w-12 h-12 rounded-lg border-2 text-xl border-black flex justify-center items-center cursor-pointer"
              for="imageInput"
            >
              +
            </label>
            <input
              type="file"
              id="imageInput"
              class="hidden"
              onChange={handleFileInput}
              ref={imageInputRef!}
            />
          </div>
          {images().map((image) => (
            <img
              src={URL.createObjectURL(image)}
              class="w-12 h-12 rounded-lg cursor-pointer"
              onClick={() => setSelected(URL.createObjectURL(image))}
            />
          ))}
        </div>
        <div class="w-full flex h-full items-center">
          <img src={selected()} class="w-full" />
        </div>
      </div>
      <button
        class="p-2 border-2 rounded-lg"
        type="submit"
        onClick={handleSubmit}
      >
        추가하기
      </button>
    </div>
  );
};
