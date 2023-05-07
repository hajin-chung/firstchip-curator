// server functions mainly fetching data from db

import { connect } from '@planetscale/database'

const dbConfig = {
	host: import.meta.env.DATABASE_HOST,
	username: import.meta.env.DATABASE_USERNAME,
	password: import.meta.env.DATABASE_PASSWORD,
}

const conn = connect(dbConfig);

