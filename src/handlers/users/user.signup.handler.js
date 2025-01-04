import userSignup from "../../services/users/user.signup.service.js";

const userSignupHandler = async (request, reply) => {
	const fastifyInstance = request.server;

	fastifyInstance.log.info("userSignupHandler: function -starts");

	const response = await userSignup(request, fastifyInstance);

	fastifyInstance.log.info("userSignupHandler: function -ends");

	reply.status(response.statusCode).send(response.body);
};

export default userSignupHandler;
