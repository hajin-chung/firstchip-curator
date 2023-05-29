import { Component, createSignal, onMount } from "solid-js";
import * as qr from "qrcode";

export const Qrcode: Component = () => {
  const [show, setShow] = createSignal(false);
  const [code, setCode] = createSignal<string>();

  onMount(async () => {
    if (!window) return;
    if (window.location.href) {
      qr.toDataURL(window.location.href).then((s) => {
        setCode(s);
        console.log(s);
      });
    }
  });

  return (
    <div class="flex flex-col gap-2 self-end">
      {show() && (
        <div class="w-20 h-20">
          <img src={code()} />
        </div>
      )}
      <button class="hover-bg p-1" onClick={() => setShow((s) => !s)}>
        QR코드 보기
      </button>
    </div>
  );
};
