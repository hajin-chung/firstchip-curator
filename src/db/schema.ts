import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";

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
  createdAt: timestamp("createdAt").defaultNow(),
  artistId: varchar("artistId", { length: 10 }).references(() => artist.id),
});

export const image = pgTable("image", {
  id: varchar("id", { length: 10 }).primaryKey(),
  url: varchar("url", { length: 2048 }).notNull(),
  artId: varchar("artId", { length: 10 }).references(() => art.id),
});

export const session = pgTable("session", {
  id: varchar("id", { length: 10 }).primaryKey(),
  artistId: varchar("artistId", { length: 10 }).references(() => artist.id),
  expires: timestamp("expires").notNull(),
});
