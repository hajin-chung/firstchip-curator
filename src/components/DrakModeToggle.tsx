import { createSignal, type Component, onMount, createEffect } from "solid-js";

export const DarkModeToggle: Component = () => {
  const [theme, setTheme] = createSignal<"light" | "dark">("light");

  onMount(() => {
    const themeOld = localStorage.getItem("theme");
    if (themeOld === "dark") {
      setTheme(themeOld);
      document.documentElement.classList.add("dark");
    } else if (themeOld === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  });

  createEffect(() => {
    if (theme() === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme() === "light") {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", theme());
  });

  return (
    <button
      onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
      class="font-bold text-sm hover-bg p-1"
    >
      {theme() === "dark" ? "라이트 모드" : "다크 모드"}
    </button>
  );
};
