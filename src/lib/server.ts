// server functions mainly fetching data from db

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as tables from "@db/schema";
import { ArtStatus, Exhibit, ExhibitFilter, SESSION_DURATION } from "./type";
import type { Artist } from "@db/schema";
import { createId, toISOLocal } from "@lib/utils";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { and, eq } from "drizzle-orm";

const DATABASE_URI = import.meta.env.DATABASE_URI;
const client = postgres(DATABASE_URI);
const db = drizzle(client);

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

export const createSignedUrl = async (type: "get" | "put", id: string) => {
  let command =
    type === "get"
      ? new GetObjectCommand({ Bucket: BUCKET_NAME, Key: id })
      : new PutObjectCommand({ Bucket: BUCKET_NAME, Key: id });

  const signedUrl = await getSignedUrl(S3, command, {
    expiresIn: PRESIGNED_URL_EXPIRES,
  });
  return signedUrl;
};

export const getArtById = async (artId: string, artistId: string) => {
  const art = (
    await db
      .select({
        id: tables.art.id,
        name: tables.art.name,
        description: tables.art.description,
        artistId: tables.art.artistId,
        price: tables.art.price,
        status: tables.art.status,
      })
      .from(tables.art)
      .where(eq(tables.art.id, artId))
  )[0];

  const artist = (
    await db
      .select({
        id: tables.artist.id,
        name: tables.artist.name,
        picture: tables.artist.picture,
      })
      .from(tables.artist)
      .where(eq(tables.artist.id, artistId))
  )[0];

  const images = await db
    .select({
      id: tables.image.id,
      artId: tables.image.artId,
    })
    .from(tables.image)
    .where(eq(tables.image.artId, artId));

  const imageUrls = images.map(({ id }) => `/image?id=${id}`);

  return { art, artist, images: imageUrls };
};

export const getArtistById = async (artistId: string) => {
  const artist = (
    await db
      .select({
        id: tables.artist.id,
        name: tables.artist.name,
        picture: tables.artist.picture,
        description: tables.artist.description,
        history: tables.artist.history,
      })
      .from(tables.artist)
      .where(eq(tables.artist.id, artistId))
  )[0];
  return artist;
};

export const getArtsByArtistId = async (artistId: string) => {
  const arts = await db
    .select({
      id: tables.art.id,
      name: tables.art.name,
      description: tables.art.description,
      price: tables.art.price,
      status: tables.art.status,
      thumbnail: tables.image.id,
    })
    .from(tables.art)
    .rightJoin(tables.image, eq(tables.art.id, tables.image.artId))
    .where(and(eq(tables.art.artistId, artistId), eq(tables.image.idx, 0)))
    .orderBy(tables.art.createdAt);

  return arts;
};

export const createSession = async (artistId: string) => {
  const sessionId = createId();
  const sessionExpires = new Date(new Date().getTime() + SESSION_DURATION);
  await db
    .insert(tables.session)
    .values({ id: sessionId, expires: sessionExpires, artistId });

  return { sessionId, sessionExpires };
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
  const check = await db
    .select({ sub: tables.artist.sub, id: tables.artist.id })
    .from(tables.artist)
    .where(eq(tables.artist.sub, sub));
  let artistId: string;

  if (check.length === 0) {
    // create user
    artistId = createId();
    await db.insert(tables.artist).values({
      id: artistId,
      name,
      email,
      sub,
      picture,
    });
  } else {
    artistId = check[0].id;
  }

  const { sessionId, sessionExpires } = await createSession(artistId);

  return { sessionId, sessionExpires };
};

export const getAuthDataBySessionId = async (sessionId: string | undefined) => {
  if (sessionId === undefined) {
    return { isAuthed: false };
  }

  const result = await db
    .select({
      artistId: tables.artist.id,
      sessionId: tables.session.id,
    })
    .from(tables.artist)
    .leftJoin(tables.session, eq(tables.artist.id, tables.session.artistId))
    .where(eq(tables.session.id, sessionId));

  if (result.length === 0) {
    return { isAuthed: false, artist: undefined };
  } else if (result[0].sessionId === null) {
    return { isAuthed: false, artist: undefined };
  } else {
    return { isAuthed: true, artist: result[0] };
  }
};

