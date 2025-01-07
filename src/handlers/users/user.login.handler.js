import userLogin from "../../services/users/user.login.service.js";

const userLoginHandler = async (request, reply) => {
	const fastifyInstance = request.server;

	fastifyInstance.log.info("userLoginHandler: function -starts");

	const response = await userLogin(request, fastifyInstance);

	fastifyInstance.log.info("userLoginHandler: function -ends");

	reply.status(response.statusCode).send(response.body);
};

export default userLoginHandler;
