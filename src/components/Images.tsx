import { createSignal, type Component, onMount } from "solid-js";

type Props = {
  imageUrls: string[];
};

export const Images: Component<Props> = ({ imageUrls }) => {
  const [loadCount, setLoadCount] = createSignal(0);
  const [imageIndex, setImageIndex] = createSignal(0);
  const [mousePos, setMousePos] = createSignal<
    { x: number; y: number } | undefined
  >();

  const next = () => {
    setImageIndex((idx) => {
      if (idx + 1 < imageUrls.length) return idx + 1;
      else return idx;
    });
  };

  const prev = () => {
    setImageIndex((idx) => {
      if (idx - 1 >= 0) return idx - 1;
      else return idx;
    });
  };

  return (
    <div class="w-full h-[540px] rounded-lg flex flex-col items-center gap-4">
      <div
        class="w-full h-full relative"
        classList={{
          loading: loadCount() !== imageUrls.length,
        }}
        onMouseDown={(evt) => setMousePos({ x: evt.clientX, y: evt.clientY })}
        onMouseUp={(evt) => {
          const pos = mousePos();
          if (!pos) return;
          const dx = pos.x - evt.clientX;
          const dy = pos.y - evt.clientY;

          if (dx > 0) next();
          else if (dx < 0) prev();
        }}
        onTouchStart={(evt) =>
          setMousePos({ x: evt.touches[0].clientX, y: evt.touches[0].clientY })
        }
        onTouchEnd={(evt) => {
          const pos = mousePos();
          if (!pos) return;
          const dx = pos.x - evt.changedTouches[0].clientX;
          const dy = pos.y - evt.changedTouches[0].clientY;

          if (dx > 0) next();
          else if (dx < 0) prev();
        }}
      >
        {imageUrls.map((image, idx) => (
          <div
            class="absolute top-0 left-0 h-full w-full flex justify-center transition"
            classList={{
              "opacity-100": imageIndex() === idx,
              "opacity-0": imageIndex() !== idx,
            }}
          >
            <img
              src={image}
              class="drop-shadow-2xl rounded-lg self-center transition opacity-0 max-h-full max-w-full object-contain m-0"
              onLoad={(evt) => {
                const elem = evt.currentTarget;
                if (elem.clientHeight > elem.clientWidth)
                  elem.style.height = "100%";
                else elem.style.width = "100%";
                elem.classList.remove("opacity-0");
                setLoadCount((cnt) => cnt + 1);
              }}
              onDragStart={(evt) => evt.preventDefault()}
              draggable={false}
            />
          </div>
        ))}
      </div>
      <div class="flex gap-2">
        {imageUrls.map((_, idx) => (
          <button
            class="rounded-full w-2 h-2 bg-gray-300 transition"
            classList={{ "bg-gray-600": imageIndex() === idx }}
            onClick={() => setImageIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
};
