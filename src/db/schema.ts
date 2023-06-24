import type { InferModel } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  timestamp,
  smallint,
  bigint,
} from "drizzle-orm/pg-core";

/**
 * database schema declaration
 *
 * every id must be string of length 10
 *
 */

export const artist = pgTable("artist", {
  id: varchar("id", { length: 10 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  sub: text("sub").notNull(),
  picture: text("picture"),
  createdAt: timestamp("createdAt").defaultNow(),
  description: text("description").default(""),
});

export const art = pgTable("art", {
  id: varchar("id", { length: 10 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: bigint("price", { mode: "number" }),
  createdAt: timestamp("createdAt").defaultNow(),
  artistId: varchar("artistId", { length: 10 }).references(() => artist.id),
});

export const image = pgTable("image", {
  id: varchar("id", { length: 10 }).primaryKey(),
  idx: smallint("idx").notNull().default(0),
  url: varchar("url", { length: 2048 }).notNull(),
  artId: varchar("artId", { length: 10 }).references(() => art.id),
});

export const session = pgTable("session", {
  id: varchar("id", { length: 10 }).primaryKey(),
  artistId: varchar("artistId", { length: 10 }).references(() => artist.id),
  expires: timestamp("expires").notNull(),
});

export type Artist = InferModel<typeof artist>;
export type Art = InferModel<typeof art>;
export type Image = InferModel<typeof image>;
export type Session = InferModel<typeof session>;
