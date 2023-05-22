// server functions mainly fetching data from db

import { Config, connect } from "@planetscale/database";
import { SESSION_DURATION, type Art, type Artist, type Image } from "./type";
import { createId } from "@lib/utils";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const dbConfig: Config = {
  host: import.meta.env.DATABASE_HOST,
  username: import.meta.env.DATABASE_USERNAME,
  password: import.meta.env.DATABASE_PASSWORD,
  fetch: (url, init) => {
    delete (init as any)["cache"]; // Remove cache header
    return fetch(url, init);
  },
};

const conn = connect(dbConfig);

const ACCOUNT_ID = import.meta.env.CLOUDFLARE_ACCOUNT_ID;
const ACCESS_KEY = import.meta.env.R2_ACCESS_KEY;
const SECRET_KEY = import.meta.env.R2_SECRET_KEY;
const PRESIGNED_URL_EXPIRES = 3600;
const BUCKET_NAME = import.meta.env.BUCKET_NAME;
const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

export const getArtById = async (artId: string, artistId: string) => {
  const artResult = await conn.execute(
    "SELECT id, name, description, artistId FROM art WHERE id=?",
    [artId]
  );
  const artistResult = await conn.execute(
    "SELECT id, name, picture FROM artist WHERE id=?",
    [artistId]
  );
  const imagesResult = await conn.execute(
    "SELECT id, artId FROM image WHERE artId=?",
    [artId]
  );

  const art = artResult.rows[0] as Art;
  const artist = artistResult.rows[0] as Artist;
  const images = imagesResult.rows as Image[];

  const imageUrls = await Promise.all(
    images.map(({ id }) => {
      return getSignedUrl(
        S3,
        new GetObjectCommand({ Bucket: BUCKET_NAME, Key: id }),
        { expiresIn: PRESIGNED_URL_EXPIRES }
      );
    })
  );

  return { art, artist, images: imageUrls };
};

export const getArtistById = async (artistId: string) => {
  const artistResult = await conn.execute(
    "SELECT id, name, picture, description FROM artist WHERE id=?",
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

export const getAuthDataBySessionId = async (sessionId: string | undefined) => {
  if (sessionId === undefined) {
    return { isAuthed: false };
  }

  // return artist
  const artistRes = await conn.execute(
    "SELECT artist.id as artistId, session.id as sessionId FROM artist LEFT JOIN session ON artist.id = session.artistId WHERE session.id = ?;",
    [sessionId]
  );

  const artistData = artistRes.rows[0] as
    | { artistId: string; sessionId: string }
    | undefined;

  return { isAuthed: !!artistData, artist: artistData };
};

export const createArt = async (
  name: string,
  description: string,
  artistId: string,
  imageCount: number
) => {
  const artId = createId();

  const createArtRes = await conn.execute(
    "INSERT INTO art (id, name, description, artistId) VALUES (?, ?, ?, ?)",
    [artId, name, description, artistId]
  );

  // TODO: check query success

  // generate imageCount image upload links
  const signedUrls = await Promise.all(
    [...Array(imageCount).keys()].map(async () => {
      const imageId = createId();
      const signedUrl = await getSignedUrl(
        S3,
        new PutObjectCommand({ Bucket: BUCKET_NAME, Key: imageId }),
        { expiresIn: 3600 }
      );
      return { imageId, signedUrl };
    })
  );

  await Promise.all(
    signedUrls.map(({ imageId }) => createImage(imageId, artId))
  );

  return { signedUrls, artId };
};

export const createGetImageUrl = async (id: string) => {
  const signedUrl = await getSignedUrl(
    S3,
    new GetObjectCommand({ Bucket: BUCKET_NAME, Key: id }),
    { expiresIn: 3600 }
  );
  return signedUrl;
};

export const createPutImageUrl = async (id: string) => {
  const signedUrl = await getSignedUrl(
    S3,
    new PutObjectCommand({ Bucket: BUCKET_NAME, Key: id }),
    { expiresIn: 3600 }
  );
  return signedUrl;
};

export const createImage = async (id: string, artId: string) => {
  const imageRes = await conn.execute(
    "INSERT INTO image (id, artId, url) VALUES (?, ?, ?)",
    [id, artId, ""]
  );
  // TODO: handle query res
};

export const updateProfile = async (
  artistId: string,
  name: string,
  description: string
) => {
  const res = await conn.execute(
    "UPDATE artist SET description=?, name=? WHERE id=?",
    [description, name, artistId]
  );
};

export const updatePicture = async (artistId: string) => {
  const res = await conn.execute("UPDATE artist SET picture=? WHERE id=?", [
    `/image?id=${artistId}`,
    artistId,
  ]);
  // TODO: handle res
};
