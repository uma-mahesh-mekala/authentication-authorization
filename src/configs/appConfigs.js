import fastifyEnv from "@fastify/env";
import fastifyPlugin from "fastify-plugin";

const configSchema = {
	type: "object",
	required: [
		"PORT",
		"SALT",
		"PGUSER",
		"PGPASSWORD",
		"PGPORT",
		"PGHOST",
		"PGDATABASE",
		"APP_SECRET",
	],
	properties: {
		PORT: {
			type: "string",
			default: 3000,
		},
		HOST: {
			type: "string",
			default: "0.0.0.0",
		},
		SALT: {
			type: "string",
			description: "salt to generate a hash",
		},
		PGUSER: {
			type: "string",
			description: "user name for the pgAdmin",
		},
		PGPASSWORD: {
			type: "string",
			description: "password for the pg client for the given user",
		},
		PGPORT: {
			type: "integer",
			description: "port on which the db runs",
		},
		PGHOST: {
			type: "string",
			description: "pgAdmin host",
		},
		PGDATABASE: {
			type: "string",
			description: "database name",
		},
		APP_SECRET: {
			type: "string",
			description: "Application secret for token verification",
		},
	},
};

const configPlugin = async (fastify) => {
	await fastify.register(fastifyEnv, {
		confKey: "config",
		schema: configSchema,
		dotenv: true,
	});
};

export default fastifyPlugin(configPlugin);
