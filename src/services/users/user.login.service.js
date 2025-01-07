import fetchUserFromDB from "../common/common.service.js";

/**
 * verify the users email and password
 * @param {object} request
 * @param {object} fastifyInstance
 * @returns responseObject
 */
const verifyUser = async (request, fastifyInstance) => {
	let responseObject;
	let pgClient;
	try {
		fastifyInstance.log.info(`verifyUser: Service - ends`);
		const { email, password } = request.body;
		const user = await fetchUserFromDB(email, fastifyInstance);
		const hashPassword = await fastifyInstance.generateHash(password);
		if (!user.rows.length || hashPassword !== user.rows[0].password) {
			responseObject = {
				statusCode: 403,
				body: {
					error: "Invalid email or password",
				},
			};

			return responseObject;
		}

		responseObject = {
			statusCode: 200,
			body: {
				message: "user successfully logged in",
			},
		};

		return responseObject;
	} catch (error) {
		fastifyInstance.log.error(
			`There is an error fetching user from Database`,
			error
		);
		throw new Error(error);
	} finally {
		if (pgClient) pgClient.release();
		fastifyInstance.log.info(`verifyUser: Service - ends`);
	}
};

export default verifyUser;
