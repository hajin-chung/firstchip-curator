export type Artist = {
  id: string;
  name: string;
  profile: string;
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
