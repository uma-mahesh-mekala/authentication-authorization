import { pbkdf2Sync } from "node:crypto";
import fastifyPlugin from "fastify-plugin";

const cryptoPlugin = async (fastify) => {
	const generateHash = (data) => {
		try {
			const key = pbkdf2Sync(data, fastify.config.SALT, 10000, 32, "sha512");
			const hash = key.toString("hex");
			return hash;
		} catch (error) {
			fastify.log.error(error);
		}
	};

	fastify.decorate("generateHash", generateHash);
};

export default fastifyPlugin(cryptoPlugin);
