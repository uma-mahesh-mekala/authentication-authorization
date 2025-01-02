import pg from "pg";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import fastifyPlugin from "fastify-plugin";

const dbPlugin = async (fastify) => {
	const { Pool } = pg;
	//create a pool instance
	const pool = new Pool({
		user: fastify.config.PGUSER,
		password: fastify.config.PGPASSWORD,
		host: fastify.config.PGHOST,
		port: fastify.config.PGPORT,
		database: fastify.config.PGDATABASE,
	});

	//runs initially to create the tables in the database when application runs for the first time
	const initializeSchema = async () => {
		let client;
		try {
			client = await pool.connect();
			const fileName = fileURLToPath(import.meta.url);
			const dirName = path.dirname(fileName);
			const schemaPath = path.join(dirName, "..", "DB_SCHEMA.sql");

			const schema = await fs.readFile(schemaPath, { encoding: "utf-8" });
			await client.query(schema);
			fastify.log.info(`Database schema initialization completed`);
		} catch (error) {
			fastify.log.error("Error initializing database schema");
			throw error;
		} finally {
			if (client) client.release();
		}
	};

	/**
	 *
	 * @returns pgClient
	 */

	const pgClient = async () => {
		try {
			const client = await pool.connect();
			return client;
		} catch (error) {
			fastify.log.error(`There is an error connecting to database`, error);
		}
	};

	await initializeSchema(); //initicalize database schema

	fastify.decorate("pgClient", pgClient);
};

export default fastifyPlugin(dbPlugin);
