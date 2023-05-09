// server functions mainly fetching data from db

import { connect } from "@planetscale/database";
import type { Art, Artist, Image } from "./type";
import { createId } from "@paralleldrive/cuid2";

const dbConfig = {
  host: import.meta.env.DATABASE_HOST,
  username: import.meta.env.DATABASE_USERNAME,
  password: import.meta.env.DATABASE_PASSWORD,
};

const conn = connect(dbConfig);

// async function execute<T>(query: string, args: any[] | undefined): Promise<T> {
// 	const result = await conn.execute(query, args);
// 	return {} as T;
// }

export const getArtById = async (artId: string, artistId: string) => {
  const artResult = await conn.execute(
    "SELECT id, name, description, artistId FROM art WHERE id=?",
    [artId]
  );
  const artistResult = await conn.execute(
    "SELECT id, name, profile FROM artist WHERE id=?",
    [artistId]
  );
  const imagesResult = await conn.execute(
    "SELECT id, artId FROM image WHERE artId=?",
    [artId]
  );

  const art = artResult.rows[0] as Art;
  const artist = artistResult.rows[0] as Artist;
  const images = imagesResult.rows as Image[];

  return { art, artist, images };
};

export const getArtistById = async (artistId: string) => {
  const artistResult = await conn.execute(
    "SELECT id, name, profile FROM artist WHERE id=?",
    [artistId]
  );
  const artResult = await conn.execute(
    "SELECT id, name FROM art WHERE artistId=?",
    [artistId]
  );

  const artist = artistResult.rows[0] as Artist;
  const arts = artResult.rows as Pick<Art, "id" | "name">[];

  return { artist, arts };
};

export const createArtist = async ({
  name,
  profile = "",
}: Pick<Artist, "name" | "profile">) => {
  const id = createId();
  const result = await conn.execute(
    "INSERT INTO artist (id, name, profile) VALUES (?, ?, ?)",
    [id, name, profile]
  );

  return result;
};
