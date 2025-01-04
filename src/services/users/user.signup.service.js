import fetchUserFromDB from "../common/common.service.js";
/**
 * Signuo with email and password
 * @param {object} request
 */
const userSignup = async (request, fastifyInstance) => {
	let response;
	fastifyInstance.log.info(`addUser: service - starts`);
	let pgClient = await fastifyInstance.pgClient();
	const { email, password } = request.body;

	try {
		const user = await fetchUserFromDB(email, fastifyInstance);
		if (user) {
			response = {
				statusCode: 400,
				body: {
					error: "User already exists, try with a different email",
				},
			};
			fastifyInstance.log.info(`addUser: service - ends`);
			return response;
		}

		const passwordHash = await fastifyInstance.generateHash(password);

		const addUserQuery = {
			text: fastifyInstance.appConstants.DBQUERY.addUser,
			values: [email, passwordHash],
		};
		await pgClient.query(addUserQuery);

		response = {
			statusCode: 200,
			body: {
				message: "User Registered successfully",
			},
		};

		return response;
	} catch (error) {
		fastifyInstance.log.error(
			`There is an error adding the user to the database`,
			error
		);
		throw new Error(error);
	} finally {
		if (pgClient) pgClient.release();
		fastifyInstance.log.info(`addUser: service - ends`);
	}
};

export default userSignup;
