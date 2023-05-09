export type Artist = {
  id: string;
  name: string;
	email: string;
	sub: string;
  picture: string;
};

export type Art = {
  id: string;
  name: string;
  description: string;
  artistId: string;
};

export type Image = {
  id: string;
  url: string;
  artId: string;
};

export const SESSION_DURATION = 1000 * 60 * 60 * 24; // 1 day in ms