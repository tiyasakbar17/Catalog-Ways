const jwt = require("jsonwebtoken");
const { failedResponse } = require("../responses");
const code = process.env.SECRET_KEY;

module.exports = {
	jwtAuth: (roleAkses) => {
		return async (req, res, next) => {
			try {
				const authHeader = req.headers.authorization;
				if (authHeader) {
					const token = authHeader.replace("Bearer ", "");
					jwt.verify(token, code, (error, result) => {
						if (error) {
							return failedResponse(res, "Invalid Token");
						} else {
							if (roleAkses.includes(result.role) || result.role == "admin") {
								req.user = result;
								next();
							} else {
								return failedResponse(res, "Can't Access This Endpoint");
							}
						}
					});
				} else {
					failedResponse(res, "No Token Inserted");
				}
			} catch (error) {
				console.log(error);
				failedResponse(res, JSON.stringify(error));
			}
		};
	},
};
