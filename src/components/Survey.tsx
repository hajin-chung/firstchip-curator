import { Component, createSignal } from "solid-js";
import {
  TextInput,
  TextAreaInput,
  ChoiceInput,
  Choice,
  MultiChoiceInput,
} from "./Form";

export const Survey: Component = () => {
  const [q1, setQ1] = createSignal("");
  const [q2, setQ2] = createSignal("");
  const [q3, setQ3] = createSignal("");
  const [q4, setQ4] = createSignal<string[]>([]);

  const choices: Choice[] = [
    {
      text: "1번 선택지",
      value: "123",
    },
    {
      text: "2번 선택지",
      value: "213",
    },
    {
      text: "3번 선택지",
      value: "223",
    },
  ];

  const multiChoices: Choice[] = [
    {
      text: "1번 선택지",
      value: "1",
    },
    {
      text: "2번 선택지",
      value: "2",
    },
    {
      text: "3번 선택지",
      value: "3",
    },
  ];

  return (
    <div class="flex flex-col gap-4 mb-10 items-start">
      <div class="flex flex-col gap-2 items-start">
        <p class="font-bold">질문 1: 짧은 텍스트</p>
        <TextInput value={q1} onInput={(nv) => setQ1(nv)} />
      </div>
      <div class="flex flex-col gap-2 items-start">
        <p class="font-bold">질문 2: 긴 텍스트</p>
        <TextAreaInput value={q2} onInput={(nv) => setQ2(nv)} />
      </div>
      <div class="flex flex-col gap-2 items-start">
        <p class="font-bold">질문 3: 단일 선택</p>
        <ChoiceInput
          choices={choices}
          value={q3}
          onChange={(nv) => setQ3(nv)}
        />
      </div>
      <div class="flex flex-col gap-2 items-start">
        <p class="font-bold">질문 4: 다중 선택</p>
        <MultiChoiceInput
          choices={multiChoices}
          values={q4}
          onChange={(nv) => setQ4(nv)}
        />
      </div>
      <button class="bg-slate-100 rounded-lg p-2 hover:bg-slate-200 self-end">
        제출하기
      </button>
    </div>
  );
};
