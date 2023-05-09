// TODO: run the entire file in one execution
// probably need to be a package as itself

import 'dotenv/config';
import { connect } from "@planetscale/database";
import { readFile } from "fs/promises";

const config = {
	host: process.env.DATABASE_HOST,
	username: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
}

const conn = connect(config);

const migrator = async () => {
	const sqlFile = await readFile("./db/init.sql");
	const sql = sqlFile.toString();
	console.log(sql.slice(130));
	const results = await conn.execute(sql);
	console.log(results);
}

migrator().catch(e => console.error(e));