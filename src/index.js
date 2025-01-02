import Fastify from "fastify";
import fastifyAutoload from "@fastify/autoload";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const fileName = fileURLToPath(import.meta.url);
const dirName = dirname(fileName);

let fastifyInstance;
const buildServer = async () => {
	fastifyInstance = Fastify({
		logger: true,
	});

	fastifyInstance
		.register(fastifyAutoload, {
			dir: join(dirName, "configs"),
		})
		.register(fastifyAutoload, {
			dir: join(dirName, "plugins"),
		});

	return fastifyInstance;
};

buildServer()
	.then((fastifyInstance) => {
		const listenOptions = {
			port: process.env.PORT,
			host: process.env.HOST,
		};
		fastifyInstance.listen(listenOptions, (err, address) => {
			if (err) {
				fastifyInstance.log.error(err);
				process.exit(1);
			}

			fastifyInstance.log.info(`server listening on ${address}`);
		});
	})
	.catch((err) => {
		fastifyInstance.log.error(err);
		process.exit(1);
	});
