import type { Component } from "solid-js";

export const ListButton: Component = () => {
  const handleClick = () => {
    if (!window) return;
    window.location.href = "/";
  };

  return (
    <button
      class="font-bold flex gap-2 items-center my-4"
      onClick={handleClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="#000000"
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        id="left-arrow"
        data-name="Flat Line"
        class="icon flat-line"
      >
        <line
          id="primary"
          x1="21"
          y1="12"
          x2="3"
          y2="12"
          style="fill: none; stroke: rgb(0, 0, 0); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"
        />
        <polyline
          id="primary-2"
          data-name="primary"
          points="6 9 3 12 6 15"
          style="fill: none; stroke: rgb(0, 0, 0); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"
        />
      </svg>
      <p class="hover:drop-shadow-2xl">다른 작품 보러 가기</p>
    </button>
  );
};
