import { Component, createSignal, onMount } from "solid-js";
import * as qr from "qrcode";

type Props =
  | {
      url: string;
      useCurrent: false;
    }
  | { url: ""; useCurrent: true };

export const Qrcode: Component<Props> = ({ url, useCurrent }) => {
  const [code, setCode] = createSignal<string>();

  onMount(() => {
    if (useCurrent) {
			console.log(window.location.href);
      qr.toDataURL(window.location.href).then((s) => {
        setCode(s);
      });
    } else if (!useCurrent) {
      qr.toDataURL(url).then((s) => {
        setCode(s);
      });
    }
  });

  return (
    <div class="flex flex-col gap-2 self-end">
      <div class="w-20 h-20">
        <img src={code()} />
      </div>
    </div>
  );
};
