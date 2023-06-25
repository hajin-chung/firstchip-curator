import { createSignal, type Component, JSX, createEffect } from "solid-js";

type DotProps = {
  i: number;
  j: number;
};

const [mouseX, setMouseX] = createSignal<number | undefined>();
const [mouseY, setMouseY] = createSignal<number | undefined>();

const Dot: Component<DotProps> = ({ i, j }) => {
  const [radius, setRadius] = createSignal(8);
  const [transform, setTransform] = createSignal("");
  const style: () => JSX.CSSProperties = () => {
    return {
      "background-color": "#fb923c",
      "border-radius": "9999px",
      width: `${radius()}px`,
      height: `${radius()}px`,
      transform: transform(),
      "justify-self": "center",
      "translate": "0.1s"
    };
  };

  createEffect(() => {
    const x = mouseX();
    const y = mouseY();

    if (x === undefined || y === undefined) {
      console.log("hi");
      setTransform("none");
      return;
    };

    const dx = j * 25 + 12.5 - x;
    const dy = i * 25 + 12.5 - y;

    const dist = Math.max(Math.sqrt(Math.pow(dy, 2) + Math.pow(dx, 2)), 50);
    const vector = [2 * dx / dist, 2 * dy / dist];

    setTransform(`translate(${vector[1]}px, ${vector[0]}px)`);
  });

  return <div style={style()} />;
};

export const Dots: Component = () => {
  const dots = [];

  for (let i = 0; i < 12; i++) {
    for (let j = 0; j < 20; j++) {
      dots.push(<Dot i={i} j={j} />);
    }
  }

  const handleMouse: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent> = (
    e
  ) => {
    setMouseX(e.offsetX);
    setMouseY(e.offsetY);
  };

  const handleMouseLeave = () => {
    console.log("hiclla");
    setMouseX(undefined);
    setMouseY(undefined);
  }

  return (
    <div
      class="w-[500px] h-[300px] grid grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-[repeat(12,minmax(0,1fr))] items-center"
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
    >
      {dots}
    </div>
  );
};
