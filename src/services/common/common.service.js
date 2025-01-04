const checkEmailInDB = async (email, fastifyInstance) => {
	fastifyInstance.log.info("fetchUserFromDB: function - starts");
	let pgClient;
	try {
		pgClient = await fastifyInstance.pgClient();
		const fetchUserQuery = {
			text: fastifyInstance.appConstants.DBQUERY.checkEmailInDB,
			values: [email],
		};
		const fetchUserQueryResponse = await pgClient.query(fetchUserQuery);

		return fetchUserQueryResponse.rows.length;
	} catch (error) {
		fastifyInstance.log.error("There is error fetching data from the database");
		throw error;
	} finally {
		if (pgClient) pgClient.release();
		fastifyInstance.log.info("fetchUserFromDB: function - ends");
	}
};

export default checkEmailInDB;