export const createArt = async (
  name: string,
  description: string,
  artistId: string,
  imageCount: number
) => {
  const artId = createId();
  await db.insert(tables.art).values({
    id: artId,
    name,
    description,
    artistId,
  });

  // generate imageCount image upload links
  const signedUrls = await Promise.all(
    [...Array(imageCount).keys()].map(async () => {
      const imageId = createId();
      const signedUrl = await createSignedUrl("put", imageId);
      return { imageId, signedUrl };
    })
  );

  await Promise.all(
    signedUrls.map(({ imageId }, idx) => createImage(imageId, artId, idx))
  );

  return { signedUrls, artId };
};

export const updateArt = async (
  artId: string,
  name: string,
  description: string,
  price: number | null,
  status: ArtStatus,
  imageCount: number
) => {
  await db
    .update(tables.art)
    .set({
      name,
      description,
      price,
      status,
    })
    .where(eq(tables.art.id, artId));

  await db.delete(tables.image).where(eq(tables.image.artId, artId));

  // generate imageCount image upload links
  const signedUrls = await Promise.all(
    [...Array(imageCount).keys()].map(async () => {
      const imageId = createId();
      const signedUrl = await createSignedUrl("put", imageId);
      return { imageId, signedUrl };
    })
  );

  await Promise.all(
    signedUrls.map(({ imageId }, idx) => createImage(imageId, artId, idx))
  );

  return { signedUrls, artId };
};

export const deleteArt = async (artId: string) => {
  await db.delete(tables.image).where(eq(tables.image.artId, artId));
  await db.delete(tables.art).where(and(eq(tables.art.id, artId)));
};

export const createImage = async (id: string, artId: string, idx: number) => {
  await db.insert(tables.image).values({
    id,
    artId,
    idx,
    url: "",
  });
};

export const updateProfile = async (
  artistId: string,
  name: string,
  description: string,
  history: string
) => {
  await db
    .update(tables.artist)
    .set({
      name,
      description,
      history,
    })
    .where(eq(tables.artist.id, artistId));
};

export const updatePicture = async (artistId: string) => {
  await db
    .update(tables.artist)
    .set({
      picture: `/image?id=${artistId}`,
    })
    .where(eq(tables.artist.id, artistId));
};

export const getAllArtists = async () => {
  return await db.select().from(tables.artist);
};

export const getAllExhibits = async () => {
  return await db.select().from(tables.exhibit);
};

export const updateExhibit = async (newExhibit: Exhibit) => {
  await db
    .update(tables.exhibit)
    .set(newExhibit)
    .where(eq(tables.exhibit.id, newExhibit.id));

  const signedUrl = createSignedUrl("put", newExhibit.id);
  return signedUrl;
};

export const createExhibit = async (
  newExhibit: Pick<Exhibit, "location" | "endDate" | "startDate" | "title">
) => {
  const id = createId();

  await db.insert(tables.exhibit).values({
    id,
    ...newExhibit,
  });

  const signedUrl = createSignedUrl("put", id);

  return signedUrl;
};

export const deleteExhibit = async (id: string) => {
  await db
    .delete(tables.exhibitArts)
    .where(eq(tables.exhibitArts.exhibitId, id));
  await db.delete(tables.exhibit).where(eq(tables.exhibit.id, id));
};

export const addArtToExhibit = async (artId: string, exhibitId: string) => {
  await db.insert(tables.exhibitArts).values({
    artId,
    exhibitId,
  });
};

export const getExhibitsByFilter = async (filter: ExhibitFilter) => {
  const nowTimeStamp = toISOLocal(new Date());
};

export const getExhibitById = async (exhibitId: string) => {
  return (await db
    .select({
      id: tables.exhibit.id,
      title: tables.exhibit.title,
      location: tables.exhibit.location,
      startDate: tables.exhibit.startDate,
      endDate: tables.exhibit.endDate,
    })
    .from(tables.exhibit)
    .where(eq(tables.exhibit.id, exhibitId)))[0];
};

export const getExhibitArtsById = async (exhibitId: string) => {
  return await db
    .select({
      artId: tables.art.id,
      artName: tables.art.name,
      artDescription: tables.art.description,
      thumbnail: tables.image.id,
      artPrice: tables.art.price,
      artStatus: tables.art.status,
      artistId: tables.artist.id,
      artistName: tables.artist.name,
    })
    .from(tables.exhibitArts)
    .leftJoin(tables.art, eq(tables.exhibitArts.artId, tables.art.id))
    .leftJoin(tables.image, eq(tables.art.id, tables.image.artId))
    .leftJoin(tables.artist, eq(tables.art.artistId, tables.artist.id))
    .where(eq(tables.image.idx, 0))
    .where(eq(tables.exhibitArts.exhibitId, exhibitId));
};
