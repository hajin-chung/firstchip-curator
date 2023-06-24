import type { art, artist, image, session } from "@db/schema";
import type { InferModel } from "drizzle-orm";
import type { DOMElement } from "solid-js/jsx-runtime";

export const SESSION_DURATION = 1000 * 60 * 60 * 24; // 1 day in ms
export type Artist = InferModel<typeof artist>;
export type Art = InferModel<typeof art>;
export type Image = InferModel<typeof image>;
export type Session = InferModel<typeof session>;

export type EventHandler = (evt: {
  currentTarget: HTMLInputElement;
  target: DOMElement;
}) => void;
