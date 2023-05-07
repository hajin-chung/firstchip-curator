// server functions mainly fetching data from db

import { connect } from '@planetscale/database'

const dbConfig = {
	host: import.meta.env.DATABASE_HOST,
	username: import.meta.env.DATABASE_USERNAME,
	password: import.meta.env.DATABASE_PASSWORD,
}

const conn = connect(dbConfig);

export const getArtById = async (artId: string) => {
	const art = {
		id: artId,
		artistId: 0,
		artistName: "artist name",
		name: "art name",
		description: "art desc",
		images: [
			"https://a.com",
		]
	}

	return art;
}

export const getArtistById = async (artistId: string) => {
	const artist = {
		id: artistId,
		name: "test name",
		profile: "https://a.com",
		arts: [
			{
				id: "123",
				name: "test name",
			}
		]
	}

	return artist;
}

export const isAdmin = async () => {
}