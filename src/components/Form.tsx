// Form elements
// short text input, long text input (textarea), selection, multi-radio
// multi-checkbox, date

import type { Component } from "solid-js";

type TextInputProps = {
  value: () => string;
  onInput: (value: string) => void;
  class?: string;
};

export const TextInput: Component<TextInputProps> = (props) => {
  return (
    <input
      type="input"
      class={`outline-none rounded-lg border-[3px] border-slate-200 focus:border-slate-600 p-1 ${props.class}`}
      value={props.value()}
      onInput={(e) => props.onInput(e.currentTarget.value)}
    />
  );
};

export const TextAreaInput: Component<TextInputProps> = (props) => {
  return (
    <textarea
      class={`outline-none rounded-lg border-[3px] border-slate-200 focus:border-slate-600 p-1 ${props.class}`}
      value={props.value()}
      onInput={(e) => props.onInput(e.currentTarget.value)}
    />
  );
};

export type Choice = {
  text: string;
  value: string;
};

type ChoiceInputProps = {
  onChange: (value: string) => void;
  choices: Choice[];
  value: () => string | undefined;
  class?: string;
};

export const ChoiceInput: Component<ChoiceInputProps> = (props) => {
  return (
    <div class={`flex gap-1 flex-col ${props.class}`}>
      {props.choices.map(({ text, value }) => (
        <div class="flex gap-1">
          <input
            id={value}
            type="radio"
            checked={props.value() === value}
            onChange={(e) => e.currentTarget.checked && props.onChange(value)}
          />
          <label for={value}>{text}</label>
        </div>
      ))}
    </div>
  );
};

type MultiChoiceInputProps = {
  values: () => string[];
  choices: Choice[];
  onChange: (values: string[]) => void;
  class?: string;
};

export const MultiChoiceInput: Component<MultiChoiceInputProps> = (props) => {
  const toggleValue = (value: string) => {
    const set = new Set(props.values());
    if (set.has(value)) {
      set.delete(value);
    } else {
      set.add(value);
    }
    props.onChange([...set]);
  };

  return (
    <div class={`flex gap-1 flex-col ${props.class}`}>
      {props.choices.map(({ text, value }) => (
        <div class="flex gap-1">
          <input
            id={value}
            type="checkbox"
            checked={!!props.values().find((v) => v === value)}
            onChange={() => toggleValue(value)}
          />
          <label for={value}>{text}</label>
        </div>
      ))}
    </div>
  );
};
