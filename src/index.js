import Fastify from "fastify";
import fastifyAutoload from "@fastify/autoload";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import fastifyOpenapiGlue from "fastify-openapi-glue";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import handlers from "./openApi/index.js";

const fileName = fileURLToPath(import.meta.url);
const dirName = dirname(fileName);

let fastifyInstance;
const buildServer = async () => {
	const openApilueOptions = {
		specification: join(dirName, "openApi/swagger.yaml"),
		serviceHandlers: handlers,
	};
	fastifyInstance = Fastify({
		logger: true,
		ajv: {
			customOptions: {
				strict: false,
			},
		},
	});

	fastifyInstance
		.register(fastifyAutoload, {
			dir: join(dirName, "configs"),
		})
		.register(fastifyAutoload, {
			dir: join(dirName, "plugins"),
		})
		.register(fastifySwagger, {
			mode: "static",
			specification: {
				path: join(dirName, "openApi/swagger.yaml"),
				postProcessor: function (swaggerObject) {
					return swaggerObject;
				},
				baseDir: dirName,
			},
		})
		.register(fastifySwaggerUi, {
			routePrefix: "/swagger",
			uiConfig: {
				docExpansion: "full",
				deepLinking: false,
			},
			staticCSP: true,
			transformStaticCSP: (header) => header,
			transformSpecification: (swaggerObject) => {
				return swaggerObject;
			},
			transformSpecificationClone: true,
		})
		.register(fastifyOpenapiGlue, openApilueOptions);

	return fastifyInstance;
};

buildServer()
	.then((fastifyInstance) => {
		console.log(fastifyInstance.printRoutes());
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
