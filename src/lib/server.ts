// server functions mainly fetching data from db

import { connect } from "@planetscale/database";
import { SESSION_DURATION, type Art, type Artist, type Image } from "./type";
import { createId } from "@lib/utils";

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

// if sub doesn't exists, create new user
// create session
// return sessionId with expires
export const authUser = async ({
  name,
  sub,
  picture,
  email,
}: Pick<Artist, "name" | "sub" | "picture" | "email">) => {
  // check sub exist
  const checkRes = await conn.execute(
    "SELECT sub, id FROM artist WHERE sub=?",
    [sub]
  );
  let artistId: string;

  if (checkRes.rows.length === 0) {
    // create user
    artistId = createId();
    const createRes = await conn.execute(
      "INSERT INTO artist (id, name, email, sub, picture) VALUES (?, ?, ?, ?, ?)",
      [artistId, name, email, sub, picture]
    );
    // TODO: check query success
  } else {
    artistId = (checkRes.rows[0] as Artist).id;
  }

  // create session
  const sessionId = createId();
  const sessionExpires = new Date(new Date().getTime() + SESSION_DURATION);
  const sessionRes = await conn.execute(
    "INSERT INTO session (id, artistId, expires) VALUES (?, ?, ?)",
    [sessionId, artistId, sessionExpires.getTime()]
  );
  // TODO: check query success

  return { sessionId, sessionExpires };
};

export const getArtistBySessionId = async (sessionId: string) => {
  // return artist
};
