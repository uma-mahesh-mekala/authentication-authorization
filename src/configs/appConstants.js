import fastifyPlugin from "fastify-plugin";

const appConstantsPlugin = async (fastify) => {
	const appConstants = {
		DBQUERY: {
			checkEmailInDB: `SELECT DISTINCT * FROM users WHERE email=$1`,
			addUser: `INSERT INTO users(email, password) VALUES($1, $2)`,
		},
	};

	fastify.decorate("appConstants", appConstants);
};

export default fastifyPlugin(appConstantsPlugin);
